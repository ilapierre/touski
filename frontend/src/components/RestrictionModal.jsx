import { useEffect, useState } from "react";
import "./RestrictionModal.css";

export default function RestrictionModal({ onClose }) {
  const foods = [
    { id: 1, name: "Arachides" },
    { id: 2, name: "Lait" },
  ];
  const [foodId, setFoodId] = useState("");
  const [note, setNote] = useState("");
  const [erreur, setErreur] = useState("");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Ajouter une restriction</h3>
        <form>
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
