
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Share, FileText } from "lucide-react";
import InvoiceTemplate from './InvoiceTemplate';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: {
    id?: string;
    date?: string;
    items: any[];
    total: number;
  };
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  invoiceData 
}) => {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Open a new window with just the invoice content
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>طباعة الفاتورة</title>');
      printWindow.document.write('<meta charset="UTF-8">');
      // Include the full CSS from your application
      printWindow.document.write('<link rel="stylesheet" href="/index.css" />');
      // Add specific print styles
      printWindow.document.write(`
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .print-container { width: 100%; max-width: 100%; padding: 0; margin: 0; }
          }
          body { direction: rtl; }
        </style>
      `);
      printWindow.document.write('</head><body>');
      
      // Only include the invoice template with printMode=true
      printWindow.document.write('<div class="print-container">');
      if (invoiceRef.current) {
        // Create a clone of the invoice template with printMode=true
        const invoiceClone = document.createElement('div');
        invoiceClone.innerHTML = `
          <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 0;">
            ${renderInvoiceHTML(invoiceData)}
          </div>
        `;
        printWindow.document.write(invoiceClone.innerHTML);
      }
      printWindow.document.write('</div>');
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.addEventListener('afterprint', () => {
            printWindow.close();
          });
        }, 300);
      });
    }
  };

  // Helper function to render invoice HTML
  const renderInvoiceHTML = (data: any) => {
    const { id, date, items, total } = data;
    const formattedDate = date ? new Date(date).toLocaleDateString('ar-SA') : new Date().toLocaleDateString('ar-SA');
    
    return `
      <div style="border: 2px solid #ddd; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; max-width: 100%; direction: rtl;">
        <!-- Header -->
        <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 20px; text-align: center;">
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
            <div style="font-size: 0.875rem; opacity: 0.75;">رقم الفاتورة: ${id || Date.now().toString()}</div>
            <div style="font-size: 0.875rem; opacity: 0.75;">التاريخ: ${formattedDate}</div>
          </div>
          <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px;">اسم المتجر</h1>
          <div style="font-size: 0.875rem;">عنوان المتجر</div>
          <div style="font-size: 0.875rem;">رقم الهاتف</div>
        </div>

        <!-- Customer Info -->
        <div style="padding: 20px; background: white; border-bottom: 1px solid #eee;">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 10px; text-align: right;">معلومات العميل</h2>
          <div style="text-align: right;">
            <div>الاسم: العميل</div>
          </div>
        </div>

        <!-- Invoice Items -->
        <div style="padding: 20px; background: white;">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 16px; text-align: right;">تفاصيل الفاتورة</h2>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6; text-align: right;">
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">المنتج</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">الكمية</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">السعر</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb;">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item: any) => `
                  <tr style="border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.productName}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.quantity}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.price.toFixed(2)}</td>
                    <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Total -->
        <div style="padding: 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 4px;">الإجمالي: ${total.toFixed(2)}</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 16px; text-align: center;">
          <div style="font-size: 0.875rem;">شكراً لتعاملكم معنا</div>
        </div>
      </div>
    `;
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'فاتورة مبيعات',
          text: `فاتورة رقم ${invoiceData.id || ''} بإجمالي ${invoiceData.total.toFixed(2)}`,
        });
        
        toast({
          title: "تمت المشاركة",
          description: "تمت مشاركة الفاتورة بنجاح",
        });
      } else {
        toast({
          title: "غير متاح",
          description: "مشاركة الفاتورة غير متاحة على هذا الجهاز",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sharing invoice:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء مشاركة الفاتورة",
        variant: "destructive"
      });
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "جاري التحضير",
      description: "يتم تحضير ملف PDF للفاتورة",
    });

    setTimeout(() => {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Get the HTML content for the PDF
        const htmlContent = renderInvoiceHTML(invoiceData);
        
        // Add the HTML content to the PDF
        pdf.html(htmlContent, {
          callback: (doc) => {
            doc.save(`فاتورة-${invoiceData.id || Date.now()}.pdf`);
            toast({
              title: "تم التحضير",
              description: "تم تحضير ملف PDF بنجاح",
            });
          },
          x: 10,
          y: 10,
          width: 190,
          windowWidth: 800
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إنشاء ملف PDF",
          variant: "destructive"
        });
      }
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">معاينة الفاتورة</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span>طباعة</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1">
            <Share className="h-4 w-4" />
            <span>مشاركة</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </Button>
        </div>
        
        <div ref={invoiceRef}>
          <InvoiceTemplate
            invoiceId={invoiceData.id}
            date={invoiceData.date}
            items={invoiceData.items}
            totalAmount={invoiceData.total}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewModal;
