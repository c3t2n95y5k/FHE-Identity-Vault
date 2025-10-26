import Navigation from "@/components/Navigation";
import IdentityCard from "@/components/IdentityCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Plus, History, Settings } from "lucide-react";

const Identity = () => {
  const hasIdentity = true; // This would come from contract state

  const activityHistory = [
    {
      action: "Identity Updated",
      date: "Jan 20, 2024",
      details: "Net worth and risk score updated",
    },
    {
      action: "Identity Created",
      date: "Jan 15, 2024",
      details: "Initial identity setup completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Identity Management</h1>
          <p className="text-muted-foreground">
            Manage your encrypted on-chain identity secured by FHE
          </p>
        </div>

        {hasIdentity ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Identity Card */}
            <div className="lg:col-span-2">
              <IdentityCard
                netWorth="1,250,000"
                domicile="United States"
                tier={7}
                isPEP={false}
                watchlistScore={0}
                riskScore={15}
                accessLevel="Premium"
                createdAt="Jan 15, 2024"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Settings className="h-4 w-4" />
                    Update Identity
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Shield className="h-4 w-4" />
                    View Permissions
                  </Button>
                </div>
              </Card>

              {/* Activity History */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Activity History</h3>
                </div>
                <div className="space-y-4">
                  {activityHistory.map((activity, index) => (
                    <div
                      key={index}
                      className="pb-4 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div className="font-medium text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {activity.date}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {activity.details}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Info Card */}
              <Card className="p-6 bg-gradient-primary text-primary-foreground">
                <Shield className="h-8 w-8 mb-3 opacity-80" />
                <h3 className="font-semibold mb-2">Your Data is Secure</h3>
                <p className="text-sm opacity-80">
                  All sensitive information is encrypted using Fully Homomorphic Encryption,
                  ensuring complete privacy on the blockchain.
                </p>
              </Card>
            </div>
          </div>
        ) : (
          // Empty State - No Identity
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Create Your Identity</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Set up your encrypted on-chain identity to access the platform's features.
              Your data will be secured with FHE technology.
            </p>
            <Button size="lg" className="bg-gradient-primary shadow-primary gap-2">
              <Plus className="h-5 w-5" />
              Create Identity
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Identity;
