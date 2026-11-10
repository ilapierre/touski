import './AjoutAliment.css';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const FoodForm = () => {
    const { alimentId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => {
        if (alimentId) {
            const storedFoods = JSON.parse(localStorage.getItem("aliments")) || [];
            const foodToEdit = storedFoods.find((aliment) => aliment.id === alimentId);
            if (foodToEdit) { return foodToEdit };
        } return {
            nom: "",
            image_url: "",
            per: "",
            calories: "",
            gras: "",
            proteines: "",
            glucides: "",
            quantite: "",
        };
    });
    const [error, setError] = useState({});
    const setMessage = useState("");
    const setIsLoading = useState(false);

    useEffect(() => {
        if (alimentId) {
            document.title = `Modification : ${formData.nom}`
        } else {
            document.title = "Ajouter un aliment"
        }
    }, [alimentId, formData.nom]);

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
        setError(errs);
        setIsLoading(false);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setMessage("");
        setIsLoading(true);
        let storedFoods = JSON.parse(localStorage.getItem("aliments")) || [];
        if (alimentId) {
            storedFoods = storedFoods.map(aliment => (aliment.id === alimentId ? { ...formData } : aliment));
        } else {
            try {
                const res = await fetch('http://localhost:5173/api/aliments/', {
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
            } catch (error) {
                setError("Erreur lors de la connexion au serveur. Veuillez réessayer.")
            } finally {
                setIsLoading(false);
            }
        }

    };
    return (
        <div>
            <h2 className="title">{alimentId ? "Modifier l'aliment" : "Ajouter un aliment"}</h2>
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
export default FoodForm;

