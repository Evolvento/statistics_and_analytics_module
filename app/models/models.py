from pydantic import BaseModel


class Numbers(BaseModel):
    num1: float
    num2: float


class User(BaseModel):
    name: str
    age: int
