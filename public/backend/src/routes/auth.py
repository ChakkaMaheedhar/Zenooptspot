from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.models.database import AdminUser, Organization
from src.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from src.utils.auth import verify_password, get_password_hash, create_access_token, get_current_active_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.email == credentials.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )
    
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(
        data={"userId": user.id, "organizationId": user.organization_id, "role": user.role}
    )
    
    return TokenResponse(
        token=access_token,
        user={
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "organization_id": user.organization_id
        }
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(AdminUser).filter(AdminUser.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create organization if needed
    if user_data.organization_id:
        organization = db.query(Organization).filter(Organization.id == user_data.organization_id).first()
        if not organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        org_id = user_data.organization_id
    else:
        # Auto-create organization for new user
        new_org = Organization(
            name=user_data.organization_name or f"{user_data.email.split('@')[0]}'s Organization"
        )
        db.add(new_org)
        db.flush()
        org_id = new_org.id
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = AdminUser(
        organization_id=org_id,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role or "manager"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(
        data={"userId": new_user.id, "organizationId": new_user.organization_id, "role": new_user.role}
    )
    
    return TokenResponse(
        token=access_token,
        user={
            "id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "organization_id": new_user.organization_id
        }
    )

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: AdminUser = Depends(get_current_active_user)):
    return current_user

