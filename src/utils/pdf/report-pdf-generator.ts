
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

// Function to generate reports PDF with minimalist design based on third screenshot
export const generateReportPDF = async (
  reportData: ReportItem[], 
  businessInfo: BusinessInfo = {}
): Promise<string> => {
  const formattedDate = new Date().toLocaleDateString('ar-SA');
  const formattedTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  
  // Calculate total value
  const totalValue = reportData.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const htmlContent = `
    <div style="font-family: 'arabic', Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <div style="text-align: left; font-size: 12px; color: #666;">
          تاريخ تقرير المخزون: ${formattedDate} - ${formattedTime}
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">باركود</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">اسم المنتج</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الكمية</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">سعر الوحدة</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">القيمة الإجمالية</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.map((item: ReportItem) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.barcode}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.name}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.quantity}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.unitPrice.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.totalPrice.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #f9f9f9; font-weight: bold;">
            <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right;">إجمالي قيمة المخزون:</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${totalValue.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="text-align: center; font-size: 12px; color: #666; margin-top: 30px;">
        <div>نهاية التقرير</div>
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: "تقرير المخزون",
    filename: `inventory-report-${Date.now()}.pdf`,
    pageSize: 'a4',
  });
};

// Function to generate a single product report
export const generateProductReportPDF = async (
  product: {
    barcode: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    description?: string;
    category?: string;
  },
  businessInfo: BusinessInfo = {}
): Promise<string> => {
  const formattedDate = new Date().toLocaleDateString('ar-SA');
  
  const htmlContent = `
    <div style="font-family: 'arabic', Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 22px; margin-bottom: 5px;">تقرير منتج</h1>
      </div>
      
      <div style="margin-bottom: 30px; border: 1px solid #eee; padding: 15px; background-color: #f9f9f9;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">${product.name}</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div>الباركود: ${product.barcode}</div>
          <div>الكمية المتوفرة: ${product.quantity}</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>سعر الوحدة: ${product.unitPrice.toFixed(2)}</div>
          <div>القيمة الإجمالية: ${product.totalPrice.toFixed(2)}</div>
        </div>
        ${product.category ? `<div style="margin-top: 10px;">التصنيف: ${product.category}</div>` : ''}
        ${product.description ? `<div style="margin-top: 10px;">الوصف: ${product.description}</div>` : ''}
      </div>
      
      <div style="text-align: center; font-size: 12px; color: #666; margin-top: 30px;">
        <div>تاريخ التقرير: ${formattedDate}</div>
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: `تقرير منتج - ${product.name}`,
    filename: `product-report-${product.barcode}-${Date.now()}.pdf`,
    pageSize: 'a4',
  });
};
