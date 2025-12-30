from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from src.config.database import get_db
from src.models.database import Customer, AdminUser
from src.schemas.customer import (
    CustomerCreate, CustomerUpdate, CustomerResponse,
    AddPointsRequest
)
from src.utils.auth import get_current_active_user

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    if not customer_data.phone_number and not customer_data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number or email is required"
        )
    
    new_customer = Customer(
        organization_id=current_user.organization_id,
        **customer_data.model_dump()
    )
    
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.get("/", response_model=List[CustomerResponse])
async def get_all_customers(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    customers = db.query(Customer).filter(
        Customer.organization_id == current_user.organization_id
    ).offset(offset).limit(limit).all()
    return customers

@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.organization_id == current_user.organization_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    return customer

@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.organization_id == current_user.organization_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    update_data = customer_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(customer, field, value)
    
    db.commit()
    db.refresh(customer)
    return customer

@router.post("/{customer_id}/points", response_model=CustomerResponse)
async def add_points(
    customer_id: int,
    points_data: AddPointsRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    if points_data.points <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Points must be greater than 0"
        )
    
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.organization_id == current_user.organization_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    customer.points += points_data.points
    db.commit()
    db.refresh(customer)
    return customer

@router.post("/{customer_id}/visits", response_model=CustomerResponse)
async def increment_visits(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.organization_id == current_user.organization_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    customer.visits += 1
    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}", status_code=status.HTTP_200_OK)
async def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.organization_id == current_user.organization_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully", "customer": customer}

