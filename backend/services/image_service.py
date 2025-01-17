import os
from typing import List
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def process_ingredient_image(base64_image: str) -> List[str]:
    """Process an image to identify ingredients using GPT-4 Vision."""
    try:
        response = await client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional chef who specializes in identifying ingredients from images. Focus on main ingredients that would be used in cooking."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "List the main ingredients you can see in this image. Please:\n1. Only list actual ingredients (no packaging, containers, or utensils)\n2. Include approximate quantities if visible\n3. List each ingredient in its basic form\n4. Separate ingredients with commas\n5. Don't include numbering or bullet points"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )

        if not response.choices or not response.choices[0].message.content:
            return []

        # Parse the comma-separated list into individual ingredients
        ingredients_text = response.choices[0].message.content
        ingredients = [
            ingredient.strip()
            for ingredient in ingredients_text.split(',')
            if ingredient.strip() and not ingredient.strip().isdigit()
        ]

        return ingredients

    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return [] 