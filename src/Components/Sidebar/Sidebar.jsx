import React from "react"
import { useAuth } from "../../context/AuthContext"
import { NavLink } from "react-router-dom"
import { Home, BookOpen, Heart, PlusSquare, LogOut } from "lucide-react"
import "./Sidebar.css"

const Sidebar = () => {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <span>Tasty</span>Board
        </div>
        <p className="sidebar-welcome">Welcome back, <strong>{user.username}</strong></p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Home size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/browse-recipes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <BookOpen size={18} />
          Browse Recipes
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Heart size={18} />
          Favorites
        </NavLink>
        <NavLink to="/add-recipe" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <PlusSquare size={18} />
          Add Recipe
        </NavLink>
      </nav>

      <button onClick={logout} className="logout-btn">
        <LogOut size={18} />
        Sign Out
      </button>
    </aside>
  )
}

export default Sidebar