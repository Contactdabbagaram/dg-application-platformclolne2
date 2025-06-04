
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import AdminHome from '@/components/admin/AdminHome';
import BusinessSettings from '@/components/admin/BusinessSettings';
import AddOutlet from '@/components/admin/AddOutlet';
import OutletSettingsLayout from '@/components/admin/OutletSettingsLayout';
import OutletDashboard from '@/components/admin/OutletDashboard';
import OutletOrders from '@/components/admin/OutletOrders';
import OutletReviews from '@/components/admin/OutletReviews';
import OutletSettings from '@/components/admin/OutletSettings';
import FrontendSettings from '@/components/admin/FrontendSettings';

const Admin = () => {
  const [activeView, setActiveView] = useState('home');
  const [selectedOutlet, setSelectedOutlet] = useState('Airoli');
  const [activeOutletSection, setActiveOutletSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/admin/login');
        } else if (session) {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const handleAddOutlet = (outletName: string) => {
    console.log('Adding outlet:', outletName);
    setActiveView('home');
  };

  const handleOutletSelect = (outletName: string) => {
    setSelectedOutlet(outletName);
    setActiveOutletSection('dashboard');
    setActiveView('outlet');
  };

  const handleOutletSectionChange = (section: string) => {
    setActiveOutletSection(section);
  };

  const renderOutletContent = () => {
    switch (activeOutletSection) {
      case 'dashboard':
        return <OutletDashboard outletName={selectedOutlet} />;
      case 'orders':
        return <OutletOrders outletName={selectedOutlet} />;
      case 'reviews':
        return <OutletReviews outletName={selectedOutlet} />;
      case 'settings':
        return <OutletSettings outletName={selectedOutlet} />;
      default:
        return <OutletDashboard outletName={selectedOutlet} />;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <AdminHome 
            onNavigateToBusinessSettings={() => setActiveView('business-settings')}
            onNavigateToOutletManagement={() => setActiveView('business-settings')}
            onOutletSelect={handleOutletSelect}
            onNavigateToFrontendSettings={() => setActiveView('frontend-settings')}
            onNavigateToStoreSettings={() => setActiveView('store-settings')}
          />
        );
      case 'business-settings':
        return (
          <BusinessSettings 
            onAddOutlet={() => setActiveView('add-outlet')}
            onBack={() => setActiveView('home')}
          />
        );
      case 'add-outlet':
        return (
          <AddOutlet 
            onBack={() => setActiveView('business-settings')}
            onSave={handleAddOutlet}
          />
        );
      case 'frontend-settings':
        return <FrontendSettings />;
      case 'store-settings':
        return <StoreSettings restaurantId="00000000-0000-0000-0000-000000000001" />;
      case 'outlet':
        return (
          <OutletSettingsLayout
            outletName={selectedOutlet}
            activeSection={activeOutletSection}
            onSectionChange={handleOutletSectionChange}
            onBack={() => setActiveView('home')}
          >
            {renderOutletContent()}
          </OutletSettingsLayout>
        );
      default:
        return (
          <AdminHome 
            onNavigateToBusinessSettings={() => setActiveView('business-settings')}
            onNavigateToOutletManagement={() => setActiveView('business-settings')}
            onOutletSelect={handleOutletSelect}
            onNavigateToFrontendSettings={() => setActiveView('frontend-settings')}
            onNavigateToStoreSettings={() => setActiveView('store-settings')}
          />
        );
    }
  };

  return <div className="min-h-screen">{renderContent()}</div>;
};

export default Admin;
