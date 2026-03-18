export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ROBOFLOW_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "ROBOFLOW_API_KEY not configured" });
  }

  try {
    const { offer, wrtcParams } = req.body;

    const response = await fetch(
      "https://serverless.roboflow.com/webrtc/init",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          offer,
          workspace_name: wrtcParams.workspaceName,
          workflow_id: wrtcParams.workflowId,
          stream_output_names: wrtcParams.streamOutputNames,
          data_output_names: wrtcParams.dataOutputNames,
          processing_timeout: wrtcParams.processingTimeout || 3600,
          requested_plan: wrtcParams.requestedPlan || "webrtc-gpu-medium",
          requested_region: wrtcParams.requestedRegion || "us",
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Roboflow API error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: error.message });
  }
}
