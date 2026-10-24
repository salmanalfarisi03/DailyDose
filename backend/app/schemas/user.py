from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class UserRoleEnum(str):
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    FINANCE = "FINANCE"


class UserBase(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: str = Field(default="ADMIN")
    is_active: bool = True


class UserCreate(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    full_name: str = Field(..., min_length=2, max_length=255)
    password: str = Field(..., min_length=6, max_length=128)
    role: str = Field(default="ADMIN")


class UserLogin(BaseModel):
    email: str
    password: str



class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime


class LoginResponse(BaseModel):
    user: UserResponse
    token: str
    message: str
