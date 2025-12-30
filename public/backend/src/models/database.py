from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, TIMESTAMP, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.config.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    industry_type = Column(String(100))
    logo_url = Column(Text)
    billing_plan = Column(String(50), default='free')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("billing_plan IN ('free', 'basic', 'pro')", name='check_billing_plan'),
    )

    # Relationships
    admin_users = relationship("AdminUser", back_populates="organization", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="organization", cascade="all, delete-orphan")
    businesses = relationship("Business", back_populates="organization", cascade="all, delete-orphan")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default='staff')
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('owner', 'manager', 'staff')", name='check_role'),
    )

    # Relationships
    organization = relationship("Organization", back_populates="admin_users")
    business_users = relationship("BusinessUser", back_populates="admin_user", cascade="all, delete-orphan")


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    industry_type = Column(String(100))
    logo_url = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="businesses")
    business_users = relationship("BusinessUser", back_populates="business", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="business", cascade="all, delete-orphan")


class BusinessUser(Base):
    __tablename__ = "business_users"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    admin_user_id = Column(Integer, ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), default='staff')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('owner', 'manager', 'staff')", name='check_business_user_role'),
    )

    # Relationships
    business = relationship("Business", back_populates="business_users")
    admin_user = relationship("AdminUser", back_populates="business_users")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=True)
    phone_number = Column(String(20))
    name = Column(String(255))
    email = Column(String(255))
    points = Column(Integer, default=0)
    visits = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="customers")
    business = relationship("Business", back_populates="customers")

