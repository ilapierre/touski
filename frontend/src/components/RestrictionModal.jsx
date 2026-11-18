import { useEffect, useState } from "react";
import "./RestrictionModal.css";

export default function RestrictionModal({ userId, onClose, onAdded }) {
  const [foodId, setFoodId] = useState("");
  const [erreur, setErreur] = useState("");
  //adresse du backend
  const API_URL = "http://localhost:8000";

  //faire un map d allergie possible manuellement

  const allergens = [
    { id: 1, name: "Arachides" },
    { id: 2, name: "Noix (amandes, noix de cajou, noisettes, etc ...)" },
    { id: 3, name: "Lait" },
    { id: 4, name: "Oeufs" },
    { id: 5, name: "Poissons" },
    { id: 6, name: "Crustacés et mollusques" },
    { id: 7, name: "Soya" },
    { id: 8, name: "Blé et triticale" },
    { id: 9, name: "Sésame" },
    { id: 10, name: "Moutarde" },
    { id: 11, name: "Céleri" },
    { id: 12, name: "Sulfites" },
    { id: 13, name: "Kiwi" },
  ];

  const intolerances = [
    { id: 1, name: "Gluten" },
    { id: 2, name: "Lactose" },
    { id: 3, name: "Fructose" },
    { id: 4, name: "Histamine" },
    { id: 5, name: "Caféine" },
    { id: 6, name: "Aspartame" },
  ];

  const autresRestrictions = [
    { id: 1, name: "Végétarien" },
    { id: 2, name: "Vegan" },
    { id: 3, name: "Pescétarien" },
    { id: 4, name: "Flexitarien" },
    { id: 5, name: "Halal" },
    { id: 6, name: "Casher" },
  ];

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
        <h3>Ajouter une ou plusieurs restrictions</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Allergies
            <select value={foodId} onChange={(e) => setFoodId(e.target.value)}>
              <option value="">-- Choisir --</option>
              {allergens.map((allergen) => (
                <option key={allergen.id} value={allergen.id}>
                  {allergen.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Intolérances
            <select value={foodId} onChange={(e) => setFoodId(e.target.value)}>
              <option value="">-- Choisir --</option>
              {intolerances.map((intolerance) => (
                <option key={intolerance.id} value={intolerance.id}>
                  {intolerance.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Autres restrictions
            <select value={foodId} onChange={(e) => setFoodId(e.target.value)}>
              <option value="">-- Choisir --</option>
              {autresRestrictions.map((restriction) => (
                <option key={restriction.id} value={restriction.id}>
                  {restriction.name}
                </option>
              ))}
            </select>
          </label>

          {erreur && <p className="modal-erreur">{erreur}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" onClick={handleSubmit}>
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
