import { useEffect, useState } from "react";
import "./RestrictionModal.css";

export default function RestrictionModal({ userId, onClose, onAdded }) {
  const [foods, setFoods] = useState([]);
  const [foodId, setFoodId] = useState("");
  const [note, setNote] = useState("");
  const [erreur, setErreur] = useState("");
  //adresse du backend
  const API_URL = "http://localhost:8000";

  // Charger la liste des aliments au montage du composant
  useEffect(() => {
    fetch(`${API_URL}/foods`) // adapte à ta route d'aliments
      .then((res) => res.json())
      .then(setFoods)
      .catch(() => setErreur("Impossible de charger les aliments"));
  }, []);

  // Soumettre le formulaire pour ajouter une restriction
  async function handleSubmit(e) {
    e.preventDefault();
    if (!foodId) return setErreur("Choisis un aliment");

    const res = await fetch(`${API_URL}/users/${userId}/allergies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ food_id: Number(foodId), note: note || null }),
    });

    if (!res.ok) return setErreur("Erreur lors de l'ajout");
    onAdded(await res.json());
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Ajouter une restriction</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Aliment
            <select value={foodId} onChange={(e) => setFoodId(e.target.value)}>
              <option value="">-- Choisir --</option>
              {foods.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Note (optionnel)
            <input
              type="text"
              maxLength={50}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {erreur && <p className="modal-erreur">{erreur}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}
