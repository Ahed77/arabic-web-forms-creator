
import { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Share, Printer } from 'lucide-react';
import { ActionButtons } from '@/components/ActionButtons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateReportPDF } from '@/utils/pdfGenerator';
import { useSettings } from '@/contexts/SettingsContext';

const Reports = () => {
  const { toast } = useToast();
  const { businessInfo } = useSettings();
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

  const handleExportPDF = async () => {
    toast({
      title: "جاري التحضير",
      description: "يتم تحضير ملف PDF للتقرير",
    });

    try {
      await generateReportPDF(sampleReport, businessInfo);
      toast({
        title: "تم التحضير",
        description: "تم تحضير ملف PDF بنجاح",
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

  const handlePrint = () => {
    // Open a new window with just the report content
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>طباعة التقرير</title>');
      printWindow.document.write('<meta charset="UTF-8">');
      // Include the full CSS from your application
      printWindow.document.write('<link rel="stylesheet" href="/index.css" />');
      printWindow.document.write(`
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .print-container { width: 100%; max-width: 100%; padding: 0; margin: 0; }
          }
          body { direction: rtl; }
          
          .report-header {
            background: linear-gradient(to right, #6366f1, #8b5cf6); 
            color: white; 
            padding: 20px; 
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          
          .report-content {
            padding: 20px;
            background: white;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
          }
          
          .report-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .report-table th, .report-table td {
            padding: 10px;
            border: 1px solid #e5e7eb;
          }
          
          .report-table th {
            background-color: #eef2ff;
            text-align: right;
            color: #4f46e5;
          }
          
          .report-footer {
            padding: 20px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-top: none;
            text-align: right;
          }
          
          .report-final-footer {
            background: linear-gradient(to right, #6366f1, #8b5cf6);
            color: white;
            padding: 16px;
            text-align: center;
            border-radius: 0 0 10px 10px;
          }
        </style>
      `);
      printWindow.document.write('</head><body>');
      
      // Render the report with our invoice-like styling
      printWindow.document.write(`
        <div class="print-container">
          <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
            <!-- Header -->
            <div class="report-header">
              <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                <div style="font-size: 0.875rem; opacity: 0.75;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</div>
              </div>
              <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px;">${businessInfo.name}</h1>
              <div style="font-size: 0.875rem;">${businessInfo.address}</div>
              <div style="font-size: 0.875rem;">${businessInfo.phone}</div>
              ${businessInfo.email ? `<div style="font-size: 0.875rem;">${businessInfo.email}</div>` : ''}
            </div>

            <!-- Report Content -->
            <div class="report-content">
              <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; text-align: center; color: #4f46e5;">تقرير المخزون</h2>
              
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
              <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; color: #4f46e5;">
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
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-bold text-center">التقارير</h1>
          <p className="text-center opacity-90 mt-2">عرض التقارير وطباعتها وتصديرها كملفات PDF</p>
        </div>

        <Card className="p-6 mb-8 border border-indigo-100 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-indigo-700">تقرير المخزون</h2>
            <div className="flex gap-2">
              <Button onClick={generatePDF} className="bg-indigo-600 hover:bg-indigo-700">
                معاينة التقرير
              </Button>
              <Button onClick={handleExportPDF} variant="outline" className="border-indigo-200">
                <FileText className="h-4 w-4 mr-2" /> تصدير PDF
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 mb-6 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-indigo-50">
                  <TableHead className="text-right text-indigo-800">باركود</TableHead>
                  <TableHead className="text-right text-indigo-800">اسم المنتج</TableHead>
                  <TableHead className="text-right text-indigo-800">الكمية</TableHead>
                  <TableHead className="text-right text-indigo-800">سعر الوحدة</TableHead>
                  <TableHead className="text-right text-indigo-800">القيمة الإجمالية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReport.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <TableCell>{item.barcode}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableBody>
                <TableRow className="bg-indigo-50">
                  <TableCell colSpan={4} className="text-right font-bold text-indigo-800">إجمالي قيمة المخزون:</TableCell>
                  <TableCell className="font-bold text-indigo-800">1800000.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="text-right text-gray-500 text-sm">
            <p>تقرير عن المخزون - {new Date().toLocaleDateString('ar-SA')}</p>
            <p className="mt-4">نهاية التقرير</p>
          </div>
        </Card>

        <Card className="p-6 border border-indigo-100 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-indigo-700">إحصائيات سريعة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-sm border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold">إجمالي المنتجات</p>
              <p className="text-3xl font-bold text-blue-800 mt-2">1</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg shadow-sm border border-green-200">
              <p className="text-sm text-green-600 font-semibold">إجمالي المبيعات</p>
              <p className="text-3xl font-bold text-green-800 mt-2">0</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-lg shadow-sm border border-orange-200">
              <p className="text-sm text-orange-600 font-semibold">إجمالي الديون</p>
              <p className="text-3xl font-bold text-orange-800 mt-2">300</p>
            </div>
          </div>
        </Card>

        {/* Print Preview Dialog */}
        <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-indigo-600 mb-2">معاينة التقرير</DialogTitle>
            </DialogHeader>
            
            <div className="mb-4 flex justify-center gap-3">
              <Button onClick={handleExportPDF} className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>حفظ كـ PDF</span>
              </Button>
              <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span>طباعة</span>
              </Button>
            </div>
            
            <div ref={reportRef} className="overflow-auto max-h-[60vh] border border-gray-200 rounded-lg shadow-lg">
              <div className="overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
                  <div className="mb-2 flex justify-between">
                    <div className="text-sm opacity-75">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{businessInfo.name}</h1>
                  <div className="text-sm">{businessInfo.address}</div>
                  <div className="text-sm">{businessInfo.phone}</div>
                  {businessInfo.email && <div className="text-sm">{businessInfo.email}</div>}
                </div>

                {/* Report Content */}
                <div className="p-6 bg-white">
                  <h2 className="text-lg font-semibold mb-4 text-center text-indigo-700">تقرير المخزون</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-indigo-50 text-right">
                          <th className="p-3 border text-indigo-800">باركود</th>
                          <th className="p-3 border text-indigo-800">اسم المنتج</th>
                          <th className="p-3 border text-indigo-800">الكمية</th>
                          <th className="p-3 border text-indigo-800">سعر الوحدة</th>
                          <th className="p-3 border text-indigo-800">القيمة الإجمالية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleReport.map((item, index) => (
                          <tr key={index} className="border-b text-right">
                            <td className="p-3 border">{item.barcode}</td>
                            <td className="p-3 border">{item.name}</td>
                            <td className="p-3 border">{item.quantity}</td>
                            <td className="p-3 border">{item.unitPrice.toFixed(2)}</td>
                            <td className="p-3 border">{item.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="p-6 bg-gray-50 border-t">
                  <div className="text-right">
                    <div className="text-xl font-bold text-indigo-700">إجمالي قيمة المخزون: {sampleReport.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 text-center">
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
