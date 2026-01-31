'use client';

import React from 'react';
import { Funnel, FunnelChart, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'A funnel chart';

function normalizeNameToKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function findConfigKey(name: string, chartConfig: ChartConfig): string | undefined {
  const normalized = normalizeNameToKey(name);

  if (normalized in chartConfig) {
    return normalized;
  }

  const configKeys = Object.keys(chartConfig);
  const match = configKeys.find((key) => normalizeNameToKey(key) === normalized);
  if (match) {
    return match;
  }

  const lowerName = name.toLowerCase();
  return configKeys.find((key) => {
    const configLabel = chartConfig[key]?.label;
    if (typeof configLabel === 'string') {
      return configLabel.toLowerCase() === lowerName;
    }
    return false;
  });
}

export function ChartFunnel({
  data,
  chartConfig,
  title,
  description: desc,
}: {
  data: Array<{ name: string; value: number; fill?: string }>;
  chartConfig: ChartConfig;
  title: string;
  description?: string;
}) {
  const transformedData = React.useMemo(() => {
    return data.map((item) => {
      if (item.fill) {
        return item;
      }

      const configKey = findConfigKey(item.name, chartConfig);
      const fill = configKey && chartConfig[configKey]?.color ? `var(--color-${configKey})` : 'var(--chart-1)';

      return {
        ...item,
        fill,
      };
    });
  }, [data, chartConfig]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {desc && <CardDescription>{desc}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <FunnelChart data={transformedData}>
            <ChartTooltip content={(props) => <ChartTooltipContent {...props} hideLabel nameKey="name" />} />
            <Funnel dataKey="value" data={transformedData} isAnimationActive>
              <LabelList position="right" fill="#000" stroke="none" dataKey="name" className="fill-foreground" />
            </Funnel>
          </FunnelChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">Showing conversion funnel with {data.length} stages</div>
      </CardFooter>
    </Card>
  );
}
