
import { Button } from '@/components/ui/button';
import { FileText, Save, Printer } from 'lucide-react';

interface InvoiceActionsProps {
  totalAmount: number;
  isEmpty: boolean;
  onPreviewInvoice: () => void;
  onSaveInvoice: () => void;
}

const InvoiceActions = ({ 
  totalAmount,
  isEmpty,
  onPreviewInvoice, 
  onSaveInvoice 
}: InvoiceActionsProps) => {
  return (
    <div className="mt-8 border-t border-indigo-100 pt-4">
      <div className="flex justify-end mb-4">
        <div className="text-lg font-semibold bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md border border-indigo-100">
          إجمالي الفاتورة: <span className="font-bold">{totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto flex items-center justify-center gap-2"
          disabled={isEmpty}
          onClick={onPreviewInvoice}
        >
          <Printer className="h-4 w-4" />
          معاينة وطباعة الفاتورة
        </Button>
        
        <Button 
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto flex items-center justify-center gap-2"
          disabled={isEmpty}
          onClick={onSaveInvoice}
        >
          <Save className="h-4 w-4" />
          حفظ الفاتورة
        </Button>
      </div>
    </div>
  );
};

export default InvoiceActions;
