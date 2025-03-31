const Form = ({ photoMode }) => {
  return (
    <div>
      <div className="formHeader">
        <h1>Describe Your Shot</h1>
        <p>The more detailed you are, the better advice you will recieve.</p>
      </div>
       <form>
        <label>
        Upload or Choose a Photo:
            <input
            type="file"
            accept="image/*"
            capture="environment"
            />
        </label>

        <label>
        Distance (Yds):
        <input type="number" placeholder="230 yards"/>    
        </label>

        <label>
        Lie Type:
        <input type="text" placeholder="Fairway, rough, bunker, needles, fescue, etc"/>    
        </label>

        <label>
        Obstacles:
        <input type="text" placeholder="Tree, rock, water"/>    
        </label>

        <label>
        Wind:
        <input type="text" placeholder="Left to right, light breeze"/>
        <p>Units are not needed just general information.</p>    
        </label>

        <label>
        Elevation:
        <input type="number" placeholder="Elevated green, uphill, flat"/>    
        </label>

        <label>
        Course Firmness:
        <input type="number" placeholder="Elevated green, uphill, flat"/>    
        </label>

        <label>
        Additional Notes:
        <input type="number" placeholder="Elevated green, uphill, flat"/>    
        </label>
        <button className='chroma-glow-button custom-btn'>Send to Caddy</button>
    </form>
    </div>
  )
}

export default Form