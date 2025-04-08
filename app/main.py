import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse

from app import Numbers, User


app = FastAPI()


user = User(name="John Doe", age=25)


@app.get("/")
async def root():
    return FileResponse("index.html")


@app.get("/custom")
def read_custom_message():
    return {"message": "This is a custom message!"}


@app.post("/calculate")
def calculate(numbers: Numbers):
    result = numbers.num1 + numbers.num2
    return {"result": result}


@app.get("/users")
def get_user():
    return user


@app.post("/user")
def is_adult(user: User):
    return {"name": user.name, "age": user.age, "is_adult": (user.age >= 18)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
