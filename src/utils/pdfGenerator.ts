
import jsPDF from 'jspdf';
import { useSettings } from '@/contexts/SettingsContext';

interface PdfGenerationOptions {
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
      
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
      });
      
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

export const generateInvoicePDF = async (
  invoiceData: any, 
  businessInfo: any = null
): Promise<string> => {
  // Format date
  const formattedDate = invoiceData.date ? 
    new Date(invoiceData.date).toLocaleDateString('ar-SA') : 
    new Date().toLocaleDateString('ar-SA');
  
  // Generate HTML for PDF
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">${businessInfo?.name || 'اسم المتجر'}</h1>
        <div style="font-size: 14px; margin-bottom: 5px;">${businessInfo?.address || 'عنوان المتجر'}</div>
        <div style="font-size: 14px;">${businessInfo?.phone || 'رقم الهاتف'}</div>
        ${businessInfo?.email ? `<div style="font-size: 14px;">${businessInfo.email}</div>` : ''}
        <div style="margin-top: 15px; display: flex; justify-content: space-between;">
          <div>رقم الفاتورة: ${invoiceData.id || Date.now().toString()}</div>
          <div>التاريخ: ${formattedDate}</div>
        </div>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; padding: 20px;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">معلومات العميل</h2>
        <div>الاسم: العميل</div>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; padding: 20px;">
        <h2 style="font-size: 18px; margin-bottom: 15px;">تفاصيل الفاتورة</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">المنتج</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">الكمية</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">السعر</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map((item: any) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.productName}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.price.toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px;">
        <div style="text-align: left;">
          ${businessInfo?.tax > 0 ? `
            <div style="margin-bottom: 10px;">
              <span>إجمالي المنتجات: </span>
              <span>${invoiceData.total.toFixed(2)}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <span>الضريبة (${businessInfo.tax}%): </span>
              <span>${(invoiceData.total * businessInfo.tax / 100).toFixed(2)}</span>
            </div>
            <div style="height: 1px; background-color: #e5e7eb; margin: 10px 0;"></div>
            <div style="font-weight: bold; font-size: 18px;">
              <span>الإجمالي النهائي: </span>
              <span>${(invoiceData.total * (1 + businessInfo.tax / 100)).toFixed(2)}</span>
            </div>
          ` : `
            <div style="font-weight: bold; font-size: 18px;">
              <span>الإجمالي: </span>
              <span>${invoiceData.total.toFixed(2)}</span>
            </div>
          `}
        </div>
      </div>
      
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
        <div>شكراً لتعاملكم معنا</div>
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: `فاتورة رقم ${invoiceData.id || Date.now().toString()}`,
    filename: `invoice-${invoiceData.id || Date.now()}.pdf`,
  });
};

export const generateReportPDF = async (reportData: any, businessInfo: any = null): Promise<string> => {
  const formattedDate = new Date().toLocaleDateString('ar-SA');
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">${businessInfo?.name || 'اسم المتجر'}</h1>
        <div style="font-size: 14px; margin-bottom: 5px;">${businessInfo?.address || 'عنوان المتجر'}</div>
        <div style="font-size: 14px;">${businessInfo?.phone || 'رقم الهاتف'}</div>
        ${businessInfo?.email ? `<div style="font-size: 14px;">${businessInfo.email}</div>` : ''}
        <div style="margin-top: 15px;">
          <div>تاريخ التقرير: ${formattedDate}</div>
        </div>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; padding: 20px;">
        <h2 style="font-size: 18px; margin-bottom: 15px; text-align: center;">تقرير المخزون</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">باركود</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">اسم المنتج</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">الكمية</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">سعر الوحدة</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">القيمة الإجمالية</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map((item: any) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.barcode}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${item.totalPrice.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px;">
        <div style="text-align: left; font-weight: bold; font-size: 18px;">
          <span>إجمالي قيمة المخزون: </span>
          <span>${reportData.reduce((sum: number, item: any) => sum + item.totalPrice, 0).toFixed(2)}</span>
        </div>
      </div>
      
      <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
        <div>تقرير المخزون - ${formattedDate}</div>
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: "تقرير المخزون",
    filename: `inventory-report-${Date.now()}.pdf`,
  });
};
