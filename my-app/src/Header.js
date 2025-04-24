<div className="community-eats">
  <header className="header">
    <h1>COMMUNITY EATS</h1>
    <nav className="navigation">
      <Link to="/recipe-library">Recipe Library</Link>
      <Link to="/about-us">About Us</Link>
    </nav>
  </header>

  <main className="main-content">
    <section className="welcome-section">
      <p>
        Welcome to Community Eats - a space where food lovers come together to share, recreate, 
        and reinvent their favorite recipes! As a member, you can upload your own culinary creations, 
        discover new dishes, and get inspired by others in our vibrant food community.
      </p>
    </section>

    <hr className="divider" />

    <section className="subscribe-section">
      <h2>KEEP EATING!</h2>
      <div className="subscribe-box">
        <button className="subscribe-button">SUBSCRIBE</button>
        <input type="email" placeholder="Email address" className="email-input" />
      </div>
    </section>
  </main>

  <footer className="footer">
    <p>© 2025, Community Eats</p>
    <p>(810) 246 - 8357</p>
    <p>1234 Michigan Avenue, Dearborn, MI 48124</p>
  </footer>

  <Routes>
    <Route path="/recipe-library" element={<RecipeLibrary />} />
  </Routes>
</div>