'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const styles = {
  cardContainer: ['@container/card', 'w-full'].join(' '),
  card: ['@container/card'].join(' '),
  cardHeader: ['card-header', 'p-2', 'gap-0'].join(' '),
  cardTitle: ['p-2'].join(' '),
  cardDescription: ['p-2'].join(' '),
  cardContent: ['p-2'].join(' '),
  cardFooter: ['p-2'].join(' '),
};

export function ChartBarStacked({
  data,
  chartConfig,
  title,
  description,
}: {
  data: Array<Record<string, string | number>>;
  chartConfig: ChartConfig;
  title: string;
  description?: string;
}) {
  const dataKeys = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const keys = Object.keys(data[0]).filter((key) => key !== 'name');
    return keys;
  }, [data]);

  return (
    <div className={styles.cardContainer}>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="[&_*]:outline-none [&_*]:focus:outline-none">
            <BarChart
              responsive
              accessibilityLayer
              data={data}
              layout="vertical"
              barCategoryGap="5%"
              margin={{
                left: 25,
              }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const label = chartConfig[value as keyof typeof chartConfig]?.label;
                  return typeof label === 'string' ? label : String(value);
                }}
                tick={(props) => {
                  const { x, y, payload } = props;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={4}
                        textAnchor="end"
                        fill="currentColor"
                        className="text-xs fill-muted-foreground"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {chartConfig[payload.value as keyof typeof chartConfig]?.label || payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              <XAxis dataKey="value" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={(props) => (
                  <ChartTooltipContent
                    {...props}
                    hideLabel
                    formatter={(value, name, item) => {
                      const config = chartConfig[name as keyof typeof chartConfig];
                      const label = config?.label || name;
                      const indicatorColor = item.payload?.fill || item.color || config?.color;
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
                            <span className="text-muted-foreground">{label}</span>
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
              {dataKeys.map((key, index) => {
                const config = chartConfig[key as keyof typeof chartConfig];
                const isFirst = index === 0;
                const isLast = index === dataKeys.length - 1;
                const radius: number | [number, number, number, number] = isFirst
                  ? ([5, 0, 0, 5] as [number, number, number, number])
                  : isLast
                    ? ([0, 5, 5, 0] as [number, number, number, number])
                    : 0;
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="stack"
                    radius={radius}
                    fill={config?.color || '#8884d8'}
                    barSize={15}
                  />
                );
              })}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
