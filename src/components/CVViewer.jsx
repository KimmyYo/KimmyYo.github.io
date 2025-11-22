// src/components/CVViewer.jsx
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// For Vite: put pdf.worker.mjs in /public and use this path
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function CVViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(794); // default A4-ish width
  const containerRef = useRef(null);

  const A4_WIDTH = 794; // max width in px

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Watch container width and update pageWidth
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    const updateWidth = () => {
      const w = element.clientWidth;
      // Use container width but don't exceed A4 width
      setPageWidth(Math.min(w, A4_WIDTH));
    };

    updateWidth(); // initial

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Document
        file="/CV.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p>Loading CV…</p>}
      >
        {numPages &&
          Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="cv-page-wrapper">
              <Page
                pageNumber={i + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
      </Document>
    </div>
  );
}
