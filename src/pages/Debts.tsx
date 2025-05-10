
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const Debts = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">الديون</h1>
          <p className="text-gray-500">إدارة ديون العملاء والموردين</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">إضافة دين جديد</p>
          <Button className="bg-blue-500 hover:bg-blue-600">
            إضافة دين جديد
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Debts;
