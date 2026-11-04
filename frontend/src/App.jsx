import { Navigate, Route, Routes } from "react-router";
import TopBar from "./components/TopBar";
import Landing from "./pages/Landing";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profil from "./pages/Profil";
import Groupes from "./pages/groupes";

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
        <Route path="/groupes" element={<Groupes/>}/>
      </Routes>
    </>
  );
}

export default App;
