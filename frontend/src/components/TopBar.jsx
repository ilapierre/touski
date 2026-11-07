import { Link } from "react-router";
import { useLocation, useNavigate } from "react-router";
import "./TopBar.css";
import ChangeLang from "./ChangeLang";

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
          <ChangeLang />
          <Link to="/profil" className="login-button">
            Profil
          </Link>
          <button type="button" className="login-button" onClick={deconnexion}>
            Déconnexion
          </button>
        </nav>
      ) : (
        <nav className="topbar-actions">
          <ChangeLang />
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
