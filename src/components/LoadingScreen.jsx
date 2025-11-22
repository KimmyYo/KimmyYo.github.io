import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Wait 2 seconds before fading out
    const timer = setTimeout(() => setFade(true), 5000);

    // Remove loading screen after fade animation finishes (0.6s)
    const removeTimer = setTimeout(() => onDone(), 5600);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className={`loading-overlay ${fade ? "fade-out" : ""}`}>
      <div className="loading-content">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    </div>
  );
}
