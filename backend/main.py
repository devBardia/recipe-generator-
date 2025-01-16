from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

from routers import auth
from config.database import connect_to_mongo, close_mongo_connection

# Load environment variables
load_dotenv()

app = FastAPI(title="Recipe Generator API")

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite's default development server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers for database connection
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"]) 