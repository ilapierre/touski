import { useRestrictions } from '../restrictions'
import './RestrictionFilter.css'

// Pastilles pour exclure des restrictions (allergènes); l'état est géré par la page
function RestrictionFilter({ excluded, onToggle, onReset }) {
  const { restrictions, label } = useRestrictions()

  return (
    <section className="filters" aria-label="Filtrer par restrictions">
      <h3>Exclure ce qui contient :</h3>
      <div className="filter-chips">
        {Object.keys(restrictions).map((key) => (
          <button
            key={key}
            type="button"
            className="filter-chip"
            aria-pressed={excluded.includes(key)}
            onClick={() => onToggle(key)}
          >
            {label(key)}
          </button>
        ))}
        {excluded.length > 0 && (
          <button type="button" className="filter-reset" onClick={onReset}>
            Réinitialiser
          </button>
        )}
      </div>
    </section>
  )
}

export default RestrictionFilter
