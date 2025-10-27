import { Link, Routes, Route, Navigate } from 'react-router-dom'
import Planner from './routes/Planner'
import Recipes from './routes/Recipes'
import Shopping from './routes/Shopping'
import Settings from './routes/Settings'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/planner" replace />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <nav className="fixed bottom-0 inset-x-0 border-t bg-white">
        <ul className="grid grid-cols-4 text-center">
          <li><Link className="block p-3" to="/planner">Planner</Link></li>
          <li><Link className="block p-3" to="/recipes">Recettes</Link></li>
          <li><Link className="block p-3" to="/shopping">Courses</Link></li>
          <li><Link className="block p-3" to="/settings">Réglages</Link></li>
        </ul>
      </nav>
    </div>
  )
}
