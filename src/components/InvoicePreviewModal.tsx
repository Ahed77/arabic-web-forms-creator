
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
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>طباعة الفاتورة</title>');
      printWindow.document.write('<link rel="stylesheet" href="/index.css" />');
      printWindow.document.write('</head><body>');
      
      if (invoiceRef.current) {
        printWindow.document.write('<div class="print-container">');
        printWindow.document.write(invoiceRef.current.innerHTML);
        printWindow.document.write('</div>');
      }
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      printWindow.addEventListener('load', () => {
        printWindow.focus();
        printWindow.print();
        printWindow.addEventListener('afterprint', () => {
          printWindow.close();
        });
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

  const handleExportPDF = () => {
    toast({
      title: "جاري التحضير",
      description: "يتم تحضير ملف PDF للفاتورة",
    });

    setTimeout(() => {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        if (invoiceRef.current) {
          pdf.html(invoiceRef.current, {
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
        }
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
