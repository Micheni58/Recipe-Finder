import React from "react"
import { useNavigate } from "react-router-dom"
import { sampleRecipes } from "../../data/data"
import { Button, Card, Pill } from "../../Components/UI"
import { Clock, Heart, User, Star } from "lucide-react"
import "./Home.css"

const HERO_IMG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="tb-landing">
      <header className="tb-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Cook Something Amazing Today</h1>
            <p className="lead text-muted">
              Discover recipes from around the world, save your favorites, and plan your week with
              curated meal ideas.
            </p>
            <div className="hero-ctas">
              <Button onClick={() => navigate('/browse-recipes')} className="cta-primary">
                Start Cooking
              </Button>
              <Button variant="ghost" onClick={() => navigate('/browse-recipes')}>
                Browse Recipes
              </Button>
            </div>
            <div className="hero-search">
              <input className="input" placeholder="Search recipes, cuisines, ingredients..." />
            </div>
          </div>
          <div className="hero-media">
            <div className="hero-image" style={{backgroundImage: `url(${HERO_IMG})`}} />
          </div>
        </div>
      </header>

      <section className="container featured-section">
        <h2>Featured Recipes</h2>
        <p className="text-muted">Hand-picked recipes to spark your next meal.</p>
        <div className="featured-grid">
          {sampleRecipes.slice(0,4).map((r) => (
            <Card key={r.id} className="featured-card">
              <div className="card-media" style={{backgroundImage: `url(${r.imageUrl})`}}>
                <button className="fav-btn"><Heart size={16} /></button>
                <span className="badge">{r.cuisine}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{r.title}</h3>
                <p className="text-muted small">{r.description}</p>
                <div className="card-meta">
                  <span className="meta-item"><Clock size={14} /> {r.prepTime}m</span>
                  <span className="meta-item"><Star size={14} /> 4.8</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container categories-section">
        <h2>Popular Categories</h2>
        <div className="chips">
          {['Italian','Mexican','Indian','Thai','Desserts','Healthy'].map((c) => (
            <Pill key={c}>{c}</Pill>
          ))}
        </div>
      </section>

      <section className="container stats-section">
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon"><User size={24} /></div>
            <div>
              <div className="stat-value">120K+</div>
              <div className="text-muted small">Home cooks</div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-icon">🍽️</div>
            <div>
              <div className="stat-value">24K+</div>
              <div className="text-muted small">Recipes</div>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-icon">🔥</div>
            <div>
              <div className="stat-value">3.2M</div>
              <div className="text-muted small">Monthly views</div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="tb-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <h3>TastyBoard</h3>
            <p className="text-muted small">Cook something amazing every day.</p>
          </div>
          <div className="footer-links text-muted small">
            <div>About</div>
            <div>Careers</div>
            <div>Contact</div>
            <div>Privacy</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home