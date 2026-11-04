import { useState, useEffect } from 'react';
import './groupes.css';

const BACKEND_URL = "http://localhost:5000/";

export default function Groupes({ groupeId = 1, isOwner = true}) {
    const [membres, setMembres] = useState([]);
    const [loading, setLoading] = useState(true);
    const[error, setError] = useState('');

    const peutGererLesRoles = isOwner;

    useEffect(() => {
        fetch(`${BACKEND_URL}/groupes/${groupeId}/membres`)
            .then((res) => {
                if(!res.ok) throw new Error("Erreur lors du chargement des membres");
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
            const response = await fetch(`${BACKEND_URL}/groupes/${groupeId}/membres`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole}),
            });

            if (!response.ok) throw new Error("Échec de la mise à jour du rôle.");
            
            setMembres((prevMembres) =>
                prevMembres.map((membre) =>
                    membre.id === userId ? { ...membre, role: newRole} : membre
                )
            );
        } catch(err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="g-status">Chargement...</div>;
    if (error) return <div className="g-status g-error">{error}</div>;

    return (
        <div className="g-container">
            <h2>Gestion du groupe {groupeId} </h2>
            <table className="g-table">
                <thead>
                    <tr>
                        <th>Membres</th>
                        <th>Rôle</th>
                    </tr>
                </thead>
                <tbody>
                    {membres.map((membre) => (
                        <tr key={membre.id}>
                            <td className="g-user">Membre</td>
                            <td>
                                {peutGererLesRoles ? (
                                    <select
                                        className="g-select"
                                        value={membre.role || 'standart'}
                                        onChange={(e) => handleRoleChange(membre.id, e.target.value)}
                                    >
                                        <option value="owner">Propriétaire</option>
                                        <option value="privileged">Privilégie</option>
                                        <option value="standart">Standart</option>
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
                    <button className="g-btn g-btn-add">Inviter un membre</button>
                    <button className="g-btn g-btn-dlt">Retirer un membre</button>
                </div>
            )}
        </div>
    )
}