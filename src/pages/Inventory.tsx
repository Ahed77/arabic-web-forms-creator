
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Barcode } from 'lucide-react';
import { getFromStorage, saveToStorage } from '@/utils/localStorage';
import { ActionButtons } from '@/components/ActionButtons';

// Product type
interface Product {
  id: string;
  barcode: string;
  name: string;
  quantity: number;
  price: number;
}

const STORAGE_KEY = 'inventory-products';

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
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Load products from local storage on initial render
  useEffect(() => {
    const savedProducts = getFromStorage<Product[]>(STORAGE_KEY, []);
    setProducts(savedProducts);
  }, []);

  // Save products to local storage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, products);
  }, [products]);

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

    // Check for duplicate barcode
    if (products.some(p => p.barcode === newProduct.barcode && (!editProductId || p.id !== editProductId))) {
      toast({
        title: "خطأ في الباركود",
        description: "هذا الباركود مستخدم بالفعل",
        variant: "destructive",
      });
      return;
    }

    if (editProductId) {
      // Update existing product
      const updatedProducts = products.map(product => 
        product.id === editProductId 
          ? { ...newProduct, id: editProductId } 
          : product
      );
      setProducts(updatedProducts);
      
      toast({
        title: "تم تحديث المنتج",
        description: "تم تحديث المنتج بنجاح",
      });
      setEditProductId(null);
    } else {
      // Add new product
      const product: Product = {
        id: Date.now().toString(),
        ...newProduct,
      };
      setProducts([...products, product]);
      
      toast({
        title: "تم إضافة المنتج",
        description: "تمت إضافة المنتج بنجاح",
      });
    }
    
    // Reset form
    setNewProduct({
      barcode: '',
      name: '',
      quantity: 0,
      price: 0,
    });
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setNewProduct({
      barcode: product.barcode,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
    setEditProductId(product.id);
    
    // Open the dialog
    const dialogTrigger = document.querySelector('[data-testid="add-product-trigger"]') as HTMLButtonElement;
    if (dialogTrigger) {
      dialogTrigger.click();
    }
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح",
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
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 mb-4"
                data-testid="add-product-trigger"
              >
                <span className="ml-2">+</span> {editProductId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-right">
                  {editProductId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </DialogTitle>
                <DialogDescription className="text-right">
                  أدخل تفاصيل المنتج. يمكنك استخدام ماسح الباركود.
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
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setNewProduct({
                        barcode: '',
                        name: '',
                        quantity: 0,
                        price: 0,
                      });
                      setEditProductId(null);
                    }}
                  >
                    إلغاء
                  </Button>
                </DialogClose>
                <Button 
                  onClick={addProduct} 
                  className={editProductId ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}
                >
                  {editProductId ? 'تحديث المنتج' : 'إضافة المنتج'}
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
              <ActionButtons contentType="inventory" />
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          تعديل
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          حذف
                        </Button>
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
