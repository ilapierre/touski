import { Route, Routes } from 'react-router'
import TopBar from './components/TopBar'
import Landing from './pages/Landing'

function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  )
}

export default App
