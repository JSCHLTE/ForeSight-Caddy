import { useState, useEffect, useRef } from 'react';

const VoiceRecorder = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isIOS, setIsIOS] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    // Set up event handlers
    recognitionRef.current.onresult = (event) => {
      let final_transcript = '';
      let interim_transcript = '';

      // Iterate through all results received so far
      for (let i = 0; i < event.results.length; ++i) {
        // Get the transcript string for the current result
        const transcriptPart = event.results[i][0].transcript;
        
        // If the result is final, append it to the final transcript
        if (event.results[i].isFinal) {
          final_transcript += transcriptPart + ' ';
        } else {
          // Otherwise, it's an interim result, keep track of the latest one
          interim_transcript = transcriptPart;
        }
      }

      // Update the state with the accumulated final transcript plus the latest interim part
      setTranscript(final_transcript.trim() + (interim_transcript ? ' ' + interim_transcript : ''));
    };

    recognitionRef.current.onerror = (event) => {
      setError(`Error: ${event.error}`);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    setError('');
    setTranscript(''); // Reset transcript when starting a new recording session
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError(`Failed to start recording: ${err.message}`);
    }
  };

  const stopRecording = () => {
    try {
      recognitionRef.current.stop(); // This should trigger a final result event if needed
      setIsRecording(false);
      // The transcript state should now hold the final accumulated text
      if (transcript.trim()) {
        onTranscriptionComplete(transcript.trim());
      }
    } catch (err) {
      setError(`Failed to stop recording: ${err.message}`);
    }
  };

  return (
    <div className="voice-recorder">
      {error && <div className="error-message">{error}</div>}
      
      <div className="recording-controls">
        {!isRecording ? (
          <button 
            type="button" 
            className="record-button"
            onClick={startRecording}
          >
            <i class="fa-solid fa-microphone"></i>
          </button>
        ) : (
          <button 
            type="button" 
            className="stop-button"
            onClick={stopRecording}
          >
            <i class="fa-solid fa-microphone-slash"></i>
          </button>
        )}
      </div>
      
      {isIOS && (
        <div className="ios-notice">
          <p>Note: On iOS, you'll need to grant microphone access for the app to work. If the button above doesn’t respond, just tap the text area below and use your keyboard’s microphone to start speaking.</p>
        </div>
      )}
      
      {transcript && (
        <div className="transcript-container">
          <h4>Transcript:</h4>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder; 