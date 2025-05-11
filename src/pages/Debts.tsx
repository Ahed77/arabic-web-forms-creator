import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, UserPlus, Search, Calendar, Phone, Users, Save, FileText, DownloadCloud } from 'lucide-react';
import { getFromStorage, saveToStorage } from '@/utils/localStorage';
import jsPDF from 'jspdf';
import { ActionButtons } from '@/components/ActionButtons';

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
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor| null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add debtor states
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addReligion, setAddReligion] = useState('');
  const [addType, setAddType] = useState<'customer'|'supplier'>('customer');
  const [showManual, setShowManual] = useState(false);

  // Transaction states
  const [trxType, setTrxType] = useState<'debt'|'payment'>('debt');
  const [trxAmount, setTrxAmount] = useState('');
  const [trxNotes, setTrxNotes] = useState('');

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
        setShowManual(true);
      }
    } catch (e) {
      toast({ title: 'غير مدعوم', description: 'لا تدعم المتصفحات هذه الميزة حالياً', variant: 'destructive' });
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
    const d: Debtor = { id: Date.now().toString(), name: addName, phone: addPhone, religion: addReligion, type: addType, totalDebt:0, totalPayment:0 };
    setDebtors([...debtors, d]);
    toast({ title: 'تم', description: 'تمت إضافة المدين بنجاح' });
    // reset
    setAddName(''); setAddPhone(''); setAddReligion(''); setAddType('customer'); setShowManual(false);
  };

  const addTransaction = () => {
    if (!selectedDebtor) return toast({ title: 'خطأ', description: 'اختر مدين أول��ً', variant:'destructive' });
    const amt = parseFloat(trxAmount);
    if (!amt || amt <= 0) return toast({ title: 'خطأ', description: 'أدخل مبلغ صحيح', variant:'destructive' });
    const t: Transaction = { id: Date.now().toString(), debtorId: selectedDebtor.id, type: trxType, amount: amt, date: new Date().toISOString().split('T')[0], notes: trxNotes };
    setTransactions([...transactions, t]);
    // update totals
    setDebtors(debtors.map(d => d.id === selectedDebtor.id ? { ...d,
      totalDebt: trxType==='debt'? d.totalDebt+amt: d.totalDebt,
      totalPayment: trxType==='payment'? d.totalPayment+amt: d.totalPayment
    } : d));
    toast({ title: 'تم', description: 'تمت إضافة المعاملة' });
    setTrxType('debt'); setTrxAmount(''); setTrxNotes('');
  };

  const getBalance = (d: Debtor) => d.totalDebt - d.totalPayment;
  const getPercent = (d: Debtor) => d.totalDebt===0?100: Math.round((d.totalPayment/d.totalDebt)*100);

  const filtered = debtors.filter(d => d.name.includes(searchTerm)|| d.phone.includes(searchTerm));

  const exportPDF = () => {
    if (!selectedDebtor) return;
    const doc = new jsPDF();
    doc.text(`تقرير مدين: ${selectedDebtor.name}`, 10, 10);
    doc.text(`الهاتف: ${selectedDebtor.phone}`, 10, 16);
    if(selectedDebtor.religion) doc.text(`الديانة: ${selectedDebtor.religion}`, 10, 22);
    let y=30;
    transactions.filter(t=>t.debtorId===selectedDebtor.id).forEach(t=>{
      doc.text(`${t.date} - ${t.type==='debt'?'دين':'دفعة'} - ${t.amount.toFixed(2)} - ${t.notes}`, 10, y);
      y+=6;
    });
    doc.save(`${selectedDebtor.name}_report.pdf`);
  };

  return (<Layout>
    <div className="container mx-auto p-4" dir="rtl">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">إدارة الديون المتقدمة</h1>
      </header>

      <div className="flex justify-center mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 flex items-center gap-2"><Plus /> إضافة مدين</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>اختيار طريقة الإضافة</DialogTitle></DialogHeader>
            {!showManual?
              <div className="space-y-3">
                <Button variant="outline" onClick={pickContacts} className="w-full flex items-center gap-2"><Users /> من جهات الاتصال</Button>
                <Button variant="outline" onClick={()=>setShowManual(true)} className="w-full flex items-center gap-2"><UserPlus /> يدوياً</Button>
              </div>
            :
              <div className="space-y-3">
                <Input placeholder="الاسم" value={addName} onChange={e=>setAddName(e.target.value)} />
                <Input placeholder="الهاتف" value={addPhone} onChange={e=>setAddPhone(e.target.value)} />
                <Input placeholder="الديانة" value={addReligion} onChange={e=>setAddReligion(e.target.value)} />
                <Select value={addType} onValueChange={v=>setAddType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">عميل</SelectItem>
                    <SelectItem value="supplier">مورد</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full bg-green-500 hover:bg-green-600" onClick={addDebtor}>إضافة</Button>
              </div>
            }
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3" />
          <Input placeholder="بحث..." className="pr-10" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
        </div>
      </div>

      {selectedDebtor? (
        <>
          <Card className="mb-6 p-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={()=>setSelectedDebtor(null)}>عودة</Button>
              <h2 className="text-2xl font-semibold">{selectedDebtor.name}</h2>
            </div>
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="outline" onClick={exportPDF}><DownloadCloud /> PDF</Button>
              <Sheet>
                <SheetTrigger asChild><Button><FileText /> إضافة معاملة</Button></SheetTrigger>
                <SheetContent side="top">
                  <SheetHeader><SheetTitle>معاملة لـ {selectedDebtor.name}</SheetTitle></SheetHeader>
                  <div className="space-y-3 mt-4">
                    <Select value={trxType} onValueChange={v=>setTrxType(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debt">دين</SelectItem>
                        <SelectItem value="payment">دفعة</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="المبلغ" value={trxAmount} onChange={e=>setTrxAmount(e.target.value)} />
                    <Input placeholder="ملاحظة" value={trxNotes} onChange={e=>setTrxNotes(e.target.value)} />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={()=>{setTrxType('debt'); setTrxAmount(''); setTrxNotes('');}}>إلغاء</Button>
                      <Button onClick={addTransaction}>حفظ</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Card className="bg-gray-50 p-4 mb-6">
              <h3 className="font-medium">الرصيد: {getBalance(selectedDebtor).toFixed(2)}</h3>
              <p>سدد: {getPercent(selectedDebtor)}%</p>
            </Card>

            <Table>
              <TableHeader><TableRow><TableHead>تاريخ</TableHead><TableHead>نوع</TableHead><TableHead>المبلغ</TableHead><TableHead>ملاحظة</TableHead></TableRow></TableHeader>
              <TableBody>
                {transactions.filter(t=>t.debtorId===selectedDebtor.id).map(t=>(
                  <TableRow key={t.id}>
                    <TableCell>{new Date(t.date).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{t.amount.toFixed(2)}</TableCell>
                    <TableCell>{t.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4">
              <ActionButtons contentType="debt" />
            </div>
          </Card>
        </>
      ) : (
        filtered.map(d=>(
          <Card key={d.id} className="mb-3 p-3 hover:bg-gray-50 cursor-pointer" onClick={()=>setSelectedDebtor(d)}>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm"><Phone /> {d.phone}</p>
                {d.religion && <p className="text-sm">ديانة: {d.religion}</p>}
              </div>
              <div className="text-right">
                <p className={`${getBalance(d)>0?'text-red-500':'text-green-500'}`}>{getBalance(d).toFixed(2)}</p>
                <p className="text-xs">{getPercent(d)}%</p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  </Layout>);
}
