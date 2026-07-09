from datetime import date
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class StudentCreate(BaseModel):
    name: str
    marks: Decimal
    category: str
    application_date: date


class StudentResponse(BaseModel):
    id: int
    name: str
    marks: Decimal
    category: str
    application_date: date

    model_config = ConfigDict(from_attributes=True)