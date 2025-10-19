import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";
import hatIcon from "../assets/hat.png";
import { supabase } from "../services/supabaseClient";
import AuthModal from "./AuthModal";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  function handleLogout() {
    supabase.auth.signOut();
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <img src={hatIcon} alt="World of Spaghetti logo" className="brand-icon" />
            <span className="brand-name">World of Spaghetti</span>
          </Link>
          <nav className="main-nav">
            <Link to="/recipes">Рецепты</Link>
            {user ? (
              <>
                <Link to="/profile" className="profile-link">Профиль</Link>
                <Link to="/add-recipe" className="add-recipe-btn">+ Добавить рецепт</Link>
                <button onClick={handleLogout} className="logout-btn">Выйти</button>
              </>
            ) : (
              <button className="login-btn" onClick={() => setShowAuth(true)}>
                Войти
              </button>
            )}
          </nav>
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={() => setShowAuth(false)} />}
    </>
  );
}
