from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey, CheckConstraint, UniqueConstraint
from app.database import Base


class StudentPreference(Base):
    __tablename__ = "student_preferences"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False
    )

    priority = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint(
            "priority IN (1,2,3)",
            name="check_valid_priority"
        ),

        UniqueConstraint(
            "student_id",
            "priority",
            name="unique_student_priority"
        ),

        UniqueConstraint(
            "student_id",
            "course_id",
            name="unique_student_course"
        ),
    )
    student = relationship(
    "Student",
    back_populates="preferences",
    )

    course = relationship(
    "Course",
    back_populates="preferences",
    )