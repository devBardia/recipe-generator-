from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = None

async def connect_to_mongo():
    """Create database connection."""
    global client
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        await client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close database connection."""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_database():
    """Get database instance."""
    return client.recipe_generator

# Collections
def get_users_collection():
    """Get users collection."""
    return get_database().users 