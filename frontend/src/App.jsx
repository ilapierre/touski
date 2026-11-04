import { Route, Routes } from 'react-router'
import TopBar from './components/TopBar'
import Landing from './pages/Landing'
import AjoutAliment from './pages/AjoutAliment';

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/addaliment" element={<AjoutAliment />} />
      </Routes>
    </>
  )
}

export default App
