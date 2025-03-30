import './css/variables.css';
import './css/base.css';
import './css/app.css';

function App() {

  return (
    <header id='siteHeader'>
      <div className='headerInner'>
        <h1>The AI Golf Caddy</h1>
        <p>Built to help you play smarter, swing with confidence, and choose the right shot — every time.</p>
        <div className='headerButtons'>
          <button className='chroma-glow-button'>Take or Upload Photo</button>
          <button>Describe Your Lie</button>
        </div>
      </div>
    </header>
  )
}

export default App
