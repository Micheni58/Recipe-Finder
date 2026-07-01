import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { RecipeProvider } from "./context/RecipeContext";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Dashboard from "./Pages/Dashboard/Dashboard";
import BrowseRecipes from "./Pages/BrowseRecipes/BrowseRecipes";
import Favorites from "./Pages/Favorites/Favorites";
import AddRecipe from "./Pages/AddRecipe/AddRecipe";
import RecipeDetail from "./Components/RecipeDetail/RecipeDetail";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <RecipeProvider>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/browse-recipes" element={<BrowseRecipes />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
              </Routes>
              <Footer />
            </div>
          </RecipeProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;