import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { trackRouteChange } from './lib/track';
import Restock from './pages/Restock';
import Pricing from './pages/Pricing';
import Demo from './pages/Demo';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Compare from './pages/Compare';

// Reports every route to GA4 + the Meta Pixel. Renders nothing; must live
// INSIDE <Router> so useLocation() has a router context. index.html only
// fires a pageview on hard load, so without this every client-side
// navigation goes uncounted — see trackRouteChange() in lib/track.js.
function RouteAnalytics() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackRouteChange(pathname);
  }, [pathname]);
  return null;
}

// DragonRestock LP. The root and any unknown path render the landing page;
// remaining routes (privacy, tos, support, comparisons) are listed below.
function App() {
  return (
    <Router>
      <RouteAnalytics />
      <Routes>
        <Route path="/" element={<Restock />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/features" element={<Demo />} />
        <Route path="/pricing" element={<Pricing />} />
        {/* Head-to-head comparison pages. One template, one entry per
            competitor in src/data/compareCopy.js; an unbuilt or misspelled
            slug redirects home rather than rendering an empty table. Every
            live slug must also be in scripts/postbuild-spa-routes.mjs, or
            GitHub Pages serves it as an HTTP 404. */}
        <Route path="/compare/:slug" element={<Compare />} />
        {/* Legal + support. The footer and the app's sign-up form both link
            here; before these existed every one of those links resolved to
            the landing page under an HTTP 404, and a reachable privacy
            policy is something Google and Meta check at ad review. */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Restock />} />
      </Routes>
    </Router>
  );
}

export default App;
