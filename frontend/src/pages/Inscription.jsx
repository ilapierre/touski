import "./Connexion.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "/api";

function Inscription() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    const res = await fetch(`${API_URL}/auth/inscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.status === 409) {
      setErreur("Ce courriel est déjà utilisé");
      return;
    }
    if (!res.ok) {
      setErreur(
        "Vérifiez vos informations (mot de passe : 8 caractères minimum)",
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
        <h2>Inscription</h2>

        <label htmlFor="name">Nom</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          required
        />

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
          minLength={8}
          required
        />

        {erreur && <p className="auth-erreur">{erreur}</p>}

        <button type="submit" className="login-button primary">
          Créer mon compte
        </button>

        <p className="auth-lien">
          Déjà un compte ? <Link to="/connexion">Connectez-vous</Link>
        </p>
      </form>
    </main>
  );
}

export default Inscription;
