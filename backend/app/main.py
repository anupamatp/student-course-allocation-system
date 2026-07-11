from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.routers.students import router as student_router
from app.routers.courses import router as course_router
from app.routers.allocation import router as allocation_router
from app.routers.dashboard import router as dashboard_router
from app.routers.ai import router as ai_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router)
app.include_router(course_router)
app.include_router(allocation_router)
app.include_router(dashboard_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Student Course Allocation API is running!"}