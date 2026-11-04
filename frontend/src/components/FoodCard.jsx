import { useState } from 'react'
import './FoodCard.css'

const macros = [
  { key: 'proteins', label: 'Protéines' },
  { key: 'carbohydrates', label: 'Glucides' },
  { key: 'fat', label: 'Lipides' },
]

function FoodImage({ food }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="food-image">
      {food.image_url && !failed ? (
        <img
          src={food.image_url}
          alt={food.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{food.name?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

function FoodCard({ food }) {
  return (
    <article className="food-card">
      <FoodImage food={food} />
      <div className="food-body">
        <div className="food-header">
          <h3 title={food.name}>{food.name}</h3>
          {food.kcal != null && <span className="kcal-badge">{food.kcal} kcal</span>}
        </div>
        <p className="food-per">{food.per && `pour ${food.per}`}</p>
        <dl className="macros">
          {macros.map(({ key, label }) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>{food[key] != null ? `${food[key]} g` : '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

export default FoodCard
