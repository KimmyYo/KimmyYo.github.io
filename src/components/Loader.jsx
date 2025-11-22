import Lottie from "lottie-react"
import { TypeAnimation } from 'react-type-animation'
import loaderAnimation from "../assets/loader.json"

export default function Loader({
  loop = true,
  className = "",
  style,
}) {
  return (
    <div className="loading-wrapper">
      <div className={`loader-container ${className}`} style={style}>
        
        <div className="lottie-wrapper">
          <Lottie
            animationData={loaderAnimation}
            loop={loop}
            autoplay
          />
        </div>

        <div className="typing-loader">
          <TypeAnimation
            sequence={[
              "Welcome to Yachi's Gallery", 
              1000
            ]}
            style={{
              fontSize: '0.5em',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}
            speed={50}
            repeat={1}
          />
        </div>

      </div>
    </div>
  );
}
