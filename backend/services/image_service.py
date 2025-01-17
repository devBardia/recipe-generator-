from fastapi import UploadFile
from openai import OpenAI
import base64
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

async def process_ingredient_image(image: UploadFile) -> List[str]:
    try:
        # Read and encode the image
        contents = await image.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        # Reset file pointer for potential future reads
        await image.seek(0)

        messages = [
            {
                "role": "system",
                "content": "You are a professional chef who can identify ingredients in images. List only the main ingredients you can see, separated by commas."
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What ingredients can you identify in this image? Please list them in a comma-separated format."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=300
        )

        # Extract ingredients from the response
        ingredients_text = response.choices[0].message.content
        ingredients = [ingredient.strip() for ingredient in ingredients_text.split(',')]
        
        return ingredients

    except Exception as e:
        print(f"Error processing image: {str(e)}")
        raise e 