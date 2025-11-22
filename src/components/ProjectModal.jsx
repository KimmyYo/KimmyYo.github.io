import { useState } from "react"

export default function ProjectModal({ isOpen, onClose, project }) {
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen || !project) return null

  const handleCloseClick = () => {
    setIsClosing(true)             // 🔥 start fade-out animation
    setTimeout(() => {
      setIsClosing(false)          // reset for next open
      onClose()                    // actually close
    }, 300)                         // MUST match CSS duration
  }

  return (
    <div
      className={`project-modal-backdrop ${isClosing ? "closing" : "open"}`}
      onClick={handleCloseClick}
    >
      <div
        className={`project-modal ${isClosing ? "closing" : "open"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="project-modal-close"
          type="button"
          onClick={handleCloseClick}
        >
          ×
        </button>

        {project.eyebrow && (
          <p className="project-modal-eyebrow">{project.eyebrow}</p>
        )}

        <h2 className="project-modal-title">{project.title}</h2>

        {project.subtitle && (
          <p className="project-modal-subtitle">{project.subtitle}</p>
        )}

        {project.description && (
          <ul className="project-modal-body">
            {project.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="project-modal-link"
          >
            View project ↗
          </a>
        )}
      </div>
    </div>
  )
}
