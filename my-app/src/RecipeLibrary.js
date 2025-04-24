import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from './firebaseConfig';
import './StyleRecipeLibrary.css';        // Your original styling
import './recipelibrarymenu.css';         // CSS for the sidebar & filtering
// import './fonts.css';                  // (Uncomment if you need your fonts imported)

const RecipeLibrary = () => {
  // Full list of recipes from the Realtime Database
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  // List of recipes after filtering
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state: Cuisine, Food Type, Diet, and Search Term
  const [cuisineFilter, setCuisineFilter] = useState({
    American: false,
    Asian: false,
    Italian: false,
    Mediterranean: false,
    Mexican: false
  });
  const [foodTypeFilter, setFoodTypeFilter] = useState({
    Burgers: false,
    Pastas: false,
    Salads: false,
    Steaks: false,
    Tacos: false
  });
  const [diet, setDiet] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch recipes from the Realtime Database on mount
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
      } else {
        setRecipes([]);
        setFilteredRecipes([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to check if a recipe passes the filters
  const passesFilters = (recipe) => {
    // Search filter: by recipe name
    if (searchTerm.trim()) {
      const lowerName = recipe.name ? recipe.name.toLowerCase() : '';
      if (!lowerName.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }
    // Diet filter (if not "all")
    if (diet !== 'all' && recipe.diet !== diet) {
      return false;
    }
    // Cuisine filter: only if at least one cuisine checkbox is selected
    const activeCuisines = Object.keys(cuisineFilter).filter((key) => cuisineFilter[key]);
    if (activeCuisines.length > 0) {
      if (!recipe.cuisineType || !activeCuisines.includes(recipe.cuisineType)) {
        return false;
      }
    }
    // Food Type filter: only if at least one food type checkbox is selected
    const activeFoodTypes = Object.keys(foodTypeFilter).filter((key) => foodTypeFilter[key]);
    if (activeFoodTypes.length > 0) {
      if (!recipe.foodType || !activeFoodTypes.includes(recipe.foodType)) {
        return false;
      }
    }
    return true;
  };

  // Update the filtered recipes list whenever recipes or any filter changes
  useEffect(() => {
    const newFiltered = recipes.filter((recipe) => passesFilters(recipe));
    setFilteredRecipes(newFiltered);
  }, [recipes, searchTerm, diet, cuisineFilter, foodTypeFilter]);

  // Handlers for filter option changes
  const handleCuisineChange = (e) => {
    const { name, checked } = e.target;
    setCuisineFilter((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFoodTypeChange = (e) => {
    const { name, checked } = e.target;
    setFoodTypeFilter((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDietChange = (e) => {
    setDiet(e.target.value);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="recipe-library">
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

      {/* Main content: Flex container with sidebar (filter) and recipe section */}
      <main className="main-content">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <h2>Filter</h2>
          {/* Search Box */}
          <div style={{fontFamily: "'Instrument Sans', sans-serif"}}className="search-box">
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
            {Object.keys(cuisineFilter).map((key) => (
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
            {Object.keys(foodTypeFilter).map((key) => (
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
          <h2 className="section-title">Recipe Library</h2>
          {loading ? (
            <p>Loading recipes...</p>
          ) : (
            <div className="recipe-grid">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <h3>{recipe.name || recipe.title}</h3>
                    <p>{recipe.category || recipe.cuisineType}</p>
                    {recipe.imageUrl && (
                      <img
                      src={recipe.imageUrl}
                      alt={recipe.name || recipe.title}
                      className="recipe-image"
                      style={{
                        width: "100%",
                        height: "200px", 
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        border: "2px solid black",
                      }}
                    />
                    )}
                  <Link 
                    to={`/recipe/${recipe.id}`} 
                    className="view-category-btn"
                    style={{
                      backgroundColor: 'black', 
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px', 
                      textDecoration: 'none', 
                      display: 'inline-block', 
                      marginTop: '10px',
                      fontFamily: "'Instrument Sans', sans-serif" 
                    }}
                  >
                    View Recipe
                  </Link>
                  </div>
                ))
              ) : (
                <p>No recipes found</p>
              )}
            </div>
          )}
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
    </div>
  );
};

export default RecipeLibrary;

