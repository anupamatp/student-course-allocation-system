from pydantic import BaseModel, ConfigDict


class PreferenceCreate(BaseModel):
    student_id: int
    course_id: int
    priority: int


class PreferenceResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    priority: int

    model_config = ConfigDict(from_attributes=True)