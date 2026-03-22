from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import upload_router

app = FastAPI()
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# uvicorn app.main:app --reload

app.include_router(upload_router, prefix="/upload", tags=["upload"])


@app.get("/")
def read_root():
    return {"Hello": "World"}