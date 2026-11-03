import './AjoutAliment.css';
import { useState } from "react";
import useParams from 'react-router-dom';

const AjoutForm = () => {
    const { alimentId } = useParams();
    const [formData, setFormData] = useState({
        nom: "",
        image_url: "",
        per: "",
        calories: "",
        gras: "",
        proteines: "",
        glucides: "",
        quantite: "",
    });
    const [error, setError] = useState({});
    const [mesage, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'quantite' ? parseInt(value) || 0 : value,
        });
    };

    const validate = () => {
        let errs = {};
        if (!formData.nom.trim()) errs.nom = "Le nom est requis !";
        if (!formData.quantite || formData.quantite <= 0) errs.quantite = "Veuillez entrez une quantité valide !";
        if (formData.calories < 0) errs.calories = "Veuillez entrez un nombre de calories valide !";
        if (formData.gras < 0) errs.gras = "Veuillez entrez une quantité de gras valide !";
        if (formData.proteines < 0) errs.proteines = "Veuillez entrez une quantité de protéines valide !";
        if (formData.glucides < 0) errs.glucides = "Veuillez entrez une quantité de glucides valide !";
        setErrors(errs);
        setIsLoading(false);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setMessage("");
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/aliments/' /* À corriger */, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Aliment "${formData.nom}" ajouté avec succès !`)
            } else {
                setError(data.error || "Erreur ! L'aliment n'a pas pu être ajouté.");
            }
        } catch (err) {
            setError("Erreur lors de la connexion au serveur. Veuillez réessayer.")
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
            <h2>Ajouter un aliment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom</label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />
                    {error.nom && <span>{error.nom}</span>}
                </div>

                <div>
                    <label>URL de l'image</label>
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Per</label>
                    <input
                        type="text"
                        name="per"
                        value={formData.per}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Calories</label>
                    <input
                        type="text"
                        name="calories"
                        value={formData.calories}
                        onChange={handleChange}
                    />
                    {error.calories && <span>{error.calories}</span>}
                </div>

                <div>
                    <label>Gras</label>
                    <input
                        type="text"
                        name="gras"
                        value={formData.gras}
                        onChange={handleChange}
                    />
                    {error.gras && <span>{error.gras}</span>}
                </div>

                <div>
                    <label>Protéines</label>
                    <input
                        type="text"
                        name="protéines"
                        value={formData.proteines}
                        onChange={handleChange}
                    />
                    {error.proteines && <span>{error.proteines}</span>}
                </div>

                <div>
                    <label>Glucides</label>
                    <input
                        type="text"
                        name="glucides"
                        value={formData.glucides}
                        onChange={handleChange}
                    />
                    {error.glucides && <span>{error.glucides}</span>}
                </div>

                <div>
                    <label>Quantité</label>
                    <input
                        type="text"
                        name="quantite"
                        value={formData.quantite}
                        onChange={handleChange}
                        required
                    />
                    {error.quantite && <span>{error.quantite}</span>}
                </div>

                <div>
                    <button type="submit">Enregistrer</button>
                    <button type="button" onClick={() => navigate("/")}>Annuler</button>
                </div>
            </form>
        </div>
    );
};
export default AjoutAliment;

