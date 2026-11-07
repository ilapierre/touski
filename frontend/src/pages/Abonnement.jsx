export default function Abonnement() {
    return (
        <div className="abonnement=container">
            <div className="header">
                <h1> Abonnement </h1>
                <h4> Abonnez-vous pour avoir accès à l'IA</h4>
                <p> Utilisez l'IA pour vous créez des recettes idéales à votre goûts.</p>
            </div>

            <div className="plans">
                <div className="card-content">
                    <h3>Gratuit</h3>
                    <p>$0 par mois</p>
                    <ul className="plan-liste">
                        <li>Gestion du réfrigérateur</li>
                        <li>Recettes de base</li>
                    </ul>
                </div>
            </div>

            <div className="plans">
                <div className="card-content">
                    <h3>IA</h3>
                    {/* À CHANGER LE PRIX */}
                    <p>$50 par mois</p>
                    <ul className="plan-liste">
                        <li>Gestion du réfrigérateur</li>
                        <li>Recettes de base</li>
                        <li>IA</li>
                    </ul>
                </div>
            </div>
        </div>
        
    )
}