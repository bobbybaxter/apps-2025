'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ChartAreaInteractive({
  data,
  chartConfig,
}: {
  data: Array<{
    date: string;
    applied: number;
    ghosted: number;
    notSelected: number;
    cancelled: number;
    applicationRescinded: number;
    offerRescinded: number;
    interviews: number;
  }>;
  chartConfig: ChartConfig;
}) {
  const [aggregation, setAggregation] = React.useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const parseDate = React.useCallback((dateStr: string): Date => {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }, []);

  const filteredData = React.useMemo(() => {
    const getWeekStart = (date: Date): Date => {
      const d = new Date(date);
      const day = d.getDay(); // 0 = Sunday, 6 = Saturday
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const getMonthStart = (date: Date): Date => {
      const d = new Date(date.getFullYear(), date.getMonth(), 1);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const getGroupKey = (date: Date, type: 'daily' | 'weekly' | 'monthly'): string => {
      if (type === 'daily') {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      } else if (type === 'weekly') {
        const weekStart = getWeekStart(date);
        const month = String(weekStart.getMonth() + 1).padStart(2, '0');
        const day = String(weekStart.getDate()).padStart(2, '0');
        const year = weekStart.getFullYear();
        return `${month}/${day}/${year}`;
      } else {
        const monthStart = getMonthStart(date);
        const month = String(monthStart.getMonth() + 1).padStart(2, '0');
        const year = monthStart.getFullYear();
        return `${month}/01/${year}`;
      }
    };

    if (aggregation === 'daily') {
      return data;
    }

    const grouped = new Map<
      string,
      {
        date: string;
        applied: number;
        ghosted: number;
        notSelected: number;
        cancelled: number;
        applicationRescinded: number;
        offerRescinded: number;
        interviews: number;
      }
    >();

    data.forEach((item) => {
      const date = parseDate(item.date);
      const groupKey = getGroupKey(date, aggregation);

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          date: groupKey,
          applied: 0,
          ghosted: 0,
          notSelected: 0,
          cancelled: 0,
          applicationRescinded: 0,
          offerRescinded: 0,
          interviews: 0,
        });
      }

      const group = grouped.get(groupKey)!;
      group.applied += item.applied || 0;
      group.ghosted += item.ghosted || 0;
      group.notSelected += item.notSelected || 0;
      group.cancelled += item.cancelled || 0;
      group.applicationRescinded += item.applicationRescinded || 0;
      group.offerRescinded += item.offerRescinded || 0;
      group.interviews += item.interviews || 0;
    });

    return Array.from(grouped.values()).sort((a, b) => {
      return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });
  }, [data, aggregation, parseDate]);

  return (
    <Card className="@container/card">
      <CardHeader className="p-2">
        <CardTitle className="p-2">Application Data Over Time</CardTitle>
        <CardAction>
          <ToggleGroup
            type="single"
            value={aggregation}
            onValueChange={(value) => {
              if (value && (value === 'daily' || value === 'weekly' || value === 'monthly')) {
                setAggregation(value);
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={aggregation}
            onValueChange={(value) => {
              if (value === 'daily' || value === 'weekly' || value === 'monthly') {
                setAggregation(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select aggregation"
            >
              <SelectValue placeholder="Weekly" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="daily" className="rounded-lg">
                Daily
              </SelectItem>
              <SelectItem value="weekly" className="rounded-lg">
                Weekly
              </SelectItem>
              <SelectItem value="monthly" className="rounded-lg">
                Monthly
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <YAxis tickLine={false} axisLine={false} width={30} allowDataOverflow={true} />
            <defs>
              <linearGradient id="fillApplied" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-applied)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-applied)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillGhosted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-ghosted)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-ghosted)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillNotSelected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-notSelected)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-notSelected)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cancelled)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-cancelled)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillApplicationRescinded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-applicationRescinded)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-applicationRescinded)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOfferRescinded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-offerRescinded)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-offerRescinded)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-interviews)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-interviews)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const dateStr = String(value);
                const date = parseDate(dateStr);
                if (aggregation === 'monthly') {
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  });
                } else if (aggregation === 'weekly') {
                  const weekEnd = new Date(date);
                  weekEnd.setDate(weekEnd.getDate() + 6);
                  return `${date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })} - ${weekEnd.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}`;
                } else {
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }
              }}
            />
            <ChartTooltip
              cursor={false}
              content={(props) => {
                const filteredPayload = props.payload?.filter((item) => {
                  const value = typeof item.value === 'number' ? item.value : Number(item.value);
                  return value !== 0 && !isNaN(value);
                });

                return (
                  <ChartTooltipContent
                    {...props}
                    payload={filteredPayload}
                    labelFormatter={(value) => {
                      const dateStr = String(value);
                      const date = parseDate(dateStr);
                      if (aggregation === 'monthly') {
                        return date.toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        });
                      } else if (aggregation === 'weekly') {
                        const weekEnd = new Date(date);
                        weekEnd.setDate(weekEnd.getDate() + 6);
                        return `${date.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })} - ${weekEnd.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}`;
                      } else {
                        return date.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        });
                      }
                    }}
                    indicator="dot"
                  />
                );
              }}
            />
            <Area dataKey="applied" type="natural" fill="url(#fillApplied)" stroke="var(--color-applied)" stackId="a" />
            <Area dataKey="ghosted" type="natural" fill="url(#fillGhosted)" stroke="var(--color-ghosted)" stackId="b" />
            <Area
              dataKey="notSelected"
              type="natural"
              fill="url(#fillNotSelected)"
              stroke="var(--color-notSelected)"
              stackId="c"
            />
            <Area
              dataKey="interviews"
              type="natural"
              fill="url(#fillInterviews)"
              stroke="var(--color-interviews)"
              stackId="g"
            />
            <Area
              dataKey="cancelled"
              type="natural"
              fill="url(#fillCancelled)"
              stroke="var(--color-cancelled)"
              stackId="d"
            />
            <Area
              dataKey="applicationRescinded"
              type="natural"
              fill="url(#fillApplicationRescinded)"
              stroke="var(--color-applicationRescinded)"
              stackId="e"
            />
            <Area
              dataKey="offerRescinded"
              type="natural"
              fill="url(#fillOfferRescinded)"
              stroke="var(--color-offerRescinded)"
              stackId="f"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
