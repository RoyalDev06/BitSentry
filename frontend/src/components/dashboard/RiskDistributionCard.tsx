import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useRiskDistribution } from "../../hooks/useDashboard";
import type { RiskLevel } from "../../types/dashboard";
import SectionCard from "./SectionCard";
import StateView from "./StateView";
import { riskLabel } from "./dashboardUtils";

const RISK_COLORS: Record<RiskLevel, string> = {
  low: "var(--color-risk-low)",
  medium: "var(--color-risk-medium)",
  high: "var(--color-risk-high)",
  critical: "var(--color-risk-critical)",
};

export default function RiskDistributionCard() {
  const { data, isLoading, isError, refetch } = useRiskDistribution();
  const isEmpty = !isLoading && !isError && (!data || data.length === 0);

  return (
    <SectionCard title="Risk Distribution">
      {isLoading || isError || isEmpty ? (
        <StateView
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          emptyMessage="No risk data available."
          onRetry={refetch}
        />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="level"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
              >
                {data!.map((entry) => (
                  <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-background-card)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: 8,
                  color: "var(--color-text-primary)",
                }}
                formatter={(value, _name, item) => [
                  `${value}`,
                  riskLabel[
                    (item as { payload: { level: RiskLevel } }).payload.level
                  ],
                ]}
              />
              <Legend
                formatter={(_v, entry) =>
                  riskLabel[
                    (entry as { payload: { level: RiskLevel } }).payload.level
                  ]
                }
                wrapperStyle={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
