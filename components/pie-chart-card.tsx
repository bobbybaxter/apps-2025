'use client';

import React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const styles = {
  cardContainer: ['@container/card', 'aspect-square', 'w-full', 'max-w-[150px]', 'min-[400px]:max-w-[167px]'].join(' '),
  card: ['@container/card', 'h-full'].join(' '),
};

export default function PieChartCard({
  data,
  chartConfig,
  title,
}: {
  data: Array<{ label: string; value: number; fill: string }>;
  chartConfig: ChartConfig;
  title: string;
}) {
  const totalItemsCount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  return (
    <div className={styles.cardContainer}>
      <Card className={styles.card}>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[150px] w-[150px] min-[400px]:h-[167px] min-[400px]:w-[167px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={(props) => (
                  <ChartTooltipContent
                    {...props}
                    hideLabel
                    nameKey="label"
                    formatter={(value, name, item) => {
                      const indicatorColor = item.payload?.fill || item.color;
                      const dataName = item.payload?.name || name;

                      return (
                        <>
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)"
                            style={
                              {
                                '--color-bg': indicatorColor,
                                '--color-border': indicatorColor,
                              } as React.CSSProperties
                            }
                          />
                          <div className="flex flex-1 items-center gap-2 leading-none">
                            <span className="text-muted-foreground">{dataName}</span>
                            {value && (
                              <span className="text-foreground font-mono font-medium tabular-nums">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </span>
                            )}
                          </div>
                        </>
                      );
                    }}
                  />
                )}
              />
              <Pie data={data} dataKey="value" nameKey="label" innerRadius="60%" strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 3}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalItemsCount.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 15} className="fill-muted-foreground">
                            {title}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
