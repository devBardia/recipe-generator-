import os
from typing import Optional, Dict, List
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def create_recipe_prompt(ingredients: List[str], preferences: Optional[Dict] = None) -> str:
    base_prompt = """Create a detailed recipe using the available ingredients and following the specified preferences. Format the response as a JSON object with the following structure:
{
    "title": "Recipe Name",
    "ingredients": ["2 cups flour", "1 teaspoon salt", etc.],
    "instructions": ["Preheat the oven to 350°F", "Mix dry ingredients in a bowl", etc.],
    "cooking_time": minutes_as_integer,
    "servings": number_of_servings,
    "calories": approximate_calories_per_serving,
    "cuisine_type": "cuisine style",
    "diet_type": "diet category",
    "difficulty": "easy/medium/hard",
    "prep_time": minutes_for_preparation,
    "total_time": total_minutes_needed
}

Important requirements:
1. Do not include numbers in instructions
2. Each instruction should be a clear, concise step
3. Keep instructions action-oriented and direct
4. Use precise measurements in ingredients
5. Follow the exact preferences specified for servings, cooking time, etc."""

    if ingredients:
        base_prompt += f"\n\nAvailable ingredients: {', '.join(ingredients)}"
    
    if preferences:
        pref_str = "\n\nRequired preferences:"
        if preferences.get('servings'):
            pref_str += f"\n- Must make exactly {preferences['servings']} servings"
        if preferences.get('cookingTime'):
            pref_str += f"\n- Total cooking time should be around {preferences['cookingTime']} minutes"
        if preferences.get('calories'):
            pref_str += f"\n- Target {preferences['calories']} calories per serving"
        if preferences.get('cuisineType') and preferences['cuisineType'] != 'any':
            pref_str += f"\n- Follow {preferences['cuisineType']} cuisine style"
        if preferences.get('dietType') and preferences['dietType'] != 'any':
            pref_str += f"\n- Must be suitable for {preferences['dietType']} diet"
        if preferences.get('difficulty'):
            pref_str += f"\n- Recipe difficulty should be {preferences['difficulty']}"
        base_prompt += pref_str
    
    return base_prompt

async def generate_recipe(ingredients: List[str], preferences: Optional[Dict] = None) -> Optional[Dict]:
    """Generate a recipe using OpenAI's GPT-3.5."""
    try:
        prompt = create_recipe_prompt(ingredients, preferences)
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "system",
                    "content": """You are a professional chef creating detailed, accurate recipes. 
                    Important formatting rules:
                    - DO NOT include any numbers, bullets, or prefixes in instruction steps
                    - Each instruction should start directly with an action verb
                    - Example correct format: "Mix the flour and water" (not "1. Mix" or "First, mix")
                    - Keep instructions clear and concise
                    - Use precise measurements in ingredients
                    - STRICTLY follow the specified number of servings and other preferences"""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )

        if response.choices and response.choices[0].message.content:
            recipe_data = json.loads(response.choices[0].message.content)
            
            # Clean up instructions to remove any numbering or bullets
            recipe_data["instructions"] = [
                # Remove any numbers, bullets, or prefixes like "Step 1:", "First,"
                step.lstrip("0123456789-.).• ").replace("Step ", "").replace("step ", "")
                    .replace("First, ", "").replace("Then, ", "").replace("Finally, ", "")
                    .replace("Next, ", "").capitalize()
                for step in recipe_data["instructions"]
                if step.strip()
            ]
            
            # Clean up ingredients to ensure consistent formatting
            recipe_data["ingredients"] = [
                ingredient.strip().lower().capitalize()
                for ingredient in recipe_data["ingredients"]
                if ingredient.strip()
            ]
            
            # Ensure all required fields are present and preferences are followed
            required_fields = ["title", "ingredients", "instructions", "cooking_time", "servings"]
            if not all(field in recipe_data for field in required_fields):
                raise ValueError("Missing required fields in recipe data")
            
            # Enforce preferences if specified
            if preferences:
                if preferences.get('servings'):
                    recipe_data["servings"] = int(preferences["servings"])
                if preferences.get('cookingTime'):
                    recipe_data["cooking_time"] = int(preferences["cookingTime"])
                if preferences.get('calories'):
                    recipe_data["calories"] = int(preferences["calories"])
                if preferences.get('cuisineType') and preferences['cuisineType'] != 'any':
                    recipe_data["cuisine_type"] = preferences["cuisineType"]
                if preferences.get('dietType') and preferences['dietType'] != 'any':
                    recipe_data["diet_type"] = preferences["dietType"]
                if preferences.get('difficulty'):
                    recipe_data["difficulty"] = preferences["difficulty"]
            
            return recipe_data
        
        return None

    except Exception as e:
        print(f"Error generating recipe: {str(e)}")
        return None 