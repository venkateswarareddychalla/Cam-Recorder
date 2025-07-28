let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let timerDisplay = document.querySelector("#timer");

// Video info elements
let videoInfo = document.querySelector("#videoInfo");
let resolutionEl = document.querySelector("#resolution");
let frameRateEl = document.querySelector("#frameRate");
let aspectRatioEl = document.querySelector("#aspectRatio");
let videoCodecEl = document.querySelector("#videoCodec");
let audioInfoEl = document.querySelector("#audioInfo");
let streamStatusEl = document.querySelector("#streamStatus");
let recordingInfoEl = document.querySelector("#recordingInfo");
let recordDurationEl = document.querySelector("#recordDuration");
let estSizeEl = document.querySelector("#estSize");
let startTimeEl = document.querySelector("#startTime");

let recordFlag = false;

let chunks = [];  // media data is stored in chunks;

let recorder;  // stores undefined value by default;

let startTime;
let timerInterval;

let constraints = {
  audio: true,
  video: true,
};

let stream;

// Capture photo function
function capturePhoto() {
  if (!video.srcObject) {
    alert("Camera not available for capture");
    return;
  }
  
  // Create canvas to capture frame
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw current video frame to canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Convert to blob and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capture-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
  
  // Visual feedback
  captureBtn.classList.add("scale-capture");
  setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
  }, 500);
}

// Update video information display
function updateVideoInfo() {
  if (!video.srcObject) return;
  
  const videoTrack = stream.getVideoTracks()[0];
  const audioTrack = stream.getAudioTracks()[0];
  
  if (videoTrack) {
    const settings = videoTrack.getSettings();
    
    // Resolution
    resolutionEl.textContent = `${settings.width || video.videoWidth}×${settings.height || video.videoHeight}`;
    
    // Frame rate
    frameRateEl.textContent = `${settings.frameRate || 30} fps`;
    
    // Aspect ratio
    const aspectRatio = (settings.width / settings.height).toFixed(2);
    aspectRatioEl.textContent = aspectRatio == 1.78 ? "16:9" : aspectRatio == 1.33 ? "4:3" : aspectRatio;
    
    // Video codec (approximation)
    videoCodecEl.textContent = "H.264 (WebRTC)";
  }
  
  if (audioTrack) {
    const audioSettings = audioTrack.getSettings();
    audioInfoEl.textContent = `${audioSettings.sampleRate || 48000}Hz Stereo`;
  } else {
    audioInfoEl.textContent = "No Audio";
  }
}

// Estimate file size (rough calculation)
function updateEstimatedSize() {
  if (!recordFlag) return;
  
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  // Rough estimate: ~1MB per 10 seconds for standard quality
  const estimatedMB = (elapsed * 0.1).toFixed(1);
  estSizeEl.textContent = `${estimatedMB} MB`;
}

// Timer functions
function startTimer() {
  startTime = Date.now();
  timerDisplay.style.display = 'block';
  recordingInfoEl.style.display = 'block';
  startTimeEl.textContent = new Date().toLocaleTimeString();
  timerInterval = setInterval(() => {
    updateTimer();
    updateEstimatedSize();
  }, 1000);
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  
  let timeString;
  if (hours > 0) {
    // Show HH:MM:SS format when recording for 1+ hours
    timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    // Show MM:SS format for recordings under 1 hour
    timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  timerDisplay.textContent = timeString;
  recordDurationEl.textContent = timeString;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerDisplay.style.display = 'none';
  recordingInfoEl.style.display = 'none';
  timerDisplay.textContent = '00:00';
  recordDurationEl.textContent = '00:00';
  estSizeEl.textContent = '0 MB';
}

// Initialize camera stream but don't start recording
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((mediaStream) => {
    stream = mediaStream;
    video.srcObject = stream;
    
    // Ensure video plays automatically
    video.play().catch(e => console.log("Video autoplay prevented:", e));
    
    // Update video info when metadata loads
    video.addEventListener('loadedmetadata', () => {
      updateVideoInfo();
      streamStatusEl.textContent = "Live";
    });
    
    // Initialize recorder with camera stream but don't start recording
    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", (e) => {
      chunks = [];
      console.log("Camera recording started");
      // Update button appearance to show recording state
      recordBtn.textContent = "Stop";
      recordBtn.classList.add("scale-record");
      streamStatusEl.textContent = "Recording";
      // Start the timer
      startTimer();
    });

    recorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });

    recorder.addEventListener("stop", (e) => {
      console.log("Camera recording stopped");
      let blob = new Blob(chunks, { type: "video/mp4" });
      let videoUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = videoUrl;
      a.download = `camera-recording-${new Date().toISOString().replace(/[:.]/g, '-')}.mp4`;
      a.click();
      
      // Reset button appearance and stop timer
      recordBtn.textContent = "Record";
      recordBtn.classList.remove("scale-record");
      streamStatusEl.textContent = "Live";
      stopTimer();
      recordFlag = false;
    });
  })
  .catch((error) => {
    console.error("Camera permission denied or device not found", error);
    alert("Please allow camera and microphone access to use the recorder.");
  });

// Record button click handler - only start/stop recording on button click
recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) {
    console.log("Camera recorder not initialized yet");
    return;
  }
  
  recordFlag = !recordFlag;
  
  if (recordFlag) {
    // Start camera recording
    if (recorder.state === "inactive") {
      recorder.start();
      console.log("Starting camera recording");
    }
  } else {
    // Stop camera recording
    if (recorder.state === "recording") {
      recorder.stop();
      console.log("Stopping camera recording");
    }
  }
});

// Capture button click handler - works during recording and live preview
captureBtnCont.addEventListener("click", (e) => {
  capturePhoto();
  console.log("Photo captured");
});
