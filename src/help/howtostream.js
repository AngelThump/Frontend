import React, { useEffect } from "react";
import OBS_OUTPUT_ADVANCED from "./OBS_OUTPUT_ADVANCED.png";
import OBS_STREAM_SETTING from "./OBS_STREAM_SETTING.png";

export default function HowToStream() {
  useEffect(() => {
    document.title = "How to Stream - AngelThump";
  }, []);

  return (
    <div className="help-center-panel">
      <div style={{ paddingTop: ".75rem", paddingBottom: ".75rem" }}>
        <div className="slds-grid slds-wrap slds-medium-nowrap slds-large-nowrap">
          <div className="slds-col--padded slds-size--12-of-12 slds-medium-size--8-of-12 slds-large-size--8-of-12 comm-layout-column">
            <div className="slds-rich-text-editor__output uiOutputRichText forceOutputRichText cKnowledgeArticle">
              <div className="guide">
                <h2>Broadcast Guidelines</h2>
              </div>
              <div className="bounding">
                <p className="help-mg-b-12">Here are the guidelines for streaming on AngelThump.</p>
                <div>
                  <h2 className="help-header">Broadcast Requirements</h2>
                  <p className="help-mg-b-12">The following settings are required to be compatible with broadcasting to the entire site:</p>
                  <h3 className="help-text">Video Requirements</h3>
                  <ul className="help-ul help-text">
                    <li>Codec: H.264 (x264) / NVENC / AVC / AV1 (Only on MediaMTX Ingest Servers)</li>
                    <li>Encoding Profile: High (preferred) or Main</li>
                    <li>Mode: Strict CBR</li>
                    <li>Keyframe Interval: 2 seconds</li>
                    <li>Framerates: 30 or 60 frames per second</li>
                    <li>Recommended bitrate range - 3 megabits per second</li>
                  </ul>
                  <h3 className="help-text">Audio Requirements</h3>
                  <ul className="help-ul help-text">
                    <li>Codec: AAC-LC. Stereo or Mono</li>
                    <li>Recommended Bitrate (for maximum compatibility) 96kbps</li>
                    <li>Maximum audio bit rate: 160 kbps (AAC)</li>
                    <li>Sampling frequency: any (AAC)</li>
                  </ul>
                </div>
                <div className="help-top"></div>
                <h2 className="help-header">How to stream on OBS</h2>
                <div>
                  <p className="help-mg-b-12">
                    First you would need to download
                    <a href="https://obsproject.com/download" rel="noopener noreferrer" target="_blank">
                      &nbsp;OBS
                    </a>
                  </p>
                  <h3 className="help-text"> OBS Stream Settings</h3>
                  <p className="help-mg-b-12">On your OBS, click settings and go to Stream to enter your settings. Click Service and choose Custom...</p>
                  <img className="help-img" alt="" src={OBS_STREAM_SETTING}></img>
                  <h3 className="help-text">
                    You may use the Auto Ingest link where it determines the nearest server. Put your{" "}
                    <a href="/settings/channel" rel="noopener noreferrer" target="_blank">
                      stream key
                    </a>{" "}
                    in the stream key box
                  </h3>
                  <ul className="help-ul help-text">
                    <li>{`rtmp://ingest.angelthump.com/live`}</li>
                    <li>
                      <a href="/help/ingests" rel="noopener noreferrer" target="_blank">
                        Otherwise get the nearest ingest from this link to get the best stability and reliability for your broadcast.
                      </a>
                    </li>
                  </ul>
                  <h3 className="help-text">OBS Output Settings (Advanced)</h3>
                  <img className="help-img" alt="" src={OBS_OUTPUT_ADVANCED}></img>
                  <p className="help-mg-b-12">
                    On your OBS, click settings and go to output to enter your settings using the provided guidelines up top. Please make sure your Keyframe interval is set to 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
