from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
import base64
import io
from config.database import get_users_collection, get_recipes_collection
from .auth import get_current_user
from services.openai_service import generate_recipe
from services.image_service import process_ingredient_image

router = APIRouter()

class RecipeBase(BaseModel):
    title: str = Field(..., description="Recipe title")
    ingredients: List[str] = Field(..., description="List of ingredients with quantities")
    instructions: List[str] = Field(..., description="Step by step cooking instructions")
    cooking_time: int = Field(..., description="Cooking time in minutes", gt=0)
    servings: int = Field(..., description="Number of servings", gt=0)
    calories: Optional[int] = Field(None, description="Calories per serving", gt=0)
    cuisine_type: Optional[str] = Field(None, description="Type of cuisine")
    diet_type: Optional[str] = Field(None, description="Type of diet")
    difficulty: Optional[str] = Field(None, description="Recipe difficulty level")
    prep_time: Optional[int] = Field(None, description="Preparation time in minutes", gt=0)
    total_time: Optional[int] = Field(None, description="Total time including prep and cooking", gt=0)

class RecipeCreate(BaseModel):
    ingredients: List[str] = Field(..., description="List of ingredients")
    preferences: Optional[dict] = Field(default={}, description="Recipe preferences")

class RecipeInDB(RecipeBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }
        
    @property
    def formatted_time(self) -> str:
        hours = self.cooking_time // 60
        minutes = self.cooking_time % 60
        return f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"

async def save_recipe_to_db(recipe: RecipeBase, user_id: str) -> str:
    """Save recipe to database and return the recipe ID."""
    recipe_doc = {
        **recipe.dict(),
        "user_id": str(user_id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await get_recipes_collection().insert_one(recipe_doc)
    
    if not result.inserted_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save recipe"
        )
    
    # Update user's recipes list
    await get_users_collection().update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"recipes": str(result.inserted_id)}}
    )
    
    return str(result.inserted_id)

@router.post("/random", response_model=RecipeBase)
async def generate_random_recipe(
    preferences: dict = None,
    current_user = Depends(get_current_user)
):
    """Generate a random recipe based on optional preferences."""
    try:
        recipe = await generate_recipe([], preferences)
        
        if recipe:
            # Save recipe and update user's recipes list
            recipe_id = await save_recipe_to_db(recipe, current_user["_id"])
            return recipe
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate recipe"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/from-image", response_model=RecipeBase)
async def generate_recipe_from_ingredients_image(
    image: UploadFile = File(...),
    preferences: Optional[dict] = None,
    current_user = Depends(get_current_user)
):
    """Generate a recipe from an image of ingredients."""
    try:
        # Read the image file
        image_content = await image.read()
        
        # Convert to base64
        base64_image = base64.b64encode(image_content).decode('utf-8')
        
        # Process the image and get ingredients
        ingredients = await process_ingredient_image(base64_image)
        
        if not ingredients:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No ingredients detected in the image"
            )
        
        recipe = await generate_recipe(ingredients, preferences)
        
        if recipe:
            # Save recipe and update user's recipes list
            recipe_id = await save_recipe_to_db(recipe, current_user["_id"])
            return recipe
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate recipe"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/from-text", response_model=RecipeBase)
async def generate_recipe_from_ingredients_text(
    recipe_request: RecipeCreate,
    current_user = Depends(get_current_user)
):
    """Generate a recipe from a list of ingredients."""
    try:
        recipe = await generate_recipe(
            recipe_request.ingredients,
            recipe_request.preferences
        )
        
        if recipe:
            # Save recipe and update user's recipes list
            recipe_id = await save_recipe_to_db(recipe, current_user["_id"])
            return recipe
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate recipe"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/history", response_model=List[RecipeInDB])
async def get_user_recipes(
    current_user = Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    """Get user's recipe history."""
    try:
        # Get the user's recipe IDs from the users collection
        user = await get_users_collection().find_one(
            {"_id": ObjectId(current_user["_id"])}
        )
        
        if not user or "recipes" not in user:
            return []
        
        # Convert recipe IDs to ObjectId
        recipe_ids = [ObjectId(recipe_id) for recipe_id in user["recipes"]]
        
        # Get recipes from the recipes collection
        recipes = await get_recipes_collection().find(
            {"_id": {"$in": recipe_ids}}
        ).sort(
            "created_at", -1
        ).skip(skip).limit(limit).to_list(length=limit)
        
        # Add the recipe ID to each recipe and format dates
        for recipe in recipes:
            recipe["id"] = str(recipe["_id"])
            recipe["created_at"] = recipe["created_at"].isoformat()
            recipe["updated_at"] = recipe["updated_at"].isoformat()
            # Remove the _id field as we have id
            recipe.pop("_id", None)
        
        return recipes
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 