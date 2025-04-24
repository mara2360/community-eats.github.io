import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import AboutUs from './AboutUs';
import './index.css';
import FilterMenu from './FilterMenu';
import LoginPage from './LoginPage';
import CreateRecipe from './CreateRecipe';
import { useAuth } from './AuthContext'; 
import './fonts.css';
import styles from './styles.css';
import Profile from './Profile';
import RecipeDetails from './RecipeDetails';
import RecipeLibrary from './RecipeLibrary'; // Import the RecipeLibrary component
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const carouselImages = [
  '/images/cara_img1.jpg',
  '/images/cara_img2.jpg',
  '/images/cara_img3.jpg',
  '/images/cara_img4.jpg'
];

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  pauseOnHover: true
};

const CommunityEats = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="community-eats">
        <Routes>
          {/* Login route - always accessible */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes - only accessible after login */}
          <Route path="/home" element={
            currentUser ? (
              <>
                <header className="header">
                  <div className="header-content">
                    <h1>COMMUNITY EATS</h1>
                    <nav className="navigation">
                      <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/create-recipe">Create Recipe</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/recipe-library">Recipe Library</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                      </ul>
                    </nav>
                    {currentUser && (
                      <div className="user-info">
                        <span className="user-name">
                          {currentUser.displayName || currentUser.email.split('@')[0]}
                        </span>
                        <img 
                          src={currentUser.photoURL || '/default-user.png'} 
                          alt="User profile" 
                          className="user-avatar"
                        />
                      </div>
                    )}
                  </div>
                </header>

                {/* Carousel Section */}
                <section className="carousel-section">
                  <Slider {...carouselSettings}>
                    {carouselImages.map((image, index) => (
                      <div key={index}>
                        <div className="carousel-slide">
                          <img 
                            src={image} 
                            alt={`Featured ${index + 1}`}
                            className="carousel-image"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </section>
                
                {/* Main Content Section */}
                <main className="main-content">
                  <section className="welcome-section">
                    <p>
                    Welcome to Community Eats - a space where food lovers come together to share, 
                    recreate, and reinvent their favorite recipes! As a member, you can upload your 
                    own culinary creations, discover new dishes, and get inspired by others in our 
                    vibrant food community. Whether you're an experienced cook or a beginner, everyone's 
                    welcome to join in the fun and explore a world of flavors. Let's cook, share, and eat!
                    </p>
                  </section>
                </main>
                    
                {/* Footer and Subscribe Section */}
                <footer className="footer">
                  <div className="footer-content">
                    <div className="footer-left">
                      <section className="subscribe-section">
                        <h2>KEEP EATING!</h2>
                        <div className="subscribe-container">
                          <button className="subscribe-button">
                            SUBSCRIBE
                          </button>
                          <input 
                            type="email" 
                            placeholder="Email address" 
                            className="email-input" 
                          />
                        </div>
                      </section>
                      
                      <div className="footer-text">
                        <p>© 2025, Community Eats</p>
                        <p>(810) 246 - 8357</p>
                        <p>1234 Michigan Avenue, Dearborn, MI 48124</p>
                      </div>
                    </div>
                  </div>
                </footer>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Recipe-related routes */}
          <Route 
            path="/create-recipe" 
            element={currentUser ? <CreateRecipe /> : <Navigate to="/login" replace />} 
          />
          
          <Route 
            path="/about-us" 
            element={currentUser ? <AboutUs /> : <Navigate to="/login" replace />} 
          />
          
          {/* Updated Recipe Library route */}
          <Route 
            path="/recipe-library" 
            element={currentUser ? <RecipeLibrary /> : <Navigate to="/login" replace />} 
          />
          
          {/* Recipe Details route */}
          <Route 
            path="/recipe/:id" 
            element={currentUser ? <RecipeDetails /> : <Navigate to="/login" replace />} 
          />
          
          {/* Profile route */}
          <Route 
            path="/profile" 
            element={currentUser ? <Profile /> : <Navigate to="/login" replace />} 
          />
          
          {/* Redirect root path to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Redirect any other path to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default CommunityEats;