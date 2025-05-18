
import { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Share, Printer } from 'lucide-react';
import { ActionButtons } from '@/components/ActionButtons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Reports = () => {
  const { toast } = useToast();
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Generate sample report data
  const sampleReport = [
    { barcode: 'SCAN2829', name: 'شاحن', quantity: 1500, unitPrice: 1200, totalPrice: 1800000 }
  ];

  // Generate PDF for printing
  const generatePDF = () => {
    setIsPrintPreviewOpen(true);
  };

  const handlePrint = () => {
    // Open a new window with just the report content
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>طباعة التقرير</title>');
      printWindow.document.write('<meta charset="UTF-8">');
      // Include the full CSS from your application
      printWindow.document.write('<link rel="stylesheet" href="/index.css" />');
      // Add specific print styles
      printWindow.document.write(`
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .print-container { width: 100%; max-width: 100%; padding: 0; margin: 0; }
          }
          body { direction: rtl; }
          
          .report-header {
            background: linear-gradient(to right, #3b82f6, #8b5cf6); 
            color: white; 
            padding: 20px; 
            text-align: center;
          }
          
          .report-content {
            padding: 20px;
            background: white;
          }
          
          .report-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .report-table th, .report-table td {
            padding: 8px;
            border: 1px solid #e5e7eb;
          }
          
          .report-table th {
            background-color: #f3f4f6;
            text-align: right;
          }
          
          .report-footer {
            padding: 20px;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            text-align: right;
          }
          
          .report-final-footer {
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            color: white;
            padding: 16px;
            text-align: center;
          }
        </style>
      `);
      printWindow.document.write('</head><body>');
      
      // Render the report with our invoice-like styling
      printWindow.document.write(`
        <div class="print-container">
          <div style="border: 2px solid #ddd; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; max-width: 100%; direction: rtl;">
            <!-- Header -->
            <div class="report-header">
              <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                <div style="font-size: 0.875rem; opacity: 0.75;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</div>
              </div>
              <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px;">اسم المتجر</h1>
              <div style="font-size: 0.875rem;">عنوان المتجر</div>
              <div style="font-size: 0.875rem;">رقم الهاتف</div>
            </div>

            <!-- Report Content -->
            <div class="report-content">
              <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; text-align: center;">تقرير المخزون</h2>
              
              <table class="report-table">
                <thead>
                  <tr>
                    <th>باركود</th>
                    <th>اسم المنتج</th>
                    <th>الكمية</th>
                    <th>سعر الوحدة</th>
                    <th>القيمة الإجمالية</th>
                  </tr>
                </thead>
                <tbody>
                  ${sampleReport.map((item) => `
                    <tr>
                      <td>${item.barcode}</td>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div class="report-footer">
              <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 4px;">
                إجمالي قيمة المخزون: ${sampleReport.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
              </div>
            </div>
            
            <!-- Final Footer -->
            <div class="report-final-footer">
              <div style="font-size: 0.875rem;">تقرير المخزون - ${new Date().toLocaleDateString('ar-SA')}</div>
            </div>
          </div>
        </div>
      `);
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.addEventListener('afterprint', () => {
            printWindow.close();
          });
        }, 300);
      });
    }
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
            <ActionButtons contentType="inventory" />
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

        {/* Print Preview Dialog */}
        <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-center">معاينة التقرير</DialogTitle>
            </DialogHeader>
            
            <div className="mb-4 flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span>طباعة</span>
              </Button>
            </div>
            
            <div ref={reportRef} className="overflow-auto max-h-[60vh]">
              <div className="border-2 border-blue-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 text-center">
                  <div className="mb-2 flex justify-between">
                    <div className="text-sm opacity-75">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">اسم المتجر</h1>
                  <div className="text-sm">عنوان المتجر</div>
                  <div className="text-sm">رقم الهاتف</div>
                </div>

                {/* Report Content */}
                <div className="p-6 bg-white">
                  <h2 className="text-lg font-semibold mb-4 text-center">تقرير المخزون</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 text-right">
                          <th className="p-2 border">باركود</th>
                          <th className="p-2 border">اسم المنتج</th>
                          <th className="p-2 border">الكمية</th>
                          <th className="p-2 border">سعر الوحدة</th>
                          <th className="p-2 border">القيمة الإجمالية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleReport.map((item, index) => (
                          <tr key={index} className="border-b text-right">
                            <td className="p-2 border">{item.barcode}</td>
                            <td className="p-2 border">{item.name}</td>
                            <td className="p-2 border">{item.quantity}</td>
                            <td className="p-2 border">{item.unitPrice.toFixed(2)}</td>
                            <td className="p-2 border">{item.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="p-6 bg-gray-50 border-t">
                  <div className="text-right">
                    <div className="text-xl font-bold mb-1">إجمالي قيمة المخزون: {sampleReport.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 text-center">
                  <div className="text-sm">تقرير المخزون - {new Date().toLocaleDateString('ar-SA')}</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Reports;
