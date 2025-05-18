
import React from 'react';
import Layout from '@/components/Layout';
import SettingsForm from '@/components/settings/SettingsForm';

const Settings = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <SettingsForm />
      </div>
    </Layout>
  );
};

export default Settings;
