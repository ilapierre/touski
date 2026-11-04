import { Route, Routes } from 'react-router'
import TopBar from './components/TopBar'
import Landing from './pages/Landing'
import Groupes from './pages/groupes'

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/groupes" element={<Groupes />} />
      </Routes>
    </>
  )
}

export default App
