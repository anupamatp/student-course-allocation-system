from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.dependencies import get_db
from app.models.student import Student
from app.models.course import Course
from app.models.allocation import Allocation
from app.schemas.dashboard import DashboardStatisticsResponse
router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

@router.get("/statistics", response_model=DashboardStatisticsResponse)
def get_dashboard_statistics(db: Session = Depends(get_db)):

    total_students = db.query(Student).count()

    allocated_students = (
        db.query(Allocation)
        .filter(Allocation.status == "ALLOCATED")
        .count()
    )

    not_allocated_students = (
        db.query(Allocation)
        .filter(Allocation.status == "NOT_ALLOCATED")
        .count()
    )

    total_courses = db.query(Course).count()

    total_seats = (
        db.query(func.sum(Course.total_seats))
        .scalar() or 0
    )

    remaining_seats = (
        db.query(
            func.sum(
                Course.remaining_general_seats +
                Course.remaining_obc_seats +
                Course.remaining_sc_seats +
                Course.remaining_st_seats
            )
        )
        .scalar() or 0
    )

    return DashboardStatisticsResponse(
        total_students=total_students,
        allocated_students=allocated_students,
        not_allocated_students=not_allocated_students,
        total_courses=total_courses,
        total_seats=total_seats,
        remaining_seats=remaining_seats,
    )