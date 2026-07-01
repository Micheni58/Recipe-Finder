import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Clock3, Layers, Compass } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToasts } from "../../context/ToastContext";
import { useRecipes } from "../../context/RecipeContext";
import Sidebar from "../../Components/Sidebar/Sidebar";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import SearchBar from "../../Components/UI/SearchBar/SearchBar";
import Card from "../../Components/UI/Card/Card";
import Button from "../../Components/UI/Button/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToasts();
  const {
    recipes,
    filteredRecipes,
    loading,
    error,
    cuisines,
    searchQuery,
    setSearchQuery,
    selectedCuisine,
    setSelectedCuisine,
  } = useRecipes();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / recipesPerPage));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      addToast(error, "error");
    }
  }, [error, addToast]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const topRecipes = useMemo(() => filteredRecipes.slice(0, 3), [filteredRecipes]);
  const savedRecipes = useMemo(
    () => recipes.filter((recipe) => String(recipe.id).startsWith("user_")).length,
    [recipes]
  );
  const paginatedRecipes = useMemo(
    () =>
      filteredRecipes.slice(
        (currentPage - 1) * recipesPerPage,
        currentPage * recipesPerPage
      ),
    [filteredRecipes, currentPage]
  );

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-shell">
          <section className="dashboard-hero">
            <div>
              <p className="eyebrow">Chef Control Center</p>
              <h1>Welcome back, {user?.username || "Chef"}.</h1>
              <p className="hero-copy">
                Stay inspired with fresh recipes, custom filters, and smart kitchen insights for your next tasty creation.
              </p>
            </div>
            <div className="hero-action">
              <Button className="btn-hero" onClick={() => navigate("/add-recipe")}>Create Recipe</Button>
              <Button variant="ghost" onClick={() => navigate("/browse-recipes")}>Browse all recipes</Button>
            </div>
          </section>

          <div className="stats-grid">
            <motion.div className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="stat-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <h3>{recipes.length}</h3>
                <p>Total recipes in library</p>
              </div>
            </motion.div>
            <motion.div className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="stat-icon stat-icon-secondary">
                <Layers size={20} />
              </div>
              <div>
                <h3>{cuisines.length}</h3>
                <p>Distinct cuisine categories</p>
              </div>
            </motion.div>
            <motion.div className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="stat-icon stat-icon-accent">
                <Clock3 size={20} />
              </div>
              <div>
                <h3>{savedRecipes}</h3>
                <p>Recipes authored by you</p>
              </div>
            </motion.div>
          </div>

          <Card className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Recipe discovery</h2>
                <p className="text-muted">Filter recipes by name or cuisine to focus on the perfect dish.</p>
              </div>
              <Button variant="ghost" onClick={() => navigate("/favorites")}>View Favorites</Button>
            </div>

            <div className="dashboard-filters">
              <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by recipe title" />
              <div className="cuisine-pill-group">
                <button
                  type="button"
                  className={`pill ${selectedCuisine === "" ? "active" : ""}`}
                  onClick={() => setSelectedCuisine("")}
                >
                  All cuisines
                </button>
                {cuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    className={`pill ${selectedCuisine === cuisine ? "active" : ""}`}
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <section className="top-recipes-section">
            <div className="section-heading">
              <h2>Top recommendations</h2>
              <p className="text-muted">Hand-picked recipes from your current search and trending tastes.</p>
            </div>
            <div className="top-recipes-grid">
              {topRecipes.length > 0 ? (
                topRecipes.map((recipe) => (
                  <Card key={recipe.id} className="top-recipe-card">
                    <div className="top-card-header">
                      <span>{recipe.cuisine || "Global"}</span>
                      <div className="top-card-meta">
                        <Compass size={16} />
                        <span>{recipe.prepTime || 25} min</span>
                      </div>
                    </div>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description?.slice(0, 120) || "A delicious recipe to try today."}</p>
                  </Card>
                ))
              ) : (
                <p>No featured recipes at the moment.</p>
              )}
            </div>
          </section>

          <section className="recipe-gallery">
            <div className="section-heading">
              <h2>Recipe library</h2>
              <p className="text-muted">Browse every available recipe across your collection.</p>
            </div>
            <div className="recipe-list">
              {loading ? (
                <p className="status-copy">Loading recipes...</p>
              ) : error ? (
                <p className="status-copy">{error}</p>
              ) : filteredRecipes.length > 0 ? (
                paginatedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))
              ) : (
                <p className="status-copy">No recipes found. Try a broader search or switch cuisine filters.</p>
              )}
            </div>
          </section>

          <div className="dashboard-pagination">
            <Button variant="ghost" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </Button>
            <span className="page-indicator">Page {currentPage} of {totalPages}</span>
            <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
