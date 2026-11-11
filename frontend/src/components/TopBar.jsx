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

      <nav className="topbar-action">
        <Link to="/abonnement" className="subs">
          Abonnement
        </Link> 

      {connecte ? (
        <>
          <Link to="/profil" className="login-button">
            Profil
          </Link>
          <button type="button" className="login-button" onClick={deconnexion}>
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link to="/connexion" className="login-button">
            Connexion
          </Link>
          <Link to="/inscription" className="login-button">
            Inscription
          </Link>
        </>
      )}
      </nav>
    </header>
  );
}

export default TopBar;
