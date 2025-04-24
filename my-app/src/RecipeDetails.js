import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { adminRecipes } from './AdminRecipes';
import { useAuth } from './AuthContext'; 
import './recipelibrarymenu.css'; 
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from './firebaseConfig';
import AboutUs from './AboutUs';
import FilterMenu from './FilterMenu';
import LoginPage from './LoginPage';
import CreateRecipe from './CreateRecipe'; 
import './fonts.css';
import Profile from './Profile'; 


const RecipeDetails = () => {
  const { currentUser } = useAuth();
  const { id } = useParams(); // e.g. /recipe/admin-burger-1
  const [recipe, setRecipe] = useState(null);
  const [isAdminRecipe, setIsAdminRecipe] = useState(false);
  const [loading, setLoading] = useState(true);
  const database = getDatabase(app);
  const recipeRef = ref(database, `recipes/${id}`);
    get(recipeRef).then((snapshot) => {
    if (snapshot.exists()) {
    setRecipe({ id: snapshot.key, ...snapshot.val() });
  }
});

  useEffect(() => {
    // Check if this ID is in the adminRecipes
    const foundAdmin = adminRecipes.find((item) => item.id === id);
    if (foundAdmin) {
      setRecipe(foundAdmin);
      setIsAdminRecipe(true);
      setLoading(false);
    } else {
      // Otherwise, fetch from Firestore by doc ID
      const fetchRecipe = async () => {
        try {
          const docRef = doc(db, 'recipes', id);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setRecipe({ id: snapshot.id, ...snapshot.data() });
          } else {
            console.warn('No recipe found in Firestore with ID:', id);
          }
        } catch (error) {
          console.error('Error fetching recipe details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return <div>Loading recipe...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  // Decide how to label the "author"
  const authorName = isAdminRecipe ? 'Community Eats Team' : 'User Submitted';

  return (
    <div className="page-container">
      {/* Top Bar (same style as FilterMenu) */}
      <div className="top-bar">
        <button className="veg-option-btn">VEGETARIAN LIBRARY OPTION</button>
      </div>

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

      {/* Main content container */}
      <div className="main-content" style={{ display: 'block' }}>
        {/* A section for the recipe details */}
        <section 
          className="recipe-details-section" 
          style={{ maxWidth: '700px', margin: '0' }}
        >
          <h2 style={{ fontFamily: 'Italiana, serif', fontSize: '32px' }}>
            {recipe.name}
          </h2>
          <p style={{ fontFamily: 'Instrument Sans, sansSerif', fontStyle: 'italic', marginBottom: '10px' }}>
            By: {authorName}
          </p>

          {/* Image if present */}
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              style={{
                width: '100%',
                maxWidth: '400px',
                borderRadius: '6px',
                marginBottom: '20px',
                border: '2px solid black',
              }}
            />
          )}

          {/* Basic recipe info */}
          <p style={{fontFamily: 'Instrument Sans, sansSerif', fontSize:'20px'}}><strong>Cuisine:</strong> {recipe.cuisineType || 'N/A'}</p>
          <p style={{fontFamily: 'Instrument Sans, sansSerif', fontSize:'20px'}}><strong>Food Type:</strong> {recipe.foodType || 'N/A'}</p>
          <p style={{fontFamily: 'Instrument Sans, sansSerif', fontSize:'20px'}}><strong>Diet:</strong> {recipe.diet || 'N/A'}</p>

          {/* Ingredients */}
          <h3 style={{fontFamily: 'Instrument Sans, sansSerif', fontSize:'30px', marginTop: '30px', borderBottom: '2px solid black'}}>Ingredients</h3>
          <ul style={{fontSize:'18px', fontWeight: '700'}}>
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>

          {/* Steps */}
          <h3 style={{fontFamily: 'Instrument Sans, sansSerif', fontSize:'30px', marginTop: '30px', borderBottom: '2px solid black' }}>Instructions</h3>
          <ol style={{fontSize:'18px', fontWeight: '700'}}>
            {recipe.steps?.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>

          {/* A short "About" note */}
          <h3 style={{fontFamily: 'Instrument Sans, sansSerif', fontSize:'30px', marginTop: '30px', borderBottom: '2px solid black' }}>About This Recipe</h3>
          {isAdminRecipe ? (
            <p style={{fontSize:'18px', fontWeight: '700'}}>This is an official Community Eats Team recipe — enjoy!</p>
          ) : (
            <p>Thanks to our community for sharing this delicious dish!</p>
          )}
        </section>
      </div>

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
    </div>
  );
};

export default RecipeDetails;
