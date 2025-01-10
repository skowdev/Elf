import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function DoorPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Position du curseur
  const [chatMessages, setChatMessages] = useState([]); // Messages dans la discussion
  const [userInput, setUserInput] = useState(''); // Entrée utilisateur
  const audioRef = useRef(null);

  // Gestion de la position du curseur personnalisé
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Démarre la musique quand la page est chargée
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  // Gestion de l'envoi des messages
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Ajoute le message utilisateur
    const newMessages = [...chatMessages, { sender: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput('');

    // Appelle l'API ChatGPT
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_API_KEY`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
        }),
      });

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Ajoute la réponse de l'assistant
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: assistantMessage }]);
    } catch (error) {
      console.error('Erreur lors de la communication avec ChatGPT:', error);
    }
  };

  // Charger le modèle 3D
  const Model = () => {
    const gltf = useRef();

    useEffect(() => {
      const loader = new GLTFLoader();
      loader.load('../finalihope.glb', (loadedModel) => {
        gltf.current = loadedModel;
      });
    }, []);

    if (!gltf.current) return null;
    return <primitive object={gltf.current.scene} scale={1} />;
  };

  return (
    <div className="door-page" style={{ cursor: 'none' }}> {/* Cache le curseur par défaut */}
      {/* Musique de fond */}
      <audio ref={audioRef} src="cover.mp3" loop />

      {/* Scène 3D */}
      

      {/* Curseur personnalisé */}
      <div
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: cursorPosition.y,
          left: cursorPosition.x,
          width: '40px',
          height: '40px',
          backgroundImage: 'url("cursor.png")', // Remplace par ton image PNG
          backgroundSize: 'cover',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      />

      {/* Bulle de discussion */}
      <div
        className="chat-bubble"
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '300px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '25px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          className="chat-header"
          style={{
            background: '#6C63FF',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Discussion
        </div>
        <div
          className="chat-messages"
          style={{ flex: 1, padding: '10px', overflowY: 'auto' }}
        >
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                margin: '5px 0',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  background: msg.sender === 'user' ? '#6C63FF' : '#E0E0E0',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  padding: '8px 12px',
                  borderRadius: '15px',
                  maxWidth: '80%',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div
          className="chat-input"
          style={{ padding: '10px', borderTop: '1px solid #ccc' }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ecrire un message..."
            style={{
              width: 'calc(100% - 40px)',
              padding: '10px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              marginLeft: '10px',
              padding: '10px',
              borderRadius: '50%',
              background: '#6C63FF',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoorPage;
