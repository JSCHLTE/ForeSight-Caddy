import { useEffect, useState } from "react"

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
  const [caddyInfo, setCaddyInfo] = useState([]);
  const [caddyTab, setCaddyTab] = useState(false);

  useEffect(() => {
    console.log('save to LS eventually')
  }, [caddyInfo]);

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
    setCaddyInfo(prevInfo => ([...prevInfo, data.reply]));
    setCaddyTab(true);
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

      <div className={`caddyLog ${caddyTab ? 'show' : ''}`}>
        <div className="caddyTitleBar">
          <h3>Caddy Log:</h3>
          <div className="closeCaddy" onClick={()=> setCaddyTab(false)}>
            <div className="x x1"></div>
            <div className="x x2"></div>
          </div>
        </div>
        {
          caddyInfo.length > 0 ? 
          caddyInfo.map((item, index) => (
            <div key={index} className="caddyCard">
              <h4>{`Caddy Response: ${index + 1}`}</h4>
              <pre>{item}</pre>
            </div>
          ))
          :
          <p className="nores">No responses found.</p>
        }
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
        <input type="number" placeholder="227, 150, 23" name="distance" onChange={handleChange} value={formData.distance} required/>
        <p>Reqruied. How far are you from the pin? Just the number in yards is perfect. Doesn't need to be exact. 🔭</p>  
        </label>

        <label>
        Lie Type:
        <input type="text" placeholder="Fairway, rough, bunker, pine needles, plugged, etc." name="lie" onChange={handleChange} value={formData.lie} required={!photoMode}/>  
        <p>Where's the ball sitting? Fairway, rough, bunker, fringe, plugged, etc. 🏖️</p>  
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
        <input type="text" placeholder="Uphill, downhill, elevated green, etc." name="elevation" onChange={handleChange} value={formData.elevation} required={!photoMode}/> 
        <p>Just tell us if it's uphill, downhill, elevated green, or mostly flat — no need for numbers. 🏔️</p>     
        </label>

        <label>
        Course Firmness:
        <input type="text" placeholder="Soft or firm" name="firmness" onChange={handleChange} value={formData.firmness} />
        <p>Optional. Only mention if the fairways or greens feel really soft or firm. 🏌️</p>      
        </label>

        <label>
        Additional Notes:
        <input type="text" placeholder="Beginner, club distance, tucked pin, water short" name="notes" onChange={handleChange} value={formData.notes}/>
        <p>Optional. Anything the caddy should know that isn't covered above — e.g. tucked pin, water short, ball above feet. 📝</p>    
        </label>
        <div className="formButtons">
        <button className='chroma-glow-button custom-btn' type="submit">Send to Caddy</button>
        <button className='custom-btn' type="button"  onClick={()=> setCaddyTab(true)}>Caddy Log</button>
        </div>
    </form>
    </div>
  )
}

export default Form