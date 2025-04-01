import { useState } from "react"

const Form = ({ handlePhotoMode }) => {

  const [photoMode, setPhotoMode] = useState(true);
  const [formData, setFormData] = useState({
    img: '',
    distance: '',
    lie: '',
    obstacles: '',
    wind: '',
    elevation: '',
    firmness: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if(type === 'file') {
      setFormData((data) => ({
        ...data,
        [name]: files[0]
      }))
    } else {
      setFormData((data) => ({
        ...data,
        [name]: value
      }))
    }
  }

  const handleMode = (mode) => {
    mode ? setPhotoMode(true) : setPhotoMode(false)
  }
  

  async function handleSubmit() {

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    
    const imageURL = await toBase64(formData.img);

    const prompt = ''
    const imageMode = photoMode

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: { prompt, imageMode, imageURL } }),
    });
    
    const data = await res.json();
    console.log("AI Reply:", data.reply);
    
  }

  return (
    <div>
      <div className="formHeader">
        <h1>Describe Your Shot</h1>
        <p>The more detailed you are, the better advice you will recieve.</p>
      </div>

      <div className="generationType">
        <button className={`custom-btn ${photoMode ? `chroma-glow-button` : ``}`} onClick={() => setPhotoMode(true)}>Photo Mode</button>
        <button className={`custom-btn ${photoMode ? `` : `chroma-glow-button`}`} onClick={() => setPhotoMode(false)}>Text Mode</button>
      </div>

       <form onSubmit={handleSubmit}>
        {photoMode ?         <label>
        Upload or Choose a Photo:
            <input
            type="file"
            accept="image/*"
            capture="environment"
            name="img"
            onChange={handleChange}
            />
        </label> : ''}

        <label>
        Distance (Yds):
        <input type="number" placeholder="230 yards" name="distance" onChange={handleChange} value={formData.distance}/>    
        </label>

        <label>
        Lie Type:
        <input type="text" placeholder="Fairway, rough, bunker, needles, fescue, etc" name="lie" onChange={handleChange} value={formData.lie}/>    
        </label>

        <label>
        Obstacles:
        <input type="text" placeholder="Tree, rock, water" name="obstacles" onChange={handleChange} value={formData.obstacles}/>    
        </label>

        <label>
        Wind:
        <input type="text" placeholder="Left to right, light breeze" name="wind" onChange={handleChange} value={formData.wind}/>
        <p>Units are not needed just general information.</p>    
        </label>

        <label>
        Elevation:
        <input type="number" placeholder="Elevated green, uphill, flat" name="elevation" onChange={handleChange} value={formData.elevation}/>    
        </label>

        <label>
        Course Firmness:
        <input type="number" placeholder="Elevated green, uphill, flat" name="firmness" onChange={handleChange} value={formData.firmness}/>    
        </label>

        <label>
        Additional Notes:
        <input type="number" placeholder="Elevated green, uphill, flat" name="notes" onChange={handleChange} value={formData.notes}/>    
        </label>
        <button className='chroma-glow-button custom-btn'>Send to Caddy</button>
    </form>
    </div>
  )
}

export default Form