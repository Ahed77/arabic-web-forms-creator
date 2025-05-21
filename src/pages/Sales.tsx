
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, FileText, Download } from 'lucide-react';
import InvoicePreviewModal from '@/components/InvoicePreviewModal';
import ProductSelector from '@/components/sales/ProductSelector';
import InvoiceTable from '@/components/sales/InvoiceTable';
import InvoiceActions from '@/components/sales/InvoiceActions';
import SavedInvoices from '@/components/sales/SavedInvoices';
import { useSalesInvoice } from '@/hooks/useSalesInvoice';
import { useSettings } from '@/contexts/SettingsContext';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

const Sales = () => {
  const {
    products,
    invoiceItems,
    savedInvoices,
    isInvoicePreviewOpen,
    isSavedInvoicesOpen,
    currentInvoice,
    totalInvoiceAmount,
    handleAddToInvoice,
    handleRemoveItem,
    handleSaveInvoice,
    handleViewInvoicePreview,
    handleViewSavedInvoices,
    handleDeleteInvoice,
    setIsInvoicePreviewOpen,
    setIsSavedInvoicesOpen
  } = useSalesInvoice();
  
  const { businessInfo } = useSettings();
  const { toast } = useToast();
  
  const handleExportCurrentInvoiceToPDF = async () => {
    if (invoiceItems.length === 0) {
      toast({
        title: "خطأ",
        description: "الفاتورة فارغة، قم بإضافة منتجات أولاً",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "جاري التحضير",
      description: "يتم تحضير ملف PDF للفاتورة",
    });
    
    try {
      const tempInvoice = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: [...invoiceItems],
        total: totalInvoiceAmount
      };
      
      const filename = await generateInvoicePDF(tempInvoice, businessInfo);
      
      toast({
        title: "تم التحضير",
        description: `تم تصدير الفاتورة كملف PDF باسم ${filename}`,
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
    <Layout>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center">إدارة المبيعات</h1>
          <p className="text-center opacity-90 mt-2">إنشاء فواتير جديدة وإدارة عمليات البيع</p>
        </div>
        
        <div className="flex justify-center gap-3 mb-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white border-indigo-200 hover:bg-indigo-50 shadow-sm"
            onClick={handleViewSavedInvoices}
          >
            <Clock className="h-4 w-4 text-indigo-600" />
            عرض الفواتير السابقة ({savedInvoices.length})
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white border-indigo-200 hover:bg-indigo-50 shadow-sm"
            onClick={handleExportCurrentInvoiceToPDF}
            disabled={invoiceItems.length === 0}
          >
            <Download className="h-4 w-4 text-indigo-600" />
            تصدير PDF
          </Button>
        </div>
        
        <Card className="mb-6 p-6 border border-indigo-100 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center text-indigo-700">إضافة منتج للفاتورة</h2>
          <ProductSelector 
            products={products} 
            onAddToInvoice={handleAddToInvoice}
          />
        </Card>

        <Card className="mb-6 p-6 border border-indigo-100 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center text-indigo-700">الفاتورة الحالية</h2>
          
          <InvoiceTable 
            invoiceItems={invoiceItems} 
            onRemoveItem={handleRemoveItem} 
          />
          
          <InvoiceActions 
            totalAmount={totalInvoiceAmount}
            isEmpty={invoiceItems.length === 0}
            onPreviewInvoice={handleViewInvoicePreview}
            onSaveInvoice={handleSaveInvoice}
            onExportPDF={handleExportCurrentInvoiceToPDF}
          />
        </Card>
        
        {currentInvoice && (
          <InvoicePreviewModal 
            isOpen={isInvoicePreviewOpen}
            onClose={() => setIsInvoicePreviewOpen(false)}
            invoiceData={currentInvoice}
          />
        )}
        
        <SavedInvoices 
          invoices={savedInvoices}
          isOpen={isSavedInvoicesOpen}
          onClose={() => setIsSavedInvoicesOpen(false)}
          onDeleteInvoice={handleDeleteInvoice}
        />
      </div>
    </Layout>
  );
};

export default Sales;
