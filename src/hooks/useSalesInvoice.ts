
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getFromStorage, saveToStorage } from '@/utils/localStorage';

interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  quantity: number;
  available: number;
}

interface InvoiceItem {
  productId: string;
  productName: string;
  barcode: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  date: string;
  items: InvoiceItem[];
  total: number;
}

const PRODUCTS_STORAGE_KEY = 'inventory-products';
const INVOICES_STORAGE_KEY = 'sales-invoices';

export const useSalesInvoice = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  
  // Total amount calculation
  const totalInvoiceAmount = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  
  // Load products and invoices from local storage on initial render
  useEffect(() => {
    const savedProducts = getFromStorage<Product[]>(PRODUCTS_STORAGE_KEY, []);
    setProducts(savedProducts);
    
    const invoices = getFromStorage<Invoice[]>(INVOICES_STORAGE_KEY, []);
    setSavedInvoices(invoices);
  }, []);
  
  const handleAddToInvoice = (newItem: InvoiceItem) => {
    // Check if item already exists in invoice
    const existingItemIndex = invoiceItems.findIndex(item => item.productId === newItem.productId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...invoiceItems];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      setInvoiceItems(updatedItems);
      
      toast({
        title: "تم التحديث",
        description: `تم تحديث كمية ${newItem.productName} في الفاتورة`
      });
    } else {
      // Add new item
      setInvoiceItems([...invoiceItems, newItem]);
      toast({
        title: "تمت الإضافة",
        description: `تمت إضافة ${newItem.productName} إلى الفاتورة`
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };
  
  const handleSaveInvoice = () => {
    if (invoiceItems.length === 0) {
      toast({
        title: "خطأ",
        description: "لا يمكن حفظ فاتورة فارغة",
        variant: "destructive"
      });
      return;
    }
    
    // Create new invoice
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...invoiceItems],
      total: totalInvoiceAmount
    };
    
    // Update products quantities in inventory
    const updatedProducts = [...products];
    
    for (const item of invoiceItems) {
      const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
      if (productIndex >= 0) {
        updatedProducts[productIndex].available -= item.quantity;
      }
    }
    
    // Save updated products to local storage
    saveToStorage(PRODUCTS_STORAGE_KEY, updatedProducts);
    setProducts(updatedProducts);
    
    // Save invoice
    const updatedInvoices = [...savedInvoices, newInvoice];
    saveToStorage(INVOICES_STORAGE_KEY, updatedInvoices);
    setSavedInvoices(updatedInvoices);
    
    toast({
      title: "تم إنشاء الفاتورة",
      description: "تم حفظ الفاتورة بنجاح"
    });
    
    // Clear invoice items
    setInvoiceItems([]);
  };

  const handleViewInvoicePreview = () => {
    if (invoiceItems.length === 0) {
      toast({
        title: "خطأ",
        description: "الفاتورة فارغة، قم بإضافة منتجات أولاً",
        variant: "destructive"
      });
      return;
    }

    const previewInvoice: Invoice = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...invoiceItems],
      total: totalInvoiceAmount
    };

    setCurrentInvoice(previewInvoice);
    setIsInvoicePreviewOpen(true);
  };

  const handleViewSavedInvoices = () => {
    if (savedInvoices.length === 0) {
      toast({
        title: "لا توجد فواتير",
        description: "لا يوجد فواتير سابقة"
      });
    } else {
      toast({ 
        title: "الفواتير السابقة", 
        description: `تم العثور على ${savedInvoices.length} فاتورة` 
      });
    }
  };

  return {
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
  };
};
