# Drone Detector

Real-time drone detection using Roboflow's cloud AI with WebRTC streaming.

## Features

- 📹 Live camera feed with rear camera preferred on mobile
- 🤖 YOLO26 model inference via Roboflow cloud GPUs
- 📦 Real-time bounding box visualization
- 📊 Live drone count display
- 📱 Mobile-friendly (iOS Safari, Android Chrome)
- 🔒 Secure API key handling via backend proxy
- 🌙 Dark minimal UI

## Project Structure

```
drone-detector/
├── package.json         # Dependencies
├── vercel.json          # Vercel deployment config
├── vite.config.js       # Vite build config
├── index.html           # Main HTML file
├── src/
│   └── main.js          # App logic with Roboflow SDK
├── api/
│   └── init-webrtc.js   # Vercel serverless proxy
├── .env.example         # Environment template
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
cd drone-detector
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```bash
ROBOFLOW_API_KEY=your_roboflow_api_key_here
```

Get your API key from: https://app.roboflow.com/settings/api

### 3. Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
cd drone-detector
vercel deploy --prod
```

### 3. Set Environment Variable

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add `ROBOFLOW_API_KEY` with your API key
3. Redeploy if needed

Your app will be live at `https://your-project.vercel.app`

## Test on Mobile

1. Open the Vercel URL on your phone
2. Tap "Start Detection"
3. Grant camera permission
4. Point at drones to detect them!

## Configuration

Edit `src/main.js` to customize:

```javascript
const CONFIG = {
    workspaceName: 'siddhantsatotes-workspace',
    workflowId: 'detect-count-and-visualize',
    streamOutputNames: ['output_image'],
    dataOutputNames: ['count_objects', 'predictions'],
    requestedPlan: 'webrtc-gpu-medium',  // small, medium, large
    requestedRegion: 'us'                 // us, eu, ap
};
```

### GPU Plans

| Plan | Use Case |
|------|----------|
| `webrtc-gpu-small` | Basic testing |
| `webrtc-gpu-medium` | Production use |
| `webrtc-gpu-large` | High performance |

## How It Works

1. **Camera Access**: Uses WebRTC to capture video from device camera
2. **Stream to Roboflow**: Video frames are sent to Roboflow's cloud GPUs
3. **AI Inference**: YOLO26 model detects drones in real-time
4. **Results Overlay**: Processed video with bounding boxes is streamed back
5. **Secure Proxy**: API key is kept server-side via Vercel serverless function

## Troubleshooting

### Camera Not Working
- Grant camera permissions in browser settings
- On iOS, ensure Safari has camera access in Settings
- Check that you're on HTTPS (Vercel provides this)

### Connection Failed
- Verify your `ROBOFLOW_API_KEY` is set correctly
- Check Roboflow dashboard for API usage limits
- Try a different region in CONFIG

### No Detections Showing
- Ensure good lighting conditions
- Point camera at clear sky or known drone location
- Check browser console for errors

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome (Desktop) | ✅ Full |
| Chrome (Android) | ✅ Full |
| Safari (Desktop) | ✅ Full |
| Safari (iOS 14.3+) | ✅ Full |
| Firefox | ✅ Full |
| Edge | ✅ Full |

## Security Notes

- API key is stored server-side (never exposed to browser)
- Uses Vercel serverless functions for secure proxy
- All traffic is encrypted via HTTPS

## License

MIT License - Use freely for personal and commercial projects.
