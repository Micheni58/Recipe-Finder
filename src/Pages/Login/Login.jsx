import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToasts } from '../../context/ToastContext'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input } from '../../Components/UI'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import './Login.css'

const Login = () => {
  const { user, login } = useAuth()
  const { addToast } = useToasts()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
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
    const { username, password } = formData
    if (login(username, password)) {
      addToast('Login successful!', 'success')
      navigate('/dashboard')
    } else {
      addToast('Invalid username or password', 'error')
    }
  }

  return (
    <div className="auth-split">
      <div className="auth-left auth-left-login">
        <div className="auth-left-content">
          <div className="eyebrow">Welcome back</div>
          <h1>Ready to get cooking?</h1>
          <p className="text-muted">
            Log in to access your saved recipes, meal plans, and chef picks in one place.
          </p>
          <div className="auth-highlights">
            <span>• Fast personalized recommendations</span>
            <span>• Favorites and collections</span>
            <span>• Easy meal planning</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card glass">
          <h2>Log in to TastyBoard</h2>
          <p className="text-muted small">Enter your credentials to continue.</p>
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
                placeholder="Enter your password"
                required
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="auth-meta-row">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className="link-button">Forgot password?</button>
            </div>

            <Button type="submit" className="submit-action">Login</Button>
            <div className="divider">Or login with</div>
            <div className="social-row">
              <Button variant="ghost">Google</Button>
              <Button variant="ghost">GitHub</Button>
            </div>
            <p className="small text-muted">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
