import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, Loader2 } from "lucide-react";
import { useIdentity, useCreateIdentity } from "@/hooks/useIdentity";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { toast } from "sonner";

// Common countries
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "KR", name: "South Korea" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
];

const IdentityNew = () => {
  const { address, isConnected } = useAccount();
  const { hasIdentity, identityData, refetchHasIdentity } = useIdentity();
  const { createIdentity, isEncrypting } = useCreateIdentity();

  const [formData, setFormData] = useState({
    netWorth: "",
    domicile: "",
    isPEP: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.netWorth || !formData.domicile) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const hash = await createIdentity({
        netWorth: parseInt(formData.netWorth),
        domicile: formData.domicile,
        isPEP: formData.isPEP,
      });

      toast.success("Identity created successfully!");
      console.log("Transaction hash:", hash);

      // Refetch identity status
      setTimeout(() => {
        refetchHasIdentity();
      }, 2000);

    } catch (error: any) {
      console.error("Failed to create identity:", error);
      toast.error(error.message || "Failed to create identity");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Please connect your wallet to access identity management features.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
          // Show existing identity
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Identity</h2>
                <p className="text-sm text-muted-foreground">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Identity Data</Label>
                <p className="text-sm">Your encrypted identity is stored on-chain. Sensitive data is encrypted using FHE.</p>
              </div>

              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  Update Identity
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          // Create Identity Form
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create Your Identity</h2>
              <p className="text-muted-foreground">
                Set up your encrypted on-chain identity. Your sensitive data will be encrypted using FHE.
              </p>
            </div>

            <form onSubmit={handleCreateIdentity} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="netWorth">Net Worth (USD)</Label>
                <Input
                  id="netWorth"
                  type="number"
                  placeholder="1000000"
                  value={formData.netWorth}
                  onChange={(e) => setFormData({ ...formData, netWorth: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be encrypted and stored on-chain
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domicile">Domicile (Country)</Label>
                <Select
                  value={formData.domicile}
                  onValueChange={(value) => setFormData({ ...formData, domicile: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPEP"
                  checked={formData.isPEP}
                  onChange={(e) => setFormData({ ...formData, isPEP: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isPEP" className="cursor-pointer">
                  I am a Politically Exposed Person (PEP)
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary shadow-primary"
                size="lg"
                disabled={isEncrypting || isSubmitting}
              >
                {isEncrypting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Encrypting Data...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Identity...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Create Identity
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IdentityNew;
