
import { generatePDFFromHTML } from './pdf-generator-core';

interface BusinessInfo {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  vatNumber?: string;
  tax?: number;
  logo?: string;
}

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
  barcode?: string;
}

interface InvoiceData {
  id?: string;
  date?: string;
  items: InvoiceItem[];
  total: number;
}

// Function to generate invoice PDF with proper Arabic support and simplified design
export const generateInvoicePDF = async (
  invoiceData: InvoiceData, 
  businessInfo: BusinessInfo = {}
): Promise<string> => {
  // Format date
  const formattedDate = invoiceData.date ? 
    new Date(invoiceData.date).toLocaleDateString('ar-SA') : 
    new Date().toLocaleDateString('ar-SA');
  
  // Invoice ID or timestamp
  const invoiceId = invoiceData.id || `INV-${Date.now().toString().substring(6)}`;
  
  // Generate simplified HTML for PDF based on the first screenshot design
  const htmlContent = `
    <div style="font-family: 'arabic', Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 22px; margin-bottom: 5px;">فاتورة مبيعات</h1>
      </div>
      
      <div style="margin-bottom: 20px; font-size: 14px; display: flex; justify-content: space-between;">
        <div>
          <div>الفاتورة: ${invoiceId}</div>
          <div>التاريخ: ${formattedDate}</div>
        </div>
        ${businessInfo?.name ? `<div>${businessInfo.name}</div>` : ''}
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">المنتج</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الكمية</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">سعر البيع</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map((item: InvoiceItem) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.productName}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.quantity}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.price.toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; text-align: left; font-weight: bold;">
        <div>الإجمالي الكلي: ${invoiceData.total.toFixed(2)}</div>
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: `فاتورة ${invoiceId}`,
    filename: `invoice-${invoiceId}.pdf`,
    pageSize: 'a4',
  });
};

// Function to generate a customer statement PDF
export const generateCustomerStatementPDF = async (
  customerName: string,
  customerPhone: string,
  transactions: {
    date: string;
    description: string;
    amount: number;
    type: 'دفعة' | 'دين';
  }[],
  balance: number,
  businessInfo: BusinessInfo = {}
): Promise<string> => {
  // Calculate totals
  const paidTotal = transactions
    .filter(t => t.type === 'دفعة')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const debtTotal = transactions
    .filter(t => t.type === 'دين')
    .reduce((sum, t) => sum + t.amount, 0);

  // Format current date
  const formattedDate = new Date().toLocaleDateString('ar-SA');
  const formattedTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  // Generate HTML content for the statement based on the fourth screenshot design
  const htmlContent = `
    <div style="font-family: 'arabic', Arial, sans-serif; direction: rtl; padding: 20px; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 22px; margin-bottom: 5px;">كشف حساب</h1>
        <div style="font-size: 18px; margin-bottom: 10px;">${customerName}</div>
      </div>
      
      <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
        <div style="font-size: 14px;">
          <div>مستحق عليه: ${balance.toFixed(2)}</div>
          <div>هاتف العميل: ${customerPhone}</div>
        </div>
        <div style="font-size: 14px; text-align: left;">
          <div>إجمالي الديون المسددة: ${paidTotal.toFixed(2)}</div>
          <div>إجمالي الديون المستحقة: ${debtTotal.toFixed(2)}</div>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">التاريخ والوقت</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">الملاحظة</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">نوع المعاملة</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">المبلغ</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(transaction => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${transaction.date}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${transaction.description}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: ${transaction.type === 'دفعة' ? 'green' : 'red'};">${transaction.type}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${transaction.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 30px; text-align: center; font-weight: bold;">
        <div style="font-size: 16px;">مستحق عليه: ${balance.toFixed(2)}</div>
      </div>
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <div>تم إنشاؤه في ${formattedDate} ${formattedTime}</div>
      </div>
    </div>
  `;
  
  return generatePDFFromHTML(htmlContent, {
    title: `كشف حساب - ${customerName}`,
    filename: `statement-${Date.now()}.pdf`,
    pageSize: 'a4',
  });
};
