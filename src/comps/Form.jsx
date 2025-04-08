import { useEffect, useState } from "react"
import VoiceRecorder from "./VoiceRecorder"

const Form = () => {

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
  const [caddyInfo, setCaddyInfo] = useState(()=> {
    const stored = localStorage.getItem('caddyCards');
    return stored ? JSON.parse(stored) : []
  });
  const [caddyTab, setCaddyTab] = useState(false);
  const [caddyBtn, setCaddyBtn] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  useEffect(() => {
    localStorage.setItem('caddyCards', JSON.stringify(caddyInfo));
  }, [caddyInfo]);

  const handleCaddyLog = (value) => {
    setCaddyTab(value);
    if (!value) {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  }

  useEffect(() => {
    if(caddyTab) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [caddyTab]);

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

  const handleVoiceTranscription = (transcript) => {
    setVoiceTranscript(transcript);
    setFormData(prevData => ({
      ...prevData,
      notes: transcript
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setCaddyBtn(false);
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    let imageURL = null;
    if (formData.img && typeof formData.img === "object" && formData.img instanceof Blob) {
      imageURL = await toBase64(formData.img);
    }
    
    const prompt = `
    You're a professional golf caddy helping a player (never mention them as player, always say you) choose the best shot for their current situation. Consider all relevant conditions like distance, wind, lie, elevation, and firmness. Be specific, smart, and think like a real caddy would during a round. The user may have sent a photo, in which case you should use visual context to fill in missing information like, lie, elevation or obstacles  
    
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

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageURL }),
    });
    
    const data = await res.json();
    setCaddyInfo(prevInfo => ([data.reply, ...prevInfo]));
    setCaddyTab(true);
    setCaddyBtn(true);
    setFormData({
      img: '',
      distance: '',
      lie: '',
      obstacles: '',
      wind: '',
      elevation: '',
      firmness: '',
      notes: ''
    })
    setVoiceTranscript('');
  }

  const formatCaddyResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };
  
  const getDisplayNumber = (index) => {
    return caddyInfo.length - index;
  };

  return (
    <div>
      <div className="formHeader">
        <h1>Describe Your Shot</h1>
        <p>Most fields are optional besides yardage — but the more details you give, the better your caddy's advice will be. <i>Please note: this app is built for full swings, punch shots, and short-game situations. Putting responses may be generic and aren't fully supported.</i></p>
      </div>
      <div className="generationType">
        <button className={`custom-btn ${isVoiceMode ? 'chroma-glow-button' : ''}`} onClick={() => setIsVoiceMode(true)}>Voice Mode</button>
        <button className={`custom-btn ${!isVoiceMode ? 'chroma-glow-button' : ''}`} onClick={() => setIsVoiceMode(false)}>Photo/Text Mode</button>
      </div>

      <div className={caddyTab ? 'overlay' : ''} onClick={() => handleCaddyLog(false)}></div>

      <div className={`caddyLog ${caddyTab ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="caddyTitleBarWrapper">
          <div className="caddyTitleBar">
            <h3>Caddy Log:</h3>
            <div className="closeWrapper">
              {caddyInfo.length > 0 ? (
                <button 
                  className="clearBtn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCaddyInfo([]);
                  }}
                >
                  Clear
                </button>
              ) : ''}
              <div 
                className="closeCaddy" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCaddyLog(false);
                }}
              >
                <div className="x x1"></div>
                <div className="x x2"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="caddyCards">
        {
          caddyInfo.length > 0 ? 
          caddyInfo.map((item, index) => (
            <div key={index} className="caddyCard">
              <h4>{`Caddy Response: ${getDisplayNumber(index)}`}</h4>
              <div
                className="formattedCaddyText"
                dangerouslySetInnerHTML={{ __html: formatCaddyResponse(item) }}
              /></div>
          ))
          :
          <p className="nores">No responses found.</p>
        }
        </div>
      </div>

       <form onSubmit={handleSubmit}>
        {!isVoiceMode ? (
          <>
            <label>
              Upload or Choose a Photo (Optional):
              <input
                type="file"
                accept="image/*"
                name="img"
                onChange={handleChange}
              />
            </label>

            <label>
              Distance (Yds):
              <input type="number" placeholder="227, 150, 23" name="distance" onChange={handleChange} value={formData.distance} required />
              <p>Required. How far are you from the pin? Just the number in yards is perfect. Doesn't need to be exact. 🔭</p>  
            </label>

            <label>
              Lie Type:
              <input type="text" placeholder="Fairway, rough, bunker, pine needles, plugged, etc." name="lie" onChange={handleChange} value={formData.lie} />  
              <p>Where's the ball sitting? Fairway, rough, bunker, fringe, plugged, etc. 🏖️</p>  
            </label>

            <label>
              Obstacles:
              <input type="text" placeholder="Trees, rocks, water, cart girl" name="obstacles" onChange={handleChange} value={formData.obstacles} />
              <p>Optional. List any obstacles that could affect the shot. ⚠️</p>   
            </label>

            <label>
              Wind:
              <input type="text" placeholder="Left to right, light breeze" name="wind" onChange={handleChange} value={formData.wind}/>
              <p>Exact speeds are fine — but "right to left, pretty windy" works too. 😎</p>    
            </label>

            <label>
              Elevation:
              <input type="text" placeholder="Uphill, downhill, elevated green, etc." name="elevation" onChange={handleChange} value={formData.elevation} /> 
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
          </>
        ) : (
          <>
            <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} />
            
            <label>
              Voice Description:
              <textarea
                placeholder="Your voice description will appear here..."
                name="notes"
                onChange={handleChange}
                value={formData.notes}
                style={{ minHeight: '150px', width: '100%', padding: '10px' }}
                required
              />
              <p>You can edit your transcript here. If your mobile browser doesn’t support this feature, try using your keyboard’s microphone input instead — it usually works much better 🎤</p>
            </label>
          </>
        )}
        
        <div className="formButtons">
          {caddyBtn ? <button className='chroma-glow-button custom-btn' type="submit">Send to Caddy</button> : <button className='chroma-glow-button custom-btn' disabled>Getting Advice...</button>}
          <button className='custom-btn' type="button" onClick={()=> handleCaddyLog(true)}>Caddy Log</button>
        </div>
    </form>
    </div>
  )
}

export default Form