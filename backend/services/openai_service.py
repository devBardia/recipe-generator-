import openai
from typing import List, Optional
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

class Recipe(BaseModel):
    title: str
    ingredients: List[str]
    instructions: List[str]
    cooking_time: int
    servings: int
    calories: Optional[int]
    cuisine_type: Optional[str]
    diet_type: Optional[str]

def create_recipe_prompt(ingredients: List[str], preferences: Optional[dict] = None) -> str:
    """Create a prompt for recipe generation."""
    base_prompt = "Generate a detailed recipe with the following format:\n"
    base_prompt += "Title: [Recipe Name]\n"
    base_prompt += "Ingredients: [List of ingredients with quantities]\n"
    base_prompt += "Instructions: [Step by step cooking instructions]\n"
    base_prompt += "Cooking Time: [Time in minutes]\n"
    base_prompt += "Servings: [Number of servings]\n"
    base_prompt += "Calories: [Approximate calories per serving]\n"
    base_prompt += "Cuisine Type: [Type of cuisine]\n"
    base_prompt += "Diet Type: [Any specific diet category]\n\n"

    if ingredients:
        base_prompt += f"Use these ingredients: {', '.join(ingredients)}\n"
    
    if preferences:
        for key, value in preferences.items():
            base_prompt += f"{key}: {value}\n"
    
    return base_prompt

def parse_recipe_response(response_text: str) -> Recipe:
    """Parse OpenAI response into Recipe object."""
    lines = response_text.strip().split('\n')
    recipe_dict = {}
    current_key = None
    current_list = []

    for line in lines:
        if line.startswith('Title:'):
            recipe_dict['title'] = line.replace('Title:', '').strip()
        elif line.startswith('Ingredients:'):
            current_key = 'ingredients'
            current_list = []
        elif line.startswith('Instructions:'):
            recipe_dict['ingredients'] = current_list
            current_key = 'instructions'
            current_list = []
        elif line.startswith('Cooking Time:'):
            if current_key == 'instructions':
                recipe_dict['instructions'] = current_list
            time_str = line.replace('Cooking Time:', '').strip()
            recipe_dict['cooking_time'] = int(time_str.split()[0])
        elif line.startswith('Servings:'):
            servings_str = line.replace('Servings:', '').strip()
            recipe_dict['servings'] = int(servings_str.split()[0])
        elif line.startswith('Calories:'):
            calories_str = line.replace('Calories:', '').strip()
            recipe_dict['calories'] = int(calories_str.split()[0])
        elif line.startswith('Cuisine Type:'):
            recipe_dict['cuisine_type'] = line.replace('Cuisine Type:', '').strip()
        elif line.startswith('Diet Type:'):
            recipe_dict['diet_type'] = line.replace('Diet Type:', '').strip()
        elif line.strip() and current_key:
            current_list.append(line.strip())

    if current_key == 'instructions':
        recipe_dict['instructions'] = current_list

    return Recipe(**recipe_dict)

async def generate_recipe_from_text(
    ingredients: List[str],
    preferences: Optional[dict] = None
) -> Recipe:
    """Generate recipe using GPT-3.5."""
    prompt = create_recipe_prompt(ingredients, preferences)
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a professional chef who creates detailed recipes."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    
    recipe_text = response.choices[0].message.content
    return parse_recipe_response(recipe_text)

async def generate_recipe_from_image(
    ingredients: List[str],
    preferences: Optional[dict] = None
) -> Recipe:
    """Generate recipe using GPT-4 with image-identified ingredients."""
    prompt = create_recipe_prompt(ingredients, preferences)
    prompt += "\nThese ingredients were identified from an image, so please be creative and flexible with the recipe."
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a professional chef who creates detailed recipes."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    
    recipe_text = response.choices[0].message.content
    return parse_recipe_response(recipe_text) 