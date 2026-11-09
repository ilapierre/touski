import { useEffect, useRef, useState } from 'react'
import './RecipeModal.css'

// Les instructions sont un texte brut : une étape par ligne non vide
const toParagraphs = (text) =>
  (text ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

function RecipeModal({ recipe, onClose }) {
  const dialogRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const ingredients = recipe.ingredients ?? []
  const paragraphs = toParagraphs(recipe.instructions)

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
      className="recipe-modal"
      aria-labelledby="recipe-modal-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
        ×
      </button>

      <div className="modal-image">
        {recipe.image_url && !failed ? (
          <img src={recipe.image_url} alt={recipe.name} onError={() => setFailed(true)} />
        ) : (
          <span aria-hidden="true">{recipe.name?.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="modal-body">
        <div className="modal-header">
          <h2 id="recipe-modal-title">{recipe.name}</h2>
          {recipe.is_ai && <span className="ai-badge">IA</span>}
        </div>

        <dl className="modal-details">
          <div>
            <dt>Source</dt>
            <dd>
              {/^https?:\/\//.test(recipe.source) ? (
                <a href={recipe.source} target="_blank" rel="noreferrer">
                  {recipe.source.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              ) : (
                recipe.source || '—'
              )}
            </dd>
          </div>
          <div>
            <dt>Origine</dt>
            <dd>{recipe.is_ai ? 'Générée par IA' : 'Recette importée'}</dd>
          </div>
        </dl>

        {ingredients.length > 0 && (
          <section className="modal-section">
            <h3>Ingrédients</h3>
            <ul className="modal-ingredients">
              {ingredients.map((ing, i) => (
                <li key={i}>
                  <span>{ing.name}</span>
                  {ing.measure && <span className="measure">{ing.measure}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {paragraphs.length > 0 && (
          <section className="modal-section">
            <h3>Instructions</h3>
            <ul className="modal-instructions">
              {paragraphs.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </dialog>
  )
}

export default RecipeModal
