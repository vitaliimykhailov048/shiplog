from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


Status = Literal["pending", "in_transit", "delivered", "cancelled"]


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ShipmentBase(BaseModel):
    tracking_number: str = Field(min_length=3, max_length=64)
    carrier: str = Field(min_length=1, max_length=80)
    origin: str = Field(min_length=1, max_length=120)
    destination: str = Field(min_length=1, max_length=120)
    status: Status = "pending"
    eta: Optional[datetime] = None
    notes: Optional[str] = Field(default=None, max_length=2000)


class ShipmentCreate(ShipmentBase):
    pass


class ShipmentUpdate(BaseModel):
    tracking_number: Optional[str] = Field(default=None, min_length=3, max_length=64)
    carrier: Optional[str] = Field(default=None, min_length=1, max_length=80)
    origin: Optional[str] = Field(default=None, min_length=1, max_length=120)
    destination: Optional[str] = Field(default=None, min_length=1, max_length=120)
    status: Optional[Status] = None
    eta: Optional[datetime] = None
    notes: Optional[str] = Field(default=None, max_length=2000)


class ShipmentOut(ShipmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class StatsOut(BaseModel):
    total: int
    pending: int
    in_transit: int
    delivered: int
    cancelled: int
