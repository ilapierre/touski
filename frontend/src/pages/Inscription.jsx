import "./Connexion.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const API_URL = "/api";

function Inscription() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const { t } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    const res = await fetch(`${API_URL}/auth/inscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.status === 409) {
      setErreur(t('inscription.errCourriel'));
      return;
    }
    if (!res.ok) {
      setErreur(
        t('inscription.errPasse'),
      );
      return;
    }

    // Connexion automatique : l'API renvoie déjà le token
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    navigate("/profil");
  }

  return (
    <main className="auth">
      <form className="auth-form" onSubmit={handleSubmit}>
        <img src="/touski-logo.png" alt="Logo Touski" className="auth-logo" />
        <h2>{t('inscription.titre')}</h2>

        <label htmlFor="name">{t('inscription.nom')}</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          required
        />

        <label htmlFor="email">{t('inscription.courriel')}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">{t('inscription.motdepasse')}</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        {erreur && <p className="auth-erreur">{erreur}</p>}

        <button type="submit" className="login-button primary">
          {t('inscription.creer')}
        </button>

        <p className="auth-lien">
          {t('inscription.compte')} <Link to="/connexion">{t('inscription.connecter')}</Link>
        </p>
      </form>
    </main>
  );
}

export default Inscription;
