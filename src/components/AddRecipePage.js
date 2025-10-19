import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import "../css/AddRecipeForm.css";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("italian");
  const [type, setType] = useState("main");
  const [complexity, setComplexity] = useState("Средне"); // Добавлено состояние для сложности
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState([{ text: "", image: "" }]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };
  const addStep = () => setSteps([...steps, { text: "" }]);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));
    const updateStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Вы должны быть авторизованы!");
    setLoading(true);
    const { error } = await supabase.from("recipes").insert([
      {
        user_id: user.id,
        title,
        description,
        cuisine,
        type,
        complexity, // Добавлено поле сложности
        cook_time: cookTime ? parseInt(cookTime) : null,
        servings: servings ? parseInt(servings) : null,
        image_url: imageUrl,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.text.trim() || s.image.trim()),
      },
    ]);
    setLoading(false);
    if (error) {
      console.error(error);
      alert("Ошибка при добавлении рецепта");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="add-recipe-page container">
      <h1>Добавить рецепт</h1>
      <form onSubmit={handleSubmit} className="recipe-form">
        <label>Название рецепта *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="form-row">
          <div>
            <label>Кухня</label>
            <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
              <option value="italian">Итальянская</option>
              <option value="french">Французская</option>
              <option value="asian">Азиатская</option>
              <option value="other">Другая</option>
            </select>
          </div>
          <div>
            <label>Тип блюда</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="main">Основное блюдо</option>
              <option value="starter">Закуска</option>
              <option value="dessert">Десерт</option>
            </select>
          </div>
          <div>
            <label>Сложность</label>
            <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
              <option value="Легко">Легко</option>
              <option value="Средне">Средне</option>
              <option value="Сложно">Сложно</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Время приготовления (мин)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <label>Порции</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="4"
            />
          </div>
        </div>
        <label>Изображение (URL)</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        <h3>Ингредиенты</h3>
        {ingredients.map((ingredient, i) => (
          <div key={i} className="dynamic-row">
            <input
              type="text"
              placeholder="Название"
              value={ingredient.name}
              onChange={(e) => updateIngredient(i, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Количество"
              value={ingredient.amount}
              onChange={(e) => updateIngredient(i, "amount", e.target.value)}
            />
            {ingredients.length > 1 && (
              <button type="button" onClick={() => removeIngredient(i)}>
                ✖
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addIngredient}>
          + Добавить ингредиент
        </button>
        <h3>Шаги приготовления</h3>
        {steps.map((step, i) => (
        <div key={i} className="dynamic-step">
            <textarea
            placeholder={`Шаг ${i + 1}`}
            value={step.text}
            onChange={(e) => updateStep(i, "text", e.target.value)}
            />
            <input
            type="url"
            placeholder="URL изображения шага"
            value={step.image}
            onChange={(e) => updateStep(i, "image", e.target.value)}
            />
            {steps.length > 1 && (
            <button type="button" onClick={() => removeStep(i)}>✖</button>
            )}
        </div>
        ))}
        <button type="button" className="add-btn" onClick={addStep}>
          + Добавить шаг
        </button>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Сохранение..." : "Добавить рецепт"}
        </button>
      </form>
    </div>
  );
}
