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
import StoreSettings from '@/components/admin/StoreSettings';
import OutletMenuManagement from '@/components/admin/OutletMenuManagement';
import { OutletProvider } from '@/contexts/OutletContext';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const [activeView, setActiveView] = useState('home');
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [selectedOutletName, setSelectedOutletName] = useState<string>('');
  const [activeOutletSection, setActiveOutletSection] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState<any[]>([]);

  // Restaurant ID and Outlet ID mappings - this is now just for initial state
  const outletIdMapping = {
    'Airoli': '00000000-0000-0000-0000-000000000101',
    'Andheri (W)': '00000000-0000-0000-0000-000000000102',
    'Bandra': '00000000-0000-0000-0000-000000000103',
  };

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
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchOutlets = async () => {
      const { data, error } = await supabase.from('outlets').select('id, name, address').order('name');
      if (error) {
        console.error("Error fetching outlets:", error);
      } else if (data) {
        setOutlets(data);
      }
    };
    if (user) {
      fetchOutlets();
    }
  }, [user]);

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

  const handleOutletSelect = (outlet: { id: string; name: string }) => {
    setSelectedOutletId(outlet.id);
    setSelectedOutletName(outlet.name);
    setActiveOutletSection('dashboard');
    setActiveView('outlet');
  };

  const handleOutletSectionChange = (section: string) => {
    setActiveOutletSection(section);
  };

  const renderOutletContent = () => {
    if (!selectedOutletId) {
        return <p>Something went wrong, outlet not selected.</p>;
    }

    switch (activeOutletSection) {
      case 'dashboard':
        return <OutletDashboard outletName={selectedOutletName} outletId={selectedOutletId} />;
      case 'menu':
        return <OutletMenuManagement 
          outletName={selectedOutletName} 
          outletId={selectedOutletId}
        />;
      case 'orders':
        return <OutletOrders outletName={selectedOutletName} />;
      case 'reviews':
        return <OutletReviews outletName={selectedOutletName} />;
      case 'settings':
        return <OutletSettings outletName={selectedOutletName} />;
      default:
        return <OutletDashboard outletName={selectedOutletName} outletId={selectedOutletId} />;
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <AdminHome 
            outlets={outlets}
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
        // This view is not directly reachable from a button, but if it were, an outlet must be selected.
        if (!selectedOutletId) {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600">Please select an outlet from the home page to manage store settings.</p>
                <Button onClick={() => { setActiveView('home'); }} className="mt-4">
                  Back to Home
                </Button>
              </div>
            </div>
          );
        }
        return (
          <OutletProvider outletId={selectedOutletId}>
            <StoreSettings outletId={selectedOutletId} />
          </OutletProvider>
        );
      case 'outlet':
        if (!selectedOutletId) return null;
        return (
          <OutletProvider outletId={selectedOutletId}>
            <OutletSettingsLayout
              outletName={selectedOutletName}
              activeSection={activeOutletSection}
              onSectionChange={handleOutletSectionChange}
              onBack={() => setActiveView('home')}
            >
              {renderOutletContent()}
            </OutletSettingsLayout>
          </OutletProvider>
        );
      default:
        return (
          <AdminHome 
            outlets={outlets}
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
