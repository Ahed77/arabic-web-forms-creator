
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
  return new Promise((resolve, reject) => {
    try {
      const {
        filename = `debtor-statement-${debtor.name}-${Date.now()}.pdf`,
      } = options;

      // Register Arabic font
      registerArabicFont();
      
      // Create new document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
      });
      
      // Use default font first to avoid errors if Arabic font fails
      doc.setFont("helvetica");
      
      try {
        // Try to set Arabic font
        doc.setFont("arabic");
      } catch (err) {
        console.warn("Could not set Arabic font, using default instead:", err);
      }
      
      doc.setFontSize(20);
      
      // Title with improved styling
      const title = "كشف حساب مدين";
      doc.setTextColor(44, 62, 80); // Dark blue color
      doc.text(title, doc.internal.pageSize.width - 20, 20, { align: "right" });
      
      // Add decorative line under title
      doc.setDrawColor(52, 152, 219); // Blue color
      doc.setLineWidth(0.5);
      doc.line(doc.internal.pageSize.width - 70, 22, doc.internal.pageSize.width - 20, 22);
      
      // Date
      const currentDate = new Date().toLocaleDateString('ar-SA');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`تاريخ التقرير: ${currentDate}`, doc.internal.pageSize.width - 20, 28, { align: "right" });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Customer info section with better styling
      doc.setFillColor(245, 245, 245); // Light gray background
      doc.roundedRect(20, 35, doc.internal.pageSize.width - 40, 25, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.text(`الاسم: ${debtor.name}`, doc.internal.pageSize.width - 25, 43, { align: "right" });
      doc.text(`الهاتف: ${debtor.phone}`, doc.internal.pageSize.width - 25, 51, { align: "right" });
      
      // Additional info
      doc.setFontSize(12);
      doc.text(`النوع: ${debtor.type === 'customer' ? 'عميل' : 'مورد'}`, 40, 51);
      if (debtor.religion) {
        doc.text(`الديانة: ${debtor.religion}`, 40, 43);
      }
      
      // Summary section with enhanced visual styling
      const balance = debtor.totalDebt - debtor.totalPayment;
      const paymentPercentage = debtor.totalDebt === 0 ? 100 : Math.round((debtor.totalPayment / debtor.totalDebt) * 100);
      
      doc.setFillColor(235, 245, 251); // Light blue background
      doc.roundedRect(20, 70, doc.internal.pageSize.width - 40, 30, 3, 3, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(41, 128, 185); // Blue color for heading
      doc.text("ملخص الحساب المالي", doc.internal.pageSize.width - 25, 80, { align: "right" });
      doc.setTextColor(0, 0, 0); // Reset text color
      
      doc.setFontSize(14);
      const status = balance > 0 ? "مستحق عليه (مدين)" : "مستحق له (دائن)";
      doc.text(status + ":", doc.internal.pageSize.width - 25, 90, { align: "right" });
      
      doc.setTextColor(balance > 0 ? 192 : 39, 39, balance > 0 ? 57 : 174);
      doc.text(`${Math.abs(balance).toFixed(2)}`, doc.internal.pageSize.width - 75, 90, { align: "right" });
      doc.setTextColor(0, 0, 0); // Reset text color
      
      // Transactions table with improved styling
      doc.setFontSize(16);
      doc.setTextColor(41, 128, 185); // Blue color for heading
      doc.text("سجل المعاملات", doc.internal.pageSize.width - 25, 110, { align: "right" });
      doc.setTextColor(0, 0, 0); // Reset text color
      
      // Headers with gradient background
      doc.setFillColor(52, 152, 219); // Blue header
      doc.rect(20, 115, doc.internal.pageSize.width - 40, 10, "F");
      
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(11);
      doc.text("التاريخ", 30, 122);
      doc.text("الملاحظة", 80, 122);
      doc.text("النوع", 130, 122);
      doc.text("المبلغ", doc.internal.pageSize.width - 30, 122, { align: "right" });
      doc.setTextColor(0, 0, 0); // Reset text color
      
      // Transactions with alternating background
      let yPos = 130;
      const sortedTransactions = [...transactions]
        .filter(t => t.debtorId === debtor.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      sortedTransactions.forEach((transaction, index) => {
        const date = new Date(transaction.date).toLocaleDateString('ar-SA');
        const type = transaction.type === 'debt' ? 'دين' : 'دفعة';
        
        // Alternating row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245); // Light gray for even rows
          doc.rect(20, yPos - 5, doc.internal.pageSize.width - 40, 10, "F");
        }
        
        doc.setFontSize(10);
        doc.text(date, 30, yPos);
        
        // Truncate notes if too long
        const truncatedNotes = transaction.notes.length > 25 ? 
          transaction.notes.substring(0, 25) + "..." : 
          transaction.notes;
        doc.text(truncatedNotes, 80, yPos);
        
        // Colorize transaction type
        if (transaction.type === 'debt') {
          doc.setTextColor(192, 57, 43); // Red for debts
        } else {
          doc.setTextColor(39, 174, 96); // Green for payments
        }
        doc.text(type, 130, yPos);
        doc.text(transaction.amount.toFixed(2), doc.internal.pageSize.width - 30, yPos, { align: "right" });
        doc.setTextColor(0, 0, 0); // Reset text color
        
        yPos += 10;
        
        // Add new page if needed
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
          
          // Add continuation header
          doc.setFontSize(12);
          doc.text(`تابع كشف حساب: ${debtor.name}`, doc.internal.pageSize.width - 20, 15, { align: "right" });
          
          // Recreate table headers on new page
          doc.setFillColor(52, 152, 219); // Blue header
          doc.rect(20, 20, doc.internal.pageSize.width - 40, 10, "F");
          
          doc.setTextColor(255, 255, 255); // White text
          doc.setFontSize(11);
          doc.text("التاريخ", 30, 27);
          doc.text("الملاحظة", 80, 27);
          doc.text("النوع", 130, 27);
          doc.text("المبلغ", doc.internal.pageSize.width - 30, 27, { align: "right" });
          doc.setTextColor(0, 0, 0); // Reset text color
          
          yPos = 35;
        }
      });
      
      // Summary footer with enhanced visual styling
      yPos += 15;
      doc.setFillColor(235, 245, 251); // Light blue background
      doc.roundedRect(20, yPos - 10, doc.internal.pageSize.width - 40, 30, 3, 3, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(41, 128, 185); // Blue color
      doc.text("ملخص نهائي", doc.internal.pageSize.width - 25, yPos, { align: "right" });
      doc.setTextColor(0, 0, 0); // Reset text color
      
      yPos += 10;
      
      // Final summary details
      doc.text(`إجمالي الديون: ${debtor.totalDebt.toFixed(2)}`, doc.internal.pageSize.width - 25, yPos, { align: "right" });
      doc.text(`إجمالي الدفعات: ${debtor.totalPayment.toFixed(2)}`, doc.internal.pageSize.width - 120, yPos, { align: "right" });
      
      yPos += 10;
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(60, yPos - 5, 120, 10, 3, 3, 'F');
      doc.text(`نسبة السداد: ${paymentPercentage}%`, doc.internal.pageSize.width - 25, yPos, { align: "right" });
      
      const balanceText = `الرصيد: ${balance.toFixed(2)}`;
      doc.setTextColor(balance > 0 ? 192 : 39, 39, balance > 0 ? 57 : 174);
      doc.text(balanceText, doc.internal.pageSize.width - 120, yPos, { align: "right" });
      
      // Add a footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`صفحة ${i} من ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
      
      // Save and resolve the PDF file
      doc.save(filename);
      resolve(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};
