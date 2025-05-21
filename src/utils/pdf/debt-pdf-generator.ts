
import jsPDF from 'jspdf';
import { registerArabicFont } from './arabic-font-registration';
import { PdfGenerationOptions } from './pdf-generator-core';

interface DebtorTransaction {
  id: string;
  type: 'debt' | 'payment';
  amount: number;
  date: string;
  notes: string;
}

interface Debtor {
  id: string;
  name: string;
  phone: string;
  religion?: string;
  type: 'customer' | 'supplier';
  totalDebt: number;
  totalPayment: number;
}

export const generateDebtorStatementPDF = (
  debtor: Debtor,
  transactions: DebtorTransaction[],
  options: PdfGenerationOptions = {}
): Promise<string> => {
  return new Promise((resolve) => {
    const {
      filename = `debtor-statement-${debtor.name}-${Date.now()}.pdf`,
    } = options;

    // Register Arabic font
    registerArabicFont();
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });
    
    doc.setFont("arabic");
    doc.setFontSize(20);
    
    // Title
    doc.text("كشف حساب مدين", doc.internal.pageSize.width - 20, 20, { align: "right" });
    
    // Customer info
    doc.setFontSize(15);
    doc.text(`الاسم: ${debtor.name}`, doc.internal.pageSize.width - 20, 35, { align: "right" });
    doc.text(`الهاتف: ${debtor.phone}`, doc.internal.pageSize.width - 20, 45, { align: "right" });
    doc.text(`النوع: ${debtor.type === 'customer' ? 'عميل' : 'مورد'}`, doc.internal.pageSize.width - 20, 55, { align: "right" });
    
    // Summary
    const balance = debtor.totalDebt - debtor.totalPayment;
    const paymentPercentage = debtor.totalDebt === 0 ? 100 : Math.round((debtor.totalPayment / debtor.totalDebt) * 100);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 65, doc.internal.pageSize.width - 40, 30, "F");
    
    doc.setFontSize(16);
    doc.text("ملخص الحساب المالي", doc.internal.pageSize.width - 20, 75, { align: "right" });
    
    doc.setFontSize(14);
    const status = balance > 0 ? "مستحق عليه (مدين)" : "مستحق له (دائن)";
    doc.text(status + ":", doc.internal.pageSize.width - 20, 85, { align: "right" });
    
    doc.setTextColor(balance > 0 ? 220 : 0, 0, balance > 0 ? 0 : 220);
    doc.text(`${Math.abs(balance).toFixed(2)}`, doc.internal.pageSize.width - 40, 85, { align: "right" });
    doc.setTextColor(0, 0, 0);
    
    // Transactions table
    doc.setFontSize(14);
    doc.text("سجل المعاملات", doc.internal.pageSize.width - 20, 110, { align: "right" });
    
    // Headers
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 115, doc.internal.pageSize.width - 40, 10, "F");
    
    doc.setFontSize(12);
    doc.text("التاريخ", 30, 122);
    doc.text("الملاحظة", 70, 122);
    doc.text("النوع", 120, 122);
    doc.text("المبلغ", doc.internal.pageSize.width - 40, 122, { align: "right" });
    
    // Transactions
    let yPos = 135;
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('ar-SA');
      const type = transaction.type === 'debt' ? 'دين' : 'دفعة';
      
      doc.setFontSize(10);
      doc.text(date, 30, yPos);
      doc.text(transaction.notes.slice(0, 20), 70, yPos);
      
      if (transaction.type === 'debt') {
        doc.setTextColor(220, 0, 0);
      } else {
        doc.setTextColor(0, 180, 0);
      }
      doc.text(type, 120, yPos);
      doc.text(transaction.amount.toFixed(2), doc.internal.pageSize.width - 40, yPos, { align: "right" });
      doc.setTextColor(0, 0, 0);
      
      yPos += 10;
      
      // Add new page if needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Summary at the bottom
    yPos += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, doc.internal.pageSize.width - 40, 25, "F");
    
    yPos += 8;
    doc.setFontSize(12);
    doc.text(`إجمالي الديون: ${debtor.totalDebt.toFixed(2)}`, doc.internal.pageSize.width - 20, yPos, { align: "right" });
    doc.text(`إجمالي الدفعات: ${debtor.totalPayment.toFixed(2)}`, doc.internal.pageSize.width - 120, yPos, { align: "right" });
    
    yPos += 10;
    doc.text(`نسبة السداد: ${paymentPercentage}%`, doc.internal.pageSize.width - 20, yPos, { align: "right" });
    doc.text(`الرصيد: ${balance.toFixed(2)}`, doc.internal.pageSize.width - 120, yPos, { align: "right" });
    
    // Save PDF
    doc.save(filename);
    resolve(filename);
  });
};
