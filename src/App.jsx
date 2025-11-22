import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect } from 'react'

import { gsap } from 'gsap'
import * as THREE from 'three'
import MuseumModel from './components/MuseumModel'
import ProjectRaycaster from './components/RayCaster'
import ProjectModal from './components/ProjectModal'
import CVModal from "./components/CVModal";
import Loader from "./components/Loader"
import SpotifyPlaylistModal from './components/SpotifyPlaylistModal'



import './index.css'

// Map Blender names → info shown in the modal
const PROJECT_INFO = {
  Plane001: {
    eyebrow: "Side Project",
    title: "Median Voter Bot",
    subtitle: "Empowering Voters: Real-Time Political Insights via Telegram",
    description: [
      "Scraped and filtered Taiwan political news using Selenium and keyword-based logic, enabling timely and relevant updates.",
      "Applied SnowNLP and jieba for sentiment analysis on candidate mentions, delivering actionable insights through an interactive Telegram bot built with Python and Flask."
    ],
    link: "https://github.com/KimmyYo/MedianVoterBot"
  },
  Plane002: {
    eyebrow: 'Capstone Project',
    title: 'WishGather',
    subtitle: 'Sustainable Solutions for Minimizing Offering Waste',
    description:[
      'Improved product classification by leveraging the YOLO model with visual-semantic capabilities.',
      'Developed and integrated a linear programming–based resource allocation algorithm with offering I/O.'],
    link: 'https://github.com/KimmyYo/WishGather'
  },
  Plane003: {
    eyebrow: "Data Mining",
    title: "Classification And Clusering",
    subtitle: "Data Classification with KNN & K-Means Clustering",
    description: [
      "Implemented KNN and K-Means algorithms to classify datasets containing 8 known and 5 unknown types, improving clustering accuracy and pattern recognition."
    ],
    link: "https://github.com/KimmyYo/ClassificationAndClustering"
  },
  Plane004: {
    eyebrow: "Hackathon",
    title: "A R Can You Find a Parking Place?",
    subtitle: "AR-Powered Parking: 3D Navigation for Taipei",
    description: [
      "Integrated real-time parking data with custom APIs and 3D visualization to help drivers and visitors quickly locate available spaces.",
      "Combined MapBox navigation and AR.js for interactive city mapping, reducing search time and supporting Taipei’s smart city initiatives."
    ],
    link: "https://github.com/sitcon-hackathon2024-archive/team3_Taipei-City-Dashboard?tab=readme-ov-file"
  }
}

const CONTACTS = {
  Github: "https://github.com/KimmyYo",
  Email: "r14724011@ntu.edu.tw",
  LinkedIn: "https://www.linkedin.com/in/yachiyu/"
}

function RendererFix() {
  const { gl } = useThree()

  gl.physicallyCorrectLights = true
  gl.outputColorSpace = THREE.SRGBColorSpace

  gl.toneMapping = THREE.ACESFilmicToneMapping
  gl.toneMappingExposure = 0.1

  return null
}

export default function App() {
  const url = '/models/room.glb'
  const [isModelLoaded, setModelLoaded] = useState(false)

  const cameraAndLookAt = {
    intro: [[50, 80, 50], [0, 0, 0]],
    about: [[0, -2, 3], [1, 0, -2]],
    projects: [[3, 3, 2], [-3, 0, -1]],
    cv: [[-3, 0, 6], [-3, 0, 4]],
    contact: [[-2, -2, 1], [2, 0, 0]],
  }

  const sections = ['intro', 'about', 'projects', 'cv', 'contact']
  const [currentSection, setCurrentSection] = useState('intro')

  const controlsRef = useRef(null)
  const cameraRef = useRef(null)
  const [projectMeshes, setProjectMeshes] = useState([])
  const [activeProject, setActiveProject] = useState(null)

  const [showPDF, setShowPDF] = useState(false)
  const [spotifyVisible, setSpotifyVisible] = useState(false)
  const [spotifyInitialized, setSpotifyInitialized] = useState(false)


  // init camera for intro
  useEffect(() => {
    const cfg = cameraAndLookAt['intro']
    if (cameraRef.current && controlsRef.current && cfg) {
      const [cameraPos, lookAtPos] = cfg
      cameraRef.current.position.set(...cameraPos)
      controlsRef.current.target.set(...lookAtPos)
      controlsRef.current.update()
    }
  }, [])

  // animate camera on section change
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return
    const cfg = cameraAndLookAt[currentSection]
    if (!cfg) return

    const [cameraPos, lookAtPos] = cfg
    gsap.to(cameraRef.current.position, {
      x: cameraPos[0],
      y: cameraPos[1],
      z: cameraPos[2],
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => controlsRef.current.update(),
    })
    gsap.to(controlsRef.current.target, {
      x: lookAtPos[0],
      y: lookAtPos[1],
      z: lookAtPos[2],
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => controlsRef.current.update(),
    })
  }, [currentSection])

  const handleProjectClick = (index, mesh) => {
    let info = null
    const ipadCollection = ["Mesh_1", "Mesh_2", "Mesh_3", "Mesh_4", "IPad_Tablet_1"]

    if (ipadCollection.includes(mesh.name)) {
      setShowPDF(prev => !prev)
    } 
    else if (mesh.name.includes("Curve")) {
      if (mesh.name === "Curve") window.open(CONTACTS.LinkedIn, "_blank")
      if (mesh.name === "Curve001") window.open(CONTACTS.Github, "_blank")
      if (mesh.name === "Curve002") window.location.href = "mailto:" + CONTACTS.Email
    } 
    else if (mesh.name.includes("Spiral")){
      openPlaylist()
    }

    else {
      info = PROJECT_INFO[mesh.name]
    }

    if (info) {
      setActiveProject({ ...info, id: mesh.name })
    }
  }
  const openPlaylist = () => {
  if (!spotifyInitialized) setSpotifyInitialized(true) // mount iframe once
  setSpotifyVisible(true) // show overlay
  }

  const closePlaylist = () => {
    setSpotifyVisible(false) // hide overlay, iframe stays → music keeps playing
  }

  return (
    <>
      {(
        <>
        <section className="hero">
          {/* Left panel */}
          <div className="hero-panel hero-panel-left">
            <div className="hero-card">
              {currentSection === 'intro' && (
                <div className="hero-text fade-up">
                  <p className="hero-eyebrow">Welcome</p>
                  <h1 className="hero-title">
                    This is <span>Yachi Yu</span>
                  </h1>
                  <p className="hero-subtitle">
                    I love to build interactive systems that blend code, visuals, and urban data into functional and immersive experiences.
                  </p>
                  <div className="hero-tags">
                    #Urban · #Graphics · #AI
                  </div>
                </div>
              )}

              {currentSection === 'about' && (
                <div className="hero-text fade-up">
                  <p className="hero-eyebrow">About</p>
                  <h1 className="hero-title">
                    Inside the <span>Gallery</span>
                  </h1>
                  <p className="hero-subtitle">
                    Welcome to my gallery. <br/>Take a breath and explore what’s inside.
                  </p>
                </div>
              )}

              {currentSection === 'projects' && (
                <div className="hero-text fade-up">
                  <p className="hero-eyebrow">Projects</p>
                  <h1 className="hero-title">
                    On <span>Display</span>
                  </h1>
                  <p className="hero-subtitle">
                    These computer graphics pieces link to projects that blend data, AI, and interactive systems to explore the complexities of urban life.
                  </p>
                  <div className="hero-tags">
                    #ML · #Systems · #Vision · #NLP · #AR
                  </div>
                </div>
              )}

              {currentSection === 'cv' && (
                <div className="hero-text fade-up">
                  <p className="hero-eyebrow">CV</p>
                  <h1 className="hero-title">
                    Experience & <span>Background</span>
                  </h1>
                  <p className="hero-subtitle">
                    Browse my CV for a full look at my work and experience.
                  </p>
                </div>
              )}

              {currentSection === 'contact' && (
                <div className="hero-text fade-up">
                  <p className="hero-eyebrow">Contact</p>
                  <h1 className="hero-title">
                    Let’s <span>Connect</span>
                  </h1>
                  <p className="hero-subtitle">
                    Feel free to explore my work on GitHub or connect with me on LinkedIn.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Canvas (fixed on right) */}
          <div className={`hero-canvas-wrapper ${isModelLoaded ? 'loaded' : ''}`}>
             {!isModelLoaded && (
              <div className="loading-wrapper">
                 <Loader />
              </div>
            )}
            <Canvas
              camera={{ position: [50, 80, 50], fov: 45 }}
              onCreated={({ camera }) => (cameraRef.current = camera)}
            >
              <RendererFix />
              <color attach="background" args={['#050505']} />

              <Suspense fallback={null}>
                <MuseumModel 
                  url={url} 
                  onProjectsReady={setProjectMeshes}
                  onLoaded={() => setModelLoaded(true)} />
              </Suspense>

              <ProjectRaycaster
                projectMeshes={projectMeshes}
                onProjectClick={handleProjectClick}
              />

              <OrbitControls
                ref={controlsRef}
                enableDamping
                enablePan={false}
                target={[0, 1, 0]}
                minDistance={2.5}
                maxDistance={30}
                minPolarAngle={Math.PI / 10}
                maxPolarAngle={Math.PI / 2.2}
                minAzimuthAngle={-Math.PI / 2}
                maxAzimuthAngle={Math.PI / 2.5}
              />
            </Canvas>
          </div>

          {/* Section icon bar (bottom-right corner) */}
          <div className="section-icon-bar">
            {sections.map((sec) => (
              <button
                key={sec}
                className={`section-icon ${currentSection === sec ? 'active' : ''}`}
                onClick={() => setCurrentSection(sec)}
                title={sec.charAt(0).toUpperCase() + sec.slice(1)}
              >
                {sec === 'intro' && '🏠'}
                {sec === 'about' && '💡'}
                {sec === 'projects' && '🧩'}
                {sec === 'cv' && '📄'}
                {sec === 'contact' && '✉️'}
              </button>
            ))}
          </div>

          <ProjectModal
            isOpen={!!activeProject}
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />

          <CVModal
            open={showPDF}
            onClose={() => setShowPDF(false)}
          />

         {spotifyInitialized && (
          <Suspense fallback={<div>Loading...</div>}>
            <SpotifyPlaylistModal
              isVisible={spotifyVisible}
              onClose={closePlaylist}
            />
          </Suspense>
        )}
        </section>
        <footer className="site-footer">
          <p>ⓒ Yachi Yu</p>
        </footer>
        </>
      )}
      
    </>
  )
}
