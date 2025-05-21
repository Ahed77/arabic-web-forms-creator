
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
  fontColor?: string;
  fontSize?: number;
}

// Helper function to convert HTML to PDF with improved options and error handling
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
      
      // First use default font
      pdf.setFont('helvetica');
      
      // Try to use Arabic font if available
      try {
        pdf.setFont('arabic');
      } catch (err) {
        console.warn("Could not set Arabic font, using default instead:", err);
      }
      
      // Generate PDF from HTML with error handling
      pdf.html(htmlContent, {
        callback: (doc) => {
          try {
            // Save the PDF
            doc.save(filename);
            resolve(filename);
          } catch (error) {
            console.error('Error saving PDF:', error);
            reject(error);
          }
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
      console.error('Error generating PDF from HTML:', error);
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
        pageSize = 'a4',
        fontColor = '#000000',
        fontSize = 12
      } = options;
      
      // Register Arabic font
      registerArabicFont();
      
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
        putOnlyUsedFonts: true,
      });
      
      // First use default font
      pdf.setFont('helvetica');
      
      // Try to use Arabic font if available
      try {
        pdf.setFont('arabic');
      } catch (err) {
        console.warn("Could not set Arabic font, using default instead:", err);
      }
      
      // Add text content line by line
      pdf.setFontSize(fontSize);
      
      // Convert hex color to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };
      
      const rgb = hexToRgb(fontColor);
      pdf.setTextColor(rgb.r, rgb.g, rgb.b);
      
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
