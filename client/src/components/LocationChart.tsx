"use client"

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface LocationData {
  country: string;
}

interface LocationsResponse {
  locations: LocationData[];
}

interface CountryCount {
  country: string;
  count: number;
}

interface LocationChartProps {
  shortUrl: string;
}

const chartConfig: ChartConfig = {
  count: {
    label: "Clicks",
    color: "hsl(var(--chart-1))",
  },
};

export default function LocationChart({ shortUrl }: LocationChartProps) {
  const [data, setData] = useState<CountryCount[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const API_URL = import.meta.env.VITE_API_URL as string;
        const response = await fetch(`${API_URL}locations/${shortUrl}`);
        const json: LocationsResponse = await response.json();
        
        const countryMap = new Map<string, number>();
        json.locations.forEach((loc) => {
          const country = loc.country || "Unknown";
          countryMap.set(country, (countryMap.get(country) || 0) + 1);
        });

        const chartData: CountryCount[] = Array.from(countryMap, ([country, count]) => ({
          country,
          count,
        })).sort((a, b) => b.count - a.count);
        
        setData(chartData);
      } catch (err) {
        console.error("Error fetching location data:", err);
        setError("Error fetching location data");
      }
    }
    fetchLocations();
  }, [shortUrl]);

  if (error) return <div>{error}</div>;
  if (data.length === 0) return <div>Loading...</div>;

  return (
    
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Location Chart for {shortUrl}</CardTitle>
        <CardDescription>Clicks by Country</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: -20 }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="country"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  );
}