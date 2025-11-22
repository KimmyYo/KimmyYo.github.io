import { useState } from 'react'
export default function SpotifyPlaylistModal({
  isVisible,
  onClose
}) {
  const [loaded, setLoaded] = useState(false)
  return (
   <div
      className={`spotify-modal-container ${isVisible ? "visible" : "hidden"} ${loaded ? "loaded" : ""}`}
      onClick={isVisible ? onClose : undefined}
    >
      <div
        className="spotify-player-box"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="spotify-modal-body">
         <iframe
                 data-testid="embed-iframe" 
                 src="https://open.spotify.com/embed/playlist/0mj4PpYKwpzv16Pcd9bxMb?utm_source=generator&theme=0" 
                 width="100%" 
                 height="500" 
                 allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                 sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-forms"
                 loading="lazy"
                 style={{ border: "none"}}
                 onLoad={() => setLoaded(true)}  >
          </iframe>
        </div>
        <button className="spotify-modal-close-bottom" onClick={onClose}>
            🎧
         </button>
      </div>
    </div>
  )
}
