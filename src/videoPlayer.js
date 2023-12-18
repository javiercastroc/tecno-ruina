import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function VideoPlayer({ videoSources }) {
  const videoRefs = useRef([]);
  const [autoplayWithSound, setAutoplayWithSound] = useState(false);

  // Configuración de la API de Intersección
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videoSources.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          console.log(`Video ${entry.target.id} is intersecting: ${entry.isIntersecting}`);
          const video = entry.target;
          if (autoplayWithSound && entry.isIntersecting) {
            video.muted = false;
            video.play().catch(e => console.log('Error al reproducir el video:', e));
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.1, 0.9] } // Ajustar umbrales según sea necesario
    );
    

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [autoplayWithSound]);

  const scrollToCenter = (videoElement) => {
    if (videoElement) {
      const videoPosition = videoElement.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2) + (videoElement.clientHeight / 2);
      window.scrollTo({ top: videoPosition, behavior: 'smooth' });
    }
  };
  
  const togglePlayback = () => {
    if (autoplayWithSound) {
      // Detener todos los videos
      videoRefs.current.forEach(video => video && video.pause());
      setAutoplayWithSound(false);
    } else {
      setAutoplayWithSound(true);
      const firstVideo = videoRefs.current[0];
      if (firstVideo) {
        firstVideo.muted = false;
        firstVideo.play().catch(e => console.log('Error al reproducir el video:', e));
        scrollToCenter(firstVideo);
      }
    }
  };
  
  const handleVideoEnd = (index) => () => {
    const nextVideoIndex = (index + 1) % videoSources.length;
    const nextVideo = videoRefs.current[nextVideoIndex];
    if (autoplayWithSound) {
      nextVideo.muted = false;
      nextVideo.play().catch(e => console.log('Error al reproducir el video:', e));
      scrollToCenter(nextVideo);
    }
  };
  

  return (
    <div className="App">
      <h1 className="title">Tecno Ruina</h1>
      <button onClick={togglePlayback} className="playback-button">
        {autoplayWithSound ? "Stop Videos" : "Play Videos"}
      </button> 
      {videoSources.map((source, index) => (
        <React.Fragment key={index}>
          <div className="video-container">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              muted={!autoplayWithSound}
              className="centered-video"
              onEnded={handleVideoEnd(index)}
              playsInline
            >
              <source src={source} type="video/mp4" />
            </video>
          </div>
          {index < videoSources.length - 1 && <div className="spacer"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default VideoPlayer;
