from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from config.database import get_users_collection, get_recipes_collection
from .auth import get_current_user
from services.openai_service import generate_recipe
from services.image_service import process_ingredient_image

router = APIRouter()

class RecipeBase(BaseModel):
    title: str
    ingredients: List[str]
    instructions: List[str]
    cooking_time: int  # in minutes
    servings: int
    calories: Optional[int]
    cuisine_type: Optional[str]
    diet_type: Optional[str]

class RecipeCreate(BaseModel):
    ingredients: List[str]
    preferences: Optional[dict] = {}

class RecipeDB(RecipeBase):
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

@router.post("/random", response_model=RecipeBase)
async def generate_random_recipe(
    preferences: dict = None,
    current_user = Depends(get_current_user)
):
    """Generate a random recipe based on optional preferences."""
    try:
        # Generate recipe using GPT-3.5
        recipe = await generate_recipe([], preferences)
        
        if recipe:
            # Save to database with user association
            recipe_doc = {
                **recipe.dict(),
                "user_id": str(current_user["_id"]),  # Convert ObjectId to string
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await get_recipes_collection().insert_one(recipe_doc)
            
            if not result.inserted_id:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to save recipe"
                )
            
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
        # Process image to identify ingredients using GPT-4 Vision
        ingredients = await process_ingredient_image(image)
        
        if not ingredients:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No ingredients detected in the image"
            )
        
        # Generate recipe using GPT-3.5 with the identified ingredients
        recipe = await generate_recipe(ingredients, preferences)
        
        if recipe:
            # Save to database with user association
            recipe_doc = {
                **recipe.dict(),
                "user_id": str(current_user["_id"]),  # Convert ObjectId to string
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await get_recipes_collection().insert_one(recipe_doc)
            
            if not result.inserted_id:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to save recipe"
                )
            
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
        # Generate recipe using GPT-3.5
        recipe = await generate_recipe(
            recipe_request.ingredients,
            recipe_request.preferences
        )
        
        if recipe:
            # Save to database with user association
            recipe_doc = {
                **recipe.dict(),
                "user_id": str(current_user["_id"]),  # Convert ObjectId to string
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await get_recipes_collection().insert_one(recipe_doc)
            
            if not result.inserted_id:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to save recipe"
                )
            
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

@router.get("/history", response_model=List[RecipeDB])
async def get_user_recipes(
    current_user = Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    """Get user's recipe history."""
    try:
        recipes = await get_recipes_collection().find(
            {"user_id": str(current_user["_id"])}  # Convert ObjectId to string
        ).sort(
            "created_at", -1
        ).skip(skip).limit(limit).to_list(length=limit)
        
        return recipes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 