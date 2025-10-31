import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../css/RecipePage.css";

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

  const fetchLikes = useCallback(async () => {
    const { count, error } = await supabase
      .from('recipe_likes')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', id);

    if (!error) {
      setLikesCount(count);
    }
  }, [id]);

  const checkIfLiked = useCallback(async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from('recipe_likes')
      .select('*')
      .eq('recipe_id', id)
      .eq('user_id', currentUserId);

    if (!error && data.length > 0) {
      setIsLiked(true);
    }
  }, [currentUserId, id]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Ошибка при загрузке рецепта:", error);
        setRecipe(null);
      } else {
        setRecipe(data);
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    fetchLikes();
    checkIfLiked();
  }, [fetchLikes, checkIfLiked]);

  const handleLike = async () => {
    if (!currentUserId) {
      console.log("Вы должны быть авторизованы, чтобы ставить лайки!");
      return;
    }

    if (isLiked) {
      const { error } = await supabase
        .from('recipe_likes')
        .delete()
        .eq('recipe_id', id)
        .eq('user_id', currentUserId);

      if (!error) {
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      }
    } else {
      const { error } = await supabase
        .from('recipe_likes')
        .insert([{ user_id: currentUserId, recipe_id: id }]);

      if (!error) {
        setIsLiked(true);
        setLikesCount(likesCount + 1);
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить этот рецепт?")) return;
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id);
    if (error) {
      console.log("Ошибка при удалении рецепта: " + error.message);
    } else {
      navigate("/profile");
    }
  };
  
  
  const handleEdit = () => {
    navigate(`/edit-recipe/${recipe.id}`); 
  }

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Загрузка рецепта...</p>;
  }

  if (!recipe) {
    return (
      <div className="container">
        <p>Рецепт не найден.</p>
        <Link to="/">← Вернуться на главную</Link>
      </div>
    );
  }

  const isOwner = currentUserId === recipe.user_id;
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
  const difficultyColor = difficultyColors[recipe.complexity] || "#FFF9C2";
  const difficultyText = difficultyTexts[recipe.complexity] || "Средне";

  return (
    <div className="recipe-detail">
      <Link to="/" className="back-button">
        ← Назад к рецептам
      </Link>
      <div className="recipe-container">
        <div className="recipe-main">
          <div className="difficulty-badge" style={{ backgroundColor: difficultyColor }}>
            {difficultyText}
          </div>
          <div className="recipe-image-container">
            {recipe.image_url && (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="recipe-image"
              />
            )}
          </div>
          <h1>{recipe.title}</h1>
          <p className="author">{recipe.author || ""}</p>
          <p className="description">{recipe.description}</p>
          <div className="recipe-meta">
            <div className="meta-item">
              ⏱ {recipe.cook_time || "30"} минут
            </div>
            <div className="meta-item">
              🍽 {recipe.servings || "4"} порций
            </div>
            <div className="meta-item">
              <img src={require("../assets/hat.png")} alt="" aria-hidden="true" className="cuisine-icon" />
              {recipe.cuisine || "Итальянская"}
            </div>
          </div>
          <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            {likesCount}
          </button>
        </div>
        <div className="ingredients-card">
          <h2>Ингредиенты</h2>
          <ul className="ingredients-list">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-name">
                    {typeof item === "string" ? item : item.name || "Ингредиент"}
                  </span>
                  <span className="ingredient-amount">
                    {typeof item === "string" ? "" : item.amount || ""}
                  </span>
                </li>
              ))
            ) : (
              <p>Ингредиенты не указаны.</p>
            )}
          </ul>
        </div>
      </div>
      <div className="steps-section">
        <h2>Приготовление</h2>
        <ol className="steps-list">
          {recipe.steps && recipe.steps.length > 0 ? (
            recipe.steps.map((step, index) => (
              <li key={index} className="step-item">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <p className="step-text">{step.text}</p>
                  {step.image && (
                    <img src={step.image} alt={`Шаг ${index + 1}`} className="step-image" />
                  )}
                </div>
              </li>
            ))
          ) : (
            <p>Шаги приготовления не указаны.</p>
          )}
        </ol>
      </div>
      {isOwner && (
        <div className="recipe-actions">
          <button className="delete-btn" onClick={handleDelete}>
            Удалить рецепт
          </button>
          <button className="edit-btn" onClick={handleEdit}>
            Редактировать рецепт
          </button>
        </div>
      )}
    </div>
  );
}
