'use client';

import * as React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  RectangleProps,
  ReferenceLine,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const styles = {
  cardContainer: ['@container/card', 'w-full'].join(' '),
  card: ['@container/card'].join(' '),
  cardHeader: ['card-header', 'p-2', 'gap-0'].join(' '),
  cardTitle: ['p-2'].join(' '),
  cardDescription: ['p-2'].join(' '),
  cardContent: ['p-2'].join(' '),
};

export type BoxPlot = {
  name: string;
  min: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  max: number;
  average?: number;
};

type BoxPlotData = {
  name: string;
  min: number;
  barMin: number;
  bottomWhisker: number;
  bottomBox: number;
  barMedian: number;
  topBox: number;
  topWhisker: number;
  barMax: number;
  average?: number;
  size: number;
};

const VerticalBar = (props: RectangleProps) => {
  const { x, y, width, height } = props;

  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return <line x1={x} y1={y} x2={x} y2={y + height} stroke={'#999'} strokeWidth={3} />;
};

const HorizontalBar = (props: RectangleProps) => {
  const { x, y, width, height } = props;

  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return (
    <line
      x1={x}
      y1={y + height / 2}
      x2={x + width}
      y2={y + height / 2}
      stroke={'#999'}
      strokeWidth={5}
      strokeDasharray={'5'}
    />
  );
};

export function ChartBoxPlot({
  data,
  chartConfig,
  title,
  description,
}: {
  data: BoxPlot[];
  chartConfig: ChartConfig;
  title: string;
  description?: string;
}) {
  const transformedData = React.useMemo<BoxPlotData[]>(() => {
    return data.map((v) => {
      return {
        name: v.name,
        min: v.min,
        barMin: 0.001,
        bottomWhisker: v.lowerQuartile - v.min,
        bottomBox: v.median - v.lowerQuartile,
        barMedian: 0.001,
        topBox: v.upperQuartile - v.median,
        topWhisker: v.max - v.upperQuartile,
        barMax: 0.001,
        average: v.average,
        size: 250,
      };
    });
  }, [data]);

  const overallStats = React.useMemo(() => {
    const allMins = data.map((d) => d.min);
    const allMedians = data.map((d) => d.median);
    const allMaxs = data.map((d) => d.max);
    return {
      min: Math.min(...allMins),
      median: allMedians.reduce((a, b) => a + b, 0) / allMedians.length,
      max: Math.max(...allMaxs),
    };
  }, [data]);

  return (
    <div className={styles.cardContainer}>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="[&_*]:outline-none [&_*]:focus:outline-none h-[300px] w-full">
            <ComposedChart
              responsive
              accessibilityLayer
              data={transformedData}
              layout="vertical"
              barCategoryGap={0}
              margin={{
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={true} horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                interval={0}
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
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'currentColor', fontSize: 12, className: 'fill-muted-foreground' }}
              />
              <ChartTooltip
                cursor={false}
                content={(props) => (
                  <ChartTooltipContent
                    {...props}
                    hideLabel
                    formatter={(value, name) => {
                      return (
                        <>
                          <div className="flex flex-1 items-center gap-2 leading-none">
                            <span className="text-muted-foreground">{name}</span>
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
              <ReferenceLine
                x={overallStats.min}
                stroke="#999"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{
                  value: `Min: ${overallStats.min}`,
                  position: 'top',
                  fill: '#999',
                  fontSize: 11,
                }}
              />
              <ReferenceLine
                x={overallStats.median}
                stroke="#999"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{
                  value: `Median: ${Math.round(overallStats.median)}`,
                  position: 'top',
                  fill: '#999',
                  fontSize: 11,
                }}
              />
              <ReferenceLine
                x={overallStats.max}
                stroke="#999"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{
                  value: `Max: ${overallStats.max}`,
                  position: 'top',
                  fill: '#999',
                  fontSize: 11,
                }}
              />
              <Bar stackId="a" dataKey="min" fill="none" barSize={60} />
              <Bar stackId="a" dataKey="barMin" shape={<VerticalBar />} fill="none" barSize={60} />
              <Bar stackId="a" dataKey="bottomWhisker" shape={<HorizontalBar />} fill="none" barSize={60} />
              <Bar stackId="a" dataKey="bottomBox" fill="#8884d8" barSize={60} />
              <Bar stackId="a" dataKey="barMedian" shape={<VerticalBar />} fill="none" barSize={60} />
              <Bar stackId="a" dataKey="topBox" fill="#8884d8" barSize={60} />
              <Bar stackId="a" dataKey="topWhisker" shape={<HorizontalBar />} fill="none" barSize={60} />
              <Bar stackId="a" dataKey="barMax" shape={<VerticalBar />} fill="none" barSize={60} />
              <ZAxis type="number" dataKey="size" range={[0, 250]} />
              {transformedData.some((d) => d.average != null) && <Scatter dataKey="average" fill="red" stroke="#FFF" />}
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
