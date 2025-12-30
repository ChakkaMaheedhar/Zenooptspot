from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CustomerCreate(BaseModel):
    phone_number: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    points: Optional[int] = 0
    visits: Optional[int] = 0

class CustomerUpdate(BaseModel):
    phone_number: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    points: Optional[int] = None
    visits: Optional[int] = None

class AddPointsRequest(BaseModel):
    points: int

class CustomerResponse(BaseModel):
    id: int
    organization_id: int
    phone_number: Optional[str]
    name: Optional[str]
    email: Optional[str]
    points: int
    visits: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

