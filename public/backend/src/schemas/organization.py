from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrganizationCreate(BaseModel):
    name: str
    address: Optional[str] = None
    industry_type: Optional[str] = None
    logo_url: Optional[str] = None
    billing_plan: Optional[str] = "free"

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    industry_type: Optional[str] = None
    logo_url: Optional[str] = None
    billing_plan: Optional[str] = None

class OrganizationResponse(BaseModel):
    id: int
    name: str
    address: Optional[str]
    industry_type: Optional[str]
    logo_url: Optional[str]
    billing_plan: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

