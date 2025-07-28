# 📹 Media Devices API - Complete Documentation

> A comprehensive guide to the Media Devices API used in web-based camera and microphone applications.

## 📚 Table of Contents

- [Overview](#overview)
- [Browser Support](#browser-support)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [MediaStream](#mediastream)
- [MediaRecorder](#mediarecorder)
- [Constraints](#constraints)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Code Examples](#code-examples)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The **Media Devices API** provides access to connected media input devices like cameras and microphones. It's part of the WebRTC specification and allows web applications to capture audio and video streams from user devices.

### Key Components:
- **`navigator.mediaDevices`** - Main interface
- **`getUserMedia()`** - Access camera/microphone
- **`getDisplayMedia()`** - Screen capture
- **`MediaStream`** - Stream representation
- **`MediaRecorder`** - Recording functionality

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 53+ | ✅ Full Support |
| Firefox | 36+ | ✅ Full Support |
| Safari | 11+ | ✅ Full Support |
| Edge | 12+ | ✅ Full Support |
| Opera | 40+ | ✅ Full Support |
| Mobile Chrome | 53+ | ✅ Full Support |
| Mobile Safari | 11+ | ✅ Full Support |

### HTTPS Requirement:
- **Required** for production sites
- **Not required** for `localhost` development

---

## 🧠 Core Concepts

### Media Devices
Physical or virtual devices that can capture media:
- **Video Input**: Webcams, USB cameras, virtual cameras
- **Audio Input**: Microphones, headset mics, system audio
- **Audio Output**: Speakers, headphones

### Media Streams
A stream of media content consisting of:
- **Video Tracks**: Visual data from cameras
- **Audio Tracks**: Audio data from microphones
- **Metadata**: Frame rate, resolution, codec info

### Constraints
Parameters that define the desired media characteristics:
- **Video**: Resolution, frame rate, facing mode
- **Audio**: Sample rate, echo cancellation, noise suppression

---

## 🔧 API Reference

### `navigator.mediaDevices`

The main entry point for media device operations.

#### Methods:

##### `getUserMedia(constraints)`
Requests access to user's camera and/or microphone.

```javascript
navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    // Handle the media stream
  })
  .catch(error => {
    // Handle errors
  });
```

**Parameters:**
- `constraints` (Object): Media constraints specification

**Returns:**
- `Promise<MediaStream>`: Promise resolving to media stream

---

##### `getDisplayMedia(constraints)`
Captures the user's screen, window, or tab.

```javascript
navigator.mediaDevices.getDisplayMedia(constraints)
  .then(stream => {
    // Handle screen capture stream
  })
  .catch(error => {
    // Handle errors
  });
```

**Parameters:**
- `constraints` (Object): Display media constraints

**Returns:**
- `Promise<MediaStream>`: Promise resolving to display stream

---

##### `enumerateDevices()`
Lists available media input/output devices.

```javascript
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      console.log(device.kind, device.label, device.deviceId);
    });
  });
```

**Returns:**
- `Promise<Array<MediaDeviceInfo>>`: Array of device information

---

##### `getSupportedConstraints()`
Returns supported constraint properties.

```javascript
const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
console.log(supportedConstraints);
// { width: true, height: true, frameRate: true, ... }
```

**Returns:**
- `MediaTrackSupportedConstraints`: Supported constraint properties

---

## 🎬 MediaStream

Represents a stream of media content.

### Properties:

#### `id` (Read-only)
Unique identifier for the stream.

```javascript
const streamId = stream.id;
```

#### `active` (Read-only)
Boolean indicating if the stream is active.

```javascript
if (stream.active) {
  console.log("Stream is active");
}
```

### Methods:

#### `getVideoTracks()`
Returns array of video tracks.

```javascript
const videoTracks = stream.getVideoTracks();
console.log(`Found ${videoTracks.length} video tracks`);
```

#### `getAudioTracks()`
Returns array of audio tracks.

```javascript
const audioTracks = stream.getAudioTracks();
console.log(`Found ${audioTracks.length} audio tracks`);
```

#### `getTracks()`
Returns all tracks (video + audio).

```javascript
const allTracks = stream.getTracks();
allTracks.forEach(track => {
  console.log(track.kind, track.label);
});
```

#### `addTrack(track)`
Adds a track to the stream.

```javascript
stream.addTrack(newVideoTrack);
```

#### `removeTrack(track)`
Removes a track from the stream.

```javascript
stream.removeTrack(videoTrack);
```

#### `clone()`
Creates a copy of the stream.

```javascript
const clonedStream = stream.clone();
```

### Events:

#### `addtrack`
Fired when a track is added.

```javascript
stream.addEventListener('addtrack', event => {
  console.log('Track added:', event.track);
});
```

#### `removetrack`
Fired when a track is removed.

```javascript
stream.addEventListener('removetrack', event => {
  console.log('Track removed:', event.track);
});
```

---

## 🎤 MediaRecorder

Records media streams to create downloadable files.

### Constructor:

```javascript
const recorder = new MediaRecorder(stream, options);
```

**Parameters:**
- `stream`: MediaStream to record
- `options` (optional): Recording options

### Properties:

#### `state` (Read-only)
Current recording state: `"inactive"`, `"recording"`, or `"paused"`.

```javascript
if (recorder.state === "recording") {
  console.log("Currently recording");
}
```

#### `mimeType` (Read-only)
MIME type of recorded media.

```javascript
console.log("Recording format:", recorder.mimeType);
```

### Methods:

#### `start(timeslice)`
Starts recording.

```javascript
recorder.start(); // Record entire session
recorder.start(1000); // Create 1-second chunks
```

#### `stop()`
Stops recording.

```javascript
recorder.stop();
```

#### `pause()`
Pauses recording.

```javascript
recorder.pause();
```

#### `resume()`
Resumes recording.

```javascript
recorder.resume();
```

#### `requestData()`
Requests available recorded data.

```javascript
recorder.requestData();
```

### Events:

#### `start`
Recording started.

```javascript
recorder.addEventListener('start', () => {
  console.log("Recording started");
});
```

#### `dataavailable`
Recorded data is available.

```javascript
recorder.addEventListener('dataavailable', event => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
});
```

#### `stop`
Recording stopped.

```javascript
recorder.addEventListener('stop', () => {
  const blob = new Blob(recordedChunks, { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  // Use the recorded video
});
```

#### `error`
Recording error occurred.

```javascript
recorder.addEventListener('error', event => {
  console.error("Recording error:", event.error);
});
```

---

## ⚙️ Constraints

Constraints define the desired characteristics of media streams.

### Video Constraints:

#### Basic Video Constraints:
```javascript
const videoConstraints = {
  video: true,  // Request video
  audio: false  // No audio
};
```

#### Advanced Video Constraints:
```javascript
const advancedVideoConstraints = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
    frameRate: { min: 15, ideal: 30, max: 60 },
    facingMode: "user", // "user" or "environment"
    aspectRatio: 16/9
  },
  audio: true
};
```

#### Video Constraint Properties:
- **`width`**: Video width in pixels
- **`height`**: Video height in pixels
- **`frameRate`**: Frames per second
- **`facingMode`**: Camera direction (`"user"`, `"environment"`)
- **`aspectRatio`**: Width/height ratio
- **`resizeMode`**: How to handle resizing (`"none"`, `"crop-and-scale"`)

### Audio Constraints:

#### Basic Audio Constraints:
```javascript
const audioConstraints = {
  video: false,
  audio: true
};
```

#### Advanced Audio Constraints:
```javascript
const advancedAudioConstraints = {
  video: false,
  audio: {
    sampleRate: { ideal: 48000 },
    channelCount: { ideal: 2 },
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
};
```

#### Audio Constraint Properties:
- **`sampleRate`**: Audio sampling rate (Hz)
- **`channelCount`**: Number of audio channels
- **`echoCancellation`**: Remove echo feedback
- **`noiseSuppression`**: Reduce background noise
- **`autoGainControl`**: Automatic volume adjustment

### Constraint Value Types:

#### Exact Value:
```javascript
{ width: { exact: 1920 } }  // Must be exactly 1920
```

#### Range Values:
```javascript
{ width: { min: 640, max: 1920 } }  // Between 640-1920
```

#### Ideal Value:
```javascript
{ width: { ideal: 1920 } }  // Prefer 1920, but flexible
```

#### Multiple Options:
```javascript
{ width: { min: 640, ideal: 1920, max: 1920 } }
```

---

## ❌ Error Handling

Common errors and their meanings:

### Error Types:

#### `NotAllowedError`
User denied permission.
```javascript
if (error.name === 'NotAllowedError') {
  console.log("User denied camera/microphone access");
}
```

#### `NotFoundError`
No matching devices found.
```javascript
if (error.name === 'NotFoundError') {
  console.log("No camera or microphone found");
}
```

#### `NotReadableError`
Device is in use by another application.
```javascript
if (error.name === 'NotReadableError') {
  console.log("Device is busy or not accessible");
}
```

#### `OverconstrainedError`
Constraints cannot be satisfied.
```javascript
if (error.name === 'OverconstrainedError') {
  console.log("Constraints too restrictive:", error.constraint);
}
```

#### `SecurityError`
HTTPS required or other security issue.
```javascript
if (error.name === 'SecurityError') {
  console.log("Security error - check HTTPS");
}
```

### Error Handling Example:
```javascript
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    // Success
  })
  .catch(error => {
    switch (error.name) {
      case 'NotAllowedError':
        showMessage("Please allow camera and microphone access");
        break;
      case 'NotFoundError':
        showMessage("No camera or microphone found");
        break;
      case 'NotReadableError':
        showMessage("Camera/microphone is being used by another app");
        break;
      case 'OverconstrainedError':
        showMessage("Camera settings not supported");
        break;
      default:
        showMessage("Error accessing media devices: " + error.message);
    }
  });
```

---

## 💡 Best Practices

### 1. **Always Handle Errors**
```javascript
// Good
navigator.mediaDevices.getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);

// Bad
navigator.mediaDevices.getUserMedia(constraints)
  .then(handleSuccess);
```

### 2. **Use Appropriate Constraints**
```javascript
// Good - Reasonable constraints
const constraints = {
  video: { width: { ideal: 1280 }, height: { ideal: 720 } },
  audio: true
};

// Bad - Too restrictive
const constraints = {
  video: { width: { exact: 4096 }, height: { exact: 2160 } },
  audio: { sampleRate: { exact: 192000 } }
};
```

### 3. **Stop Tracks When Done**
```javascript
function stopAllTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}
```

### 4. **Check Device Capabilities**
```javascript
async function getDeviceCapabilities() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  
  if (videoDevices.length === 0) {
    throw new Error('No video devices found');
  }
}
```

### 5. **Provide User Feedback**
```javascript
function showPermissionRequest() {
  const message = "This app needs camera and microphone access to work properly.";
  showUserMessage(message);
}
```

### 6. **Handle Page Visibility**
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden && stream) {
    // Pause or stop stream when page is hidden
    stream.getTracks().forEach(track => track.enabled = false);
  } else {
    // Resume when page is visible
    stream.getTracks().forEach(track => track.enabled = true);
  }
});
```

---

## 📝 Code Examples

### Complete Camera Recorder Example:
```javascript
class CameraRecorder {
  constructor() {
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
  }
  
  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      this.setupVideo();
      this.setupRecorder();
    } catch (error) {
      this.handleError(error);
    }
  }
  
  setupVideo() {
    const video = document.querySelector('#preview');
    video.srcObject = this.stream;
    video.play();
  }
  
  setupRecorder() {
    this.recorder = new MediaRecorder(this.stream);
    
    this.recorder.addEventListener('dataavailable', event => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });
    
    this.recorder.addEventListener('stop', () => {
      this.saveRecording();
    });
  }
  
  startRecording() {
    this.chunks = [];
    this.recorder.start();
  }
  
  stopRecording() {
    this.recorder.stop();
  }
  
  saveRecording() {
    const blob = new Blob(this.chunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.mp4';
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  handleError(error) {
    console.error('Media error:', error);
    // Show user-friendly error message
  }
  
  destroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
```

### Photo Capture Example:
```javascript
function capturePhoto(video) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  ctx.drawImage(video, 0, 0);
  
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'photo.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
```

### Device Enumeration Example:
```javascript
async function listDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    const videoInputs = devices.filter(device => device.kind === 'videoinput');
    const audioInputs = devices.filter(device => device.kind === 'audioinput');
    const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
    
    console.log('Video inputs:', videoInputs);
    console.log('Audio inputs:', audioInputs);
    console.log('Audio outputs:', audioOutputs);
    
    return { videoInputs, audioInputs, audioOutputs };
  } catch (error) {
    console.error('Error enumerating devices:', error);
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Permission Denied**
**Problem**: User denies camera/microphone access
**Solution**: 
- Explain why permissions are needed
- Provide instructions to enable permissions
- Offer alternative functionality

#### 2. **HTTPS Required**
**Problem**: Site not served over HTTPS
**Solution**:
- Use HTTPS in production
- Use localhost for development
- Consider using ngrok for testing

#### 3. **Device Not Found**
**Problem**: No camera or microphone available
**Solution**:
- Check if devices are connected
- Try different constraint values
- Provide fallback options

#### 4. **Overconstrained Error**
**Problem**: Constraints too restrictive
**Solution**:
- Use `ideal` instead of `exact` values
- Provide multiple constraint options
- Fall back to basic constraints

#### 5. **Stream Not Stopping**
**Problem**: Camera light stays on after stopping
**Solution**:
```javascript
// Stop all tracks properly
stream.getTracks().forEach(track => {
  track.stop();
});
```

### Debug Helpers:

#### Check MediaDevices Support:
```javascript
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.error('MediaDevices API not supported');
}
```

#### Log Available Constraints:
```javascript
console.log('Supported constraints:', 
  navigator.mediaDevices.getSupportedConstraints());
```

#### Monitor Track States:
```javascript
stream.getTracks().forEach(track => {
  console.log(`Track ${track.kind}: ${track.readyState}`);
  
  track.addEventListener('ended', () => {
    console.log(`Track ${track.kind} ended`);
  });
});
```

---

## 📚 Additional Resources

### Specifications:
- [Media Capture and Streams API](https://w3c.github.io/mediacapture-main/)
- [MediaStream Recording API](https://w3c.github.io/mediacapture-record/)
- [Screen Capture API](https://w3c.github.io/mediacapture-screen-share/)

### Browser Documentation:
- [MDN Media Devices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [Chrome WebRTC Samples](https://webrtc.github.io/samples/)
- [Firefox Media Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)

### Tools:
- [WebRTC Troubleshooter](https://test.webrtc.org/)
- [MediaDevices Test Page](https://webrtc.github.io/samples/src/content/devices/input-output/)
- [Can I Use - MediaDevices](https://caniuse.com/mediadevices)

---

## 📄 License

This documentation is provided under the MIT License. Feel free to use, modify, and distribute.

---

**Created for the Camera Recorder Project** 📹
*Last updated: July 28, 2025*
