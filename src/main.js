import { connectors, webrtc, streams } from "@roboflow/inference-sdk";

const CONFIG = {
  apiKey: "qk5IRigWesBxqBBwEQ1L",
  serverUrl: "https://serverless.roboflow.com",
  workspaceName: "siddhantsatotes-workspace",
  workflowId: "general-segmentation-api",
  streamOutputNames: ["annotated_image"],
  dataOutputNames: ["predictions"],
  requestedPlan: "webrtc-gpu-medium",
  requestedRegion: "us",
  classes: "drone"
};

let connection = null;
let isStreaming = false;

const video = document.getElementById("video");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const droneCountEl = document.getElementById("drone-count");
const detectionCount = document.getElementById("detection-count");
const startOverlay = document.getElementById("start-overlay");
const errorOverlay = document.getElementById("error-overlay");
const errorTitle = document.getElementById("error-title");
const errorMessage = document.getElementById("error-message");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

function setStatus(status, text) {
  statusDot.className = status;
  statusText.textContent = text;
}

function showError(title, message) {
  errorTitle.textContent = title;
  errorMessage.textContent = message;
  errorOverlay.classList.remove("hidden");
  setStatus("error", "Error");
}

function updateDroneCount(count) {
  droneCountEl.textContent = `Drones: ${count}`;

  if (count > 0) {
    detectionCount.textContent = `${count} Drone${count > 1 ? "s" : ""} Detected`;
    detectionCount.classList.remove("hidden");
  } else {
    detectionCount.classList.add("hidden");
  }
}

async function startDetection() {
  try {
    startBtn.disabled = true;
    startBtn.textContent = "Connecting...";
    setStatus("connecting", "Connecting");

    const connector = connectors.withApiKey(CONFIG.apiKey, { serverUrl: CONFIG.serverUrl });

    const stream = await streams.useCamera({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });

    connection = await webrtc.useStream({
      source: stream,
      connector,
      wrtcParams: {
        workspaceName: CONFIG.workspaceName,
        workflowId: CONFIG.workflowId,
        streamOutputNames: CONFIG.streamOutputNames,
        dataOutputNames: CONFIG.dataOutputNames,
        processingTimeout: 3600,
        requestedPlan: CONFIG.requestedPlan,
        requestedRegion: CONFIG.requestedRegion,
        workflowsParameters: {
          classes: CONFIG.classes
        }
      },
      onData: (data) => {
        console.log("Detection data:", data);

        if (data.count_objects !== undefined) {
          updateDroneCount(data.count_objects);
        } else if (data.predictions) {
          updateDroneCount(data.predictions.length);
        }
      },
      onError: (error) => {
        console.error("Stream error:", error);
        showError("Stream Error", error.message || "Connection lost");
        stopDetection();
      },
    });

    video.srcObject = await connection.remoteStream();

    startOverlay.classList.add("hidden");
    stopBtn.style.display = "flex";
    isStreaming = true;
    setStatus("streaming", "Detecting");
  } catch (error) {
    console.error("Start error:", error);

    let message = error.message;
    if (error.name === "NotAllowedError") {
      message =
        "Camera permission denied. Please allow camera access and try again.";
    } else if (error.name === "NotFoundError") {
      message = "No camera found on this device.";
    }

    showError("Connection Failed", message);
    startBtn.disabled = false;
    startBtn.textContent = "Start Detection";
  }
}

function stopDetection() {
  if (connection) {
    connection.cleanup();
    connection = null;
  }

  video.srcObject = null;
  isStreaming = false;

  startOverlay.classList.remove("hidden");
  stopBtn.style.display = "none";
  errorOverlay.classList.add("hidden");

  startBtn.disabled = false;
  startBtn.textContent = "Start Detection";

  setStatus("", "Ready");
  updateDroneCount(0);
}

startBtn.addEventListener("click", startDetection);
stopBtn.addEventListener("click", stopDetection);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && isStreaming) {
    stopDetection();
  }
});
