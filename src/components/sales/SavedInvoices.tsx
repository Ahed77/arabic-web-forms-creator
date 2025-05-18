
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Printer, FileText, Trash2, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import InvoicePreviewModal from '@/components/InvoicePreviewModal';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  date: string;
  items: any[];
  total: number;
}

interface SavedInvoicesProps {
  invoices: Invoice[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteInvoice: (id: string) => void;
}

const SavedInvoices: React.FC<SavedInvoicesProps> = ({
  invoices,
  isOpen,
  onClose,
  onDeleteInvoice
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const itemsPerPage = 5;
  
  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.includes(searchTerm) || 
    // Search by date
    new Date(invoice.date).toLocaleDateString('ar-SA').includes(searchTerm) ||
    // Search by total amount
    invoice.total.toString().includes(searchTerm)
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };
  
  const handleDeleteInvoice = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      onDeleteInvoice(id);
      toast({
        title: "تم الحذف",
        description: "تم حذف الفاتورة بنجاح"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">إدارة الفواتير المحفوظة</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4 relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن فاتورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p>لا توجد فواتير محفوظة</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">خيارات</TableHead>
                    <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                    <TableHead className="text-right">عدد المنتجات</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">رقم الفاتورة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePreviewInvoice(invoice)}
                            title="معاينة وطباعة"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{invoice.total.toFixed(2)}</TableCell>
                      <TableCell>{invoice.items.length}</TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{invoice.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                        disabled={currentPage === 1} 
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                        disabled={currentPage === totalPages} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
          
          <DialogFooter>
            <Button onClick={onClose} variant="outline">إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <InvoicePreviewModal 
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          invoiceData={selectedInvoice}
        />
      )}
    </>
  );
};

export default SavedInvoices;
