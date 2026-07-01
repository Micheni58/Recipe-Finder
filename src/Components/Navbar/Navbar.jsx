import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Navbar.css"

const Navbar = () => {
  const { user } = useAuth()
  if (user) return null

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">TastyBoard</Link>
        </div>
        <div className="navbar-links">
          {!user && <Link to="/" className="navbar-link">Home</Link>}
          {!user ? (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/browse-recipes" className="navbar-link">Browse Recipes</Link>
              <Link to="/favorites" className="navbar-link">Favorites</Link>
              <Link to="/add-recipe" className="navbar-link">Add Recipe</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar