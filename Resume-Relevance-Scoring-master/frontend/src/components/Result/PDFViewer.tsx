import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { ScrollArea } from '../ui/scroll-area';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, onClose }) => {
    const [numPages, setNumPages] = useState<number | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
      setNumPages(numPages);
    }

    return (
        <button
            className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-20 z-50" 
            onClick={onClose}
        >
            <ScrollArea className="sm:h-5/6 rounded-md border" >
                <Document 
                    file={fileUrl} 
                    loading={'Loading Resume...'} 
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {Array.from({ length: numPages ?? 0 }, (_, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false}/>
                    ))}
                </Document>
            </ScrollArea>
        </button>
    );
};

export default PDFViewer;
