import './Landing.css'

const features = [
  {
    title: 'Organisez votre frigo',
    text: 'Gardez la liste de ce que vous avez sous la main, en un coup d’œil.',
  },
  {
    title: 'Cuisinez les restes',
    text: 'Recevez des suggestions de recettes selon vos ingrédients et vos restrictions.',
  },
  {
    title: 'Recettes sur mesure',
    text: 'Avec l’abonnement, générez des recettes personnalisées grâce à l’IA.',
  },
]

function Landing() {
  return (
    <main className="landing">
      <section className="intro">
        <img src="/touski-logo.png" alt="Logo Touski" className="intro-logo" />
        <h2>Tout ce qui reste dans le frigo, enfin utilisé.</h2>
        <p>
          Touski facilite l'organisation facile de vos repas. Provenant de l'expression "tout ce qui", ce gestionnaire de cuisine priorise la simplicité. Connectez-vous pour retrouver votre frigo et vos recettes.
        </p>
        <button type="button" className="login-button primary">
          Se connecter
        </button>
      </section>
      <section className="features">
        {features.map((f) => (
          <article key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Landing
