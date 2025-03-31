import { Link } from "react-router-dom"

const Home = ({ handlePhotoMode }) => {
  return (
    <header id='siteHeader'>
    <div className='headerInner'>
      <h1>The AI Golf Caddy</h1>
      <p>Built to help you play smarter, swing with confidence, and choose the right shot — every time.</p>
      <div className='headerButtons'>
        <Link to='/form'><button className='chroma-glow-button custom-btn' onClick={handlePhotoMode}>Get Started</button></Link>
      </div>
    </div>
  </header>
  )
}

export default Home