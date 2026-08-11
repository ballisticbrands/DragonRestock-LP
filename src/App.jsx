import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Restock from './pages/Restock';
import Pricing from './pages/Pricing';
import Demo from './pages/Demo';

// DragonRestock LP. The root and any unknown path render the landing page;
// remaining routes (privacy, tos, support, /compare/*) get added as they're built.
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Restock />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/features" element={<Demo />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<Restock />} />
      </Routes>
    </Router>
  );
}

export default App;
