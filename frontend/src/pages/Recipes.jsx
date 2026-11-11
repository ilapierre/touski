import { useEffect, useState } from 'react'
// import RecipeCard from '../components/RecipeCard'
// import RecipeModal from '../components/RecipeModal'
import './Recipes.css'
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 24

function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [page, setPage] = useState(0)
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController()

    const params = new URLSearchParams({
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
    if (query) params.set('q', query)

    fetch(`/api/recipes/?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setTotal(data.total)
        setRecipes(data.recipes)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <main className="recipes">
      <h2>Recettes</h2>
      <form className="search" role="search" onSubmit={handleSearch}>
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Rechercher une recette…"
          aria-label="Rechercher une recette"
        />
        <button type="submit">Rechercher</button>
      </form>
      {loading && <p className="status">Chargement…</p>}
      {error && <p className="status error">Impossible de charger les recettes : {error}</p>}
      {!loading && !error && recipes.length === 0 && (
        <p className="status">
          {query ? `Aucun résultat pour « ${query} ».` : 'Aucune recette pour le moment.'}
        </p>
      )}
      <ul className="recipes-grid">
        {recipes.map((r) => (
          <li key={r.id}>
            <RecipeCard recipe={r} onSelect={setSelected} />
          </li>
        ))}
      </ul>
      {pagination}
      {selected && <RecipeModal recipe={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}

export default Recipes
