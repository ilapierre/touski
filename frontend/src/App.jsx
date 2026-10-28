import { Route, Routes } from 'react-router'
import TopBar from './components/TopBar'
import Aliments from './pages/Aliments'
import Landing from './pages/Landing'

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/aliments" element={<Aliments />} />
      </Routes>
    </>
  )
}

export default App
