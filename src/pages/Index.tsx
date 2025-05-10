
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArchiveX, File, FileArchive, FileX } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-500 mb-6 text-center">Easy Inventory</h1>
        <p className="text-center text-gray-600 mb-10">إدارة المخزون والمبيعات والديون بسهولة</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* المخزون Card */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">المخزون</h2>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ArchiveX className="text-blue-500" size={24} />
              </div>
            </div>
            <p className="text-gray-600 mb-4">إدارة المنتجات والمخزون الخاص بك</p>
            <p className="text-gray-600 mb-6">أضف منتجات جديدة باستخدام الباركود، تتبع الكميات والأسعار.</p>
            <Link to="/inventory">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">إدارة المخزون</Button>
            </Link>
          </Card>

          {/* المبيعات Card */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">المبيعات</h2>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <File className="text-blue-500" size={24} />
              </div>
            </div>
            <p className="text-gray-600 mb-4">إنشاء وإدارة فواتير المبيعات</p>
            <p className="text-gray-600 mb-6">عرض المنتجات المتاحة، إنشاء فواتير، ومشاركتها أو طباعتها.</p>
            <Link to="/sales">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">إدارة المبيعات</Button>
            </Link>
          </Card>

          {/* الديون Card */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">الديون</h2>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileX className="text-blue-500" size={24} />
              </div>
            </div>
            <p className="text-gray-600 mb-4">إدارة ديون العملاء والموردين</p>
            <p className="text-gray-600 mb-6">تتبع الديون المستحقة عليك ولصالحك، وإدارة المدينين.</p>
            <Link to="/debts">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">إدارة الديون</Button>
            </Link>
          </Card>

          {/* التقارير Card */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">التقارير</h2>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileArchive className="text-blue-500" size={24} />
              </div>
            </div>
            <p className="text-gray-600 mb-4">عرض التقارير الشاملة</p>
            <p className="text-gray-600 mb-6">احصل على نظرة شاملة على أداء عملك من خلال التقارير المفصلة.</p>
            <Link to="/reports">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">عرض التقارير</Button>
            </Link>
          </Card>
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p>© Easy Inventory 2025</p>
        </footer>
      </div>
    </Layout>
  );
};

export default Index;
