from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

# Create a new client and connect to the server
client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
db = client.recipe_app  # Use your database name here

async def init_db():
    try:
        # Send a ping to confirm a successful connection
        await client.admin.command('ping')
        print("Pinged your deployment. Successfully connected to MongoDB Atlas!")
        
        # Create indexes
        await get_users_collection().create_index("email", unique=True)
        await get_recipes_collection().create_index([("user_id", 1), ("created_at", -1)])
        print("Database indexes created successfully!")
        
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise e

async def close_db_connection():
    client.close()
    print("Database connection closed.")

def get_database():
    """Get database instance."""
    return client.recipe_app

def get_users_collection():
    """Get users collection."""
    return get_database().users

def get_recipes_collection():
    """Get recipes collection."""
    return get_database().recipes 