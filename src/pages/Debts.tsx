
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, UserPlus, Search, Calendar, Phone, Users } from 'lucide-react';
import { ActionButtons } from '@/components/ActionButtons';

interface Debtor {
  id: string;
  name: string;
  phone: string;
  type: 'customer' | 'supplier';
  totalDebt: number;
  totalPayment: number;
}

interface Transaction {
  id: string;
  debtorId: string;
  type: 'debt' | 'payment';
  amount: number;
  date: string;
  notes: string;
}

const SAMPLE_DEBTORS: Debtor[] = [
  { 
    id: '1', 
    name: 'حسام اخي', 
    phone: '+96777846767', 
    type: 'customer',
    totalDebt: 1500,
    totalPayment: 1200
  }
];

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { 
    id: '1', 
    debtorId: '1', 
    type: 'debt', 
    amount: 1500, 
    date: '2025-05-09', 
    notes: 'باقه' 
  },
  { 
    id: '2', 
    debtorId: '1', 
    type: 'payment', 
    amount: 1200, 
    date: '2025-05-09', 
    notes: 'سداد حق باقه' 
  }
];

const Debts = () => {
  const { toast } = useToast();
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [addDebtorName, setAddDebtorName] = useState('');
  const [addDebtorPhone, setAddDebtorPhone] = useState('');
  const [addDebtorType, setAddDebtorType] = useState<'customer' | 'supplier'>('customer');
  const [showAddDebtorMethod, setShowAddDebtorMethod] = useState(false);
  
  const [transactionType, setTransactionType] = useState<'debt' | 'payment'>('debt');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  
  const handleSelectDebtor = (debtor: Debtor) => {
    setSelectedDebtor(debtor);
  };
  
  const handleAddDebtor = () => {
    if (!addDebtorName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المدين",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "تمت الإضافة",
      description: `تمت إضافة ${addDebtorName} بنجاح`
    });
    
    // Reset form
    setAddDebtorName('');
    setAddDebtorPhone('');
    setAddDebtorType('customer');
    setShowAddDebtorMethod(false);
  };
  
  const handleAddTransaction = () => {
    if (!selectedDebtor) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مدين أولاً",
        variant: "destructive"
      });
      return;
    }
    
    if (!transactionAmount || parseFloat(transactionAmount) <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "تمت الإضافة",
      description: `تمت إضافة معاملة جديدة بنجاح`
    });
    
    // Reset form
    setTransactionType('debt');
    setTransactionAmount('');
    setTransactionNotes('');
  };
  
  const getBalance = (debtor: Debtor) => {
    return debtor.totalDebt - debtor.totalPayment;
  };
  
  const getPaymentPercentage = (debtor: Debtor) => {
    if (debtor.totalDebt === 0) return 100;
    return Math.round((debtor.totalPayment / debtor.totalDebt) * 100);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">إدارة الديون</h1>
          <p className="text-sm sm:text-base text-gray-500">تتبع ديون العملاء والموردين.</p>
        </div>
        
        <div className="flex justify-center mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة مدين
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">طريقة إضافة المدين</DialogTitle>
              </DialogHeader>
              
              {!showAddDebtorMethod ? (
                <div className="space-y-4 mt-4">
                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                    onClick={() => toast({ title: "قريباً", description: "هذه الميزة قيد التطوير" })}
                  >
                    <Users className="h-4 w-4" />
                    اختيار من جهات الاتصال
                  </Button>
                  
                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                    onClick={() => setShowAddDebtorMethod(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    إضافة يدوياً
                  </Button>
                  
                  <Button 
                    className="w-full"
                    variant="ghost"
                    onClick={() => setShowAddDebtorMethod(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex justify-end mb-1">
                      <label className="text-sm font-medium">الاسم</label>
                    </div>
                    <Input 
                      value={addDebtorName}
                      onChange={(e) => setAddDebtorName(e.target.value)}
                      placeholder="أدخل اسم المدين"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-end mb-1">
                      <label className="text-sm font-medium">الهاتف</label>
                    </div>
                    <Input 
                      value={addDebtorPhone}
                      onChange={(e) => setAddDebtorPhone(e.target.value)}
                      placeholder="اختياري"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-end mb-1">
                      <label className="text-sm font-medium">النوع</label>
                    </div>
                    <Select 
                      value={addDebtorType}
                      onValueChange={(value) => setAddDebtorType(value as 'customer' | 'supplier')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">عميل</SelectItem>
                        <SelectItem value="supplier">مورد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleAddDebtor}
                  >
                    إضافة
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-gray-400" size={18} />
            <Input 
              placeholder="بحث بالاسم أو الهاتف..." 
              className="pr-10 text-right"
              dir="rtl"
            />
          </div>
        </div>
        
        {selectedDebtor ? (
          <Card className="mb-6 p-4">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedDebtor(null)}
                className="text-sm"
              >
                العودة للقائمة
              </Button>
              <h2 className="text-xl font-bold text-blue-500">{selectedDebtor.name}</h2>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex justify-end mb-4">
                  <Button className="bg-green-600 hover:bg-green-700 flex gap-1 items-center">
                    <Plus size={16} />
                    إضافة معاملة
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle className="text-center">إضافة معاملة لـ {selectedDebtor.name}</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-end mb-1">
                      <label className="text-sm font-medium">النوع</label>
                    </div>
                    <Select
                      value={transactionType}
                      onValueChange={(value) => setTransactionType(value as 'debt' | 'payment')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debt">دين (عليه)</SelectItem>
                        <SelectItem value="payment">دفعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-end mb-1">
                      <label className="text-sm font-medium">المبلغ</label>
                    </div>
                    <Input 
                      type="number"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      placeholder="0.00"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-end mb-1">
                      <label className="text-sm font-medium">الملاحظة</label>
                    </div>
                    <Input 
                      value={transactionNotes}
                      onChange={(e) => setTransactionNotes(e.target.value)}
                      placeholder="e.g., فاتورة رقم 123, دفعة مقدمة..."
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-end mb-1">
                      <label className="text-sm font-medium">التاريخ</label>
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input 
                        type="text"
                        value={new Date().toLocaleDateString('ar-SA')}
                        readOnly
                        dir="rtl"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="w-full"
                      variant="outline"
                    >
                      إلغاء
                    </Button>
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      onClick={handleAddTransaction}
                    >
                      إضافة المعاملة
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Card className="mb-6 p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-right mb-4">ملخص الحساب المالي</h3>
              <p className="text-gray-600 text-right mb-6">الرصيد الحالي ونسبة تسديد الديون لهذا العميل.</p>
              
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <h4 className="text-right mb-2">مستحق عليه (مدين):</h4>
                <p className="text-3xl font-bold text-red-500 text-center">
                  {getBalance(selectedDebtor).toFixed(2)}
                </p>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>{selectedDebtor.totalDebt.toFixed(2)} :إجمالي الديون</span>
                <span>{selectedDebtor.totalPayment.toFixed(2)} :إجمالي الدفعات</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-yellow-400 h-2.5 rounded-full" 
                  style={{ width: `${getPaymentPercentage(selectedDebtor)}%` }}
                ></div>
              </div>
              <p className="text-center mb-6">نسبة السداد: {getPaymentPercentage(selectedDebtor)}%</p>
              
              <ActionButtons />
            </Card>
            
            <h3 className="text-lg font-semibold text-right mb-4">سجل المعاملات</h3>
            <p className="text-gray-600 text-right mb-4">جميع عمليات الديون والدفعات المسجلة (الأحدث أولاً).</p>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الملاحظة</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_TRANSACTIONS.filter(t => t.debtorId === selectedDebtor.id).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                      <TableCell>
                        <span className={transaction.type === 'debt' ? 'text-red-500' : 'text-green-500'}>
                          {transaction.type === 'debt' ? 'دين' : 'دفعة'}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <div>
            {SAMPLE_DEBTORS.map((debtor) => (
              <Card 
                key={debtor.id} 
                className="mb-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSelectDebtor(debtor)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${debtor.type === 'customer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {debtor.type === 'customer' ? 'عميل' : 'مورد'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{debtor.name}</h3>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1">
                    <Phone size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{debtor.phone}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getBalance(debtor) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {getBalance(debtor).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getPaymentPercentage(debtor)}% مسدد
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Debts;
