from fastapi import FastAPI

app = FastAPI()

# uvicorn src.main:app --reload

@app.get("/")
def read_root():
    return {"Hello": "World"}