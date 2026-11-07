import "./Landing.css";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const getFeatures = (t) => [
  {
    title: t('landing.organise'),
    text: t('landing.orgTxt'),
  },
  {
    title: t('landing.cuisine'),
    text: t('landing.cuiTxt'),
  },
  {
    title: t('landing.recette'),
    text: t('landing.reTxt'),
  },
];

function Landing() {
  const { t } = useTranslation();
  const features = getFeatures(t);

  return (
    <main className="landing">
      <section className="intro">
        <img src="/touski-logo.png" alt="Logo Touski" className="intro-logo" />
        <h2>{t('landing.header')}</h2>
        <p>
          {t('landing.text')}
        </p>
        <Link to="/connexion" className="login-button primary">
          {t('landing.connecter')}
        </Link>
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
  );
}

export default Landing;
