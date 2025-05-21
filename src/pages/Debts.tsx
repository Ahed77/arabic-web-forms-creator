
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, UserPlus, Search, Calendar, Phone, Users, Share, 
  MessageSquare, FileText, Printer, ArrowLeft, ArrowRight, UserRound
} from 'lucide-react';
import { getFromStorage, saveToStorage } from '@/utils/localStorage';
import { generateDebtorStatementPDF } from '@/utils/pdf';
import { ActionButtons } from '@/components/ActionButtons';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface Debtor {
  id: string;
  name: string;
  phone: string;
  religion?: string;
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

const DEBTORS_KEY = 'debts-debtors';
const TRANSACTIONS_KEY = 'debts-transactions';

export default function Debts() {
  const { toast } = useToast();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addMethodDialogOpen, setAddMethodDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Add debtor states
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addReligion, setAddReligion] = useState('');
  const [addType, setAddType] = useState<'customer'|'supplier'>('customer');

  // Transaction states
  const [trxType, setTrxType] = useState<'debt'|'payment'>('debt');
  const [trxAmount, setTrxAmount] = useState('');
  const [trxNotes, setTrxNotes] = useState('');
  const [trxDate, setTrxDate] = useState(new Date().toISOString().split('T')[0]);

  // Contacts picker
  const pickContacts = async () => {
    try {
      // Web Contacts API
      // @ts-ignore
      const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
      if (contacts.length) {
        const c = contacts[0];
        setAddName(c.name[0] || '');
        setAddPhone(c.tel[0] || '');
        setAddDialogOpen(true);
        setAddMethodDialogOpen(false);
      }
    } catch (e) {
      toast({ title: 'غير مدعوم', description: 'لا تدعم المتصفحات هذه الميزة حالياً', variant: 'destructive' });
      setAddDialogOpen(true);
      setAddMethodDialogOpen(false);
    }
  };

  // Load
  useEffect(() => {
    const ds = getFromStorage<Debtor[]>(DEBTORS_KEY, []);
    const ts = getFromStorage<Transaction[]>(TRANSACTIONS_KEY, []);
    setDebtors(ds.length ? ds : []);
    setTransactions(ts.length ? ts : []);
  }, []);

  useEffect(() => saveToStorage(DEBTORS_KEY, debtors), [debtors]);
  useEffect(() => saveToStorage(TRANSACTIONS_KEY, transactions), [transactions]);

  const addDebtor = () => {
    if (!addName.trim()) return toast({ title: 'خطأ', description: 'ادخل اسم المدين', variant: 'destructive' });
    const d: Debtor = { 
      id: Date.now().toString(), 
      name: addName, 
      phone: addPhone, 
      religion: addReligion, 
      type: addType, 
      totalDebt: 0, 
      totalPayment: 0 
    };
    setDebtors([...debtors, d]);
    toast({ title: 'تم', description: 'تمت إضافة المدين بنجاح' });
    
    // reset
    setAddName(''); 
    setAddPhone(''); 
    setAddReligion(''); 
    setAddType('customer');
    setAddDialogOpen(false);
  };

  const addTransaction = () => {
    if (!selectedDebtor) return toast({ 
      title: 'خطأ', 
      description: 'اختر مدين أولاً', 
      variant:'destructive' 
    });
    
    const amt = parseFloat(trxAmount);
    if (!amt || amt <= 0) return toast({ 
      title: 'خطأ', 
      description: 'أدخل مبلغ صحيح', 
      variant:'destructive' 
    });
    
    const t: Transaction = { 
      id: Date.now().toString(), 
      debtorId: selectedDebtor.id, 
      type: trxType, 
      amount: amt, 
      date: trxDate || new Date().toISOString().split('T')[0], 
      notes: trxNotes 
    };
    
    setTransactions([...transactions, t]);
    
    // update totals
    setDebtors(debtors.map(d => d.id === selectedDebtor.id ? { 
      ...d,
      totalDebt: trxType==='debt'? d.totalDebt+amt: d.totalDebt,
      totalPayment: trxType==='payment'? d.totalPayment+amt: d.totalPayment
    } : d));
    
    toast({ title: 'تم', description: 'تمت إضافة المعاملة' });
    setTrxType('debt'); 
    setTrxAmount(''); 
    setTrxNotes('');
    setDrawerOpen(false);
  };

  const getBalance = (d: Debtor) => d.totalDebt - d.totalPayment;
  const getPercent = (d: Debtor) => d.totalDebt===0?100: Math.round((d.totalPayment/d.totalDebt)*100);

  const filtered = debtors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.phone.includes(searchTerm)
  );

  const exportPDF = () => {
    if (!selectedDebtor) return;
    
    const debtorTransactions = transactions.filter(t => t.debtorId === selectedDebtor.id);
    
    toast({ 
      title: 'جاري التحميل',
      description: 'يتم تحضير ملف PDF...'
    });
    
    setTimeout(() => {
      generateDebtorStatementPDF(selectedDebtor, debtorTransactions)
        .then(() => {
          toast({ 
            title: 'تم التحميل',
            description: 'تم تحميل كشف الحساب بنجاح'
          });
        })
        .catch(err => {
          console.error('Error generating PDF:', err);
          toast({ 
            title: 'خطأ',
            description: 'حدث خطأ أثناء إنشاء الملف',
            variant: 'destructive'
          });
        });
    }, 500);
  };
  
  const shareDebtor = () => {
    if (!selectedDebtor) return;
    
    if (navigator.share) {
      navigator.share({
        title: `معلومات المدين - ${selectedDebtor.name}`,
        text: `
          الاسم: ${selectedDebtor.name}
          الهاتف: ${selectedDebtor.phone}
          النوع: ${selectedDebtor.type === 'customer' ? 'عميل' : 'مورد'}
          الرصيد: ${getBalance(selectedDebtor).toFixed(2)}
          نسبة السداد: ${getPercent(selectedDebtor)}%
        `,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      toast({
        title: 'غير مدعوم',
        description: 'مشاركة المحتوى غير مدعومة في هذا المتصفح',
        variant: 'destructive'
      });
    }
  };
  
  const handleContact = () => {
    if (!selectedDebtor || !selectedDebtor.phone) return;
    
    window.location.href = `tel:${selectedDebtor.phone}`;
  };
  
  const handleSendMessage = () => {
    if (!selectedDebtor || !selectedDebtor.phone) return;
    
    window.location.href = `sms:${selectedDebtor.phone}`;
  };
  
  const handlePrint = () => {
    if (!selectedDebtor) return;
    exportPDF();
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4" dir="rtl">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">إدارة الديون</h1>
          <p className="text-muted-foreground">تتبع ديون العملاء والموردين</p>
        </header>

        <Dialog open={addMethodDialogOpen} onOpenChange={setAddMethodDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2 mb-4">
              <Plus /> إضافة مدين
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">طريقة إضافة المدين</DialogTitle>
            </DialogHeader>
            <div className="text-center mb-2">اختر طريقة إضافة المدين الجديد.</div>
            <div className="space-y-3 mt-4">
              <Button 
                variant="outline" 
                onClick={pickContacts} 
                className="w-full py-6 flex items-center gap-2 text-lg"
              >
                <Users className="w-6 h-6" /> اختيار من جهات الاتصال
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAddDialogOpen(true);
                  setAddMethodDialogOpen(false);
                }} 
                className="w-full py-6 flex items-center gap-2 text-lg"
              >
                <UserPlus className="w-6 h-6" /> إضافة يدوياً
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setAddMethodDialogOpen(false)} 
                className="w-full"
              >
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">إضافة مدين يدوياً</DialogTitle>
            </DialogHeader>
            <div className="text-center mb-2">أدخل تفاصيل العميل أو المورد الجديد.</div>
            <div className="space-y-3 mt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">الاسم</label>
                <Input placeholder="الاسم" value={addName} onChange={e=>setAddName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">الهاتف</label>
                <Input placeholder="الهاتف (اختياري)" value={addPhone} onChange={e=>setAddPhone(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">الديانة (اختياري)</label>
                <Input placeholder="الديانة" value={addReligion} onChange={e=>setAddReligion(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">النوع</label>
                <Select value={addType} onValueChange={v=>setAddType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">عميل</SelectItem>
                    <SelectItem value="supplier">مورد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={addDebtor}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  إضافة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-muted-foreground" />
            <Input 
              placeholder="بحث بالاسم أو الهاتف..." 
              className="pl-10 pr-12" 
              value={searchTerm} 
              onChange={e=>setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {selectedDebtor ? (
          <Card className="mb-6 p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="ghost" 
                onClick={()=>setSelectedDebtor(null)} 
                className="flex items-center gap-1"
              >
                <ArrowRight className="rtl:rotate-180" /> العودة للقائمة
              </Button>
              <h2 className="text-2xl font-semibold text-primary">{selectedDebtor.name}</h2>
            </div>
            
            <div className="text-sm text-muted-foreground mb-4 flex justify-end items-center gap-2">
              <Phone className="h-4 w-4" /> {selectedDebtor.phone || 'لا يوجد رقم'}
              <span className="mx-2">|</span>
              <UserRound className="h-4 w-4" /> {selectedDebtor.type === 'customer' ? 'عميل' : 'مورد'}
            </div>

            <Card className="bg-gray-50 dark:bg-gray-800 p-6 mb-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-medium mb-3 text-center">ملخص الحساب المالي</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">الرصيد الحالي ونسبة تسديد الديون لهذا العميل.</p>
              
              <div className="bg-white dark:bg-gray-900 p-4 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    {getBalance(selectedDebtor) > 0 ? 'مستحق عليه (مدين):' : 'مستحق له (دائن):'}
                  </div>
                  <div className={`text-3xl font-bold ${getBalance(selectedDebtor) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {Math.abs(getBalance(selectedDebtor)).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm mb-2">
                <div>إجمالي الدفعات: {selectedDebtor.totalPayment.toFixed(2)}</div>
                <div>إجمالي الديون: {selectedDebtor.totalDebt.toFixed(2)}</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: `${getPercent(selectedDebtor)}%` }}></div>
              </div>
              <div className="text-xs text-end">نسبة السداد: {getPercent(selectedDebtor)}%</div>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <Button 
                variant="outline" 
                onClick={shareDebtor}
                className="flex flex-col items-center py-3 h-auto"
              >
                <Share className="h-5 w-5 mb-1" />
                <span>مشاركة</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSendMessage}
                className="flex flex-col items-center py-3 h-auto"
              >
                <MessageSquare className="h-5 w-5 mb-1" />
                <span>رسالة نصية</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleContact}
                className="flex flex-col items-center py-3 h-auto"
              >
                <Phone className="h-5 w-5 mb-1" />
                <span>اتصال</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handlePrint}
                className="flex flex-col items-center py-3 h-auto"
              >
                <Printer className="h-5 w-5 mb-1" />
                <span>طباعة</span>
              </Button>
            </div>
            
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button className="w-full mb-4">
                  <FileText className="mr-2" /> إضافة معاملة
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-center text-xl">
                    إضافة معاملة لـ {selectedDebtor.name}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-4 max-w-md mx-auto">
                  <div className="text-center mb-4">
                    سجل دين جديد أو دفعة لهذا العميل.
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">النوع</label>
                      <Select value={trxType} onValueChange={v=>setTrxType(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debt">دين (عليه)</SelectItem>
                          <SelectItem value="payment">دفعة (له)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium">المبلغ</label>
                      <Input 
                        type="number" 
                        placeholder="المبلغ" 
                        value={trxAmount} 
                        onChange={e=>setTrxAmount(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium">ملاحظة</label>
                      <Input 
                        placeholder="e.g. فاتورة رقم 123, دفعة مقدمة..." 
                        value={trxNotes} 
                        onChange={e=>setTrxNotes(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium">التاريخ</label>
                      <Input 
                        type="date" 
                        value={trxDate} 
                        onChange={e=>setTrxDate(e.target.value)} 
                      />
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <DrawerClose asChild>
                        <Button variant="outline" className="flex-1">إلغاء</Button>
                      </DrawerClose>
                      <Button onClick={addTransaction} className="flex-1">إضافة المعاملة</Button>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
            
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-4">سجل المعاملات</h3>
              <div className="text-sm text-muted-foreground mb-4">
                جميع عمليات الديون والدفعات المسجلة (الأحدث أولاً).
              </div>
            </div>

            {transactions.filter(t=>t.debtorId===selectedDebtor.id).length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead className="text-center">ملاحظة</TableHead>
                      <TableHead className="text-left">المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .filter(t=>t.debtorId===selectedDebtor.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(t=>(
                      <TableRow key={t.id}>
                        <TableCell>{new Date(t.date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell>
                          <span className={t.type === 'debt' ? 'text-red-500' : 'text-green-500'}>
                            {t.type === 'debt' ? 'دين' : 'دفعة'}
                          </span>
                        </TableCell>
                        <TableCell>{t.notes}</TableCell>
                        <TableCell className="text-left">{t.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed mb-4">
                <p className="text-muted-foreground">لا توجد معاملات مسجلة</p>
                <Button onClick={() => setDrawerOpen(true)} variant="outline" className="mt-2">
                  إضافة معاملة جديدة
                </Button>
              </div>
            )}
            
            <div className="mt-4">
              <ActionButtons 
                contentType="debt"
                onShare={shareDebtor}
                onPrint={handlePrint}
                onExportPDF={exportPDF}
              />
            </div>
          </Card>
        ) : (
          <>
            {filtered.length > 0 ? (
              filtered.map(d=>(
                <Card 
                  key={d.id} 
                  className="mb-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors" 
                  onClick={()=>setSelectedDebtor(d)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {d.phone || 'لا يوجد رقم'}
                      </p>
                      {d.religion && <p className="text-xs text-muted-foreground">ديانة: {d.religion}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{d.type === 'customer' ? 'عميل' : 'مورد'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getBalance(d)>0?'text-red-500':'text-green-500'}`}>
                        {getBalance(d).toFixed(2)}
                      </p>
                      <div className="mt-1 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full" 
                          style={{ width: `${getPercent(d)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">{getPercent(d)}% مسدد</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
                <p className="text-muted-foreground mb-2">
                  {searchTerm ? 'لا توجد نتائج بحث مطابقة' : 'لا يوجد مدينين حالياً'}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={()=> setSearchTerm('')} className="mb-2">
                    مسح البحث
                  </Button>
                )}
                {!searchTerm && (
                  <Button onClick={() => setAddMethodDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2" /> إضافة مدين جديد
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
