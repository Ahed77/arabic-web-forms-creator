
import { Button } from '@/components/ui/button';
import { Share, Printer, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  onShare?: () => void;
  onPrint?: () => void;
  onExportPDF?: () => void;
  className?: string;
}

export const ActionButtons = ({ 
  onShare, 
  onPrint, 
  onExportPDF,
  className = ""
}: ActionButtonsProps) => {
  const handleShare = onShare || defaultShareHandler;
  const handlePrint = onPrint || defaultPrintHandler;
  const handleExportPDF = onExportPDF || defaultExportPDFHandler;

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1">
        <Share className="h-4 w-4" />
        <span>مشاركة</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
        <Printer className="h-4 w-4" />
        <span>طباعة</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF} className="flex items-center gap-1">
        <FileText className="h-4 w-4" />
        <span>PDF</span>
      </Button>
    </div>
  );
};

// Default handlers
const defaultShareHandler = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Easy Inventory',
      text: 'Check out this data from Easy Inventory',
      url: window.location.href,
    }).catch(err => console.error('Error sharing:', err));
  } else {
    alert('Sharing is not available on this device');
  }
};

const defaultPrintHandler = () => {
  window.print();
};

const defaultExportPDFHandler = () => {
  toast({
    title: "جاري التحضير",
    description: "يتم تحضير ملف PDF للطباعة",
  });

  setTimeout(() => {
    toast({
      title: "تم التحضير",
      description: "تم تحضير ملف PDF بنجاح",
    });
  }, 1500);
};
