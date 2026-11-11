import { Navigate, Route, Routes } from "react-router";
import TopBar from "./components/TopBar";
import Landing from "./pages/Landing";
import Profil from "./pages/Profil";
import Foods from "./pages/Foods";
import Recipes from "./pages/Recipes";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Groupes from "./pages/groupes";
import Abonnement from "./pages/Abonnement";
import Frigo from "./pages/Frigo";

// Si pas connecté, on redirige vers la connexion
function RouteProtegee({ children }) {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/connexion" />;
  }
  return children;
}

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route
          path="/frigo"
          element={
            <RouteProtegee>
              <Frigo />
            </RouteProtegee>
          }
        />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route
          path="/profil"
          element={
            <RouteProtegee>
              <Profil />
            </RouteProtegee>
          }
        />
        <Route path="/groupes" element={<Groupes />} />
        <Route path="/abonnement" element={<Abonnement />} />
      </Routes>
    </>
  );
}

export default App;
