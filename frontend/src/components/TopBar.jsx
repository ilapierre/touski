import { Link } from "react-router";
import { useLocation, useNavigate } from "react-router";
import "./TopBar.css";

function TopBar() {
  useLocation(); // pour que la barre se mette à jour quand on change de page
  const navigate = useNavigate();
  const connecte = localStorage.getItem("token");

  function deconnexion() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <img src="/touski-logo.png" alt="" className="logo" />
        <h1>Touski</h1>
      </Link>

      {connecte ? (
        <nav className="topbar-actions">
          <Link to="/profil" className="login-button">
            Profil
          </Link>
          <Link to="/foods" className="login-button">
            Aliments
          </Link>
          <Link to="/recipes" className="login-button">
            Recettes
          </Link>
          <Link to="/frigo" className="login-button">
            Frigo
          </Link>

          <Link to="/groupes" className="login-button">
            Groupes
          </Link>
          <button type="button" className="login-button" onClick={deconnexion}>
            Déconnexion
          </button>
        </nav>
      ) : (
        <nav className="topbar-actions">
          <Link to="/foods" className="login-button">
            Aliments
          </Link>
          <Link to="/recipes" className="login-button">
            Recettes
          </Link>
          <Link to="/connexion" className="login-button">
            Connexion
          </Link>
          <Link to="/inscription" className="login-button">
            Inscription
          </Link>
        </nav>
      )}
    </header>
  );
}

export default TopBar;
