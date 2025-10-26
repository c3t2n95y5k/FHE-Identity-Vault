import { Shield, Lock, Eye, EyeOff, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface IdentityCardProps {
  netWorth?: string;
  domicile?: string;
  tier?: number;
  isPEP?: boolean;
  watchlistScore?: number;
  riskScore?: number;
  accessLevel?: "Denied" | "Basic" | "Full" | "Premium";
  createdAt?: string;
  isEncrypted?: boolean;
}

const IdentityCard = ({
  netWorth = "********",
  domicile = "United States",
  tier = 5,
  isPEP = false,
  watchlistScore = 0,
  riskScore = 15,
  accessLevel = "Full",
  createdAt = "2024-01-15",
  isEncrypted = true,
}: IdentityCardProps) => {
  const [showNetWorth, setShowNetWorth] = useState(false);

  const accessLevelColors = {
    Denied: "destructive",
    Basic: "warning",
    Full: "success",
    Premium: "default",
  };

  const getRiskColor = (score: number) => {
    if (score < 20) return "text-success";
    if (score < 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-primary transition-all duration-300 border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Your Identity</h3>
            <p className="text-sm text-muted-foreground">Encrypted on-chain</p>
          </div>
        </div>
        <Badge variant={accessLevelColors[accessLevel] as any} className="gap-1">
          <Lock className="h-3 w-3" />
          {accessLevel}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Net Worth - Encrypted */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Net Worth</span>
              {isEncrypted && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Encrypted
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNetWorth(!showNetWorth)}
              className="h-8 gap-1"
            >
              {showNetWorth ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Decrypt
                </>
              )}
            </Button>
          </div>
          <div className="text-2xl font-bold">
            {showNetWorth
              ? netWorth
                ? `$${netWorth}`
                : "Encrypted"
              : "••••••••"}
          </div>
        </div>

        {/* Identity Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Domicile</div>
            <div className="font-medium">{domicile}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Tier Level</div>
            <div className="font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              {tier}/10
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">PEP Status</div>
            <Badge variant={isPEP ? "warning" : "secondary"}>
              {isPEP ? "Yes" : "No"}
            </Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Watchlist</div>
            <div className="font-medium">{watchlistScore}/5</div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-muted-foreground mb-1">Risk Score</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    riskScore < 20
                      ? "bg-success"
                      : riskScore < 50
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
              <span className={`font-medium ${getRiskColor(riskScore)}`}>
                {riskScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Created {createdAt}</span>
          <Button variant="outline" size="sm">
            Update Identity
          </Button>
        </div>
      </div>

      {riskScore > 70 && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-destructive">High Risk Detected</p>
            <p className="text-muted-foreground mt-1">
              Your risk score is elevated. Consider reviewing your identity information.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default IdentityCard;
