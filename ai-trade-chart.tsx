'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { AiChartData } from '@/lib/actions';

export function AiTradeChart({
  chartData,
  country1Name,
  country2Name,
}: {
  chartData: AiChartData['chartData'];
  country1Name: string;
  country2Name: string;
}) {
  const transformedChartData = chartData.map((d) => ({
    year: d.year,
    [`${country1Name} Exports`]: d.country1_exports,
    [`${country1Name} Imports`]: d.country1_imports,
    [`${country2Name} Exports`]: d.country2_exports,
    [`${country2Name} Imports`]: d.country2_imports,
  }));

  const formatValue = (value: number) => `$${value}B`;

  const chartConfig = {
    exports: {
      label: 'Exports',
      color: 'hsl(var(--chart-1))',
    },
    imports: {
      label: 'Imports',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[100%] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedChartData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis
            tickFormatter={formatValue}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={80}
            fontSize={12}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: name.includes('Exports')
                          ? 'hsl(var(--chart-1))'
                          : 'hsl(var(--chart-2))',
                      }}
                    ></div>
                    <div className="flex flex-1 justify-between">
                      <span>{name}</span>
                      <span className="font-bold">
                        {formatValue(Number(value))}
                      </span>
                    </div>
                  </div>
                )}
                labelClassName="font-bold"
              />
            }
          />
          <Legend />
          <Bar
            dataKey={`${country1Name} Exports`}
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey={`${country2Name} Exports`}
            fill="hsl(var(--chart-1))"
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey={`${country1Name} Imports`}
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey={`${country2Name} Imports`}
            fill="hsl(var(--chart-2))"
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
