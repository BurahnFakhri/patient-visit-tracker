import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  trend,
  trendValue
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("relative overflow-hidden bg-gradient-to-br from-card to-muted/30 border-border/50 shadow-soft", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-primary" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && trendValue && (
          <p className={cn("text-xs mt-1", getTrendColor())}>
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
}