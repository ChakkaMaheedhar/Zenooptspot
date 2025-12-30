from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.config.database import get_db
from src.models.database import AdminUser
from src.schemas.auth import RegisterRequest
from src.utils.auth import get_current_active_user, get_password_hash, create_access_token

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/", response_model=List[dict])
async def list_organization_users(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """List all users in current user's organization"""
    users = db.query(AdminUser).filter(
        AdminUser.organization_id == current_user.organization_id
    ).all()
    
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.email.split("@")[0],
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at,
        }
        for u in users
    ]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_organization_user(
    user_data: RegisterRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Create a new user in current user's organization"""
    
    # Check if email already exists
    existing_user = db.query(AdminUser).filter(AdminUser.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user in same organization
    new_user = AdminUser(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        organization_id=current_user.organization_id,
        role="staff",  # Default role
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role,
        "is_active": new_user.is_active,
        "message": "User created successfully"
    }


@router.put("/{user_id}/role", response_model=dict)
async def update_user_role(
    user_id: int,
    role_data: dict,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Update user role (only for users in same organization)"""
    
    user = db.query(AdminUser).filter(
        AdminUser.id == user_id,
        AdminUser.organization_id == current_user.organization_id
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    new_role = role_data.get("role")
    if new_role not in ["owner", "manager", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be owner, manager, or staff"
        )
    
    user.role = new_role
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "message": "Role updated successfully"
    }


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Delete a user (only for users in same organization)"""
    
    user = db.query(AdminUser).filter(
        AdminUser.id == user_id,
        AdminUser.organization_id == current_user.organization_id
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent deleting the last owner
    owner_count = db.query(AdminUser).filter(
        AdminUser.organization_id == current_user.organization_id,
        AdminUser.role == "owner"
    ).count()
    
    if user.role == "owner" and owner_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the last owner in organization"
        )
    
    db.delete(user)
    db.commit()
    
    return None
