import { Route, Routes } from 'react-router'
import TopBar from './components/TopBar'
import Foods from './pages/Foods'
import Recipes from './pages/Recipes'
import Landing from './pages/Landing'

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/recipes" element={<Recipes />} />
      </Routes>
    </>
  )
}

export default App
