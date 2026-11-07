import "./Profil.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const API_URL = "/api";

function Profil() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    async function chargerProfil() {
      const res = await fetch(`${API_URL}/auth/moi`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Token expiré ou invalide : retour à la connexion
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/connexion");
        return;
      }

      setUser(await res.json());
    }
    chargerProfil();
  }, [navigate]);

  if (!user) {
    return (
      <main className="profil">
        <p>{t('profil.charge')}</p>
      </main>
    );
  }

  return (
    <main className="profil">
      <header className="profil-entete">
        {/* Espace réservé pour la photo de profil si on fait */}
        <div className="profil-photo" aria-hidden="true"></div>

        <div className="profil-infos">
          <h2>{user.name}</h2>
          <p className="profil-email">{user.email}</p>
        </div>

        {/* Bouton de modification du profil */}
        <button type="button" className="login-button">
          {t('profil.modifier')}
        </button>
      </header>
      {/* Section des groupes. Quand les groupes seront fait on le fera pour de vrai*/}
      <section className="profil-section">
        <h3>{t('profil.gr')}</h3>
        <p className="profil-vide">{t('profil.pasgr')}</p>
      </section>

      <section className="profil-section profil-frigo">
        <h3>{t('profil.frigo')}</h3>
        <Link to="/frigo" className="profil-frigo-carte">
          {t('profil.contenu')}
        </Link>
      </section>
    </main>
  );
}

export default Profil;
