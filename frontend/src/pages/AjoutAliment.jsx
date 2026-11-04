import './AjoutAliment.css';
import { useState } from "react";
import useParams from 'react-router-dom';

const AjoutAliment = () => {
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
            const res = await fetch('http://localhost:5000/aliments/' , {
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
            <h2 className="title">Ajouter un aliment</h2>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="control">
                    <label>Nom</label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />
                    {error.nom && <span className="error">{error.nom}</span>}
                </div>

                <div className="control">
                    <label>URL de l'image</label>
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                    />
                </div>

                <div className="control">
                    <label>Per</label>
                    <input
                        type="text"
                        name="per"
                        value={formData.per}
                        onChange={handleChange}
                    />
                </div>

                <div className="control">
                    <label>Calories</label>
                    <input
                        type="text"
                        name="calories"
                        value={formData.calories}
                        onChange={handleChange}
                    />
                    {error.calories && <span className="error">{error.calories}</span>}
                </div>

                <div className="control">
                    <label>Gras</label>
                    <input
                        type="text"
                        name="gras"
                        value={formData.gras}
                        onChange={handleChange}
                    />
                    {error.gras && <span className="error">{error.gras}</span>}
                </div>

                <div className="control">
                    <label>Protéines</label>
                    <input
                        type="text"
                        name="protéines"
                        value={formData.proteines}
                        onChange={handleChange}
                    />
                    {error.proteines && <span className="error">{error.proteines}</span>}
                </div>

                <div className="control">
                    <label>Glucides</label>
                    <input
                        type="text"
                        name="glucides"
                        value={formData.glucides}
                        onChange={handleChange}
                    />
                    {error.glucides && <span className="error">{error.glucides}</span>}
                </div>

                <div className="control">
                    <label>Quantité</label>
                    <input
                        type="text"
                        name="quantite"
                        value={formData.quantite}
                        onChange={handleChange}
                        required
                    />
                    {error.quantite && <span className="error">{error.quantite}</span>}
                </div>

                <div className="btn_actions">
                    <button type="submit" className="btn_submit">Enregistrer</button>
                    <button type="button" className="btn_cancel" onClick={() => navigate("/")}>Annuler</button>
                </div>
            </form>
        </div>
    );
};
export default AjoutAliment;

