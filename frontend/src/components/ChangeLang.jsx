import { useTranslation } from "react-i18next";
import "./ChangeLang.css";

function ChangeLang() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="lang-switcher">
            <button
                onClick={() => changeLanguage('fr')}
            >
                FR
            </button>

            <button
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>

        </div>
    );
}

export default ChangeLang;