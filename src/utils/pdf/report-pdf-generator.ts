
import { generatePDFFromHTML } from './pdf-generator-core';

interface BusinessInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  vatNumber?: string;
  tax?: number;
}

interface ReportItem {
  barcode: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Function to generate reports PDF with proper Arabic support
export const generateReportPDF = async (
  reportData: ReportItem[], 
  businessInfo: BusinessInfo = {}
): Promise<string> => {
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
            ${reportData.map((item: ReportItem, index: number) => `
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
          <span>${reportData.reduce((sum: number, item: ReportItem) => sum + item.totalPrice, 0).toFixed(2)}</span>
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
