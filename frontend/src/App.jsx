import { Navigate, Route, Routes } from "react-router";
import TopBar from "./components/TopBar";
import Landing from "./pages/Landing";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import Abonnement from "./pages/Abonnement"

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

        <Route path="/abonnement" element={<Abonnement />} />
      </Routes>
    </>
  );
}

export default App;
