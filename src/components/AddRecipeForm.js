import React, { useState } from 'react';
import '../css/AddRecipeForm.css';

export default function AddRecipeForm({ onAdd, onClose, user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [author, setAuthor] = useState(user?.email || '');
  const [cuisine, setCuisine] = useState('italian');
  const [dishType, setDishType] = useState('main');
  const [complexity, setComplexity] = useState('Средне');
  const [cookTime, setCookTime] = useState('30');
  const [servings, setServings] = useState('4');

  function handleSubmit(e) {
    e.preventDefault();
    const recipe = {
      title,
      description,
      ingredients: ingredients.split('\n').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
      author,
      cuisine,
      type: dishType,
      complexity,
      cook_time: cookTime,
      servings,
      image_url: null,
    };
    onAdd(recipe);
    setTitle('');
    setDescription('');
    setIngredients('');
    setSteps('');
  }

  return (
    <div className="add-recipe-modal">
      <div className="add-recipe-modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <form className="add-recipe-form" onSubmit={handleSubmit}>
          <h3>Добавить рецепт</h3>
          <input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} required />
          <input placeholder="Автор" value={author} onChange={e => setAuthor(e.target.value)} />
          <textarea placeholder="Краткое описание" value={description} onChange={e => setDescription(e.target.value)} />
          <label>Ингредиенты (по одному на строке)</label>
          <textarea placeholder="Ингредиенты..." value={ingredients} onChange={e => setIngredients(e.target.value)} />
          <label>Шаги приготовления (по одному на строке)</label>
          <textarea placeholder="Шаги..." value={steps} onChange={e => setSteps(e.target.value)} />
          <div className="selects">
            <select value={cuisine} onChange={e => setCuisine(e.target.value)}>
              <option value="italian">Итальянская</option>
              <option value="french">Французская</option>
              <option value="asian">Азиатская</option>
            </select>
            <select value={dishType} onChange={e => setDishType(e.target.value)}>
              <option value="main">Основное блюдо</option>
              <option value="starter">Закуска</option>
              <option value="dessert">Десерт</option>
            </select>
            <select value={complexity} onChange={e => setComplexity(e.target.value)}>
              <option value="Легко">Легко</option>
              <option value="Средне">Средне</option>
              <option value="Сложно">Сложно</option>
            </select>
          </div>
          <div className="time-servings">
            <div className="time-input">
              <label>Время приготовления (мин)</label>
              <input type="number" value={cookTime} onChange={e => setCookTime(e.target.value)} />
            </div>
            <div className="servings-input">
              <label>Количество порций</label>
              <input type="number" value={servings} onChange={e => setServings(e.target.value)} />
            </div>
          </div>
          <button type="submit">Добавить</button>
        </form>
      </div>
    </div>
  );
}
