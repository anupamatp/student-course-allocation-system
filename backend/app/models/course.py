from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, CheckConstraint
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)

    total_seats = Column(Integer, nullable=False)

    general_seats = Column(Integer, nullable=False)
    obc_seats = Column(Integer, nullable=False)
    sc_seats = Column(Integer, nullable=False)
    st_seats = Column(Integer, nullable=False)

    remaining_general_seats = Column(Integer, nullable=False)
    remaining_obc_seats = Column(Integer, nullable=False)
    remaining_sc_seats = Column(Integer, nullable=False)
    remaining_st_seats = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint("total_seats >= 0", name="check_total_seats_positive"),
        CheckConstraint("general_seats >= 0", name="check_general_seats_positive"),
        CheckConstraint("obc_seats >= 0", name="check_obc_seats_positive"),
        CheckConstraint("sc_seats >= 0", name="check_sc_seats_positive"),
        CheckConstraint("st_seats >= 0", name="check_st_seats_positive"),

        CheckConstraint("remaining_general_seats >= 0", name="check_remaining_general_positive"),
        CheckConstraint("remaining_obc_seats >= 0", name="check_remaining_obc_positive"),
        CheckConstraint("remaining_sc_seats >= 0", name="check_remaining_sc_positive"),
        CheckConstraint("remaining_st_seats >= 0", name="check_remaining_st_positive"),

        CheckConstraint(
            "general_seats + obc_seats + sc_seats + st_seats = total_seats",
            name="check_total_seat_distribution"
        ),

        CheckConstraint(
            "remaining_general_seats <= general_seats",
            name="check_remaining_general_limit"
        ),
        CheckConstraint(
            "remaining_obc_seats <= obc_seats",
            name="check_remaining_obc_limit"
        ),
        CheckConstraint(
            "remaining_sc_seats <= sc_seats",
            name="check_remaining_sc_limit"
        ),
        CheckConstraint(
            "remaining_st_seats <= st_seats",
            name="check_remaining_st_limit"
        ),
    )
    preferences = relationship(
    "StudentPreference",
    back_populates="course",
    )

    allocations = relationship(
    "Allocation",
    back_populates="course",
    )