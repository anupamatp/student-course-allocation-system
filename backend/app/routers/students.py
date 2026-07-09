from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.student import Student
from app.schemas.student import StudentResponse, StudentCreate
from typing import Optional
from fastapi import Query

router = APIRouter(
    prefix="/students",
    tags=["Students"],
)

@router.get("/", response_model=list[StudentResponse])
def get_students(
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):

    query = db.query(Student)

    if search:
        query = query.filter(Student.name.ilike(f"%{search}%"))

    students = query.offset(skip).limit(limit).all()

    return students

@router.post("/", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    new_student = Student(
        name=student.name,
        marks=student.marks,
        category=student.category,
        application_date=student.application_date,
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()

    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    db_student.name = student.name
    db_student.marks = student.marks
    db_student.category = student.category
    db_student.application_date = student.application_date

    db.commit()
    db.refresh(db_student)

    return db_student


@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()

    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(db_student)
    db.commit()

    return {"message": "Student deleted successfully"}