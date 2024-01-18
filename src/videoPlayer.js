import React, { useRef, useEffect, useState, useCallback  } from 'react';
import './App.css';

function VideoPlayer({ videoSources,bufferSize = 2  }) {
  const videoRefs = useRef([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [autoplayWithSound, setAutoplayWithSound] = useState(false);

  // Actualizar esta función para manejar la carga dinámica
  const updateLoadedVideos = useCallback((index) => {
    setLoadedVideos(currentLoadedVideos => {
      let newLoadedVideos = [...currentLoadedVideos];

      // Asegúrate de que el video actual y los siguientes bufferSize videos estén marcados para cargar
      for (let i = index; i <= index + bufferSize && i < videoSources.length; i++) {
        if (!newLoadedVideos.some(v => v.index === i)) {
          newLoadedVideos.push({ source: videoSources[i], index: i, shouldLoad: true });
        }
      }

      return newLoadedVideos;
    });
  }, [bufferSize, videoSources]);

  useEffect(() => {
    updateLoadedVideos(0);
  }, [updateLoadedVideos]);

  // Configuración de la API de Intersección y manejo del buffer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const videoIndex = videoRefs.current.findIndex(v => v === entry.target);
        if (videoIndex >= 0) {
          if (autoplayWithSound && entry.isIntersecting) {
            entry.target.muted = false;
            entry.target.play().catch(e => console.log('Error al reproducir el video:', e));
          } else {
            entry.target.pause();
          }

          if (entry.isIntersecting) {
            updateLoadedVideos(videoIndex);
          }
        }
      });
    }, { threshold: [0.1, 0.9] });
    

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [autoplayWithSound,loadedVideos, bufferSize, videoSources]);



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
    if (nextVideo) {
      videoRefs.current[index].pause();
      nextVideo.muted = autoplayWithSound ? false : true;
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
      {loadedVideos.map(({ source, index, shouldLoad }) => (
        shouldLoad && (
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
          </React.Fragment>)
      ))}
    </div>
  );
}

export default VideoPlayer;
