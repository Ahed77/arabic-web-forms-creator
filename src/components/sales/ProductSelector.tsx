
import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface ProductSelectorProps {
  products: Product[];
  onAddToInvoice: (item: InvoiceItem) => void;
}

const ProductSelector = ({ products, onAddToInvoice }: ProductSelectorProps) => {
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  const handleProductSelect = (value: string) => {
    setSelectedProductId(value);
    const product = products.find(p => p.id === value);
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

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive"
      });
      return;
    }
    
    // Create new invoice item
    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
      barcode: product.barcode,
      quantity: quantity,
      price: price,
      total: price * quantity
    };

    onAddToInvoice(newItem);
    
    // Reset form
    setSelectedProductId("");
    setQuantity(1);
    setPrice(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <label className="block text-sm font-medium mb-1">اختر منتج</label>
      </div>
      <Select value={selectedProductId} onValueChange={handleProductSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="-- اختر منتج --" />
        </SelectTrigger>
        <SelectContent>
          {products.map(product => (
            <SelectItem key={product.id} value={product.id} disabled={product.available <= 0}>
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
          السعر المسجل بالمخزون: {products.find(p => p.id === selectedProductId)?.price.toFixed(2)}
        </p>
      )}

      <Button 
        className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
        onClick={handleAddToInvoice}
        disabled={!selectedProductId || products.find(p => p.id === selectedProductId)?.available === 0}
      >
        <Plus className="h-4 w-4" />
        إضافة للفاتورة
      </Button>
    </div>
  );
};

export default ProductSelector;
