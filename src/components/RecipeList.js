import React from "react";
import RecipeCard from "./RecipeCard";
import "../css/HomePage.css";

export default function RecipeList({ recipes }) {
  return (
    <div>
      <div className="recipes-header">
        <h2>Все рецепты</h2>
        <div className="recipes-count">{recipes.length} рецептов</div>
      </div>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
