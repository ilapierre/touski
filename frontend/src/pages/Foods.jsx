import { useEffect, useState } from 'react'
import FoodCard from '../components/FoodCard'
import './Foods.css'

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
    if (query) params.set('q', query)

    fetch(`/api/foods/?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setTotal(data.total)
        setFoods(data.foods)
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
          <li key={a.id}>
            <FoodCard food={a} />
          </li>
        ))}
      </ul>
      {pagination}
    </main>
  )
}

export default Foods
