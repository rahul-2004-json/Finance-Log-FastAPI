from fastapi import FastAPI,HTTPException,Depends
from typing import Annotated
from pydantic import BaseModel
from database import SessionLocal,engine
from sqlalchemy.orm import Session
import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# FastAPI will be called only by an application running on localhost:3000
origins=[
    "http://localhost:3000",
]

# Adding the above URL to our application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # This allows all methods like GET, POST, PUT, DELETE
    allow_headers=["*"],  # This allows all headers like Authorization, Content-Type etc
)


# Pydanitc model for the Transaction , this will validate the request from React Application
# This helps in either accepting or rejecting the request based on the data type
# This is request model
class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

# This is response model
class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True


# This function creates a database connection 
# It only opens when request comes in and closes when request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# We are calling our database to create tables and columns automatically when our application starts
db_dependency = Annotated[Session,Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db:db_dependency):
    # Line below maps the request data to the model or table in the database
    db_transaction = models.Transaction(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@app.get("/transactions/", response_model=list[TransactionModel])  # response_model is set to give list of TransactionModel
async def read_transaction(db:db_dependency,skip: int = 0, limit: int = 100):  # Skip and limit are the query parameters that limit the amount of data to fetch
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions