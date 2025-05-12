
import { Button } from '@/components/ui/button';

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
    <>
      <p className="text-left mb-4">إجمالي الفاتورة: {totalAmount.toFixed(2)}</p>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
        <Button 
          className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto"
          disabled={isEmpty}
          onClick={onPreviewInvoice}
        >
          معاينة وطباعة الفاتورة
        </Button>
        
        <Button 
          className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
          disabled={isEmpty}
          onClick={onSaveInvoice}
        >
          حفظ الفاتورة
        </Button>
      </div>
    </>
  );
};

export default InvoiceActions;
