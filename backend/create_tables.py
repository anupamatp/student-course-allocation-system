from app.database import Base, engine

# Import ALL models
from app.models.student import Student
from app.models.course import Course
from app.models.preference import StudentPreference
from app.models.allocation import Allocation

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully!")