import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
        <div className='navInner'>
            <div className='navLogo'>
                <img src='/images/fsc-logo.webp'/>
            </div>
            <ul className='navLinks'>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/caddy'>Caddy</NavLink></li>
            </ul>
            <div className='burger'>
                <div className='line line1'></div>
                <div className='line line2'></div>
                <div className='line line3'></div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar