import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import RecipePage from './components/RecipePage';
import Header from './components/Header';
import './App.css';
import AddRecipePage from "./components/AddRecipePage";
import RecipeEdit from "./components/RecipeEdit";

function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-recipe" element={<AddRecipePage />} />
          <Route path="/recipes" element={<HomePage />} />
          <Route path="/edit-recipe/:id" element={<RecipeEdit />} />
        </Routes>
      </main>
      <footer className="app-footer">© {new Date().getFullYear()} worldofspaghetti.igloo</footer>
    </div>
  );
}


export default App;