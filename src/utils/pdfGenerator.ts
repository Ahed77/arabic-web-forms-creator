
import jsPDF from 'jspdf';
import { useSettings } from '@/contexts/SettingsContext';
import arabic from '../assets/fonts/arabic-font';

interface PdfGenerationOptions {
  title?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: string;
}

// Register Arabic font for proper rendering of Arabic text
const registerArabicFont = () => {
  const doc = new jsPDF();
  doc.addFileToVFS('arabic-font.ttf', arabic);
  doc.addFont('arabic-font.ttf', 'arabic', 'normal');
};

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

// Function to generate invoice PDF with proper Arabic support
export const generateInvoicePDF = async (
  invoiceData: any, 
  businessInfo: any = null
): Promise<string> => {
  // Format date
  const formattedDate = invoiceData.date ? 
    new Date(invoiceData.date).toLocaleDateString('ar-SA') : 
    new Date().toLocaleDateString('ar-SA');
  
  // Generate HTML for PDF with improved styling
  const htmlContent = `
    <div style="font-family: 'arabic', Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="font-size: 24px; margin-bottom: 10px;">${businessInfo?.name || 'اسم المتجر'}</h1>
        <div style="font-size: 14px; margin-bottom: 5px;">${businessInfo?.address || 'عنوان المتجر'}</div>
        <div style="font-size: 14px;">${businessInfo?.phone || 'رقم الهاتف'}</div>
        ${businessInfo?.email ? `<div style="font-size: 14px;">${businessInfo.email}</div>` : ''}
        <div style="margin-top: 15px; display: flex; justify-content: space-between;">
          <div>رقم الفاتورة: ${invoiceData.id || Date.now().toString()}</div>
          <div>التاريخ: ${formattedDate}</div>
        </div>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; padding: 20px; background-color: #ffffff;">
        <h2 style="font-size: 18px; margin-bottom: 10px; color: #4f46e5;">معلومات العميل</h2>
        <div style="background-color: #eef2ff; padding: 10px; border-radius: 5px; border: 1px solid #e0e7ff;">الاسم: العميل</div>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; padding: 20px; background-color: #ffffff;">
        <h2 style="font-size: 18px; margin-bottom: 15px; color: #4f46e5; text-align: center;">تفاصيل الفاتورة</h2>
        <table style="width: 100%; border-collapse: collapse; border-radius: 5px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background-color: #eef2ff;">
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">المنتج</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">الكمية</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">السعر</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map((item: any, index: number) => `
              <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'}">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.productName}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.price.toFixed(2)}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px; background-color: #f9fafb;">
        <div style="text-align: left;">
          ${businessInfo?.tax > 0 ? `
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
              <span style="color: #4b5563;">إجمالي المنتجات: </span>
              <span style="font-weight: 500;">${invoiceData.total.toFixed(2)}</span>
            </div>
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
              <span style="color: #4b5563;">الضريبة (${businessInfo.tax}%): </span>
              <span style="font-weight: 500;">${(invoiceData.total * businessInfo.tax / 100).toFixed(2)}</span>
            </div>
            <div style="height: 1px; background-color: #e5e7eb; margin: 10px 0;"></div>
            <div style="font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; color: #4f46e5;">
              <span>الإجمالي النهائي: </span>
              <span>${(invoiceData.total * (1 + businessInfo.tax / 100)).toFixed(2)}</span>
            </div>
          ` : `
            <div style="font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; color: #4f46e5;">
              <span>الإجمالي: </span>
              <span>${invoiceData.total.toFixed(2)}</span>
            </div>
          `}
        </div>
      </div>
      
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div>شكراً لتعاملكم معنا</div>
        ${businessInfo?.vatNumber ? `<div style="margin-top: 5px; font-size: 12px;">الرقم الضريبي: ${businessInfo.vatNumber}</div>` : ''}
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: `فاتورة رقم ${invoiceData.id || Date.now().toString()}`,
    filename: `invoice-${invoiceData.id || Date.now()}.pdf`,
  });
};

// Function to generate reports PDF with proper Arabic support
export const generateReportPDF = async (reportData: any, businessInfo: any = null): Promise<string> => {
  const formattedDate = new Date().toLocaleDateString('ar-SA');
  
  const htmlContent = `
    <div style="font-family: 'arabic', Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="font-size: 24px; margin-bottom: 10px;">${businessInfo?.name || 'اسم المتجر'}</h1>
        <div style="font-size: 14px; margin-bottom: 5px;">${businessInfo?.address || 'عنوان المتجر'}</div>
        <div style="font-size: 14px;">${businessInfo?.phone || 'رقم الهاتف'}</div>
        ${businessInfo?.email ? `<div style="font-size: 14px;">${businessInfo.email}</div>` : ''}
        <div style="margin-top: 15px;">
          <div>تاريخ التقرير: ${formattedDate}</div>
        </div>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; padding: 20px; background-color: #ffffff;">
        <h2 style="font-size: 18px; margin-bottom: 15px; text-align: center; color: #4f46e5;">تقرير المخزون</h2>
        <table style="width: 100%; border-collapse: collapse; border-radius: 5px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background-color: #eef2ff;">
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">باركود</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">اسم المنتج</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">الكمية</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">سعر الوحدة</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #4f46e5;">القيمة الإجمالية</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map((item: any, index: number) => `
              <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'}">
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.barcode}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.totalPrice.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px; background-color: #f9fafb;">
        <div style="font-weight: bold; font-size: 18px; text-align: left; color: #4f46e5;">
          <span>إجمالي قيمة المخزون: </span>
          <span>${reportData.reduce((sum: number, item: any) => sum + item.totalPrice, 0).toFixed(2)}</span>
        </div>
      </div>
      
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div>تقرير المخزون - ${formattedDate}</div>
        ${businessInfo?.vatNumber ? `<div style="margin-top: 5px; font-size: 12px;">الرقم الضريبي: ${businessInfo.vatNumber}</div>` : ''}
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: "تقرير المخزون",
    filename: `inventory-report-${Date.now()}.pdf`,
  });
};
