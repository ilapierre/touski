import { Link } from "react-router";
import { useLocation, useNavigate } from "react-router";
import "./TopBar.css";
import { useState } from "react";
import SideDrawer from "./SideDrawer";
import Backdrop from "./Backdrop";

function TopBar() {
  useLocation(); // pour que la barre se mette à jour quand on change de page
  const navigate = useNavigate();
  const connecte = localStorage.getItem("token");

  function deconnexion() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const [drawerOuvert, setDrawerOuvert] = useState(false);

  const liens = connecte ? (
    <>
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
      <Link to="/abonnements" className="login-button">
        Abonnement
      </Link>
      <button type="button" className="login-button" onClick={deconnexion}>
        Déconnexion
      </button>
    </>
  ) : (
    <>
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
    </>
  );

  return (
    <>
      {drawerOuvert && <Backdrop onClick={() => setDrawerOuvert(false)} />}
      {drawerOuvert && (
        <SideDrawer>
          <div onClick={() => setDrawerOuvert(false)}>
            <div className="drawer-marque">
              <Link to="/" className="brand">
                <img src="/touski-logo.png" alt="" className="logo" />
                <h1>Touski</h1>
              </Link>
            </div>
            <nav>{liens}</nav>
          </div>
        </SideDrawer>
      )}

      <header className="topbar">
        <Link to="/" className="brand">
          <img src="/touski-logo.png" alt="" className="logo" />
          <h1>Touski</h1>
        </Link>

        <nav className="topbar-actions">{liens}</nav>

        <button
          className="topbar-menu-btn"
          onClick={() => setDrawerOuvert(true)}
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>
    </>
  );
}

export default TopBar;
