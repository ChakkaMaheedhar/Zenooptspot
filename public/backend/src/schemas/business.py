from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class BusinessCreate(BaseModel):
    name: str
    address: Optional[str] = None
    industry_type: Optional[str] = None
    logo_url: Optional[str] = None


class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    industry_type: Optional[str] = None
    logo_url: Optional[str] = None


class BusinessResponse(BaseModel):
    id: int
    organization_id: int
    name: str
    address: Optional[str]
    industry_type: Optional[str]
    logo_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BusinessUserCreate(BaseModel):
    admin_user_id: int
    role: str = 'staff'


class BusinessUserUpdate(BaseModel):
    role: Optional[str] = None


class BusinessUserResponse(BaseModel):
    id: int
    business_id: int
    admin_user_id: int
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BusinessDetailResponse(BusinessResponse):
    business_users: List[BusinessUserResponse] = []
