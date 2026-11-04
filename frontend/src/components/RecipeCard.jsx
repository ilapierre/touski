import './RecipeCard.css'

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <div className="recipe-header">
        <h3 title={recipe.name}>{recipe.name}</h3>
        {recipe.is_ai && <span className="ai-badge">IA</span>}
      </div>
      {recipe.source && <p className="recipe-source">{recipe.source}</p>}
    </article>
  )
}

export default RecipeCard
