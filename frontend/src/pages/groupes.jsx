import { useState, useEffect } from "react";
import "./groupes.css";

export default function Groupes({ groupeId = 1, isOwner = true }) {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [addError, setAddError] = useState("");

  const peutGererLesRoles = isOwner;

  useEffect(() => {
    const loadMembres = async () => {
      try {
        const res = await fetch(`/api/groupes/${groupeId}/membres`);
        if (!res.ok) throw new Error("Erreur lors du chargement des membres.");
        const data = await res.json();
        setMembres(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMembres();
  }, [groupeId]);

  const refreshMembres = async () => {
    try {
      const res = await fetch(`/api/groupes/${groupeId}/membres`);
      if (res.ok) {
        const data = await res.json();
        setMembres(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `/api/groupes/${groupeId}/membres/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!response.ok) throw new Error("Échec de la mise à jour du rôle.");

      setMembres((prevMembres) =>
        prevMembres.map((membre) =>
          membre.id === userId ? { ...membre, role: newRole } : membre,
        ),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError("");

    if (!emailInput.trim()) return;

    try {
      const response = await fetch(`/api/groupes/${groupeId}/membres`, {
        method: "POST",
        headers: { "Content-Type": "application/json " },
        body: JSON.stringify({ email: emailInput.trim(), role: "standard" }),
      });

      if (!response.ok) {
        const errData = await response.json();

        let errorMessage = "Erreur de l'ajout du membre.";
        if (typeof errData.detail === "string") {
          errorMessage = errData.detail;
        } else if (Array.isArray(errData.detail)) {
          errorMessage = errData.detail.map((err) => err.msg).join(", ");
        }

        throw new Error(errorMessage);
      }

      await refreshMembres();
      setEmailInput("");
      setShowAdd(false);
    } catch (err) {
      setAddError(err.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const response = await fetch(
        `/api/groupes/${groupeId}/membres/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Échec de la suppression du membre.");

      await refreshMembres();
    } catch (err) {
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
            {peutGererLesRoles && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {membres &&
            membres.filter(Boolean).map((membre) => (
              <tr key={membre.id}>
                <td className="g-user">
                  {membre.email || `Utilisateur #${membre.id}`}
                </td>
                <td>
                  {peutGererLesRoles ? (
                    <select
                      className="g-select"
                      value={
                        membre.role
                          ? typeof membre.role === "string"
                            ? membre.role
                            : membre.role.value || "standart"
                          : "standart"
                      }
                      onChange={(e) =>
                        handleRoleChange(membre.id, e.target.value)
                      }
                    >
                      <option value="owner">Propriétaire</option>
                      <option value="privileged">Privilégie</option>
                      <option value="standart">Standard</option>
                    </select>
                  ) : (
                    <span>{membre.role || "standart"}</span>
                  )}
                </td>
                {peutGererLesRoles && (
                  <td>
                    <button
                      className="g-btn g-btn-dlt"
                      onClick={() => handleRemoveMember(membre.id)}
                    >
                      Retirer
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {peutGererLesRoles && (
        <div className="g-admin-actions">
          {!showAdd ? (
            <button
              className="g-btn g-btn-add"
              onClick={() => setShowAdd(true)}
            >
              Inviter un membre
            </button>
          ) : (
            <form onSubmit={handleAddMember} className="g-add-form">
              <input
                type="email"
                placeholder="Entrez le courriel de l'invité"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="g-input"
                required
              />
              <div className="g-form-buttons">
                <button type="submit" className="g-btn g-btn-confirm">
                  Ajouter
                </button>
                <button
                  type="button"
                  className="g-btn g-btn-cancel"
                  onClick={() => {
                    setShowAdd(false);
                    setAddError("");
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
          {addError && <div className="g-status g-error">{addError}</div>}
        </div>
      )}
    </div>
  );
}
