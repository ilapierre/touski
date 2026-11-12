import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import "./Abonnement.css"

export default function Abonnement() {
    const [selectedPlan, setSelectedPlan] = useState('')
    const [showCheckout, setShowCheckout] = useState(false)
    const [subscription, setSubscription] = useState({premium : false})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [cardNumber, setCardNumber] = useState('')
    const [expired, setExpired] = useState('')
    const [cvv, setCVV] = useState('')

    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const isLoggedIn = !!token
    
    useEffect(() => {
        if(!isLoggedIn) {
            return
        }

        fetch('http://127.0.0.1:8080/abonnements/moi', {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setSubscription(data)
            if (data.premium) {
                setSelectedPlan('ia')
            } else {
                setSelectedPlan('gratuit')
            }
            setLoading(false)
        })
        .catch((err) => {
            setError(err.message)
            setLoading(false)
        })
    }, [isLoggedIn, token])

    const handleIaAction = () => {
        if(!isLoggedIn) {
            navigate('/connexion')
        } else if(subscription.premium){
            setShowCheckout(true)
        }
    }

    const handleSubscribeSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch('http://127.0.0.1:8080/abonnements/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })

        const data = await response.json()
        setSubscription({ premium: false, ends_at: data.ends_at, status: 'active'})
        setSelectedPlan('gratuit')
    }

    const handleCancelSubscription = async () => {
         await fetch('http://127.0.0.1:8080/abonnements/moi', {
            method : 'DELETE',
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })

        setSubscription({premium: false})
        setSelectedPlan('gratuit')
    }

    if (loading) {
        return (
            <main className="abon">
                <p>Chargement...</p>
            </main>
        );
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
                                <label htmlFor="cvv"> CVV </label>
                                <input
                                    id = "cvv"
                                    type = "text"
                                    placeholder = "123"
                                    value = {cvv}
                                    onChange = {(e) => setCVV(e.target.value)}
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
                    <form onSubmit={handleCancelSubscription}>
                        <div>
                            <h2> Annuler votre plan? </h2>
                            <h4> êtes-vous sûre de vouloir annuler votre plan? </h4>
                            <p>
                                Merci d'avoir utiliser le plan d'IA. On est toujours là si vous changez d'avis.
                            </p>
                        </div>
                        
                        <div className="plan-bouton">
                           <button className="btnAnn">
                                Annuler le plan
                            </button> 

                            <Link to="/profile"
                                className="btnAvis">
                                Changer d'avis?
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}