import { useState } from 'react'
import "./Abonnement.css"

export default function Abonnement() {
    const [selectedPlan, setSelectedPlan] = useState('')

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
                    onClick={() => setSelectedPlan('ia')}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}