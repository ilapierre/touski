import { Link } from "react-router";
import "./TopBar.css";

function TopBar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <img src="/touski-logo.png" alt="" className="logo" />
        <h1>Touski</h1>
      </Link>
      <Link to="/connexion" className="login-button">
        Connexion
      </Link>
    </header>
  );
}

export default TopBar;
