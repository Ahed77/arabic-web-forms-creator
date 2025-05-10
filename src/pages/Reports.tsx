
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilePdf, Share, Printer } from 'lucide-react';
import { ActionButtons } from '@/components/ActionButtons';

const Reports = () => {
  const { toast } = useToast();

  // Generate sample report data
  const sampleReport = [
    { barcode: 'SCAN2829', name: 'شاحن', quantity: 1500, unitPrice: 1200, totalPrice: 1800000 }
  ];

  // Generate PDF for printing
  const generatePDF = () => {
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

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">التقارير</h1>
          <p className="text-gray-500">عرض التقارير وطباعتها</p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">تقرير المخزون</h2>
            <Button onClick={generatePDF} className="bg-blue-500 hover:bg-blue-600">
              طباعة التقرير
            </Button>
          </div>

          <div className="border rounded-lg p-4 mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">باركود</TableHead>
                  <TableHead className="text-right">اسم المنتج</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">سعر الوحدة</TableHead>
                  <TableHead className="text-right">القيمة الإجمالية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReport.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.barcode}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-bold">إجمالي قيمة المخزون:</TableCell>
                  <TableCell className="font-bold">1800000.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="text-right text-gray-500 text-sm">
            <p>تقرير عن المخزون - {new Date().toLocaleDateString('ar-SA')}</p>
            <p className="mt-4">نهاية التقرير</p>
          </div>
          
          <div className="mt-6">
            <ActionButtons />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">إحصائيات سريعة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-500">إجمالي المنتجات</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-500">إجمالي المبيعات</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-500">إجمالي الديون</p>
              <p className="text-2xl font-bold">300</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
