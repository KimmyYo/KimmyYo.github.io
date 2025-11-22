// src/components/CVViewer.jsx
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function CVViewer() {
  const [numPages, setNumPages] = useState(null);
  const A4_WIDTH = 794; // ~A4 width at 96dpi

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Document file="/CV.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        {numPages &&
          Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              className="cv-page-wrapper"
            >
              <Page
                pageNumber={i + 1}
                width={A4_WIDTH}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
      </Document>
    </div>
  );
}
