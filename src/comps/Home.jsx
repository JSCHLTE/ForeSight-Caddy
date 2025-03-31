import { Link } from "react-router-dom"

const Home = ({ photoMode, start }) => {
  return (
    <header id='siteHeader'>
    <div className='headerInner'>
      <h1>The AI Golf Caddy</h1>
      <p>Built to help you play smarter, swing with confidence, and choose the right shot — every time.</p>
      <div className='headerButtons'>
        <Link to='/form'><button className='chroma-glow-button custom-btn' onClick={photoMode}>Take or Upload Photo</button></Link>
        <Link to='/form'><button onClick={start} className='custom-btn'>Describe Your Lie</button></Link>
      </div>
    </div>
  </header>
  )
}

export default Home