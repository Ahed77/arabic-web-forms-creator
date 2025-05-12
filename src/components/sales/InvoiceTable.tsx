
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface InvoiceItem {
  productId: string;
  productName: string;
  barcode: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceTableProps {
  invoiceItems: InvoiceItem[];
  onRemoveItem: (index: number) => void;
}

const InvoiceTable = ({ invoiceItems, onRemoveItem }: InvoiceTableProps) => {
  return (
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
                    onClick={() => onRemoveItem(index)}
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
  );
};

export default InvoiceTable;
