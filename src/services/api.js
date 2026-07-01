const BASE_URL = "https://api.spoonacular.com";
const LOCAL_API_URL = "http://localhost:4000";

const getSpoonacularApiKey = () => {
  const key = import.meta.env.VITE_SPOONACULAR_API_KEY;
  if (!key) {
    throw new Error(
      "Missing Spoonacular API key. Add VITE_SPOONACULAR_API_KEY to your .env file."
    );
  }
  return key;
};

const handleApiError = (error) => {
  console.error("API Error:", error);

  const message = error?.message?.toString() || "Failed to fetch data from API";

  if (message.includes("401")) {
    throw new Error("Invalid Spoonacular API key. Please check your VITE_SPOONACULAR_API_KEY.");
  }

  if (message.includes("402") || message.toLowerCase().includes("payment required")) {
    throw new Error(
      "Spoonacular API request blocked: payment required or plan limit exceeded. Please check your Spoonacular account or use local recipes."
    );
  }

  if (message.toLowerCase().includes("failed to fetch")) {
    throw new Error(
      "Unable to reach the API. Check your internet connection and make sure the local backend is running."
    );
  }

  throw new Error("Failed to fetch data from API");
};

export const getRecipes = async (query = "", cuisine = "", number = 12) => {
  try {
    const apiKey = getSpoonacularApiKey();
    const params = new URLSearchParams({
      apiKey,
      number: number.toString(),
      addRecipeInformation: "true",
      fillIngredients: "false",
    });

    if (query) params.append("query", query);
    if (cuisine && cuisine !== "all") params.append("cuisine", cuisine);

    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "failure") {
      throw new Error(data.message || "API request failed");
    }

    return (
      data.results?.map((recipe) => ({
        id: recipe.id,
        title: recipe.title || "Untitled Recipe",
        imageUrl: recipe.image || "/placeholder.svg?height=300&width=400",
        cuisine: recipe.cuisines?.[0] || "International",
        description: recipe.summary
          ? recipe.summary.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
          : "A delicious recipe to try",
        prepTime: recipe.readyInMinutes || 30,
        ingredients: recipe.extendedIngredients?.map((ing) => ing.original) || [],
        instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) || [],
        isUserRecipe: false,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const getRecipeById = async (id) => {
  try {
    // First attempt local recipe lookup. If the local backend is unavailable,
    // fall back to Spoonacular instead of failing immediately.
    try {
      const localResponse = await fetch(`${LOCAL_API_URL}/recipes/${id}`);
      if (localResponse.ok) {
        const recipe = await localResponse.json();
        return {
          id: recipe.id,
          title: recipe.title || "Untitled Recipe",
          imageUrl: recipe.imageUrl || "/placeholder.svg?height=300&width=400",
          cuisine: recipe.cuisine || "International",
          description: recipe.description || "A delicious recipe",
          prepTime: recipe.prepTime || 30,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          isUserRecipe: true,
        };
      }
    } catch (localError) {
      console.warn("Local backend unavailable, falling back to Spoonacular:", localError);
    }

    const apiKey = getSpoonacularApiKey();
    const response = await fetch(
      `${BASE_URL}/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=false`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const recipe = await response.json();

    if (recipe.status === "failure") {
      throw new Error(recipe.message || "Recipe not found");
    }

    return {
      id: recipe.id,
      title: recipe.title || "Untitled Recipe",
      imageUrl: recipe.image || "/placeholder.svg?height=300&width=400",
      cuisine: recipe.cuisines?.[0] || "International",
      description: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, "") : "Delicious recipe",
      prepTime: recipe.readyInMinutes || 30,
      ingredients: recipe.extendedIngredients?.map((ing) => ing.original) || [],
      instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) || [],
      isUserRecipe: false,
    };
  } catch (error) {
    handleApiError(error);
  }
};

export const getCuisines = () => {
  return [
    "African",
    "American",
    "British",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Eastern European",
    "European",
    "French",
    "German",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Japanese",
    "Jewish",
    "Korean",
    "Latin American",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "Southern",
    "Spanish",
    "Thai",
    "Vietnamese",
  ];
};

export const saveRecipe = async (recipe) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...recipe,
        prepTime: Number.parseInt(recipe.prepTime),
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : recipe.ingredients.split("\n").filter((item) => item.trim()),
        instructions: Array.isArray(recipe.instructions)
          ? recipe.instructions
          : recipe.instructions.split("\n").filter((item) => item.trim()),
        isUserRecipe: true,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to save recipe");
    }
    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserRecipes = async () => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/recipes`);
    if (!response.ok) {
      throw new Error("Failed to fetch user recipes");
    }
    const recipes = await response.json();
    return recipes.map((recipe) => ({
      ...recipe,
      isUserRecipe: true,
    }));
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return [];
  }
};

export const searchByIngredients = async (ingredients) => {
  try {
    const apiKey = getSpoonacularApiKey();
    const response = await fetch(
      `${BASE_URL}/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${encodeURIComponent(ingredients)}&number=12`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.image,
      cuisine: "International",
      description: `Recipe using ${recipe.usedIngredientCount} of your ingredients`,
      prepTime: 30,
      ingredients: [],
      instructions: [],
      isUserRecipe: false,
    }));
  } catch (error) {
    handleApiError(error);
  }
};