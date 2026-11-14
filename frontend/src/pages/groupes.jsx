import { useState, useEffect } from "react";
import "./groupes.css";

export default function Groupes({ groupeId = 1 }) {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nnameInput, setNNameInput] = useState("");
  const [addError, setAddError] = useState("");

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [createGroupError, setCreateGroupError] = useState("");

  const [hasActiveGroup, setHasActiveGroup] = useState(() => {
    return !!localStorage.getItem("activeGroupId");
  });

  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const getRoleString = (role) =>
    (typeof role === "string" ? role : role?.value || "").toLowerCase();
  const currentUserRole = getRoleString(
    membres.find((m) => m.email === currentUserEmail)?.role,
  );
  const peutGererLesRoles = ["owner", "propriétaire"].includes(currentUserRole);

  const [groupeIdAct, setGroupeIdAct] = useState(() => {
    const savedId = localStorage.getItem("activeGroupId");
    return savedId ? parseInt(savedId, 10) : groupeId;
  });
  const [groupeNomAct, setGroupeNomAct] = useState("");

  useEffect(() => {
    if (!groupeIdAct) return;
    localStorage.setItem("activeGroupId", groupeIdAct);

    const loadMembres = async () => {
      setLoading(true);
      try {
        setError("");

        const token = localStorage.getItem("token");
        if (!token) return;

        const membresRes = await fetch(`/api/groupes/${groupeIdAct}/membres`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (
          membresRes.status === 401 ||
          membresRes.status === 403 ||
          membresRes.status === 404
        ) {
          localStorage.removeItem("activeGroupId");
          setGroupeIdAct(null);
          setMembres([]);
          setLoading(false);
          return;
        }

        if (!membresRes.ok)
          throw new Error("Erreur lors du chargement des membres.");
        const data = await membresRes.json();
        setMembres(data);

        const userRes = await fetch(`/api/auth/moi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUserEmail(userData.email);
        }

        const groupRes = await fetch(`/api/groupes/${groupeIdAct}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (groupRes.ok) {
          const groupData = await groupRes.json();
          if (groupData.name) {
            setGroupeNomAct(groupData.name);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMembres();
  }, [groupeIdAct]);

  const refreshMembres = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/groupes/${groupeIdAct}/membres`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/groupes/${groupeIdAct}/membres/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/groupes/${groupeIdAct}/membres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json ",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: emailInput.trim(),
          role: "standard",
          nickname: nnameInput.trim() || null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();

        let errorMessage = "Erreur de l'ajout du membre.";
        if (typeof errData.detail === "string") {
          errorMessage = errData.detail;
        } else if (Array.isArray(errData.detail)) {
          errorMessage = errData.detail.map((err) => err.msg).join(", ");
        } else if (errData.erreur) {
          errorMessage = errData.erreur;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.membre) {
        setMembres((prevMembres) => [...prevMembres, data.membre]);
      }

      await refreshMembres();
      setEmailInput("");
      setNNameInput("");
      setShowAdd(false);
    } catch (err) {
      setAddError(err.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/groupes/${groupeIdAct}/membres/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Échec de la suppression du membre.");

      await refreshMembres();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setCreateGroupError("");

    if (!groupNameInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/groupes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupNameInput.trim() }),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        // Ignored
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.erreur ||
            `Erreur serveur (${response.status}): ${responseText || "Réponse vide"}`,
        );
      }

      if (data.id) {
        setGroupeIdAct(data.id);
        setGroupeNomAct(data.name || groupNameInput.trim());
        localStorage.setItem("activeGroupId", data.id);
        setHasActiveGroup(true);
      }

      setGroupNameInput("");
      setShowCreateGroup(false);
    } catch (err) {
      setCreateGroupError(err.message);
    }
  };

  if (loading) return <div className="g-status">Chargement...</div>;
  if (error) return <div className="g-status g-error">{error}</div>;

  if (!groupeIdAct || showCreateGroup) {
    return (
      <div className="g-container">
        <form onSubmit={handleCreateGroup} className="g-add-form">
          <h2>Créer un groupe</h2>
          <input
            type="text"
            placeholder="Nom du groupe"
            value={groupNameInput}
            onChange={(e) => setGroupNameInput(e.target.value)}
            className="g-input"
            required
          />
          <div className="g-form-buttons">
            <button type="submit" className="g-btn g-btn-confirm">
              Créer
            </button>
            {hasActiveGroup && (
              <button
                type="button"
                className="g-btn g-btn-cancel"
                onClick={() => {
                  setShowCreateGroup(false);
                  setCreateGroupError("");
                }}
              >
                Annuler
              </button>
            )}
          </div>
          {createGroupError && (
            <div className="g-status g-error">{createGroupError}</div>
          )}
        </form>
      </div>
    );
  }
  
  return (
    <div className="g-container">
          <h2>Gestion de {groupeNomAct} </h2>
          <table className="g-table">
            <thead>
              <tr>
                <th>Membres</th>
                <th>Surnom</th>
                <th>Rôle</th>
                {peutGererLesRoles && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {membres &&
                membres.filter(Boolean).map((membre) => {
                  const isCurrentUserOwner =
                    currentUserEmail && membre.email === currentUserEmail;
                  return (
                    <tr key={membre.id}>
                      <td className="g-user">
                        {membre.nickname ? (
                          <div>
                            <span>{membre.email}</span>
                          </div>
                        ) : (
                          membre.email || `Utilisateur #${membre.id}`
                        )}
                        {isCurrentUserOwner && " (Vous)"}
                      </td>
                      <td>
                        <span>{membre.nickname || "-"}</span>
                      </td>
                      <td>
                        {peutGererLesRoles && !isCurrentUserOwner ? (
                          <select
                            className="g-select"
                            value={
                              membre.role
                                ? typeof membre.role === "string"
                                  ? membre.role
                                  : membre.role.value || "standard"
                                : "standard"
                            }
                            onChange={(e) =>
                              handleRoleChange(membre.id, e.target.value)
                            }
                          >
                            <option value="owner">Propriétaire</option>
                            <option value="privileged">Privilégie</option>
                            <option value="standard">Standard</option>
                          </select>
                        ) : (
                          <span>{membre.role || "standard"}</span>
                        )}
                      </td>
                      {peutGererLesRoles && (
                        <td>
                          {!isCurrentUserOwner ? (
                            <button
                              className="g-btn g-btn-dlt"
                              onClick={() => handleRemoveMember(membre.id)}
                            >
                              Retirer
                            </button>
                          ) : (
                            <span className="g-owner">-</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
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
                  <input
                    type="text"
                    placeholder="Surnom"
                    value={nnameInput}
                    onChange={(e) => setNNameInput(e.target.value)}
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
