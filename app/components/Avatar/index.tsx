"use client";

import React, { useState, useRef } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FemaleSpeakers from "../voices";
import AvatarModel from "../AvatarModels/AvatarModel"; 

export default function Avatar() {
  const [visemeIndex, setVisemeIndex] = useState<number>(0);
  const [selectedVoice, setSelectedVoice] = useState<string>("zh-CN-XiaoxiaoNeural");
  const [listening, setListening] = useState<boolean>(false);
  const [subtitles, setSubtitles] = useState<string>("Hi there! How can I help you today?");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const modelRef = useRef<any>(); 
  const cameraPosition: [number, number, number] = [0, 1, 25]; 
  const lightIntensity: number = 0.7;

  const SpeechKey = "";
  const SpeechRegion = "eastus";

  const synthesizeSpeech = (text: string) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(SpeechKey, SpeechRegion);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const languageCode = selectedVoice.split("-").slice(0, 2).join("-");
    const ssml = `<speak version='1.0' xml:lang='${languageCode}' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'>
        <voice name='${selectedVoice}'>
            <mstts:viseme type='redlips_front'/>
            ${text}
        </voice>
    </speak>`;

    synthesizer.visemeReceived = (s, e) => {
      console.log(`Viseme ID: ${e.visemeId}, Offset: ${e.audioOffset}`);
      setTimeout(() => setVisemeIndex(e.visemeId), e.audioOffset / 10000);
    };

    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Speech synthesized.");
          setListening(false);
          setVisemeIndex(0);
        } else {
          console.error("Speech synthesis error:", result.errorDetails);
          setError("Speech synthesis error");
        }
        synthesizer.close();
      },
      (err) => {
        console.error("Error synthesizing:", err);
        setError("Error synthesizing speech");
        synthesizer.close();
      }
    );
  };

  const startListening = () => {
    setListening(true);
    const speechConfig = sdk.SpeechConfig.fromSubscription(SpeechKey, SpeechRegion);
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizing = (_, event) => console.log(`Recognizing: ${event.result.text}`);
    recognizer.recognized = (_, event) => {
      if (event.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log(`Recognized: ${event.result.text}`);
        sendToBot(event.result.text);
        recognizer.stopContinuousRecognitionAsync(() => recognizer.close(), () => recognizer.close());
      }
    };
    recognizer.startContinuousRecognitionAsync();
  };

  const sendToBot = async (message: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Bot response:", data.response);

      setSubtitles(data.response);
      synthesizeSpeech(data.response);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("There was a problem communicating with the chatbot.");
    } finally {
      setLoading(false);
      setListening(false);
    }
  };

  const [textInput, setTextInput] = useState<string>("");

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendToBot(textInput);
      setTextInput("");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "40px", padding: "20px", margin: "100px 0 250px 250px" }}>
      {/* Left Side - Avatar Container */}
      <div style={{ flex: "0 0 auto" }}>
        <div
          style={{
            width: "440px",
            height: "440px",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: "10px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 30px rgba(0, 78, 146, 0.7)",
          }}
        >
          <Canvas
            camera={{ position: cameraPosition, fov: 36, near: 0.1, far: 1000 }}
            shadows
          >
            <ambientLight intensity={lightIntensity} />
            <spotLight
              position={[15, 10, 35]}
              angle={0.3}
              penumbra={1}
              castShadow
              intensity={lightIntensity}
            />
            <pointLight position={[10, 10, 10]} intensity={lightIntensity * 1000} />

            {/* Group with avatar model positioned and scaled to show the shoulder/upper area */}
            <group ref={modelRef} scale={0.11} position={[0, -5, 0]} rotation={[0, 0, 0]}>
              <AvatarModel visemeIndex={visemeIndex} />
            </group>

            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              target={[0, 0, 0]}
              minDistance={1}
              maxDistance={10}
            />
          </Canvas>
        </div>
      </div>

      {/* Right Side - Controls and Interface */}
      <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "flex-start", paddingTop: "20px" }}>
        
        {/* Voice Selection */}
        <div style={{ marginBottom: "20px", width: "100%" }}>
          <label htmlFor="voice-select" style={{ marginRight: "10px" }}>Select Voice: </label>
          <select 
            id="voice-select" 
            value={selectedVoice} 
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {FemaleSpeakers.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subtitles/Response Area */}
        <div
          style={{
            marginBottom: "20px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            fontSize: "18px",
            padding: "15px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "5px",
            minHeight: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-live="polite"
        >
          {loading ? "Thinking..." : subtitles}
        </div>

        {/* Error Message Display */}
        {error && (
          <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
        )}

        {/* Voice Input Button */}
        <button
          onClick={startListening}
          disabled={listening || loading}
          style={{
            marginBottom: "20px",
            backgroundColor: (listening || loading) ? "#888" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "12px 25px",
            fontSize: "16px",
            cursor: (listening || loading) ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 123, 255, 0.2)"
          }}
        >
          {listening ? "Listening..." : "Speak to Me"}
        </button>

        {/* Text Input Alternative */}
        <form onSubmit={handleTextSubmit} style={{ width: "100%", maxWidth: "500px", display: "flex" }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type your message here..."
            disabled={listening || loading}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px 0 0 5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            disabled={listening || loading || !textInput.trim()}
            style={{
              padding: "10px 15px",
              backgroundColor: (listening || loading || !textInput.trim()) ? "#888" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "0 5px 5px 0",
              cursor: (listening || loading || !textInput.trim()) ? "not-allowed" : "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>

  );
}
