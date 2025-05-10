
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Clock } from 'lucide-react';
import { ActionButtons } from '@/components/ActionButtons';

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

const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'شاحن', barcode: 'SCAN2829', price: 1200, quantity: 1, available: 1500 }
];

const Sales = () => {
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  const handleProductSelect = (value: string) => {
    setSelectedProductId(value);
    const product = SAMPLE_PRODUCTS.find(p => p.id === value);
    if (product) {
      setPrice(product.price);
    }
  };

  const handleAddToInvoice = () => {
    if (!selectedProductId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار منتج",
        variant: "destructive"
      });
      return;
    }

    const product = SAMPLE_PRODUCTS.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive"
      });
      return;
    }

    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
      barcode: product.barcode,
      quantity: quantity,
      price: price,
      total: price * quantity
    };

    setInvoiceItems([...invoiceItems, newItem]);
    toast({
      title: "تمت الإضافة",
      description: `تمت إضافة ${product.name} إلى الفاتورة`
    });

    // Reset form
    setSelectedProductId("");
    setQuantity(1);
    setPrice(0);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };

  const totalInvoiceAmount = invoiceItems.reduce((sum, item) => sum + item.total, 0);

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
            onClick={() => toast({ title: "جاري التحميل", description: "يتم تحميل الفواتير السابقة" })}
          >
            <Clock className="h-4 w-4" />
            عرض الفواتير السابقة
          </Button>
        </div>
        
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">إضافة منتج للفاتورة</h2>
          
          <div className="space-y-4">
            <div className="flex justify-end">
              <label className="block text-sm font-medium mb-1">اختر منتج</label>
            </div>
            <Select value={selectedProductId} onValueChange={handleProductSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- اختر منتج --" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_PRODUCTS.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (المتوفر: {product.available})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-end">
              <label className="block text-sm font-medium mb-1">سعر البيع</label>
            </div>
            <Input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="أدخل سعر البيع"
              className="w-full"
              dir="rtl"
            />

            <div className="flex justify-end">
              <label className="block text-sm font-medium mb-1">الكمية</label>
            </div>
            <Input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full"
              min="1"
              dir="rtl"
            />

            {selectedProductId && (
              <p className="text-sm text-gray-500 text-right">
                السعر المسجل بالمخزون: {SAMPLE_PRODUCTS.find(p => p.id === selectedProductId)?.price.toFixed(2)}
              </p>
            )}

            <Button 
              className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
              onClick={handleAddToInvoice}
            >
              <Plus className="h-4 w-4" />
              إضافة للفاتورة
            </Button>
          </div>
        </Card>

        <Card className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">الفاتورة الحالية</h2>
          <p className="text-left mb-4">إجمالي الفاتورة: {totalInvoiceAmount.toFixed(2)}</p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">إزالة</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">سعر البيع</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">اسم المنتج</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      الفاتورة فارغة. قم بإضافة منتجات من القائمة أعلاه.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveItem(index)}
                        >
                          حذف
                        </Button>
                      </TableCell>
                      <TableCell>{item.total.toFixed(2)}</TableCell>
                      <TableCell>{item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <ActionButtons />
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
              disabled={invoiceItems.length === 0}
              onClick={() => {
                toast({
                  title: "تم إنشاء الفاتورة",
                  description: "تم حفظ الفاتورة بنجاح"
                });
                setInvoiceItems([]);
              }}
            >
              حفظ الفاتورة
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Sales;
