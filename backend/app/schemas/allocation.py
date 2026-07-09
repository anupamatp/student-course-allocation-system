from typing import Optional
from datetime import date
from pydantic import BaseModel, ConfigDict


class AllocationResponse(BaseModel):
    id: int
    student_id: int
    course_id: Optional[int] = None
    allocated_category: Optional[str] = None
    allocated_preference: Optional[int] = None
    status: str

    model_config = ConfigDict(from_attributes=True)


class AllocationDetailsResponse(BaseModel):
    id: int
    student_id: int
    course_id: Optional[int] = None
    student_name: str
    marks: float
    category: str
    application_date: date
    course_name: Optional[str] = None
    allocated_category: Optional[str] = None
    allocated_preference: Optional[int] = None
    status: str

    model_config = ConfigDict(from_attributes=True)