import { useEffect, useRef, useState } from "react";
import { useRestrictions } from "../restrictions";
import "./RestrictionModal.css";

const API_URL = "/api";

// Choix des restrictions de l'utilisateur
export default function RestrictionModal({ userId, selected, onClose, onSaved }) {
  const dialogRef = useRef(null);
  const { restrictions: liste, label } = useRestrictions();
  const [choix, setChoix] = useState(new Set(selected));
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // Clic sur l'arrière-plan (le <dialog> lui-même) = fermeture
  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) onClose();
  }

  function basculer(key) {
    const suivant = new Set(choix);
    if (suivant.has(key)) suivant.delete(key);
    else suivant.add(key);
    setChoix(suivant);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    const res = await fetch(`${API_URL}/restrictions/${userId}/restrictions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ restrictions: [...choix] }),
    });

    if (!res.ok) return setErreur("Erreur lors de l'enregistrement");
    onSaved((await res.json()).restrictions);
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="restriction-modal"
      aria-labelledby="restriction-modal-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        className="restriction-modal-close"
        onClick={onClose}
        aria-label="Fermer"
      >
        ×
      </button>

      <form className="restriction-modal-body" onSubmit={handleSubmit}>
        <header className="restriction-modal-header">
          <h2 id="restriction-modal-title">Mes restrictions alimentaires</h2>
          <p>
            Sélectionnez les allergènes à éviter. Ils serviront à filtrer les
            aliments et les recettes proposés.
          </p>
        </header>

        <div className="restriction-modal-choix">
          {Object.keys(liste).map((key) => (
            <label key={key} className="restriction-chip">
              <input
                type="checkbox"
                checked={choix.has(key)}
                onChange={() => basculer(key)}
              />
              <span>{label(key)}</span>
            </label>
          ))}
        </div>

        {erreur && <p className="restriction-modal-erreur">{erreur}</p>}

        <footer className="restriction-modal-footer">
          <span className="restriction-modal-compte">
            {choix.size === 0
              ? "Aucune restriction"
              : `${choix.size} sélectionnée${choix.size > 1 ? "s" : ""}`}
          </span>
          <div className="restriction-modal-actions">
            <button type="button" className="restriction-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="restriction-btn restriction-btn-primary">
              Enregistrer
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
