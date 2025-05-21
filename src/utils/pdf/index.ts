
export { registerArabicFont } from './arabic-font-registration';
export { generatePDFFromHTML, generateSimplePDF, type PdfGenerationOptions } from './pdf-generator-core';
export { generateInvoicePDF, generateCustomerStatementPDF } from './invoice-pdf-generator';
export { generateReportPDF, generateProductReportPDF } from './report-pdf-generator';
export { generateDebtorStatementPDF } from './debt-pdf-generator';

// Added export for a new function that could help with debugging font issues
export const getPdfFontList = () => {
  const jsPDF = require('jspdf');
  const doc = new jsPDF();
  return doc.getFontList();
};
