import "./Connexion.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

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

  return (
    <main className="auth">
      <form className="auth-form" onSubmit={handleSubmit}>
        <img src="/touski-logo.png" alt="Logo Touski" className="auth-logo" />
        <h2>Connexion</h2>

        <label htmlFor="email">Courriel</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="auth-erreur">{error}</p>}

        <button type="submit" className="login-button primary">
          Se connecter
        </button>

        <p className="auth-lien">
          Pas de compte ? <Link to="/inscription">Inscrivez-vous</Link>
        </p>
      </form>
    </main>
  );
}

export default Connexion;
