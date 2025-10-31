import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import RecipeCard from '../components/RecipeCard';
import '../css/ProfilePage.css';

export default function ProfilePage() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [recipes, setRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMemberSince(session.user.id);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchMemberSince(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchMemberSince = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users') 
        .select('created_at')
        .eq('id', userId)
        .single();
      if (!error && data) {
        const date = new Date(data.created_at);
        const options = { month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('ru-RU', options);
        setMemberSince(formattedDate);
      }
    } catch (error) {
      console.error('Error fetching member since:', error);
    }
  };

  const loadMyRecipes = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', session.user.id);
      if (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
      } else {
        setRecipes(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const loadLikedRecipes = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipe_likes')
        .select('recipes(*)')
        .eq('user_id', session.user.id);
      if (error) {
        console.error('Error fetching liked recipes:', error);
        setLikedRecipes([]);
      } else {
        setLikedRecipes(data.map(like => like.recipes) || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setLikedRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      loadMyRecipes();
      loadLikedRecipes();
    }
  }, [session, loadMyRecipes, loadLikedRecipes]);

  return (
    <div className="profile-page">
      {!session ? (
        <div className="auth-container">
          <p>Пожалуйста, войдите для управления своими рецептами.</p>
          <button className="sign-in-button" onClick={() => supabase.auth.signInWithPassword({ email: '', password: '' })}>
            Войти
          </button>
        </div>
      ) : (
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">😎</div>
            <div className="profile-info">
              <h1 className="profile-name">
                {session.user.user_metadata?.login || session.user.email || 'Пользователь'}
              </h1>
              <p className="profile-email">{session.user.email}</p>
              <p className="profile-member-since">  {memberSince}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{recipes.length}</span>
                <span className="stat-label">Рецептов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{likedRecipes.length}</span>
                <span className="stat-label">Лайков</span>
              </div>
            </div>
          </div>
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'my-recipes' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-recipes')}
            >
              Мои рецепты
            </button>
            <button
              className={`profile-tab ${activeTab === 'liked-recipes' ? 'active' : ''}`}
              onClick={() => setActiveTab('liked-recipes')}
            >
              Понравившиеся
            </button>
          </div>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Загрузка рецептов...</p>
            </div>
          ) : (activeTab === 'my-recipes' ? recipes.length > 0 : likedRecipes.length > 0) ? (
            <div className="recipes-grid">
              {(activeTab === 'my-recipes' ? recipes : likedRecipes).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} userId={session.user.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>{activeTab === 'my-recipes' ? 'У вас пока нет рецептов' : 'У вас пока нет понравившихся рецептов'}</h3>
              <p>{activeTab === 'my-recipes' ? 'Добавьте свой первый рецепт, чтобы поделиться им с миром!' : 'Лайкните рецепты, чтобы они отображались здесь.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
