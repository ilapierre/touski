import { useState } from 'react'
import { useRestrictions } from '../restrictions'
import './RestrictionFilter.css'

const LOGIN_MESSAGE = 'Connectez-vous pour utiliser vos restrictions.'

// Pastilles pour exclure des restrictions (allergènes); l'état est géré par la page.
// `onSelect(keys)` remplace la sélection (utilisé par le raccourci "Mes restrictions").
function RestrictionFilter({ excluded, onToggle, onSelect, onReset }) {
  const { restrictions, label } = useRestrictions()
  const [message, setMessage] = useState('')

  // Sélectionne les restrictions de l'utilisateur connecté
  const selectMine = async () => {
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) return setMessage(LOGIN_MESSAGE)
    const headers = { Authorization: `Bearer ${token}` }

    try {
      const me = await fetch('/api/auth/moi', { headers })
      if (!me.ok) return setMessage(LOGIN_MESSAGE)
      const { id } = await me.json()

      const res = await fetch(`/api/restrictions/${id}/restrictions`, { headers })
      if (!res.ok) throw new Error()
      const { restrictions: mine } = await res.json()

      if (mine.length === 0) return setMessage("Vous n'avez aucune restriction.")
      onSelect(mine)
    } catch {
      setMessage('Impossible de charger vos restrictions.')
    }
  }

  return (
    <details className="filters" open>
      <summary>
        Exclure ce qui contient
        {excluded.length > 0 && <span className="filters-count">{excluded.length}</span>}
      </summary>

      <div className="filter-chips">
        <button type="button" className="filter-mine" onClick={selectMine}>
          Mes restrictions
        </button>
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
      {message && <p className="filters-message" role="status">{message}</p>}
    </details>
  )
}

export default RestrictionFilter
