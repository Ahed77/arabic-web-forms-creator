
import jsPDF from 'jspdf';
import arabic from '../../assets/fonts/arabic-font';

// Register Arabic font for proper rendering of Arabic text
export const registerArabicFont = (): void => {
  const doc = new jsPDF();
  doc.addFileToVFS('arabic-font.ttf', arabic);
  doc.addFont('arabic-font.ttf', 'arabic', 'normal');
};
