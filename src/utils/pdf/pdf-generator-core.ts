
import jsPDF from 'jspdf';
import { registerArabicFont } from './arabic-font-registration';

export interface PdfGenerationOptions {
  title?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: string;
}

// Helper function to convert HTML to PDF
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
      
      // Add document title
      pdf.setFontSize(16);
      pdf.text(title, 20, 20);
      
      // Add the HTML content
      pdf.html(htmlContent, {
        callback: (doc) => {
          doc.save(filename);
          resolve(filename);
        },
        x: 10,
        y: 30,
        width: 190,
        windowWidth: 800
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};
