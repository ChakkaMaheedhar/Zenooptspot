from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.models.database import Business, BusinessUser, AdminUser
from src.schemas.business import (
    BusinessCreate, BusinessUpdate, BusinessResponse, BusinessDetailResponse,
    BusinessUserCreate, BusinessUserUpdate, BusinessUserResponse
)
from src.utils.auth import get_current_active_user

router = APIRouter(prefix="/api/businesses", tags=["businesses"])


# Business CRUD Endpoints
@router.post("/", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
async def create_business(
    business_data: BusinessCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Create a new business for the current user's organization"""
    
    # Create business
    new_business = Business(
        organization_id=current_user.organization_id,
        **business_data.model_dump()
    )
    
    db.add(new_business)
    db.flush()  # Get the ID before committing
    
    # Automatically assign creator as owner of the business
    owner_assignment = BusinessUser(
        business_id=new_business.id,
        admin_user_id=current_user.id,
        role='owner'
    )
    
    db.add(owner_assignment)
    db.commit()
    db.refresh(new_business)
    
    return new_business


@router.get("/", response_model=list[BusinessResponse])
async def list_businesses(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """
    List businesses accessible to the current user.
    
    PERMISSION LOGIC (ORGANIZATION-LEVEL role check):
    ================================================
    - Organization Owners (role='owner'): See ALL businesses in their organization
    - Other roles (manager, staff): See ONLY businesses they're explicitly assigned to
    
    WHY? To implement multi-tenant isolation:
    - Org owners need overview of all businesses
    - Regular users should only see their assigned businesses
    
    EXAMPLE:
    --------
    John (Org Owner) → Sees all 5 businesses in org
    Mary (Org Manager) → Sees only 2 businesses she's assigned to
    Sue (Org Staff) → Sees only 1 business she's assigned to
    
    NOTE: After fetching, permissions WITHIN each business are checked
          separately using BUSINESS-LEVEL roles (BusinessUser.role)
    """
    
    print(f"\n{'='*80}")
    print(f"🚀 GET /api/businesses/ ENDPOINT CALLED!")
    print(f"🔍 DEBUG: User={current_user.email}, ORG Role={current_user.role}, OrgID={current_user.organization_id}")
    print(f"{'='*80}\n")
    
    # ORGANIZATION OWNER? → See all businesses
    if current_user.role == 'owner':
        businesses = db.query(Business).filter(
            Business.organization_id == current_user.organization_id
        ).all()
        print(f"✅ Org Owner {current_user.email} sees all {len(businesses)} businesses")
    else:
        # NOT ORG OWNER? → See only assigned businesses
        # Query: Find businesses where this user is explicitly assigned
        print(f"🔒 Filtering for non-owner {current_user.email}...")
        businesses = db.query(Business).join(
            BusinessUser,
            Business.id == BusinessUser.business_id
        ).filter(
            Business.organization_id == current_user.organization_id,
            BusinessUser.admin_user_id == current_user.id
        ).distinct().all()
        print(f"🔒 User {current_user.email} (ORG role={current_user.role}) sees {len(businesses)} assigned businesses:")
        for biz in businesses:
            print(f"   - {biz.name} (ID={biz.id})")
    
    return businesses


@router.get("/{business_id}", response_model=BusinessDetailResponse)
async def get_business(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Get a specific business with all its users"""
    
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.organization_id == current_user.organization_id
    ).first()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    return business


@router.put("/{business_id}", response_model=BusinessResponse)
async def update_business(
    business_id: int,
    business_data: BusinessUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Update a business"""
    
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.organization_id == current_user.organization_id
    ).first()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    # Update only provided fields
    update_data = business_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(business, field, value)
    
    db.commit()
    db.refresh(business)
    
    return business


@router.delete("/{business_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_business(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Delete a business"""
    
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.organization_id == current_user.organization_id
    ).first()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    db.delete(business)
    db.commit()
    
    return None


# Business User Assignment Endpoints
@router.post("/{business_id}/assign-user", response_model=BusinessUserResponse, status_code=status.HTTP_201_CREATED)
async def assign_user_to_business(
    business_id: int,
    user_data: BusinessUserCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Assign a user to a business with a specific role"""
    
    # Check if business exists and belongs to current user's organization
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.organization_id == current_user.organization_id
    ).first()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    # Check if user exists and belongs to the same organization
    user = db.query(AdminUser).filter(
        AdminUser.id == user_data.admin_user_id,
        AdminUser.organization_id == current_user.organization_id
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in your organization"
        )
    
    # Check if user is already assigned to this business
    existing = db.query(BusinessUser).filter(
        BusinessUser.business_id == business_id,
        BusinessUser.admin_user_id == user_data.admin_user_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already assigned to this business"
        )
    
    # Update user's organization role to match the business role
    user.role = user_data.role
    
    # Create assignment
    assignment = BusinessUser(
        business_id=business_id,
        admin_user_id=user_data.admin_user_id,
        role=user_data.role
    )
    
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    
    return assignment


@router.get("/{business_id}/users", response_model=list[dict])
async def get_business_users(
    business_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Get all users assigned to a business"""
    
    business = db.query(Business).filter(
        Business.id == business_id,
        Business.organization_id == current_user.organization_id
    ).first()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    assignments = db.query(BusinessUser).filter(
        BusinessUser.business_id == business_id
    ).all()
    
    # Return user info with their assignment role
    result = []
    for assignment in assignments:
        user = db.query(AdminUser).filter(AdminUser.id == assignment.admin_user_id).first()
        if user:
            result.append({
                "id": user.id,
                "assignment_id": assignment.id,
                "email": user.email,
                "full_name": user.email.split("@")[0],
                "role": assignment.role,
            })
    
    return result


@router.put("/users/{assignment_id}", response_model=BusinessUserResponse)
async def update_business_user_role(
    assignment_id: int,
    user_data: BusinessUserUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Update a user's role in a business"""
    
    assignment = db.query(BusinessUser).join(Business).filter(
        BusinessUser.id == assignment_id,
        Business.organization_id == current_user.organization_id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    if user_data.role:
        assignment.role = user_data.role
        # Update user's organization role to match
        user = db.query(AdminUser).filter(AdminUser.id == assignment.admin_user_id).first()
        if user:
            user.role = user_data.role
    
    db.commit()
    db.refresh(assignment)
    
    return assignment


@router.delete("/users/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_user_from_business(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """Remove a user from a business"""
    
    assignment = db.query(BusinessUser).join(Business).filter(
        BusinessUser.id == assignment_id,
        Business.organization_id == current_user.organization_id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    db.delete(assignment)
    db.commit()
    
    return None
