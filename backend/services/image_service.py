from fastapi import UploadFile
import openai
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

async def process_ingredient_image(image: UploadFile) -> List[str]:
    """
    Process an image to identify ingredients using GPT-4 Vision.
    Returns a list of identified ingredients.
    """
    # Read the image file
    image_content = await image.read()
    
    try:
        # Call GPT-4 Vision API to identify ingredients
        response = await openai.ChatCompletion.acreate(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at identifying food ingredients from images. List all ingredients you can see."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "image": image_content,
                        },
                        {
                            "type": "text",
                            "text": "List all the ingredients you can identify in this image. Return them as a comma-separated list."
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        # Parse the response
        ingredients_text = response.choices[0].message.content
        ingredients = [
            ingredient.strip()
            for ingredient in ingredients_text.split(',')
            if ingredient.strip()
        ]
        
        return ingredients
        
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")
    finally:
        # Reset file pointer
        await image.seek(0) 