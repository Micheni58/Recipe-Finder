import React, { createContext, useContext, useState, useEffect } from "react";
import { useToasts } from "./ToastContext";
import { getRecipes, getCuisines, saveRecipe, getRecipeById, getUserRecipes } from "../services/api";

const RecipeContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [userRecipes, setUserRecipes] = useState([]);
  const { addToast } = useToasts();

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Spoonacular recipes
      const spoonacularRecipes = await getRecipes(searchQuery, selectedCuisine);

      // Combine recipes with cached local user recipes
      const combinedRecipes = [...spoonacularRecipes, ...userRecipes];
      setRecipes(combinedRecipes);

      // Apply filtering
      let filtered = combinedRecipes;
      if (searchQuery) {
        filtered = filtered.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedCuisine && selectedCuisine !== "all") {
        filtered = filtered.filter(
          (recipe) => recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
        );
      }
      setFilteredRecipes(filtered);

      // Set cuisines
      const predefinedCuisines = getCuisines();
      const userCuisines = [...new Set(userRecipes.map((recipe) => recipe.cuisine))];
      const allCuisines = [...new Set([...predefinedCuisines, ...userCuisines])];
      setCuisines(allCuisines);
    } catch (err) {
      setError("Failed to load recipes");
      setFilteredRecipes([]);
      addToast("Failed to load recipes", "error");
    } finally {
      setLoading(false);
    }
  };

  const getRecipeDetails = async (id) => {
    try {
      const recipe = await getRecipeById(id);
      if (!recipe) {
        throw new Error("Recipe not found");
      }
      return recipe;
    } catch (err) {
      throw err;
    }
  };

  const addRecipe = async (recipe) => {
    try {
      const newRecipe = await saveRecipe(recipe);
      if (!newRecipe) {
        throw new Error("Failed to add recipe");
      }
      // Add user_ prefix to the ID to avoid collisions
      const recipeWithPrefixedId = {
        ...newRecipe,
        id: `user_${newRecipe.id}`,
      };
      setRecipes((prev) => [...prev, recipeWithPrefixedId]);

      // Update filteredRecipes if matches filters
      let shouldAddToFiltered = true;
      if (searchQuery && !recipeWithPrefixedId.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        shouldAddToFiltered = false;
      }
      if (selectedCuisine && recipeWithPrefixedId.cuisine.toLowerCase() !== selectedCuisine.toLowerCase()) {
        shouldAddToFiltered = false;
      }
      if (shouldAddToFiltered) {
        setFilteredRecipes((prev) => [...prev, recipeWithPrefixedId]);
      }

      // Update cuisines
      if (!cuisines.includes(recipeWithPrefixedId.cuisine)) {
        setCuisines((prev) => [...prev, recipeWithPrefixedId.cuisine]);
      }

      return recipeWithPrefixedId;
    } catch (err) {
      setError("Failed to save recipe");
      addToast("Failed to add recipe", "error");
      throw err;
    }
  };

  useEffect(() => {
    const loadUserRecipes = async () => {
      try {
        const fetchedUserRecipes = await getUserRecipes();
        setUserRecipes(
          fetchedUserRecipes.map((recipe) => ({
            ...recipe,
            id: `user_${recipe.id}`,
          }))
        );
      } catch {
        setUserRecipes([]);
      }
    };

    loadUserRecipes();
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [searchQuery, selectedCuisine, userRecipes]);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        filteredRecipes,
        loading,
        error,
        cuisines,
        searchQuery,
        setSearchQuery,
        selectedCuisine,
        setSelectedCuisine,
        loadRecipes,
        addRecipe,
        getRecipeDetails,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};