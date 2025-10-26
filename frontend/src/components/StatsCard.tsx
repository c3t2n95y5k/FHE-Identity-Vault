import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  gradient?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, trend, gradient }: StatsCardProps) => {
  return (
    <Card className={`p-6 shadow-card hover:shadow-primary transition-all duration-300 ${
      gradient ? "bg-gradient-primary text-primary-foreground" : ""
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-2 ${
            gradient ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}>
            {title}
          </p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm ${
              gradient ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}>
              <span className={trend.value >= 0 ? "text-success" : "text-destructive"}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>{" "}
              {trend.label}
            </p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
          gradient ? "bg-primary-foreground/20" : "bg-primary/10"
        }`}>
          <Icon className={`h-6 w-6 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
