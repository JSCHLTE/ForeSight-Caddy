import './css/variables.css';
import './css/base.css';
import './css/app.css';
import './css/form.css'

import Home from './comps/Home';
import Form from './comps/Form';
import { useState } from 'react';

function App() {

  const [start, setStart] = useState(false);
  const [photo, setPhoto] = useState(false);

  const handlePhotoMode = () => {
    setPhoto(true);
    startApp();
  }

  const startApp = () => {
    setStart(true);
  }

  return (
    <div id='siteWrapper'>
      {start ? <Form /> : <Home photoMode={handlePhotoMode} start={startApp}/>}
    </div>
  )
}

export default App
