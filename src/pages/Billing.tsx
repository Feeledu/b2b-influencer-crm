import MainLayout from "@/components/MainLayout";
import DeveloperPanel from "@/components/DeveloperPanel";
import Billing from "@/components/Billing";
import { useAuth } from "@/contexts/AuthContext";

const BillingPage = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your Fluencr subscription and billing preferences
            </p>
          </div>
        </div>

        <Billing user={user} />
        
        <DeveloperPanel />
      </div>
    </MainLayout>
  );
};

export default BillingPage;
