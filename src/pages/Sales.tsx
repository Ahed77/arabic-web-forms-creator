
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sales = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">المبيعات</h1>
          <p className="text-sm sm:text-base text-gray-500">إنشاء وإدارة فواتير المبيعات</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <p className="text-gray-500 mb-4">إنشاء فاتورة جديدة</p>
          <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
            إنشاء فاتورة جديدة
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Sales;
