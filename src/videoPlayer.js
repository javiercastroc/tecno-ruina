import React, { useRef, useEffect, useState, useCallback } from 'react';
import './App.css';

function VideoPlayer({ videoSources, bufferSize = 4  }) {
  const videoRefs = useRef([]);
  const [autoplayWithSound, setAutoplayWithSound] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState([]);

  const updateLoadedVideos = useCallback((currentVideoIndex = 0) => {
    // Calcula los índices de inicio y fin para cargar los videos en el buffer
    const startIndex = Math.max(currentVideoIndex - Math.floor(bufferSize / 2), 0);
    let endIndex = startIndex + bufferSize;
  
    const loaded = [];
    const addedIndices = new Set();
    
    for (let i = startIndex; i < endIndex; i++) {
      const adjustedIndex = i % videoSources.length; // Ajustar índice para el buffer circular
      if (!addedIndices.has(adjustedIndex)) {
        loaded.push({
          source: videoSources[adjustedIndex],
          index: adjustedIndex
        });
        addedIndices.add(adjustedIndex);
      };
    }
  
    setLoadedVideos(loaded);
  }, [videoSources, bufferSize]);

  useEffect(() => {
    updateLoadedVideos(0);
  }, [updateLoadedVideos, videoSources]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const videoIndex = videoRefs.current.findIndex(v => v === entry.target);
          if (videoIndex >= 0) {
            setTimeout(() => {
              const video = videoRefs.current[videoIndex];
              if (entry.isIntersecting && autoplayWithSound) {
                updateLoadedVideos(videoIndex);
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
  }, [autoplayWithSound, loadedVideos, updateLoadedVideos]);

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
      //nextVideo.muted = false;
      //nextVideo.play().catch(e => console.log('Error al reproducir el video:', e));
      scrollToCenter(nextVideo);
    }
  };
  

  return (
    <div className="App">
      <h1 className="title">Tecno Ruina</h1>
      <button onClick={togglePlayback} className="playback-button">
        {autoplayWithSound ? "Stop Videos" : "Play Videos"}
      </button>
      {loadedVideos.map(({ source, index }) => (
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
