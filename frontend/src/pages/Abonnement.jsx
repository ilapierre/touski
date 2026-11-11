import { useState } from 'react'
import { useNavigate } from 'react-router'
import "./Abonnement.css"

export default function Abonnement() {
    const [selectedPlan, setSelectedPlan] = useState('')
    const [showCheckout, setShowCheckout] = useState(false)
    const [cardNumber, setCardNumber] = useState('')
    const [expired, setExpired] = useState('')
    const [csv, setCSV] = useState('')

    const navigate = useNavigate()
    const isLoggedIn = !!localStorage.getItem("token")

    const handleIaAction = () => {
        if(!isLoggedIn) {
            navigate('/connexion')
        } else {
            setShowCheckout(true)
        }
    }

    const handleSubscribeSubmit = (e) => {
        e.preventDefault()
        setShowCheckout(false)
    }

    return (
        <div className="abonnement-container">
            <div className="header">
                <h1> Abonnement </h1>
                <h4> Abonnez-vous pour avoir accès à l'IA</h4>
                <p> Utilisez l'IA pour vous créez des recettes idéales à votre goûts.</p>
            </div>

            <div className="plans">
                <div className={`type-plan ${selectedPlan === 'gratuit' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('gratuit')}>
                    <div>
                        <h3>Gratuit</h3>
                        <p className="plan-prix">$0 par mois</p>
                        <ul className="plan-liste">
                            <li>Gestion du réfrigérateur</li>
                            <li>Recettes de base</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="plans">
                <div className={`type-plan ${selectedPlan === 'ia' ? 'active' : ''}`}
                    onClick={() => {
                        setSelectedPlan('ia') 
                        handleIaAction()}}
                >
                    <div>
                        <h3>IA</h3>
                        <p className="plan-txt"> L'IA pourra t'assister dans la création d'une nouvelle recette. </p>
                        {/* À CHANGER LE PRIX */}
                        <p className="plan-prix">$50 par mois</p>
                        <ul className="plan-liste">
                            <li>Gestion du réfrigérateur</li>
                            <li>Recettes de base</li>
                            <li>IA</li>
                        </ul>
                        <p className="plan-passage">
                            {isLoggedIn ? "Acheter maintenant" : "Connectez-vous ou inscrivez-vous pour avoir ce plan."}
                        </p>
                    </div>
                </div>
            </div>

            { showCheckout && (
                <div>
                    <form onSubmit={handleSubscribeSubmit}>
                        <h2> Achat </h2>
                        <h4> Plan IA - Rappel</h4>
                        <ul>
                            <li>Gestion du réfrigérateur</li>
                            <li>Recettes de base</li>
                            <li>IA</li>
                        </ul>

                        <label htmlFor="card"> Numéro de carte</label>
                        <input
                            id = "card"
                            type = "text"
                            placeholder = "1111 2222 3333 4444"
                            value = {cardNumber}
                            onChange = {(e) => setCardNumber(e.target.value)}
                            required
                        />

                        <div>
                            <div>
                                <label htmlFor="expiry"> Expiration </label>
                                <input
                                    id = "expiry"
                                    type = "text"
                                    placeholder = "MM/AA"
                                    value = {expired}
                                    onChange = {(e) => setExpired(e.target.value)}
                                    required
                                />
                            </div> 
                            <div>
                                <label htmlFor="csv"> CSV </label>
                                <input
                                    id = "csv"
                                    type = "text"
                                    placeholder = "123"
                                    value = {setCSV}
                                    onChange = {(e) => setCSV(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <button type="button"
                                    className="login-button"
                                    onClick={() => setShowCheckout(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}