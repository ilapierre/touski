import { useEffect, useState } from 'react'

// Langue d'affichage des libellés (le backend fournit "fr" et "en")
const LANG = 'fr'

// Restrictions fournies par le backend: { milk: { fr, en }, ... }
// Chargées une seule fois puis gardées en mémoire.
let cache = null

export function useRestrictions() {
  const [restrictions, setRestrictions] = useState(cache ?? {})

  useEffect(() => {
    if (cache) return
    fetch('/api/restrictions/')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (Object.keys(data).length) cache = data
        setRestrictions(data)
      })
      .catch(() => {})
  }, [])

  // Libellé d'une clé (la clé elle-même tant que la liste n'est pas chargée)
  const label = (key) => restrictions[key]?.[LANG] ?? key

  return { restrictions, label }
}
