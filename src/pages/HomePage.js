import React, { useEffect, useState } from "react";
import "../css/HomePage.css";
import RecipeCard from "../components/RecipeCard";
import { supabase } from "../services/supabaseClient";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cuisineFilter, setCuisineFilter] = useState("Все кухни");
  const [typeFilter, setTypeFilter] = useState("Все типы");
  const [complexityFilter, setComplexityFilter] = useState("Все сложности");
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при загрузке рецептов:", error);
      setRecipes([]);
    } else {
      setRecipes(data || []);
      setFilteredRecipes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    let filtered = [...recipes];

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтрация по кухне
    if (cuisineFilter !== "Все кухни") {
      const cuisineMap = {
        "Итальянская": "italian",
        "Французская": "french",
        "Азиатская": "asian"
      };
      const cuisineValue = cuisineMap[cuisineFilter];
      filtered = filtered.filter(recipe => recipe.cuisine === cuisineValue);
    }

    // Фильтрация по типу блюда
    if (typeFilter !== "Все типы") {
      const typeMap = {
        "Основное блюдо": "main",
        "Закуска": "starter",
        "Десерт": "dessert"
      };
      const typeValue = typeMap[typeFilter];
      filtered = filtered.filter(recipe => recipe.type === typeValue);
    }

    // Фильтрация по сложности
    if (complexityFilter !== "Все сложности") {
      const complexityMap = {
        "Легко": "Легко",
        "Средне": "Средне",
        "Сложно": "Сложно"
      };
      const complexityValue = complexityMap[complexityFilter];
      filtered = filtered.filter(recipe => recipe.complexity === complexityValue);
    }

    setFilteredRecipes(filtered);
  }, [recipes, cuisineFilter, typeFilter, complexityFilter, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <main className="home-page">
      <section className="hero">
        <h1>Мир Спагетти</h1>
        <p>Откройте для себя лучшие рецепты итальянской пасты и не только</p>
      </section>
      <section className="search-section">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Поиск рецептов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍 Найти</button>
        </form>
        <div className="filters">
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
          >
            <option>Все кухни</option>
            <option>Итальянская</option>
            <option>Французская</option>
            <option>Азиатская</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>Все типы</option>
            <option>Основное блюдо</option>
            <option>Закуска</option>
            <option>Десерт</option>
          </select>
          <select
            value={complexityFilter}
            onChange={(e) => setComplexityFilter(e.target.value)}
          >
            <option>Все сложности</option>
            <option>Легко</option>
            <option>Средне</option>
            <option>Сложно</option>
          </select>
        </div>
      </section>
      {loading ? (
        <p style={{ textAlign: "center", marginTop: 40 }}>Загрузка рецептов...</p>
      ) : filteredRecipes.length > 0 ? (
        <div>
          <div className="recipes-header">
            <h2>Все рецепты</h2>
            <div className="recipes-count">{filteredRecipes.length} рецептов</div>
          </div>
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} userId={userId} />
            ))}
          </div>
        </div>
      ) : (
        <section className="empty-results">
          <div className="empty-icon">🍝</div>
          <h2>Рецепты не найдены</h2>
          <p>Попробуйте изменить фильтры или поисковый запрос.</p>
        </section>
      )}
    </main>
  );
}
