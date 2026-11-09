import { useState } from 'react'
import './RecipeCard.css'

function RecipeImage({ recipe }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="recipe-image">
      {recipe.image_url && !failed ? (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{recipe.name?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

function RecipeCard({ recipe, onSelect }) {
  return (
    <article className="recipe-card">
      <RecipeImage recipe={recipe} />
      <div className="recipe-body">
        <div className="recipe-header">
          <h3 title={recipe.name}>
            <button type="button" className="recipe-open" onClick={() => onSelect(recipe)}>
              {recipe.name}
            </button>
          </h3>
          {recipe.is_ai && <span className="ai-badge">IA</span>}
        </div>
        <p className="recipe-source">{recipe.source}</p>
      </div>
    </article>
  )
}

export default RecipeCard
