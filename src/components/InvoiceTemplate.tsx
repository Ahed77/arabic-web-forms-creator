
import React from 'react';
import { Card } from "@/components/ui/card";

interface InvoiceItem {
  productId: string;
  productName: string;
  barcode: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceTemplateProps {
  invoiceId?: string;
  date?: string;
  items: InvoiceItem[];
  totalAmount: number;
  businessName?: string;
  businessLogo?: string;
  businessAddress?: string;
  businessPhone?: string;
  customerName?: string;
  printMode?: boolean;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoiceId = Date.now().toString(),
  date = new Date().toLocaleDateString('ar-SA'),
  items,
  totalAmount,
  businessName = "اسم المتجر",
  businessLogo,
  businessAddress = "عنوان المتجر",
  businessPhone = "رقم الهاتف",
  customerName = "العميل",
  printMode = false
}) => {
  const bgClass = printMode ? "bg-white" : "bg-gradient-to-r from-purple-50 to-blue-50";
  const containerClass = printMode 
    ? "max-w-3xl mx-auto p-4 print:p-0 print:shadow-none" 
    : "max-w-3xl mx-auto p-4 shadow-lg";

  return (
    <div className={`${bgClass} min-h-full`} dir="rtl">
      <div className={containerClass}>
        <Card className="border-2 border-blue-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 text-center">
            <div className="mb-2 flex justify-between">
              <div className="text-sm opacity-75">رقم الفاتورة: {invoiceId}</div>
              <div className="text-sm opacity-75">التاريخ: {date}</div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{businessName}</h1>
            <div className="text-sm">{businessAddress}</div>
            <div className="text-sm">{businessPhone}</div>
          </div>

          {/* Customer Info */}
          <div className="p-6 bg-white border-b">
            <h2 className="text-lg font-semibold mb-2 text-right">معلومات العميل</h2>
            <div className="text-right">
              <div>الاسم: {customerName}</div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-right">تفاصيل الفاتورة</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-right">
                    <th className="p-2 border">المنتج</th>
                    <th className="p-2 border">الكمية</th>
                    <th className="p-2 border">السعر</th>
                    <th className="p-2 border">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b text-right">
                      <td className="p-2 border">{item.productName}</td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border">{item.price.toFixed(2)}</td>
                      <td className="p-2 border">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="text-right">
              <div className="text-xl font-bold mb-1">الإجمالي: {totalAmount.toFixed(2)}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 text-center">
            <div className="text-sm">شكراً لتعاملكم معنا</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
