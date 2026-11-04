import { Route, Routes } from 'react-router'
import TopBar from './components/TopBar'
import Foods from './pages/Foods'
import Landing from './pages/Landing'

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/foods" element={<Foods />} />
      </Routes>
    </>
  )
}

export default App
