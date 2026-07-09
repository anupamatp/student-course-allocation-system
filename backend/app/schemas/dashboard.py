from pydantic import BaseModel


class DashboardStatisticsResponse(BaseModel):
    total_students: int
    allocated_students: int
    not_allocated_students: int
    total_courses: int
    total_seats: int
    remaining_seats: int