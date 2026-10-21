import { Link } from 'react-router'
import './TopBar.css'

function TopBar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <img src="/touski-logo.png" alt="" className="logo" />
        <h1>Touski</h1>
      </Link>
      <button type="button" className="login-button">
        Connexion
      </button>
    </header>
  )
}

export default TopBar
