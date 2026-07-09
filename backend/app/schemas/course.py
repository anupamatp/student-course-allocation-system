from pydantic import BaseModel, ConfigDict


class CourseCreate(BaseModel):
    name: str
    total_seats: int
    general_seats: int
    obc_seats: int
    sc_seats: int
    st_seats: int


class CourseResponse(BaseModel):
    id: int
    name: str
    total_seats: int
    general_seats: int
    obc_seats: int
    sc_seats: int
    st_seats: int

    remaining_general_seats: int
    remaining_obc_seats: int
    remaining_sc_seats: int
    remaining_st_seats: int

    model_config = ConfigDict(from_attributes=True)