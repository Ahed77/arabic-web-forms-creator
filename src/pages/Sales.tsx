
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import InvoicePreviewModal from '@/components/InvoicePreviewModal';
import ProductSelector from '@/components/sales/ProductSelector';
import InvoiceTable from '@/components/sales/InvoiceTable';
import InvoiceActions from '@/components/sales/InvoiceActions';
import { useSalesInvoice } from '@/hooks/useSalesInvoice';

const Sales = () => {
  const {
    products,
    invoiceItems,
    savedInvoices,
    isInvoicePreviewOpen,
    currentInvoice,
    totalInvoiceAmount,
    handleAddToInvoice,
    handleRemoveItem,
    handleSaveInvoice,
    handleViewInvoicePreview,
    handleViewSavedInvoices,
    setIsInvoicePreviewOpen
  } = useSalesInvoice();

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">إدارة المبيعات</h1>
          <p className="text-sm sm:text-base text-gray-500">إنشاء فواتير جديدة وإدارة عمليات البيع.</p>
        </div>
        
        <div className="flex justify-center mb-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleViewSavedInvoices}
          >
            <Clock className="h-4 w-4" />
            عرض الفواتير السابقة ({savedInvoices.length})
          </Button>
        </div>
        
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">إضافة منتج للفاتورة</h2>
          <ProductSelector 
            products={products} 
            onAddToInvoice={handleAddToInvoice}
          />
        </Card>

        <Card className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">الفاتورة الحالية</h2>
          
          <InvoiceTable 
            invoiceItems={invoiceItems} 
            onRemoveItem={handleRemoveItem} 
          />
          
          <InvoiceActions 
            totalAmount={totalInvoiceAmount}
            isEmpty={invoiceItems.length === 0}
            onPreviewInvoice={handleViewInvoicePreview}
            onSaveInvoice={handleSaveInvoice}
          />
        </Card>
        
        {currentInvoice && (
          <InvoicePreviewModal 
            isOpen={isInvoicePreviewOpen}
            onClose={() => setIsInvoicePreviewOpen(false)}
            invoiceData={currentInvoice}
          />
        )}
      </div>
    </Layout>
  );
};

export default Sales;
