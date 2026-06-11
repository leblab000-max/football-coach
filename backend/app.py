from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from models import exercise
from routers import exercises

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Football Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exercises.router)

@app.get("/")
def root():
    return {"message": "Server works!"}

@app.get("/health")
def health():
    return {"status": "ok"}
