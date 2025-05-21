
import jsPDF from 'jspdf';
import arabic from '../../assets/fonts/arabic-font';

export const registerArabicFont = (): void => {
  try {
    const doc = new jsPDF();
    
    // First check if font is already registered to avoid duplicate registration
    const fontList = doc.getFontList();
    if (fontList.arabic) {
      return; // Font already registered
    }
    
    // Register the font if not already registered
    doc.addFileToVFS('arabic-font.ttf', arabic);
    doc.addFont('arabic-font.ttf', 'arabic', 'normal');
    
    console.log('Arabic font registered successfully');
  } catch (error) {
    console.error('Error registering Arabic font:', error);
  }
};
