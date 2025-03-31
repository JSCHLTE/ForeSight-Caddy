const Home = ({ photoMode, start }) => {
  return (
    <header id='siteHeader'>
    <div className='headerInner'>
      <h1>The AI Golf Caddy</h1>
      <p>Built to help you play smarter, swing with confidence, and choose the right shot — every time.</p>
      <div className='headerButtons'>
        <button className='chroma-glow-button' onClick={photoMode}>Take or Upload Photo</button>
        <button onClick={start}>Describe Your Lie</button>
      </div>
    </div>
    <center><p>v0.01</p></center>
  </header>
  )
}

export default Home