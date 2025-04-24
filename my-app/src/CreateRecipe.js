import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './CreateRecipe.css'; 
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ref, push, set } from 'firebase/database';
import AboutUs from './AboutUs';
import FilterMenu from './FilterMenu';
import LoginPage from './LoginPage';
import { useAuth } from './AuthContext'; 
import './fonts.css';
import Profile from './Profile'; 
import RecipeDetails from './RecipeDetails'; 


const CreateRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [cuisineType, setCuisineType] = useState('');
  const [foodType, setFoodType] = useState('');
  const [diet, setDiet] = useState('omnivore');

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You must be logged in to create a recipe!');
      return;
    }
  
    if (!recipeName.trim()) {
      alert('Recipe name is required!');
      return;
    }
  
    try {
      // Create a reference to a new location in your database
      const recipesRef = ref(db, 'recipes');
      const newRecipeRef = push(recipesRef);
      
      // Set the data at the new location
      await set(newRecipeRef, {
        name: recipeName,
        imageUrl: imageUrl || '',
        ingredients: ingredients.filter(ing => ing.trim() !== ''),
        steps: steps.filter(st => st.trim() !== ''),
        cuisineType: cuisineType || 'Unspecified',
        foodType: foodType || 'Unspecified',
        diet: diet,
        createdBy: currentUser.uid,  // Store who created this recipe
        createdAt: new Date().toISOString()  // Add timestamp
      });
  
      // Reset form
      setRecipeName('');
      setImageUrl('');
      setIngredients(['']);
      setSteps(['']);
      setCuisineType('');
      setFoodType('');
      setDiet('omnivore');
      
      alert('Recipe created successfully!');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert(`Failed to create recipe: ${error.message}`);
    }
  };

  const { currentUser } = useAuth();

  return (
    <div className="page-container">
      {/* Header at the very top */}
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

      {/* Main content below header */}
      <main className="main-content">
        <div className="create-recipe-container">
          <div className="recipe-form-card">
            <h1 className="form-title">Create New Recipe</h1>
        
        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Recipe Name */}
          <div className="form-group">
            <label className="form-label">Recipe Name*</label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
              className="form-input"
              placeholder="Enter recipe name"
            />
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form-input"
              placeholder="Paste image URL (optional)"
            />
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label className="form-label">Ingredients*</label>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="dynamic-input-group">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  className="form-input dynamic-input"
                  placeholder={`Ingredient ${idx + 1}`}
                />
                {idx === ingredients.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="add-button"
                    aria-label="Add ingredient"
                  >
                    <span className="plus-icon">+</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="form-group">
            <label className="form-label">Steps*</label>
            {steps.map((step, idx) => (
              <div key={idx} className="dynamic-input-group">
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  className="form-input dynamic-input step-input"
                  placeholder={`Step ${idx + 1}`}
                  rows="2"
                />
                {idx === steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="add-button"
                    aria-label="Add step"
                  >
                    <span className="plus-icon">+</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Cuisine and Food Type */}
          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">Cuisine Type</label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select Cuisine --</option>
                <option value="American">American</option>
                <option value="Asian">Asian</option>
                <option value="Italian">Italian</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Mexican">Mexican</option>
              </select>
            </div>

            <div className="form-group half-width">
              <label className="form-label">Food Type</label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select Food Type --</option>
                <option value="Burgers">Burgers</option>
                <option value="Pastas">Pastas</option>
                <option value="Salads">Salads</option>
                <option value="Steaks">Steaks</option>
                <option value="Tacos">Tacos</option>
              </select>
            </div>
          </div>

          {/* Diet */}
          <div className="form-group">
            <label className="form-label">Diet</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="diet"
                  value="omnivore"
                  checked={diet === 'omnivore'}
                  onChange={(e) => setDiet(e.target.value)}
                />
                <span className="radio-label">Omnivore</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="diet"
                  value="herbivore"
                  checked={diet === 'herbivore'}
                  onChange={(e) => setDiet(e.target.value)}
                />
                <span className="radio-label">Herbivore</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-button-container">
          <button type="submit" className="submit-button">
            Create Recipe
          </button>
          </div>
        </form>
      </div>
    </div>
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

    </div>
  );
};

export default CreateRecipe;
