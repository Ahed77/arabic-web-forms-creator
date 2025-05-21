
import jsPDF from 'jspdf';
import { registerArabicFont } from './arabic-font-registration';

export interface PdfGenerationOptions {
  title?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: string;
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// Helper function to convert HTML to PDF with improved options
export const generatePDFFromHTML = (
  htmlContent: string, 
  options: PdfGenerationOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const {
        title = 'Document',
        filename = `document-${Date.now()}.pdf`,
        orientation = 'portrait',
        pageSize = 'a4',
        margins = {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      } = options;
      
      // Register Arabic font
      registerArabicFont();
      
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
        putOnlyUsedFonts: true,
      });
      
      // Use Arabic font
      pdf.setFont('arabic');
      
      // Generate PDF from HTML without header title (to match minimalist design)
      pdf.html(htmlContent, {
        callback: (doc) => {
          // Save the PDF
          doc.save(filename);
          resolve(filename);
        },
        x: margins.left,
        y: margins.top,
        width: 210 - (margins.left + margins.right), // A4 width is 210mm
        windowWidth: 800,
        autoPaging: 'text',
        html2canvas: {
          scale: 0.96, // Slightly reduce scale for better fitting
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};

// Function to generate a simple text-based PDF (without HTML)
export const generateSimplePDF = (
  textContent: string[], 
  options: PdfGenerationOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const {
        title = 'Document',
        filename = `document-${Date.now()}.pdf`,
        orientation = 'portrait',
        pageSize = 'a4'
      } = options;
      
      // Register Arabic font
      registerArabicFont();
      
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
        putOnlyUsedFonts: true,
      });
      
      // Use Arabic font
      pdf.setFont('arabic');
      
      // Add text content line by line
      pdf.setFontSize(12);
      textContent.forEach((line, index) => {
        pdf.text(line, 10, 20 + (index * 10), { align: 'right' });
      });
      
      // Save the PDF
      pdf.save(filename);
      resolve(filename);
    } catch (error) {
      console.error('Error generating simple PDF:', error);
      reject(error);
    }
  });
};
