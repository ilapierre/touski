import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Abonnement.css";

export default function Abonnement() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expired, setExpired] = useState("");
  const [cvv, setCVV] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [membres, setMembres] = useState([]);
  const groupeIdAct = localStorage.getItem("activeGroupId");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [loading, setLoading] = useState(isLoggedIn);
  const [subscription, setSubscription] = useState({ premium: false });

  const getRoleString = (role) =>
    (typeof role === "string" ? role : role?.value || "").toLowerCase();

  const currentUserRole = getRoleString(
    membres.find((m) => m.email === currentUserEmail)?.role
  );
  const isOwner = ["owner", "propriétaire"].includes(currentUserRole);
  useEffect(() => {

    if (!isLoggedIn) {
      return;
    }

    const fetchData = async () => {
      try {
        const subRes = await fetch("/api/abonnements/moi", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (subRes.ok) {
          const data = await subRes.json();
          setSubscription({ ...data, premium: data.premium === true });
          setSelectedPlan(data.premium ? "ia" : "gratuit");
        }

        const userRes = await fetch("/api/auth/moi", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUserEmail(userData.email);
        }

        if (groupeIdAct) {
          const membresRes = await fetch(`/api/groupes/${groupeIdAct}/membres`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (membresRes.ok) {
            const membresData = await membresRes.json();
            setMembres(membresData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, token, groupeIdAct]);

  const handleIaAction = () => {
    setErrorMsg("");
    if (!isLoggedIn) {
      navigate("/connexion");
    } else if (!isOwner) {
      setErrorMsg("Seul le propriétaire du groupe peut gérer l'abonnement.")
    } else if (!subscription.premium) {
      setShowCheckout(true);
    }
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/abonnements/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setSubscription({
        premium: true,
        ends_at: data.ends_at,
        status: "active",
      });
      setSelectedPlan("ia");

      setShowCheckout(false);
      setCardNumber("");
      setExpired("");
      setCVV("");
    } catch {
      alert("Une erreur est survenue lors du paiement.");
    }
  };

  const handleCancelSubscription = async () => {
    await fetch("/api/abonnements/moi", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSubscription({ premium: false });
    setSelectedPlan("gratuit");
    setShowCancelModal(false);
  };

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
        <p>
          Utilisez l'IA pour vous créez des recettes idéales à votre goûts, où{" "}
          <strong>tous les membres de votre groupe</strong> auront accès.
        </p>
      </div>

      {errorMsg && (
        <div className="abon-error">
            {errorMsg}
        </div>
      )}

      <div className="plans">
        <div
          className={`type-plan ${selectedPlan === "gratuit" ? "active" : ""}`}
          onClick={() => setSelectedPlan("gratuit")}
        >
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
        <div
          className={`type-plan ${selectedPlan === "ia" ? "active" : ""}`}
          onClick={() => {
            setSelectedPlan("ia");
            handleIaAction();
          }}
        >
          <div>
            <h3>IA par Groupe</h3>
            <p className="plan-txt">
              {" "}
              Accès à l'assistance IA pour tout votre groupe.{" "}
            </p>
            <p className="plan-prix">$22 par mois</p>
            <ul className="plan-liste">
              <li>Gestion du réfrigérateur</li>
              <li>Recettes de base</li>
              <li>IA</li>
            </ul>
            <div className="plan-passage">
              {!isLoggedIn ? (
                "Connectez-vous ou inscrivez-vous pour abonner votre groupe."
              ) : !isOwner ? (
                <span className="plan-restreint"> Réservé au propriétaire du groupe</span>
              ) : subscription.premium ? (
                <div className="active-plan-info">
                  <span className="plan-actif">Plan Actif</span>
                  {subscription.ends_at && (
                    <p className="plan-expirer">
                      Expire le :{" "}
                      {new Date(subscription.ends_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                "Acheter maintenant"
              )}
            </div>
          </div>
        </div>
      </div>

      {subscription.premium && isLoggedIn && isOwner &&(
        <div className="btn-cancel-abon-container">
          <button
            type="button"
            className="btn-cancel-abon"
            onClick={() => setShowCancelModal(true)}
          >
            Annuler l'abonnement
          </button>
        </div>
      )}

      {showCancelModal && (
        <div className="checkout-container">
          <div className="checkout-form">
            <h2>Confirmation d'annulation</h2>
            <p>Êtes-vous sûr de vouloir annuler votre abonnement?</p>
          
          <div className="btn-action">
            <button
              type="button"
              className="btn-submit"
              onClick={handleCancelSubscription}
            >
              Oui, annuler
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowCancelModal(false)}
            >
              Retour
            </button>
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="checkout-container">
          <form onSubmit={handleSubscribeSubmit} className="checkout-form">
            <h2> Achat </h2>
            <h4> Plan IA </h4>
            <ul className="checkout-feature">
              <li>Gestion du réfrigérateur</li>
              <li>Recettes de base</li>
              <li>IA</li>
            </ul>

            <div className="form-group">
              <label htmlFor="card"> Numéro de carte *</label>
              <input
                id="card"
                type="text"
                placeholder="1111 2222 3333 4444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry"> Expiration *</label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/AA"
                  value={expired}
                  onChange={(e) => setExpired(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv"> CVV *</label>
                <input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCVV(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="btn-action">
              <button type="submit" className="btn-submit">
                Acheter
              </button>
              <button
                type="button"
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
  );
}
