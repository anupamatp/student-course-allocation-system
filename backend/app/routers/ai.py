from fastapi import APIRouter
from app.schemas.ai import AIRequest, AIResponse
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database import get_db
from app.models.allocation import Allocation
from app.models.course import Course
from app.models.student import Student
from app.models.preference import StudentPreference
router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)

@router.post("/chat", response_model=AIResponse)
def chat(request: AIRequest, db: Session = Depends(get_db)):
    message = request.message.lower()

    if (
        "allocated to each course" in message
        or ("allocated" in message and "course" in message)
    ):
        return allocated_students_per_course(db)

    elif (
        "first preference" in message
        or ("did not receive" in message and "preference" in message)
    ):
        return students_not_first_preference(db)

    elif (
        "highest rejection rate" in message
        or ("rejection" in message and "course" in message)
    ):
        return highest_rejection_course(db)

    elif (
        "category-wise allocation" in message
        or ("category" in message and "allocation" in message)
        or "allocation summary" in message
    ):
        return category_allocation_summary(db)

    return AIResponse(
        response="Sorry, I don't understand that question."
    )
def allocated_students_per_course(db: Session):
    courses = db.query(Course).all()

    if not courses:
        return AIResponse(response="No courses found.")

    response = "Students allocated to each course:\n\n"

    for course in courses:
        count = (
            db.query(Allocation)
            .filter(Allocation.course_id == course.id)
            .count()
        )

        response += f"{course.name}: {count} students\n"

    return AIResponse(response=response)
def students_not_first_preference(db: Session):
    allocations = (
        db.query(Allocation)
        .join(Student)
        .filter(
            Allocation.status == "ALLOCATED",
            Allocation.allocated_preference != 1
        )
        .all()
    )

    if not allocations:
        return AIResponse(
            response="All allocated students received their first preference."
        )

    response = "Students who did not receive their first preference:\n\n"

    for allocation in allocations:
        response += (
            f"{allocation.student.name} "
            f"(Received Preference {allocation.allocated_preference})\n"
        )

    return AIResponse(response=response)

def highest_rejection_course(db: Session):
    courses = db.query(Course).all()

    if not courses:
        return AIResponse(response="No courses found.")

    highest_course = None
    highest_rejection = -1
    preferred_count = 0
    allocated_count = 0

    for course in courses:

        preferred = (
            db.query(StudentPreference)
            .filter(StudentPreference.course_id == course.id)
            .count()
        )

        allocated = (
            db.query(Allocation)
            .filter(
                Allocation.course_id == course.id,
                Allocation.status == "ALLOCATED"
            )
            .count()
        )

        rejection = preferred - allocated

        if rejection > highest_rejection:
            highest_rejection = rejection
            highest_course = course.name
            preferred_count = preferred
            allocated_count = allocated

    return AIResponse(
        response=(
            f"{highest_course} had the highest rejection rate.\n\n"
            f"Students Preferred: {preferred_count}\n"
            f"Students Allocated: {allocated_count}\n"
            f"Rejected Students: {highest_rejection}"
        )
    )
def category_allocation_summary(db: Session):
    categories = ["GENERAL", "OBC", "SC", "ST"]

    response = "Category-wise Allocation Summary:\n\n"

    for category in categories:

        total = (
            db.query(Student)
            .filter(Student.category == category)
            .count()
        )

        allocated = (
            db.query(Allocation)
            .join(Student)
            .filter(
                Student.category == category,
                Allocation.status == "ALLOCATED"
            )
            .count()
        )

        not_allocated = total - allocated

        response += (
            f"{category}\n"
            f"Allocated: {allocated}\n"
            f"Not Allocated: {not_allocated}\n\n"
        )

    return AIResponse(response=response)