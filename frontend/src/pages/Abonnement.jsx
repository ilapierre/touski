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

        fetch('/api/abonnements/moi', {
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
        } else if(!subscription.premium){
            setShowCheckout(true)
        }
    }

    const handleSubscribeSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch('/api/abonnements/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })

        const data = await response.json()
        setSubscription({ premium: true, ends_at: data.ends_at, status: 'active'})
        setSelectedPlan('ia')
        setShowCheckout(false)
    }

    const handleCancelSubscription = async () => {
         await fetch('/api/abonnements/moi', {
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
                <p> Utilisez l'IA pour vous créez des recettes idéales à votre goûts, où <strong>tous les membres de votre groupe</strong> auront accès.</p>
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
                        <h3>IA par Groupe</h3>
                        <p className="plan-txt"> Accès à l'assistance IA pour tout votre groupe. </p>
                        <p className="plan-prix">$22 par mois</p>
                        <ul className="plan-liste">
                            <li>Gestion du réfrigérateur</li>
                            <li>Recettes de base</li>
                            <li>IA</li>
                        </ul>
                        <p className="plan-passage">
                            {isLoggedIn ? (subscription.premium ? (
                                <span> Plan Actif </span>
                            ) : "Acheter maintenant" ) : "Connectez-vous ou inscrivez-vous pour abonner votre groupe. "}
                        </p>
                    </div>
                </div>
            </div>

            {subscription.premium && isLoggedIn && (
                <div>
                    <button
                    onClick={handleCancelSubscription}>
                        Annuler l'abonnement
                    </button>
                </div>
            )}

            { showCheckout && (
                <div className="checkout-container">
                    <form onSubmit={handleSubscribeSubmit} className="checkout-form">
                        <h2> Achat </h2>
                        <h4> Plan IA </h4>
                        <ul className="checkout-feature">
                            <li>Gestion du réfrigérateur</li>
                            <li>Recettes de base</li>
                            <li>IA</li>
                        </ul>

                        <div className='form-group'>
                            <label htmlFor="card"> Numéro de carte</label>
                            <input
                                id = "card"
                                type = "text"
                                placeholder = "1111 2222 3333 4444"
                                value = {cardNumber}
                                onChange = {(e) => setCardNumber(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className='form-row'>
                            <div className='form-group'>
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
                            <div className='form-group'>
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
                        </div>

                        <div className='btn-action'>
                            <button type="submit" className='btn-submit'>
                                Acheter
                            </button>
                            <button type="button"
                                className="btn-cancel"
                                onClick={() => setShowCheckout(false)}
                                >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}