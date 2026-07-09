from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.allocation_service import run_allocation
from app.models.allocation import Allocation
from app.schemas.allocation import (
    AllocationResponse,
    AllocationDetailsResponse,
)

router = APIRouter(
    prefix="/allocation",
    tags=["Allocation"],
)


@router.post("/run")
def allocate_courses(db: Session = Depends(get_db)):
    return run_allocation(db)


@router.get("/", response_model=list[AllocationDetailsResponse])
def get_allocations(db: Session = Depends(get_db)):
    """
    Returns allocation results with student and course details.
    """
    allocations = db.query(Allocation).all()
    result = []
    for allocation in allocations:
        result.append(
            AllocationDetailsResponse(
                id=allocation.id,
                student_id=allocation.student_id,
                course_id=allocation.course_id,
                student_name=allocation.student.name,
                marks=float(allocation.student.marks),
                category=allocation.student.category,
                application_date=allocation.student.application_date,
                course_name=allocation.course.name if allocation.course else None,
                allocated_category=allocation.allocated_category,
                allocated_preference=allocation.allocated_preference,
                status=allocation.status,
            )
        )
    return result