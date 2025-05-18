
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Moon, Globe, Building, Image } from 'lucide-react';

const SettingsForm = () => {
  const { 
    theme, 
    language, 
    businessInfo, 
    setTheme, 
    setLanguage, 
    updateBusinessInfo 
  } = useSettings();

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric values
    if (name === 'tax') {
      parsedValue = parseFloat(value) || 0;
    }
    
    updateBusinessInfo({ [name]: parsedValue });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">إعدادات التطبيق</h2>
      
      <Tabs defaultValue="business" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>معلومات المتجر</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>المظهر</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>اللغة</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="business" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المتجر</Label>
                  <Input
                    id="name"
                    name="name"
                    value={businessInfo.name}
                    onChange={handleBusinessInfoChange}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">شعار المتجر (رابط الصورة)</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={businessInfo.logo}
                    onChange={handleBusinessInfoChange}
                    className="text-right"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">عنوان المتجر</Label>
                  <Input
                    id="address"
                    name="address"
                    value={businessInfo.address}
                    onChange={handleBusinessInfoChange}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={businessInfo.phone}
                    onChange={handleBusinessInfoChange}
                    className="text-right"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    value={businessInfo.email}
                    onChange={handleBusinessInfoChange}
                    type="email"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">نسبة الضريبة (%)</Label>
                  <Input
                    id="tax"
                    name="tax"
                    value={businessInfo.tax}
                    onChange={handleBusinessInfoChange}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="text-right"
                  />
                </div>
              </div>
              
              {businessInfo.logo && (
                <div className="mt-4">
                  <Label>معاينة الشعار</Label>
                  <div className="mt-2 border rounded-lg p-4 flex justify-center">
                    <img 
                      src={businessInfo.logo} 
                      alt="شعار المتجر" 
                      className="max-h-24 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <Label>اختر المظهر</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center p-4 h-auto"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-8 w-8 mb-2" />
                  <span>فاتح</span>
                </Button>
                
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center p-4 h-auto"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-8 w-8 mb-2" />
                  <span>داكن</span>
                </Button>
                
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center p-4 h-auto"
                  onClick={() => setTheme('system')}
                >
                  <div className="flex mb-2">
                    <Sun className="h-8 w-8" />
                    <Moon className="h-8 w-8" />
                  </div>
                  <span>تلقائي</span>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="language" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <Label>اختر اللغة</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={language === 'ar' ? 'default' : 'outline'}
                  className="flex items-center justify-center p-4 h-auto"
                  onClick={() => setLanguage('ar')}
                >
                  <span>العربية</span>
                </Button>
                
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  className="flex items-center justify-center p-4 h-auto"
                  onClick={() => setLanguage('en')}
                >
                  <span>English</span>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
