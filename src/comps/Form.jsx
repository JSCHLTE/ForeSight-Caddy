import { useState } from "react"

const Form = () => {

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

  async function handleSubmit(e) {

    e.preventDefault();

      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });

          console.log("photoMode:", photoMode);
          console.log("formData.img:", formData.img);
          console.log("img type:", typeof formData.img);
          console.log("img instanceof Blob:", formData.img instanceof Blob);


          let imageURL = null;
          if (
            photoMode &&
            formData.img &&
            typeof formData.img === "object" &&
            formData.img instanceof Blob
          ) {
            imageURL = await toBase64(formData.img);
          }
          
          

    const prompt = `
    You're a professional golf caddy helping a player choose the best shot for their current situation. Consider all relevant conditions like distance, wind, lie, elevation, and firmness. Be specific, smart, and think like a real caddy would during a round. The user may have sent a photo, in which case you should use visual context to fill in missing information like, lie, elevation or obstacles  
    
    Shot Details:
    - Distance to the pin: ${formData.distance || "Not specified"}
    - Wind: ${formData.wind || "No wind mentioned"}
    - Elevation change: ${formData.elevation || "No elevation info"}
    - Lie: ${formData.lie || "Unclear from the image"}
    - Ground firmness: ${formData.firmness || "Normal conditions"}
    - Obstacles: ${formData.obstacles || "None mentioned"}
    - Additional notes: ${formData.notes || "None"}
    
      Respond with:
      1. The recommended club
      2. Suggested shot shape or trajectory (e.g., high draw, low fade, punch, etc.)
      3. A short, guided tip — including how to set up, where to position the ball, swing thoughts, and any key advice to execute the shot properly, as if you're standing beside the player on the course.
    `;    

    const imageMode = photoMode

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageMode, imageURL }),
    });
    
    const data = await res.json();
    console.log("AI Reply:", data.reply);
    
  }

  return (
    <div>
      <div className="formHeader">
        <h1>Describe Your Shot</h1>
        <p>Most fields are optional besides yardage — but the more details you give, the better your caddy’s advice will be. <i>Please note: this app is built for full swings, punch shots, and short-game situations. Putting responses may be generic and aren’t fully supported.</i></p>
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
            name="img"
            onChange={handleChange}
            required/>
        </label> : ''}

        <label>
        Distance (Yds):
        <input type="number" placeholder="230 yards" name="distance" onChange={handleChange} value={formData.distance} required/>
        <p>Reqruied. How far are you from the pin? Just the number in yards is perfect. Doesn't need to be exact. 🔭</p>  
        </label>

        <label>
        Lie Type:
        <input type="text" placeholder="Fairway, rough, bunker, pine needles, etc." name="lie" onChange={handleChange} value={formData.lie} required={!photoMode}/>  
        <p>Where's the ball sitting? Fairway, rough, bunker, fringe, etc. 🏖️</p>  
        </label>

        <label>
        Obstacles:
        <input type="text" placeholder="Trees, rocks, water, cart girl" name="obstacles" onChange={handleChange} value={formData.obstacles} />
        <p>Optional. List any obstacles that could affect the shot. ⚠️</p>   
        </label>

        <label>
        Wind:
        <input type="text" placeholder="Left to right, light breeze" name="wind" onChange={handleChange} value={formData.wind} required={!photoMode}/>
        <p>Exact speeds are fine — but “right to left, pretty windy” works too. 😎</p>    
        </label>

        <label>
        Elevation:
        <input type="text" placeholder="Elevated green, uphill, flat" name="elevation" onChange={handleChange} value={formData.elevation} required={!photoMode}/> 
        <p>Just tell us if it's uphill, downhill, or mostly flat — no need for numbers. 🏔️</p>     
        </label>

        <label>
        Course Firmness:
        <input type="text" placeholder="Elevated green, uphill, flat" name="firmness" onChange={handleChange} value={formData.firmness} />
        <p>Optional. Only mention if the fairways or greens feel really soft or firm. 🏌️</p>      
        </label>

        <label>
        Additional Notes:
        <input type="text" placeholder="Elevated green, uphill, flat" name="notes" onChange={handleChange} value={formData.notes}/>
        <p>Optional. Anything the caddy should know that isn't covered above — e.g. tucked pin, water short, ball above feet. 📝</p>    
        </label>
        <button className='chroma-glow-button custom-btn'>Send to Caddy</button>
    </form>
    </div>
  )
}

export default Form