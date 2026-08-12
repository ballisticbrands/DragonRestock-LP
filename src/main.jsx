import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initAttribution } from './lib/attribution.js'
import { initCtaTracking } from './lib/track.js'
import './globals.css'

// Capture UTMs / click ids from this landing (or a saved cookie) and
// install a click-time href rewriter so any outbound link to a
// dragonrestock.com URL (LP → LP or LP → app.dragonrestock.com) carries
// them through to the sign-up destination. See src/lib/attribution.js.
initAttribution()

// Fire a GA4/Clarity/Meta `cta_click` event whenever a sign-up CTA (link
// to app.dragonrestock.com) is clicked. See src/lib/track.js.
initCtaTracking()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
