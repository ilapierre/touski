import "./Connexion.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const API_URL = "/api";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // /auth/connexion attend un formulaire OAuth2 (username + password)
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await fetch(`${API_URL}/auth/connexion`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });

    if (!res.ok) {
      setError("Courriel ou mot de passe invalide");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    navigate("/");
  }

  const { t } = useTranslation();

  return (
    <main className="auth">
      <form className="auth-form" onSubmit={handleSubmit}>
        <img src="/touski-logo.png" alt="Logo Touski" className="auth-logo" />
        <h2>{t('connexion.titre')}</h2>

        <label htmlFor="email">{t('connexion.courriel')}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">{t('connexion.motdepasse')}</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="auth-erreur">{error}</p>}

        <button type="submit" className="login-button primary">
          {t('connexion.connecter')}
        </button>

        <p className="auth-lien">
          {t('connexion.pascompte')} <Link to="/inscription">{t('connexion.inscrire')}</Link>
        </p>
      </form>
    </main>
  );
}

export default Connexion;
