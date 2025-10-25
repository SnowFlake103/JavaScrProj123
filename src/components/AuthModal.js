import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../css/AuthModal.css";

export default function AuthModal({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState(""); // новое поле логина
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isRegister) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: { data: { login } } 
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;
      onLogin(result.data.session);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Загрузка..." : isRegister ? "Создать аккаунт" : "Войти"}
          </button>

        </form>

        <p className="toggle">
          {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Войти" : "Зарегистрироваться"}
          </span>
        </p>
      </div>
    </div>
  );
}
