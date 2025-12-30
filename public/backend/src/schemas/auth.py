from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    organization_id: Optional[int] = None
    organization_name: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = "staff"

class TokenResponse(BaseModel):
    token: str
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    organization_id: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

