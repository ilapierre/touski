import "./Profil.css";
import photoProfilDefault from "../assets/photo-profil-vide.jpg";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "/api";

function Profil() {
  const [user, setUser] = useState(null);
  const [edition, setEdition] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [apercuPhoto, setApercuPhoto] = useState(null);
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function chargerProfil() {
      const res = await fetch(`${API_URL}/auth/moi`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/connexion");
        return;
      }
      setUser(await res.json());
    }
    chargerProfil();
  }, [navigate]);

  function ouvrirEdition() {
    setForm({ name: user.name, email: user.email, password: "" });
    setErreur("");
    setEdition(true);
  }

  function annuler() {
    setApercuPhoto(null);
    setEdition(false);
  }

  function changerPhoto(e) {
    const fichier = e.target.files[0];
    if (fichier) {
      setApercuPhoto(URL.createObjectURL(fichier));
    }
  }

  async function enregistrer(e) {
    e.preventDefault();
    setErreur("");

    // On n'envoie le mot de passe que s'il a été rempli
    const donnees = { name: form.name, email: form.email };
    if (form.password) {
      donnees.password = form.password;
    }

    const res = await fetch(`${API_URL}/users/moi`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(donnees),
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/connexion");
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErreur(
        typeof data.detail === "string"
          ? data.detail
          : "Erreur lors de la modification",
      );
      return;
    }

    setUser(await res.json());
    setEdition(false);
  }

  if (!user) {
    return (
      <main className="profil">
        <p>Chargement...</p>
      </main>
    );
  }

  return (
    <main className="profil">
      <form className="profil-entete" onSubmit={enregistrer}>
        <div className="profil-photo-conteneur">
          <img
            src={apercuPhoto || user.photo || photoProfilDefault}
            alt="Photo de profil"
            className="profil-photo"
          />
          {edition && (
            <label className="profil-photo-plus">
              +
              <input
                type="file"
                accept="image/*"
                onChange={changerPhoto}
                hidden
              />
            </label>
          )}
        </div>

        <div className="profil-infos">
          {edition ? (
            <>
              <label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>
              <label>
                <input
                  type="password"
                  value={form.password}
                  placeholder="Laisser vide pour ne pas changer"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </label>
              {erreur && <p className="profil-erreur">{erreur}</p>}
            </>
          ) : (
            <>
              <h2>{user.name}</h2>
              <p className="profil-email">{user.email}</p>
            </>
          )}
        </div>

        {edition ? (
          <div className="profil-boutons">
            <button type="submit" className="login-button">
              Enregistrer
            </button>
            <button type="button" onClick={annuler}>
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="login-button"
            onClick={ouvrirEdition}
          >
            Modifier
          </button>
        )}
      </form>

      <section className="profil-section">
        <h3>Groupe :</h3>
        <p className="profil-vide">Aucun groupe pour l'instant.</p>
      </section>

      <section className="profil-section profil-frigo">
        <h3>Mon frigo :</h3>
        <Link to="/frigo" className="profil-frigo-carte">
          Voir le contenu
        </Link>
      </section>
    </main>
  );
}

export default Profil;
