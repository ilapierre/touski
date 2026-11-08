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

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <RecipeImage recipe={recipe} />
      <div className="recipe-header">
        <h3 title={recipe.name}>{recipe.name}</h3>
        {recipe.is_ai && <span className="ai-badge">IA</span>}
      </div>
      {recipe.source && <p className="recipe-source">{recipe.source}</p>}
    </article>
  )
}

export default RecipeCard
