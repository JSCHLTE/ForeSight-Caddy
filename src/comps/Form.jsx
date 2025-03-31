const Form = ({ photoMode }) => {
  return (
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
    </form>
  )
}

export default Form