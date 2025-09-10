import type { ComparisonData } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeftRight,
  BarChart3,
  Download,
  Package,
  PackageOpen,
  Scale,
  Table2,
  WandSparkles,
} from 'lucide-react';
import { TradeChart } from './trade-chart';
import { TradeDataTable } from './trade-data-table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { AiTradeChart } from './ai-trade-chart';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value * 1_000_000_000); // Assuming value is in billions
}

export function ComparisonDashboard(props: ComparisonData) {
  const { country1Data, country2Data, aiSummary, aiChart, stats } = props;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
            <ArrowLeftRight className="size-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {country1Data.name} vs. {country2Data.name}
            </h1>
        </div>
        <Button variant="outline">
          <Download className="mr-2" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <WandSparkles className="size-6 text-primary" />
            <CardTitle>AI-Powered Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{aiSummary.summary}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <Scale className="text-muted-foreground" />
                        <span>Total Trade Balance</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalTradeBalance)}</p>
                    <p className="text-xs text-muted-foreground">
                        {stats.tradeSurplusCountry ? `${stats.tradeSurplusCountry} has a trade surplus` : 'Balanced trade'}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <BarChart3 className="text-muted-foreground" />
                        <span>Total Trade Volume</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalTradeVolume)}</p>
                    <p className="text-xs text-muted-foreground">Combined exports and imports</p>
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <BarChart3 className="size-6 text-primary" />
            <CardTitle>Year-over-Year Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeChart country1Data={country1Data} country2Data={country2Data} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
             <WandSparkles className="size-6 text-primary" />
            <CardTitle>AI-Generated Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full relative overflow-hidden rounded-lg border">
                <AiTradeChart
                    chartData={aiChart.chartData}
                    country1Name={country1Data.name}
                    country2Name={country2Data.name}
                />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{aiChart.chartDescription}</p>
          </CardContent>
        </Card>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Major Commodities</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{country1Data.name}</h3>
                    <Separator/>
                    <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><Package className="text-accent" /> Exports</h4>
                        <div className="flex flex-wrap gap-2">
                            {country1Data.commodities.exports.map(c => <Badge variant="secondary" key={c}>{c}</Badge>)}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><PackageOpen className="text-primary"/> Imports</h4>
                        <div className="flex flex-wrap gap-2">
                            {country1Data.commodities.imports.map(c => <Badge variant="outline" key={c}>{c}</Badge>)}
                        </div>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{country2Data.name}</h3>
                    <Separator/>
                    <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><Package className="text-accent" /> Exports</h4>
                        <div className="flex flex-wrap gap-2">
                            {country2Data.commodities.exports.map(c => <Badge variant="secondary" key={c}>{c}</Badge>)}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2"><PackageOpen className="text-primary"/> Imports</h4>
                        <div className="flex flex-wrap gap-2">
                            {country2Data.commodities.imports.map(c => <Badge variant="outline" key={c}>{c}</Badge>)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <Table2 className="size-6 text-primary" />
          <CardTitle>Detailed Trade Data</CardTitle>
        </CardHeader>
        <CardContent>
          <TradeDataTable country1Data={country1Data} country2Data={country2Data} />
        </CardContent>
      </Card>
    </div>
  );
}
