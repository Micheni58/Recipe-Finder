import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToasts } from '../../context/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input } from '../../Components/UI'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import './Signup.css'

const Signup = () => {
  const { user, signup } = useAuth()
  const { addToast } = useToasts()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { username, password, confirmPassword } = formData
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error')
      return
    }
    if (signup(username, password)) {
      addToast('Signup successful! Please log in.', 'success')
      navigate('/login')
    } else {
      addToast('Username already exists', 'error')
    }
  }

  return (
    <div className="auth-split">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="eyebrow">Welcome to TastyBoard</div>
          <h1>Find your next delicious meal and make every night special.</h1>
          <p className="text-muted">
            Discover premium recipes, track favorites, and build meal plans in one beautiful place.
          </p>
          <div className="auth-highlights">
            <span>• Curated recipe collections</span>
            <span>• Smart meal planning</span>
            <span>• Save favorites instantly</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card glass">
          <h2>Create your account</h2>
          <p className="text-muted small">Get started with a secure login and save your favorite recipes.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="label">Username</label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              icon={User}
              placeholder="janedoe"
              required
            />

            <label className="label">Password</label>
            <div className="password-field">
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Create a password"
                required
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label className="label">Confirm password</label>
            <Input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              icon={Lock}
              placeholder="Confirm password"
              required
            />

            <Button type="submit" className="submit-action">Create Account</Button>
            <div className="divider">Or continue with</div>
            <div className="social-row">
              <Button variant="ghost">Continue with Google</Button>
              <Button variant="ghost">Continue with GitHub</Button>
            </div>
            <p className="small text-muted">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
