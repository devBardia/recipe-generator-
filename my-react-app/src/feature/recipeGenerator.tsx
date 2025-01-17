import { useState } from 'react';
import { config } from '../config/config';

// Add API response type
interface RecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  cooking_time: number;
  servings: number;
  calories?: number;
  cuisine_type?: string;
  diet_type?: string;
}

interface RecipeGeneratorProps {
  userId?: string;
}

export const RecipeGenerator = ({ userId }: RecipeGeneratorProps) => {
  const [calories, setCalories] = useState('');
  const [dietPreference, setDietPreference] = useState<'healthy' | 'no-preference'>('no-preference');
  const [cookingTime, setCookingTime] = useState<'quick' | 'medium' | 'any'>('any');
  const [cuisineType, setCuisineType] = useState('any');
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [servings, setServings] = useState('2');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');
  const [generationType, setGenerationType] = useState<'ingredients' | 'random'>('random');
  const [showIngredientInput, setShowIngredientInput] = useState(false);
  const [inputMethod, setInputMethod] = useState<'image' | 'text'>('text');
  const [ingredients, setIngredients] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showPastRecipes, setShowPastRecipes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cuisineOptions = [
    'any',
    'italian',
    'mexican',
    'chinese',
    'japanese',
    'indian',
    'french',
    'mediterranean',
    'american',
    'thai'
  ];

  const dietaryRestrictionOptions = [
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'low-carb',
    'keto',
    'paleo'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleDietaryRestrictionChange = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleGenerateRecipe = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Starting recipe generation...');

      let endpoint = '';
      let formData: FormData | Record<string, any>;

      if (generationType === 'random') {
        endpoint = `${config.apiBaseUrl}/api/recipes/random`;
        formData = {
          preferences: {
            calories: calories ? parseInt(calories) : undefined,
            diet_preference: dietPreference,
            cooking_time: cookingTime,
            cuisine_type: cuisineType,
            skill_level: skillLevel,
            servings: parseInt(servings),
            dietary_restrictions: dietaryRestrictions,
            meal_type: mealType
          }
        };
      } else if (inputMethod === 'image' && selectedImage) {
        endpoint = `${config.apiBaseUrl}/api/recipes/from-image`;
        const imageFormData = new FormData();
        formData = imageFormData;
        imageFormData.append('image', selectedImage);
        imageFormData.append('preferences', JSON.stringify({
          calories: calories ? parseInt(calories) : undefined,
          diet_preference: dietPreference,
          cooking_time: cookingTime,
          cuisine_type: cuisineType,
          skill_level: skillLevel,
          servings: parseInt(servings),
          dietary_restrictions: dietaryRestrictions,
          meal_type: mealType
        }));
      } else {
        endpoint = `${config.apiBaseUrl}/api/recipes/from-text`;
        formData = {
          ingredients: ingredients.split(',').map(i => i.trim()),
          preferences: {
            calories: calories ? parseInt(calories) : undefined,
            diet_preference: dietPreference,
            cooking_time: cookingTime,
            cuisine_type: cuisineType,
            skill_level: skillLevel,
            servings: parseInt(servings),
            dietary_restrictions: dietaryRestrictions,
            meal_type: mealType
          }
        };
      }

      console.log('Making API call to:', endpoint);
      console.log('With data:', formData);

      // Get the JWT token from localStorage
      const token = localStorage.getItem(config.jwtStorageKey);
      if (!token) {
        throw new Error('Please log in to generate recipes');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...(inputMethod === 'image' ? {} : { 'Content-Type': 'application/json' }),
          'Authorization': `Bearer ${token}`
        },
        body: formData instanceof FormData ? formData : JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate recipe');
      }

      const recipeData = await response.json();
      console.log('Recipe generated successfully:', recipeData);
      setRecipe(recipeData);

    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recipe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Top Banner Ad Placeholder */}
      <div className="w-full h-24 bg-gradient-to-r from-purple-100 to-indigo-100 mb-8 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-sm">
        <span className="text-gray-500 font-medium">Advertisement Space</span>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center tracking-tight">
          Recipe Generator
          <span className="block text-base font-normal text-gray-500 mt-2 tracking-normal">
            Customize your perfect recipe
          </span>
        </h1>

        <div className="space-y-8">
          {/* Basic Preferences Section */}
          <div className="bg-gradient-to-r from-purple-50/70 to-indigo-50/70 backdrop-blur-sm p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">Basic Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Calories</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                  placeholder="Enter calorie range"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Diet Preference</label>
                <select
                  value={dietPreference}
                  onChange={(e) => setDietPreference(e.target.value as 'healthy' | 'no-preference')}
                  className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                >
                  <option value="no-preference">No Preference</option>
                  <option value="healthy">Healthy Food</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Preferences Section */}
          <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 backdrop-blur-sm p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">Cooking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cooking Time</label>
                <select
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value as 'quick' | 'medium' | 'any')}
                  className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                >
                  <option value="any">Any Time</option>
                  <option value="quick">Quick (less than 30 mins)</option>
                  <option value="medium">Medium (30-60 mins)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                <select
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                >
                  {cuisineOptions.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number of Servings</label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  min="1"
                  max="12"
                  className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
                  className="w-full h-12 px-4 rounded-xl bg-white/50 focus:bg-white transition-all duration-200"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dietary Restrictions Section */}
          <div className="bg-gradient-to-r from-purple-50/70 to-indigo-50/70 backdrop-blur-sm p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">Dietary Restrictions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dietaryRestrictionOptions.map(restriction => (
                <label key={restriction} className="flex items-center p-4 bg-white/50 hover:bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-all duration-200 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dietaryRestrictions.includes(restriction)}
                    onChange={() => handleDietaryRestrictionChange(restriction)}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all duration-200"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    {restriction.charAt(0).toUpperCase() + restriction.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Generation Type Toggle */}
          <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 backdrop-blur-sm p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">Recipe Generation Method</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setGenerationType('ingredients');
                  setShowIngredientInput(true);
                }}
                className={`flex-1 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                  generationType === 'ingredients'
                    ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700'
                    : 'bg-white/50 hover:bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                Generate Based on My Ingredients
              </button>
              <button
                onClick={() => {
                  setGenerationType('random');
                  setShowIngredientInput(false);
                }}
                className={`flex-1 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                  generationType === 'random'
                    ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700'
                    : 'bg-white/50 hover:bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                }`}
              >
                Generate Random Recipe
              </button>
            </div>
          </div>

          {/* Ingredient Input Section */}
          {showIngredientInput && (
            <div className="bg-gradient-to-r from-purple-50/70 to-indigo-50/70 backdrop-blur-sm p-8 rounded-2xl space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">Input Ingredients</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setInputMethod('image')}
                  className={`flex-1 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                    inputMethod === 'image'
                      ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700'
                      : 'bg-white/50 hover:bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                  }`}
                >
                  Take a Picture
                </button>
                <button
                  onClick={() => setInputMethod('text')}
                  className={`flex-1 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                    inputMethod === 'text'
                      ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700'
                      : 'bg-white/50 hover:bg-white text-gray-700 border border-gray-200 hover:border-purple-300'
                  }`}
                >
                  Type Ingredients
                </button>
              </div>

              {inputMethod === 'image' ? (
                <div className="mt-6 bg-white/50 hover:bg-white p-8 rounded-xl border border-gray-200 transition-all duration-200">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-medium
                      file:bg-purple-50 file:text-purple-700
                      hover:file:bg-purple-100
                      transition-all duration-200"
                  />
                </div>
              ) : (
                <div className="mt-6 bg-white/50 hover:bg-white p-8 rounded-xl border border-gray-200 transition-all duration-200">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Enter Your Ingredients
                  </label>
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full rounded-xl bg-white/50 focus:bg-white transition-all duration-200 p-4"
                    rows={4}
                    placeholder="Enter ingredients separated by commas"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGenerateRecipe}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 px-8 rounded-xl font-medium transition-all duration-200 ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg'
              } text-lg`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Recipe...
                </span>
              ) : (
                'Generate Recipe'
              )}
            </button>

            {/* Display generated recipe */}
            {recipe && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100 mt-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{recipe.title}</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cooking Time:</span>
                      <p>{recipe.cooking_time} minutes</p>
                    </div>
                    <div>
                      <span className="font-medium">Servings:</span>
                      <p>{recipe.servings}</p>
                    </div>
                    {recipe.calories && (
                      <div>
                        <span className="font-medium">Calories:</span>
                        <p>{recipe.calories} per serving</p>
                      </div>
                    )}
                    {recipe.cuisine_type && (
                      <div>
                        <span className="font-medium">Cuisine:</span>
                        <p>{recipe.cuisine_type}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPastRecipes(!showPastRecipes)}
              className="w-full bg-white/50 hover:bg-white text-gray-700 py-5 px-8 rounded-xl font-medium border border-gray-200 hover:border-purple-300 transition-all duration-200 text-lg"
            >
              Past Recipes
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Ad Placeholder */}
      <div className="w-full h-24 bg-gradient-to-r from-purple-100 to-indigo-100 mt-8 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-sm">
        <span className="text-gray-500 font-medium">Advertisement Space</span>
      </div>

      {/* Add error message display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}
    </div>
  );
}; 