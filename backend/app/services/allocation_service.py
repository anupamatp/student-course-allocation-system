from sqlalchemy.orm import Session

from app.models.allocation import Allocation
from app.models.course import Course
from app.models.student import Student
from app.models.preference import StudentPreference

def reset_previous_allocations(db: Session):
    """
    Clears old allocation results
    and restores remaining seats.
    """

    # Delete previous allocations
    db.query(Allocation).delete()

    # Restore remaining seats
    courses = db.query(Course).all()

    for course in courses:
        course.remaining_general_seats = course.general_seats
        course.remaining_obc_seats = course.obc_seats
        course.remaining_sc_seats = course.sc_seats
        course.remaining_st_seats = course.st_seats

    db.commit()


def get_students_sorted(db: Session):
    """
    Returns students sorted by:
    1. Marks (highest first)
    2. Application date (earliest first)
    """

    students = (
        db.query(Student)
        .order_by(
            Student.marks.desc(),
            Student.application_date.asc()
        )
        .all()
    )

    return students

def get_student_preferences(student: Student, db: Session):
    """
    Returns a student's preferences ordered by priority.
    """

    preferences = (
        db.query(StudentPreference)
        .filter(StudentPreference.student_id == student.id)
        .order_by(StudentPreference.priority.asc())
        .all()
    )

    return preferences
def allocate_student(student: Student, db: Session):
    """
    Allocates one student to the highest possible preferred course.
    If no preferred course has an available seat, the student is marked
    as NOT_ALLOCATED.
    """

    preferences = get_student_preferences(student, db)

    for preference in preferences:

        course = preference.course

        # Check seat availability based on category
        if student.category == "GENERAL":
            if course.remaining_general_seats <= 0:
                continue
            course.remaining_general_seats -= 1

        elif student.category == "OBC":
            if course.remaining_obc_seats <= 0:
                continue
            course.remaining_obc_seats -= 1

        elif student.category == "SC":
            if course.remaining_sc_seats <= 0:
                continue
            course.remaining_sc_seats -= 1

        elif student.category == "ST":
            if course.remaining_st_seats <= 0:
                continue
            course.remaining_st_seats -= 1

        # Student successfully allocated
        allocation = Allocation(
            student_id=student.id,
            course_id=course.id,
            allocated_category=student.category,
            allocated_preference=preference.priority,
            status="ALLOCATED",
        )

        db.add(allocation)
        return

    # If no seat was available in any preferred course
    allocation = Allocation(
        student_id=student.id,
        course_id=None,
        allocated_category=None,
        allocated_preference=None,
        status="NOT_ALLOCATED",
    )

    db.add(allocation)
    
def run_allocation(db: Session):
    """
    Runs the complete course allocation process.
    """

    # Step 1: Clear previous allocations
    reset_previous_allocations(db)

    # Step 2: Get students in merit order
    students = get_students_sorted(db)

    # Step 3: Allocate each student
    for student in students:
        allocate_student(student, db)

    # Step 4: Save all changes
    db.commit()

    return {
        "message": "Course allocation completed successfully."
    }