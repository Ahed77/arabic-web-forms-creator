
import React from 'react';
import Layout from '@/components/Layout';
import SettingsForm from '@/components/settings/SettingsForm';

const Settings = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-bold text-center">إعدادات النظام</h1>
          <p className="text-center opacity-90 mt-2">قم بتخصيص التطبيق ليناسب احتياجاتك</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-indigo-100">
          <SettingsForm />
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
