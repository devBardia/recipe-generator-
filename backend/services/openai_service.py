from openai import OpenAI
from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import json

load_dotenv()

client = OpenAI()

class Recipe(BaseModel):
    title: str
    ingredients: List[str]
    instructions: List[str]
    cooking_time: int
    servings: int
    calories: Optional[int] = None
    cuisine_type: Optional[str] = None
    diet_type: Optional[str] = None

async def generate_recipe(ingredients: List[str], preferences: Optional[dict] = None) -> Recipe:
    try:
        # Create the prompt
        prompt = "Generate a recipe"
        if ingredients:
            prompt += f" using these ingredients: {', '.join(ingredients)}"
        
        if preferences:
            prompt += "\nPreferences:"
            if preferences.get('calories'):
                prompt += f"\n- Around {preferences['calories']} calories per serving"
            if preferences.get('diet_preference'):
                prompt += f"\n- Diet preference: {preferences['diet_preference']}"
            if preferences.get('cooking_time'):
                prompt += f"\n- Cooking time: {preferences['cooking_time']}"
            if preferences.get('cuisine_type') and preferences['cuisine_type'] != 'any':
                prompt += f"\n- Cuisine type: {preferences['cuisine_type']}"
            if preferences.get('skill_level'):
                prompt += f"\n- Skill level: {preferences['skill_level']}"
            if preferences.get('servings'):
                prompt += f"\n- Servings: {preferences['servings']}"
            if preferences.get('dietary_restrictions'):
                prompt += f"\n- Dietary restrictions: {', '.join(preferences['dietary_restrictions'])}"
            if preferences.get('meal_type'):
                prompt += f"\n- Meal type: {preferences['meal_type']}"

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "create_recipe",
                    "description": "Create a recipe based on ingredients and preferences",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "The title of the recipe"
                            },
                            "ingredients": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "List of ingredients with quantities"
                            },
                            "instructions": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "Step by step cooking instructions"
                            },
                            "cooking_time": {
                                "type": "integer",
                                "description": "Cooking time in minutes"
                            },
                            "servings": {
                                "type": "integer",
                                "description": "Number of servings"
                            },
                            "calories": {
                                "type": "integer",
                                "description": "Calories per serving"
                            },
                            "cuisine_type": {
                                "type": "string",
                                "description": "Type of cuisine"
                            },
                            "diet_type": {
                                "type": "string",
                                "description": "Type of diet"
                            }
                        },
                        "required": ["title", "ingredients", "instructions", "cooking_time", "servings"]
                    }
                }
            }
        ]

        messages = [
            {"role": "system", "content": "You are a professional chef who creates detailed recipes."},
            {"role": "user", "content": prompt}
        ]

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            tools=tools,
            tool_choice={"type": "function", "function": {"name": "create_recipe"}}
        )

        # Check if we have a response and tool calls
        if not completion.choices or not completion.choices[0].message.tool_calls:
            raise Exception("No recipe generated")

        # Get the function call from the response
        tool_call = completion.choices[0].message.tool_calls[0]
        
        if not tool_call or not tool_call.function or not tool_call.function.arguments:
            raise Exception("Invalid recipe format")

        # Parse the recipe data
        recipe_data = json.loads(tool_call.function.arguments)
        
        # Validate required fields
        required_fields = ["title", "ingredients", "instructions", "cooking_time", "servings"]
        for field in required_fields:
            if field not in recipe_data:
                raise Exception(f"Missing required field: {field}")

        # Create and return the recipe
        recipe = Recipe(**recipe_data)
        return recipe

    except Exception as e:
        print(f"Error generating recipe: {str(e)}")
        raise e 