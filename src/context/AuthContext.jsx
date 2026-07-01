import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Load user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username, password) => {
    try {
      let users = JSON.parse(localStorage.getItem("users") || "[]")
      
      // Ensure users is an array
      if (!Array.isArray(users)) {
        console.warn("Users data is not an array, resetting to empty array")
        users = []
      }

      const matchedUser = users.find(
        (u) => u.username === username && u.password === password
      )

      if (matchedUser) {
        const userData = { username }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = (username, password) => {
    try {
      let users = JSON.parse(localStorage.getItem("users") || "[]")
      
      // Ensure users is an array
      if (!Array.isArray(users)) {
        console.warn("Users data is not an array, resetting to empty array")
        users = []
      }

      const existingUser = users.find((u) => u.username === username)

      if (existingUser) {
        return false // User already exists
      }

      const newUser = { username, password }
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
