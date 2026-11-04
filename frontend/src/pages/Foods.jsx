import { useEffect, useState } from 'react'
import './Foods.css'

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

const PAGE_SIZE = 24

function Foods() {
  const [foods, setFoods] = useState([])
  const [page, setPage] = useState(0)
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const params = new URLSearchParams({
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
    if (query) params.set('nom', query)
    const url = query ? '/api/foods/recherche' : '/api/foods/'

    fetch(`${url}?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setTotal(data.total)
        setFoods(data.resultats)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [page, query])

  const goToPage = (next) => {
    setLoading(true)
    setError(null)
    setPage(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const next = input.trim()
    if (next === query) return
    setLoading(true)
    setError(null)
    setPage(0)
    setQuery(next)
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const pagination = (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page === 0 || loading}
        aria-label="Page précédente"
      >
        ←
      </button>
      <span>
        Page {page + 1} sur {totalPages}
      </span>
      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page + 1 >= totalPages || loading}
        aria-label="Page suivante"
      >
        →
      </button>
    </nav>
  )

  return (
    <main className="foods">
      <h2>Aliments</h2>
      <form className="search" role="search" onSubmit={handleSearch}>
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Rechercher un aliment…"
          aria-label="Rechercher un aliment"
        />
        <button type="submit">Rechercher</button>
      </form>
      {loading && <p className="status">Chargement…</p>}
      {error && <p className="status error">Impossible de charger les aliments : {error}</p>}
      {!loading && !error && foods.length === 0 && (
        <p className="status">
          {query ? `Aucun résultat pour « ${query} ».` : 'Aucun aliment pour le moment.'}
        </p>
      )}
      <ul className="foods-grid">
        {foods.map((a) => (
          <li key={a.id} className="food-card">
            <FoodImage food={a} />
            <div className="food-body">
              <div className="food-header">
                <h3 title={a.name}>{a.name}</h3>
                {a.kcal != null && <span className="kcal-badge">{a.kcal} kcal</span>}
              </div>
              <p className="food-per">{a.per && `pour ${a.per}`}</p>
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
      {pagination}
    </main>
  )
}

export default Foods
