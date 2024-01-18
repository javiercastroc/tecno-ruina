import React, { useRef, useEffect, useState, useCallback } from 'react';
import './App.css';
import useLoadMoreOnScroll from 'react-hook-pagination';

function VideoPlayer({ videoSources, bufferSize = 4  }) {
  const videoRefs = useRef([]);
  const [loadedVideos, setLoadedVideos] = useState(videoSources.slice(0, bufferSize));
  const [autoplayWithSound, setAutoplayWithSound] = useState(false);
  const lastElementRef = useRef();
  const scrollerRef = useRef();

  // Cargar más videos cuando se llega al final
  const loadMoreVideos = () => {
    // Evita cargar videos más allá del total disponible
    if (loadedVideos.length >= videoSources.length) return;
  
    const nextIndex = loadedVideos.length;
    const endIndex = Math.min(nextIndex + bufferSize, videoSources.length);
    const nextVideos = videoSources.slice(nextIndex, endIndex);
  
    setLoadedVideos(prevVideos => {
      // Asegúrate de no añadir duplicados
      const newVideos = nextVideos.filter(video => !prevVideos.includes(video));
      return [...prevVideos, ...newVideos];
    });
  };
  

  // Hook para detectar el scroll y cargar más videos
  const {
    start,
    end,
    isFetching,
    doneFetching,
    setIsFetching,
    forceDonefetching
  } = useLoadMoreOnScroll({ fetchSize: bufferSize, scroller: scrollerRef, limit: videoSources.length });

  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const videoIndex = videoRefs.current.findIndex(v => v === entry.target);
          if (videoIndex >= 0) {
            setTimeout(() => {
              const video = videoRefs.current[videoIndex];
              if (entry.isIntersecting && autoplayWithSound) {
                video.muted = false;
                video.play().catch(e => {
                  console.log('Error al reproducir el video:', e);
                });
              } else {
                if (video){video.pause();}
              }
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );
  
    loadedVideos.forEach(({ index }) => {
      const video = videoRefs.current[index];
      if (video) observer.observe(video);
    });
  
    return () => {
      loadedVideos.forEach(({ index }) => {
        const video = videoRefs.current[index];
        if (video) observer.unobserve(video);
      });
    };
  }, [autoplayWithSound, loadedVideos]);

  const scrollToCenter = (videoElement) => {
    if (videoElement) {
      const videoPosition = videoElement.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (videoElement.clientHeight / 2);
      window.scrollTo({ top: videoPosition, behavior: 'smooth' });
    }
  };
  
  const togglePlayback = () => {
    setAutoplayWithSound(!autoplayWithSound);
    if (!autoplayWithSound) {
      const firstVideo = videoRefs.current[0];
      if (firstVideo) {
        firstVideo.play().catch(e => console.log('Error al reproducir el video:', e));
        scrollToCenter(firstVideo);
      }
    }
  };
  
  const handleVideoEnd = (index) => () => {
    const nextVideoIndex = (index + 1) % videoSources.length;
    //updateLoadedVideos(nextVideoIndex);
    const nextVideo = videoRefs.current[nextVideoIndex];
    if (nextVideo && autoplayWithSound) {
      nextVideo.muted = false;
      nextVideo.play().catch(e => console.log('Error al reproducir el video:', e));
      scrollToCenter(nextVideo);
      if (nextVideoIndex === 0) loadMoreVideos();
    }
    // Verifica si es necesario cargar más videos
    if (nextVideoIndex === loadedVideos.length - 1) {
      loadMoreVideos(); // Llama a loadMoreVideos cuando estás cerca del final de los videos cargados
    }
  };
  

  return (
    <div className="App">
      <h1 className="title">Tecno Ruina</h1>
      <button onClick={togglePlayback} className="playback-button">
        {autoplayWithSound ? "Stop Videos" : "Play Videos"}
      </button>
      <div ref={scrollerRef} className="video-container">
      {loadedVideos.map((source, index) => (
        <React.Fragment key={source}>
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            muted={!autoplayWithSound}
            className="centered-video"
            onEnded={handleVideoEnd(index)}
            playsInline
          >
            <source src={source} type="video/mp4" />
          </video>
          {index < loadedVideos.length - 1 && <div className="spacer"></div>}
        </React.Fragment>
      ))}
      </div>
      <div ref={lastElementRef}></div> {/* Elemento para detectar el scroll */}
    </div>
  );
}

export default VideoPlayer;
