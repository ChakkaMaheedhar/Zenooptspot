from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from src.config.database import get_db
from src.models.database import Organization
from src.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from src.utils.auth import get_current_active_user
from src.models.database import AdminUser

router = APIRouter(prefix="/api/organizations", tags=["organizations"])

@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(org_data: OrganizationCreate, db: Session = Depends(get_db)):
    new_org = Organization(**org_data.model_dump())
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    return new_org

@router.get("/", response_model=List[OrganizationResponse])
async def get_all_organizations(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    # Return only current user's organization for security
    organizations = db.query(Organization).filter(
        Organization.id == current_user.organization_id
    ).all()
    return organizations

@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return organization

@router.put("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: int,
    org_data: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    organization = db.query(Organization).filter(Organization.id == org_id).first()
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    update_data = org_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(organization, field, value)
    
    db.commit()
    db.refresh(organization)
    return organization

