from datetime import date

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.student import Student
from app.models.course import Course
from app.models.preference import StudentPreference
from app.models.allocation import Allocation


db: Session = SessionLocal()

def clear_database():
    print("Clearing existing data...")

    db.query(Allocation).delete()
    db.query(StudentPreference).delete()
    db.query(Student).delete()
    db.query(Course).delete()

    db.commit()

    print("Database cleared.")


def seed_courses():
    print("Seeding courses...")

    courses = [
        Course(
            name="Computer Science",
            total_seats=6,
            general_seats=3,
            obc_seats=1,
            sc_seats=1,
            st_seats=1,
            remaining_general_seats=3,
            remaining_obc_seats=1,
            remaining_sc_seats=1,
            remaining_st_seats=1,
        ),
        Course(
            name="Mechanical Engineering",
            total_seats=5,
            general_seats=2,
            obc_seats=1,
            sc_seats=1,
            st_seats=1,
            remaining_general_seats=2,
            remaining_obc_seats=1,
            remaining_sc_seats=1,
            remaining_st_seats=1,
        ),
        Course(
            name="Civil Engineering",
            total_seats=4,
            general_seats=2,
            obc_seats=1,
            sc_seats=1,
            st_seats=0,
            remaining_general_seats=2,
            remaining_obc_seats=1,
            remaining_sc_seats=1,
            remaining_st_seats=0,
        ),
    ]

    db.add_all(courses)
    db.commit()

    print("✅ Courses inserted.")

def seed_students():
    print("Seeding students...")

    students = [
        Student(name="Alice",   marks=95.0, category="GENERAL", application_date=date(2026, 1, 1)),
        Student(name="Nihal",    marks=95.0, category="GENERAL", application_date=date(2026, 1, 3)),  # tie with Alice, later date
        Student(name="Chitra",    marks=92.5, category="OBC",     application_date=date(2026, 1, 2)),
        Student(name="Dev",      marks=91.0, category="SC",      application_date=date(2026, 1, 1)),
        Student(name="Esha",     marks=90.0, category="GENERAL", application_date=date(2026, 1, 4)),
        Student(name="Farhan",     marks=89.5, category="ST",      application_date=date(2026, 1, 2)),
        Student(name="Gauri",     marks=88.0, category="OBC",     application_date=date(2026, 1, 5)),
        Student(name="Harish Kumar",   marks=87.5, category="GENERAL", application_date=date(2026, 1, 1)),
        Student(name="Isha",     marks=86.0, category="SC",      application_date=date(2026, 1, 6)),
        Student(name="Jatin",    marks=85.5, category="GENERAL", application_date=date(2026, 1, 3)),
        Student(name="Kavya",    marks=84.0, category="OBC",     application_date=date(2026, 1, 2)),
        Student(name="Lakshmi",  marks=83.5, category="GENERAL", application_date=date(2026, 1, 7)),
        Student(name="Meera",    marks=82.0, category="ST",      application_date=date(2026, 1, 1)),
        Student(name="Nikhil",     marks=81.0, category="GENERAL", application_date=date(2026, 1, 8)),
        Student(name="Ajas",  marks=80.5, category="SC",      application_date=date(2026, 1, 4)),
        Student(name="Priya",   marks=79.0, category="GENERAL", application_date=date(2026, 1, 2)),
        Student(name="Manu",   marks=78.5, category="OBC",     application_date=date(2026, 1, 5)),
        Student(name="Riya",    marks=77.0, category="GENERAL", application_date=date(2026, 1, 9)),
        Student(name="Sameer",   marks=76.0, category="GENERAL", application_date=date(2026, 1, 10)),
        Student(name="Tara",    marks=75.0, category="GENERAL", application_date=date(2026, 1, 6)),
    ]

    db.add_all(students)
    db.commit()

    print(f"✅ {len(students)} students inserted.")


def seed_preferences():
    print("Seeding student preferences...")

    # Fetch courses and students back from DB so we have their generated IDs
    courses = {c.name: c for c in db.query(Course).all()}
    students = db.query(Student).all()

    cs = courses["Computer Science"]
    me = courses["Mechanical Engineering"]
    ce = courses["Civil Engineering"]

    # Most students want CS first (creates real competition/oversubscription)
    main_pattern = [cs, me, ce]
    alt_pattern_1 = [me, cs, ce]
    alt_pattern_2 = [ce, me, cs]

    preferences = []

    for i, student in enumerate(students):
        if i % 5 == 0:
            pattern = alt_pattern_1
        elif i % 7 == 0:
            pattern = alt_pattern_2
        else:
            pattern = main_pattern

        for priority, course in enumerate(pattern, start=1):
            preferences.append(
                StudentPreference(
                    student_id=student.id,
                    course_id=course.id,
                    priority=priority,
                )
            )

    db.add_all(preferences)
    db.commit()

    print(f"✅ {len(preferences)} preferences inserted.")

if __name__ == "__main__":
    clear_database()
    seed_courses()
    seed_students()
    seed_preferences()
    db.close()
    print("✅ Database seeded successfully!")