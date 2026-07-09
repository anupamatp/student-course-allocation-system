from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Numeric, Date, CheckConstraint
from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    marks = Column(Numeric(5, 2), nullable=False)
    category = Column(String(20), nullable=False)
    application_date = Column(Date, nullable=False)

    __table_args__ = (
        CheckConstraint(
            "marks >= 0",
            name="check_marks_positive"
        ),
        CheckConstraint(
            "category IN ('GENERAL', 'OBC', 'SC', 'ST')",
            name="check_valid_category"
        ),
    )

    preferences = relationship(
    "StudentPreference",
    back_populates="student",
    cascade="all, delete-orphan",
    )

    allocation = relationship(
    "Allocation",
    back_populates="student",
    uselist=False,
    cascade="all, delete-orphan",
    )