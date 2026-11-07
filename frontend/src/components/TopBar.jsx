import { Link } from "react-router";
import { useLocation, useNavigate } from "react-router";
import "./TopBar.css";
import ChangeLang from "./ChangeLang";
import { useTranslation } from "react-i18next";

function TopBar() {
  useLocation(); // pour que la barre se mette à jour quand on change de page
  const navigate = useNavigate();
  const connecte = localStorage.getItem("token");

  function deconnexion() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const { t } = useTranslation();

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
            {t('topbar.profil')}
          </Link>
          <button type="button" className="login-button" onClick={deconnexion}>
            {t('topbar.deconnexion')}
          </button>
        </nav>
      ) : (
        <nav className="topbar-actions">
          <ChangeLang />
          <Link to="/connexion" className="login-button">
            {t('topbar.connexion')}
          </Link>
          <Link to="/inscription" className="login-button">
            {t('topbar.inscription')}
          </Link>
        </nav>
      )}
    </header>
  );
}

export default TopBar;
