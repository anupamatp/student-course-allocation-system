from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    CheckConstraint,
)
from app.database import Base


class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id", ondelete="SET NULL"),
        nullable=True,
    )

    allocated_category = Column(String(20), nullable=True)

    allocated_preference = Column(Integer, nullable=True)

    status = Column(String(20), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "allocated_category IN ('GENERAL','OBC','SC','ST') "
            "OR allocated_category IS NULL",
            name="check_allocated_category",
        ),

        CheckConstraint(
            "allocated_preference IN (1,2,3) "
            "OR allocated_preference IS NULL",
            name="check_allocated_preference",
        ),

        CheckConstraint(
            "status IN ('ALLOCATED','NOT_ALLOCATED')",
            name="check_status",
        ),
    )
    student = relationship(
    "Student",
    back_populates="allocation",
    )

    course = relationship(
    "Course",
    back_populates="allocations",
    )