import { NavLink, Route, Routes } from 'react-router-dom';
import Planner from './routes/Planner';
import Recipes from './routes/Recipes';
import Shopping from './routes/Shopping';
import Settings from './routes/Settings';
import Onboarding from './routes/Onboarding';

const tabs = [
  { to: '/', label: 'Planner' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/shopping', label: 'Shopping' },
  { to: '/settings', label: 'Settings' }
];

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Planner />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </main>
      <nav className="sticky bottom-0 border-t border-slate-200 bg-white">
        <ul className="flex items-center justify-around gap-2 px-2 py-3 text-sm font-medium">
          {tabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                end={tab.to === '/'}
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default App;
