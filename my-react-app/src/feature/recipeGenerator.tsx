import { useState } from 'react';

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
    // TODO: Implement API call to backend
    console.log('Generating recipe with preferences:', {
      calories,
      dietPreference,
      cookingTime,
      cuisineType,
      skillLevel,
      servings,
      dietaryRestrictions,
      mealType,
      generationType,
      ingredients: ingredients || selectedImage
    });
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
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 px-8 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg text-lg"
            >
              Generate Recipe
            </button>

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
    </div>
  );
}; 