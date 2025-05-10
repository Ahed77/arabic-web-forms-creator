
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Barcode } from 'lucide-react';

// Product type
interface Product {
  id: string;
  barcode: string;
  name: string;
  quantity: number;
  price: number;
}

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    barcode: '',
    name: '',
    quantity: 0,
    price: 0,
  });
  const [showBarcodeDialog, setShowBarcodeDialog] = useState(false);

  // Handle input change for new product
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    });
  };

  // Add new product
  const addProduct = () => {
    if (!newProduct.barcode || !newProduct.name || newProduct.price <= 0) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
    };

    setProducts([...products, product]);
    
    // Reset form
    setNewProduct({
      barcode: '',
      name: '',
      quantity: 0,
      price: 0,
    });

    toast({
      title: "تم إضافة المنتج",
      description: "تمت إضافة المنتج بنجاح",
    });
  };

  // Simulate automatic barcode scanning
  const scanBarcode = () => {
    // In a real app, this would interact with a barcode scanner
    const randomBarcode = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    
    setNewProduct({
      ...newProduct,
      barcode: randomBarcode,
    });
    
    toast({
      title: "تم مسح الباركود",
      description: `تم إدخال الباركود ${randomBarcode} بنجاح`,
    });
    
    setShowBarcodeDialog(false);
  };

  // Generate PDF for printing
  const generatePDF = () => {
    if (products.length === 0) {
      toast({
        title: "لا يوجد منتجات",
        description: "لا يمكن إنشاء PDF بدون منتجات",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "جاري التحضير",
      description: "يتم تحضير ملف PDF للطباعة",
    });

    // In a real app, this would generate a PDF
    setTimeout(() => {
      toast({
        title: "تم التحضير",
        description: "تم تحضير ملف PDF بنجاح",
      });
    }, 1500);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.includes(searchTerm) || product.barcode.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">إدارة المخزون</h1>
          <p className="text-gray-500">إضافة، عرض، وتعديل منتجات المخزون</p>
        </div>

        <div className="mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-500 hover:bg-green-600 mb-4">
                <span className="ml-2">+</span> إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-right">إضافة منتج جديد</DialogTitle>
                <DialogDescription className="text-right">
                  أدخل تفاصيل المنتج الجديد. يمكنك استخدام ماسح الباركود.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="barcode" className="text-right col-span-1">باركود</label>
                  <div className="col-span-3 flex">
                    <Input
                      id="barcode"
                      name="barcode"
                      value={newProduct.barcode}
                      onChange={handleInputChange}
                      className="flex-1"
                      dir="ltr"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => setShowBarcodeDialog(true)}
                    >
                      <Barcode size={18} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right col-span-1">اسم المنتج</label>
                  <Input
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="quantity" className="text-right col-span-1">الكمية</label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="price" className="text-right col-span-1">السعر</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <DialogClose asChild>
                  <Button variant="outline">إلغاء</Button>
                </DialogClose>
                <Button onClick={addProduct} className="bg-green-500 hover:bg-green-600">
                  إضافة المنتج
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Barcode Dialog */}
          <Dialog open={showBarcodeDialog} onOpenChange={setShowBarcodeDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-right">إضافة باركود</DialogTitle>
                <DialogDescription className="text-right">
                  اختر طريقة إضافة الباركود
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Button 
                  onClick={scanBarcode} 
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  <Barcode size={18} />
                  <span>مسح تلقائي للباركود</span>
                </Button>
                <p className="text-center text-gray-500">-- أو --</p>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="manualBarcode" className="text-right col-span-1">الإدخال اليدوي</label>
                  <div className="col-span-3 flex">
                    <Input
                      id="manualBarcode"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                      className="flex-1"
                      dir="ltr"
                      placeholder="أدخل الباركود يدويًا"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <DialogClose asChild>
                  <Button variant="outline">إلغاء</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button className="bg-green-500 hover:bg-green-600">
                    تأكيد
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="w-full mb-6">
            <Input
              placeholder="ابحث بالاسم أو الباركود..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">قائمة المنتجات</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generatePDF}>
                  طباعة
                </Button>
                <Button variant="outline">
                  مشاركة
                </Button>
              </div>
            </div>
            
            {products.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">باركود</TableHead>
                    <TableHead className="text-right">اسم المنتج</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.barcode}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">تعديل</Button>
                        <Button variant="ghost" size="sm" className="text-red-500">حذف</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">لا توجد منتجات لعرضها. ابدأ بإضافة منتج جديد</p>
                <p className="text-gray-400">لا توجد منتجات في المخزن</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
