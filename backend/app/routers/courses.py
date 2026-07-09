from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseResponse

router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
)

@router.get("/", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.post("/", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):

    new_course = Course(
        name=course.name,
        total_seats=course.total_seats,
        general_seats=course.general_seats,
        obc_seats=course.obc_seats,
        sc_seats=course.sc_seats,
        st_seats=course.st_seats,

        remaining_general_seats=course.general_seats,
        remaining_obc_seats=course.obc_seats,
        remaining_sc_seats=course.sc_seats,
        remaining_st_seats=course.st_seats,
    )

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return new_course

@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    course: CourseCreate,
    db: Session = Depends(get_db)
):
    db_course = db.query(Course).filter(Course.id == course_id).first()

    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    db_course.name = course.name
    db_course.total_seats = course.total_seats

    db_course.general_seats = course.general_seats
    db_course.obc_seats = course.obc_seats
    db_course.sc_seats = course.sc_seats
    db_course.st_seats = course.st_seats

    db_course.remaining_general_seats = course.general_seats
    db_course.remaining_obc_seats = course.obc_seats
    db_course.remaining_sc_seats = course.sc_seats
    db_course.remaining_st_seats = course.st_seats

    db.commit()
    db.refresh(db_course)

    return db_course

@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    db_course = db.query(Course).filter(Course.id == course_id).first()

    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(db_course)
    db.commit()

    return {"message": "Course deleted successfully"}