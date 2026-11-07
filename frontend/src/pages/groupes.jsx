import { useState, useEffect } from 'react';
import './groupes.css';
import { useTranslation } from "react-i18next";

const BACKEND_URL = "/api";

export default function Groupes({ groupeId = 1, isOwner = true}) {
    const [membres, setMembres] = useState([]);
    const [loading, setLoading] = useState(true);
    const[error, setError] = useState('');

    const peutGererLesRoles = isOwner;

     const { t } = useTranslation();

    useEffect(() => {
        fetch(`${BACKEND_URL}/groupes/${groupeId}/membres`)
            .then((res) => {
                if(!res.ok) throw new Error(t('groupes.errCharge'));
                return res.json();
            })
            .then((data) => {
                setMembres(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [groupeId]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`${BACKEND_URL}/groupes/${groupeId}/membres/${userId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole}),
            });

            if (!response.ok) throw new Error(t('groupes.errMAJ'));
            
            setMembres((prevMembres) =>
                prevMembres.map((membre) =>
                    membre.id === userId ? { ...membre, role: newRole} : membre
                )
            );
        } catch(err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="g-status">{t('groupes.charge')}</div>;
    if (error) return <div className="g-status g-error">{error}</div>;

    return (
        <div className="g-container">
            <h2>{t('groupes.titre')} {groupeId} </h2>
            <table className="g-table">
                <thead>
                    <tr>
                        <th>{t('groupes.membres')}</th>
                        <th>{t('groupes.role')}</th>
                    </tr>
                </thead>
                <tbody>
                    {membres.map((membre) => (
                        <tr key={membre.id}>
                            <td className="g-user">{t('groupes.membre')}</td>
                            <td>
                                {peutGererLesRoles ? (
                                    <select
                                        className="g-select"
                                        value={membre.role || 'standart'}
                                        onChange={(e) => handleRoleChange(membre.id, e.target.value)}
                                    >
                                        <option value="owner">{t('groupes.prop')}</option>
                                        <option value="privileged">{t('groupes.priv')}</option>
                                        <option value="standart">{t('groupes.stan')}</option>
                                    </select>
                                    ) : (
                                        <span>{membre.role || 'standart'}</span>
                                    )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {peutGererLesRoles && (
                <div className="g-admin-actions">
                    <button className="g-btn g-btn-add">{t('groupes.inv')}</button>
                    <button className="g-btn g-btn-dlt">{t('groupes.re')}</button>
                </div>
            )}
        </div>
    )
}