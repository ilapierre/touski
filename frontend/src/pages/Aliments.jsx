import { useEffect, useState } from 'react'
import './Aliments.css'

const macros = [
  { key: 'proteins', label: 'Protéines' },
  { key: 'carbohydrates', label: 'Glucides' },
  { key: 'fat', label: 'Lipides' },
]

function AlimentImage({ aliment }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="aliment-image">
      {aliment.image_url && !failed ? (
        <img
          src={aliment.image_url}
          alt={aliment.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{aliment.name?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

function Aliments() {
  const [aliments, setAliments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/aliments/')
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json()
      })
      .then(setAliments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="aliments">
      <h2>Aliments</h2>
      {loading && <p className="status">Chargement…</p>}
      {error && <p className="status error">Impossible de charger les aliments : {error}</p>}
      {!loading && !error && aliments.length === 0 && (
        <p className="status">Aucun aliment pour le moment.</p>
      )}
      <ul className="aliments-grid">
        {aliments.map((a) => (
          <li key={a.id} className="aliment-card">
            <AlimentImage aliment={a} />
            <div className="aliment-body">
              <div className="aliment-header">
                <h3 title={a.name}>{a.name}</h3>
                {a.kcal != null && <span className="kcal-badge">{a.kcal} kcal</span>}
              </div>
              <p className="aliment-per">{a.per && `pour ${a.per}`}</p>
              <dl className="macros">
                {macros.map(({ key, label }) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>{a[key] != null ? `${a[key]} g` : '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Aliments
