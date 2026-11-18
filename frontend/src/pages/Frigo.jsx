import { useState, useEffect } from "react";
import FoodCard from "../components/FoodCard";
import FoodModal from "../components/FoodModal";
import "./Frigo.css";

export default function Frigo() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    // TODO: charger les aliments du frigo avec setFoods (réutiliser les fonctions de Foods)
  }, []);

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
            <FoodCard key={food.id} food={food} onSelect={setSelectedFood} />
          ))}
        </div>
      )}

      {selectedFood && (
        <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </main>
  );
}
