import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Snowfall from 'react-snowfall';

function HomePage() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const audioRef = useRef(null);

  useEffect(() => {
    // Met à jour la position du curseur personnalisé
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleMusicPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleClick = () => {
    // Déclenche l'animation et joue la musique
    setIsAnimating(true);
    handleMusicPlay();
  };

  return (
    <div className="home-page" style={{ cursor: 'none' }}>
      {/* Chute de neige */}
      <Snowfall color="#fff" />

      {/* Musique de fond */}
      <audio ref={audioRef} src="cover.mp3" loop />

      {/* Contenu principal */}
      <h1 className="token-name">$ELF</h1>

      {/* Animation du rideau */}
      <CSSTransition
        in={isAnimating}
        timeout={1000}
        classNames="rideau"
        unmountOnExit
        onEntered={() => navigate('/door')} // Redirection après l'animation
      >
        <div className="transition-cover" />
      </CSSTransition>

      {/* Bouton d'entrée */}
      <a
        onClick={handleClick}
        className="enter-button"
        style={{ cursor: 'pointer', position: 'relative', zIndex: 2 }}
      >
        Enter
      </a>

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
          pointerEvents: 'none', // Empêche le curseur d'interagir
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      />
    </div>
  );
}

export default HomePage;
