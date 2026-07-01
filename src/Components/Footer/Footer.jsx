import React from "react"
import { useAuth } from "../../context/AuthContext"
import "./Footer.css"

const Footer = () => {
  const { user } = useAuth()
  if (user) return null

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} TastyBoard. All rights reserved.</p>
        <div className="footer-links">
          <a href="/about" className="footer-link">About</a>
          <a href="/contact" className="footer-link">Contact</a>
          <a href="/privacy" className="footer-link">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer