// CVModal.jsx
import CVViewer from "./CVViewer";

export default function CVModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="cv-modal-backdrop fade-up" onClick={onClose}>
      <div
        className="cv-modal-content fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="cv-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="cv-modal-body">
          <CVViewer />
        </div>
      </div>
    </div>
  );
}
