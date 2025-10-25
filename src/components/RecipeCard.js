import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../css/RecipeCard.css";

export default function RecipeCard({ recipe, userId }) {
  const difficultyColors = {
    Легко: "#C8E6C9",
    Средне: "#FFF9C2",
    Сложно: "#FFCCBC"
  };
  const difficultyTexts = {
    Легко: "Легко",
    Средне: "Средне",
    Сложно: "Сложно"
  };
    const cuisineMap = {
    italian: "Итальянская",
    french: "Французская",
    asian: "Азиатская",
    other: "Другая"
  };

  const difficultyColor = difficultyColors[recipe.complexity] || "#FFF9C2";
  const difficultyText = difficultyTexts[recipe.complexity] || "Средне";
  const cuisineText = cuisineMap[recipe.cuisine] || "Итальянская";

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const fetchLikes = useCallback(async () => {
    const { count, error } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipe.id);

    if (!error) {
      setLikesCount(count);
    }
  }, [recipe.id]);

  const checkIfLiked = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('recipe_likes')
      .select('*')
      .eq('recipe_id', recipe.id)
      .eq('user_id', userId);

    if (!error && data.length > 0) {
      setIsLiked(true);
    }
  }, [userId, recipe.id]);

  useEffect(() => {
    fetchLikes();
    checkIfLiked();
  }, [fetchLikes, checkIfLiked]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      console.log("Вы должны быть авторизованы, чтобы ставить лайки!");
      return;
    }

    if (isLiked) {
      const { error } = await supabase
        .from('recipe_likes')
        .delete()
        .eq('recipe_id', recipe.id)
        .eq('user_id', userId);

      if (!error) {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      }
    } else {
      const { error } = await supabase
        .from('recipe_likes')
        .insert([{ user_id: userId, recipe_id: recipe.id }]);

      if (!error) {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
    }
  };

  return (
    <article className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="card-link">
        <div className="thumb">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt={recipe.title} />
          ) : (
            <div className="placeholder-image"></div>
          )}
        </div>
        <div className="card-body">
          <div className="difficulty-badge" style={{ backgroundColor: difficultyColor }}>
            {difficultyText}
          </div>
          <h3 className="title">{recipe.title}</h3>
          <p className="author"> {recipe.author || ""}</p>
          <p className="desc">
            {recipe.description
                ? recipe.description.length > 120
                ? recipe.description.slice(0, 120) + "..."
                : recipe.description
                : "Описание отсутствует"}
            </p>
          <div className="meta-container">
            <div className="meta-info">
              <span className="meta-item">⏱ {recipe.cook_time || "30"} мин</span>
              <span className="meta-item">🍽 {recipe.servings || "4"}</span>
            </div>
            <div className="cuisine-tag">{cuisineText}</div>
          </div>
        </div>
      </Link>
      <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
        {likesCount}
      </button>
    </article>
  );
}

