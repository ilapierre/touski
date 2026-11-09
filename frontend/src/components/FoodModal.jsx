import { useEffect, useRef, useState } from 'react'
import './FoodModal.css'

// Libellés des allergènes (tags OFF normalisés, sans préfixe de langue)
const ALLERGENS = {
  gluten: 'Gluten',
  milk: 'Lait',
  eggs: 'Œufs',
  nuts: 'Fruits à coque',
  peanuts: 'Arachides',
  soybeans: 'Soja',
  fish: 'Poisson',
  crustaceans: 'Crustacés',
  molluscs: 'Mollusques',
  celery: 'Céleri',
  mustard: 'Moutarde',
  'sesame-seeds': 'Sésame',
  'sulphur-dioxide-and-sulphites': 'Sulfites',
  lupin: 'Lupin',
}

const allergenLabel = (tag) => ALLERGENS[tag] ?? tag.replaceAll('-', ' ')

const details = [
  { key: 'quantity', label: 'Quantité' },
  { key: 'serving_size', label: 'Portion' },
  { key: 'origin', label: 'Origine' },
  { key: 'source', label: 'Source', link: true },
]

// "https://world.openfoodfacts.org/product/123" -> "world.openfoodfacts.org"
const hostname = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const macros = [
  { key: 'proteins', label: 'Protéines' },
  { key: 'carbohydrates', label: 'Glucides' },
  { key: 'fat', label: 'Lipides' },
]

function FoodModal({ food, onClose }) {
  const dialogRef = useRef(null)
  const [failed, setFailed] = useState(false)

  const shownDetails = details.filter(({ key }) => food[key])
  const hasNutrition = food.kcal != null || macros.some(({ key }) => food[key] != null)
  const allergens = food.allergens ?? []

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  // Clic sur l'arrière-plan (le <dialog> lui-même) = fermeture
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="food-modal"
      aria-labelledby="food-modal-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <button type="button" className="food-modal-close" onClick={onClose} aria-label="Fermer">
        ×
      </button>

      <div className="food-modal-image">
        {food.image_url && !failed ? (
          <img src={food.image_url} alt={food.name} onError={() => setFailed(true)} />
        ) : (
          <span aria-hidden="true">{food.name?.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="food-modal-body">
        <div className="food-modal-header">
          <div>
            <h2 id="food-modal-title">{food.name}</h2>
            {food.brand && <p className="food-modal-brand">{food.brand}</p>}
          </div>
          {food.nutriscore && (
            <span
              className={`nutriscore nutriscore-${food.nutriscore.toLowerCase()}`}
              title={`Nutri-Score ${food.nutriscore}`}
            >
              <small>Nutri-Score</small>
              {food.nutriscore}
            </span>
          )}
        </div>

        {food.description && <p className="food-modal-description">{food.description}</p>}

        {shownDetails.length > 0 && (
          <dl className="food-modal-details">
            {shownDetails.map(({ key, label, link }) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>
                  {link && /^https?:\/\//.test(food[key]) ? (
                    <a href={food[key]} target="_blank" rel="noreferrer">
                      {hostname(food[key])}
                    </a>
                  ) : (
                    food[key]
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {hasNutrition && (
          <section className="food-modal-section">
            <h3>Valeurs nutritionnelles{food.per && ` pour ${food.per}`}</h3>
            <dl className="food-modal-macros">
              <div>
                <dt>Calories</dt>
                <dd>{food.kcal != null ? `${food.kcal} kcal` : '—'}</dd>
              </div>
              {macros.map(({ key, label }) => (
                <div key={key}>
                  <dt>{label}</dt>
                  <dd>{food[key] != null ? `${food[key]} g` : '—'}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {allergens.length > 0 && (
          <section className="food-modal-section">
            <h3>Allergènes</h3>
            <ul className="food-modal-allergens">
              {allergens.map((tag) => (
                <li key={tag}>{allergenLabel(tag)}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </dialog>
  )
}

export default FoodModal
