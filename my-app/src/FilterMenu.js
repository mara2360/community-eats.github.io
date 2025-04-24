import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebaseConfig';
import './recipelibrarymenu.css';
import { Link } from 'react-router-dom'; // For linking to /recipe/:id
import { useAuth } from './AuthContext';
import './fonts.css';

// We assume you have a RecipeDetails, CreateRecipe, etc. but we only need them if used here

const FilterMenu = () => {
  // All recipes pulled from Realtime Database
  const [recipes, setRecipes] = useState([]);
  // Filtered recipes
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Cuisine filter checkboxes
  const [cuisineFilter, setCuisineFilter] = useState({
    American: false,
    Asian: false,
    Italian: false,
    Mediterranean: false,
    Mexican: false
  });

  // Food type filter checkboxes
  const [foodTypeFilter, setFoodTypeFilter] = useState({
    Burgers: false,
    Pastas: false,
    Salads: false,
    Steaks: false,
    Tacos: false
  });

  // Diet radio: "all", "omnivore", "herbivore"
  const [diet, setDiet] = useState('all');

  // NEW: Add a searchTerm for filtering by recipe name
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch recipes from Realtime Database on mount
  useEffect(() => {
    const database = getDatabase(app);
    const recipesRef = ref(database, 'recipes');

    const unsubscribe = onValue(recipesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const array = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRecipes(array);
        setFilteredRecipes(array);
        console.log('Fetched Realtime DB recipes:', array);
      } else {
        setRecipes([]);
        setFilteredRecipes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper that returns true if recipe meets all active filters
  const passesFilters = (recipe) => {
    // 1) Search by name
    if (searchTerm.trim()) {
      const lowerName = recipe.name?.toLowerCase() || '';
      const lowerSearch = searchTerm.toLowerCase();
      if (!lowerName.includes(lowerSearch)) {
        return false;
      }
    }

    // 2) Diet filter
    if (diet !== 'all' && recipe.diet !== diet) return false;

    // 3) Cuisine filter
    const activeCuisines = Object.keys(cuisineFilter).filter(key => cuisineFilter[key]);
    if (activeCuisines.length > 0) {
      if (!recipe.cuisineType || !activeCuisines.includes(recipe.cuisineType)) {
        return false;
      }
    }

    // 4) Food type filter
    const activeFoodTypes = Object.keys(foodTypeFilter).filter(key => foodTypeFilter[key]);
    if (activeFoodTypes.length > 0) {
      if (!recipe.foodType || !activeFoodTypes.includes(recipe.foodType)) {
        return false;
      }
    }

    return true;
  };

  // Re-run filtering whenever recipes or filter states change
  useEffect(() => {
    const newFiltered = recipes.filter(r => passesFilters(r));
    setFilteredRecipes(newFiltered);
  }, [recipes, searchTerm, diet, cuisineFilter, foodTypeFilter]);

  // Handlers for filter changes
  const handleCuisineChange = (e) => {
    const { name, checked } = e.target;
    setCuisineFilter(prev => ({ ...prev, [name]: checked }));
  };

  const handleFoodTypeChange = (e) => {
    const { name, checked } = e.target;
    setFoodTypeFilter(prev => ({ ...prev, [name]: checked }));
  };

  const handleDietChange = (e) => {
    setDiet(e.target.value);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const { currentUser } = useAuth();

  return (
    <div className="page-container">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="veg-option-btn">VEGETARIAN LIBRARY OPTION</button>
      </div>

      {/* Header */}
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

      <div className="main-content">
        {/* Sidebar with Filters */}
        <aside className="filter-sidebar">
          <h2>Filter</h2>

          {/* Search by Name */}
          <div className="search-box">
            <label><strong>Search:</strong></label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Search recipes by name"
            />
          </div>

          {/* Diet Filter */}
          <div className="diet-filter">
            <h3>Diet:</h3>
            <label className="diet-radio-option">
              <input
                type="radio"
                name="diet"
                value="all"
                checked={diet === 'all'}
                onChange={handleDietChange}
              />
              All
            </label>
            <label className="diet-radio-option">
              <input
                type="radio"
                name="diet"
                value="omnivore"
                checked={diet === 'omnivore'}
                onChange={handleDietChange}
              />
              Omnivore
            </label>
            <label className="diet-radio-option">
              <input
                type="radio"
                name="diet"
                value="herbivore"
                checked={diet === 'herbivore'}
                onChange={handleDietChange}
              />
              Herbivore
            </label>
          </div>

          {/* Cuisine Checkboxes */}
          <h3>Cuisine</h3>
          <ul className="filter-list">
            {Object.keys(cuisineFilter).map(key => (
              <li key={key}>
                <label>
                  <input
                    type="checkbox"
                    name={key}
                    checked={cuisineFilter[key]}
                    onChange={handleCuisineChange}
                  />
                  {key}
                </label>
              </li>
            ))}
          </ul>

          {/* Food Type Checkboxes */}
          <h3>Food Type</h3>
          <ul className="filter-list">
            {Object.keys(foodTypeFilter).map(key => (
              <li key={key}>
                <label>
                  <input
                    type="checkbox"
                    name={key}
                    checked={foodTypeFilter[key]}
                    onChange={handleFoodTypeChange}
                  />
                  {key}
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {/* Recipe Section */}
        <section className="recipe-section">
          <h2 className="section-title">Community Recipes</h2>
          <div className="recipe-grid">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="recipe-card">
                    {recipe.imageUrl && (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="recipe-image"
                      />
                    )}
                    <h3 className="recipe-name">{recipe.name}</h3>
                    <p className="recipe-category">
                      {recipe.cuisineType} | {recipe.foodType} | {recipe.diet}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No recipes found</p>
            )}
          </div>
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
                  Subscribe
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

export default FilterMenu;
