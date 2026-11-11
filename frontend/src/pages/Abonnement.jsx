import { useState } from 'react'
import "./Abonnement.css"
import { useTranslation } from "react-i18next";

export default function Abonnement() {
    const [selectedPlan, setSelectedPlan] = useState('null')
    const { t } = useTranslation();

    return (
        <div className="abonnement-container">
            <div className="header">
                <h2> {t('abonnement.titre')} </h2>
                <h4> {t('abonnement.soust') }</h4>
                <p> {t('abonnement.txt')} </p>
            </div>

            <div className="plans">
                <div className={`type-plan ${selectedPlan === 'gratuit' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('gratuit')}>
                    <div>
                        <h3>{t('abonnement.freet')}</h3>
                        <p>$0{t('abonnement.prix')}</p>
                        <ul className="plan-liste">
                            <li>{t('abonnement.li1')}</li>
                            <li>{t('abonnement.li2')}</li><div/>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="plans">
                <div className={`type-plan ${selectedPlan === 'ia' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('ia')}>
                    <div>
                        <h3>{t('abonnement.ia')}</h3>
                        {/* À CHANGER LE PRIX */}
                        <p>$50{t('abonnement.prix')}</p>
                        <ul className="plan-liste">
                            <li>{t('abonnement.li1')}</li>
                            <li>{t('abonnement.li2')}</li>
                            <li>{t('abonnement.ia')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}