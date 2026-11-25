import { useState, useEffect } from "react";
import FoodCard from "../components/FoodCard";
import FoodModal from "../components/FoodModal";
import "./Frigo.css";

export default function Frigo() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    async function chargerFrigo() {
      const res = await fetch("/api/frigo/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) setFoods(await res.json());
    }
    chargerFrigo();
  }, []);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  async function changerQuantite(food, delta) {
    const quantity = food.frigo_quantity + delta;
    if (quantity < 1) return;

    const res = await fetch(`/api/frigo/${food.frigo_id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      setFoods((prev) =>
        prev.map((f) =>
          f.frigo_id === food.frigo_id ? { ...f, frigo_quantity: quantity } : f,
        ),
      );
    }
  }

  async function supprimer(food) {
    if (!window.confirm(`Retirer « ${food.name} » du frigo ?`)) return;

    const res = await fetch(`/api/frigo/${food.frigo_id}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      setFoods((prev) => prev.filter((f) => f.frigo_id !== food.frigo_id));
    }
  }

  const foodsFiltres = foods.filter((f) =>
    f.name?.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <main className="frigo">
      <div className="frigo-header">
        <h1>Mon Frigo</h1>
        <input
          type="search"
          placeholder="Rechercher un aliment..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </div>

      {foodsFiltres.length === 0 ? (
        <p className="frigo-vide">
          {foods.length === 0
            ? "Ton frigo est vide !"
            : "Aucun aliment trouvé."}
        </p>
      ) : (
        <div className="frigo-grid">
          {foodsFiltres.map((food) => (
            <div key={food.frigo_id} className="frigo-item">
              <FoodCard food={food} onSelect={setSelectedFood} />

              <div className="frigo-actions">
                <div className="frigo-quantite">
                  <span>Quantité</span>
                  <div className="stepper">
                    <button
                      type="button"
                      onClick={() => changerQuantite(food, -1)}
                      disabled={food.frigo_quantity <= 1}
                      aria-label="Diminuer la quantité"
                    >
                      −
                    </button>
                    <span className="stepper-valeur">
                      {food.frigo_quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changerQuantite(food, 1)}
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="frigo-supprimer"
                  onClick={() => supprimer(food)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFood && (
        <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </main>
  );
}
