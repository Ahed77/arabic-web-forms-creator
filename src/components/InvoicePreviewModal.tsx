
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Share, FileText } from "lucide-react";
import InvoiceTemplate from './InvoiceTemplate';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

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
  const { businessInfo } = useSettings();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Open a new window with just the invoice content
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>طباعة الفاتورة</title>');
      printWindow.document.write('<meta charset="UTF-8">');
      printWindow.document.write('<link rel="stylesheet" href="/index.css" />');
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
      
      printWindow.document.write('<div class="print-container">');
      if (invoiceRef.current) {
        printWindow.document.write(invoiceRef.current.innerHTML);
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

  const handleExportPDF = async () => {
    toast({
      title: "جاري التحضير",
      description: "يتم تحضير ملف PDF للفاتورة",
    });

    try {
      const filename = await generateInvoicePDF(invoiceData, businessInfo);
      toast({
        title: "تم التحضير",
        description: `تم حفظ الفاتورة كملف PDF باسم ${filename}`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء ملف PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-indigo-600 mb-2">معاينة الفاتورة</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 flex justify-center gap-3">
          <Button onClick={handleExportPDF} className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>حفظ كـ PDF</span>
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>طباعة</span>
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            <span>مشاركة</span>
          </Button>
        </div>
        
        <div ref={invoiceRef} className="border border-gray-200 rounded-lg shadow-lg">
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
