'use client';

import type { TradeData } from '@/lib/trade-data';
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

export function TradeChart({
  country1Data,
  country2Data,
}: {
  country1Data: TradeData;
  country2Data: TradeData;
}) {
  const chartData = country1Data.data.map((d1) => {
    const d2 = country2Data.data.find((d) => d.year === d1.year);
    return {
      year: d1.year,
      [`${country1Data.name} Exports`]: d1.exports,
      [`${country1Data.name} Imports`]: d1.imports,
      [`${country2Data.name} Exports`]: d2?.exports,
      [`${country2Data.name} Imports`]: d2?.imports,
    };
  });

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
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
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
            dataKey={`${country1Data.name} Exports`}
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey={`${country2Data.name} Exports`}
            fill="hsl(var(--chart-1))"
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey={`${country1Data.name} Imports`}
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey={`${country2Data.name} Imports`}
            fill="hsl(var(--chart-2))"
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
