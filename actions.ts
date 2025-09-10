'use server';

import { provideSummaryInsights } from '@/ai/flows/provide-summary-insights';
import { generateTradeComparisonChart } from '@/ai/flows/generate-trade-comparison-chart';
import { getCountryTradeData } from './trading-economics';
import type { TradeData } from './trade-data';

export interface AiChartData {
  chartDescription: string;
  chartData: {
    year: number;
    country1_exports: number;
    country1_imports: number;
    country2_exports: number;
    country2_imports: number;
  }[];
}

export interface ComparisonData {
  country1Data: TradeData;
  country2Data: TradeData;
  aiSummary: { summary: string };
  aiChart: AiChartData;
  stats: {
    totalTradeVolume: number;
    totalTradeBalance: number;
    tradeSurplusCountry: string | null;
  };
}

export async function getComparisonData(
  country1Code: string,
  country2Code: string
): Promise<ComparisonData | null> {
  try {
    const [country1Data, country2Data] = await Promise.all([
        getCountryTradeData(country1Code),
        getCountryTradeData(country2Code)
    ]);

    if (!country1Data || !country2Data) {
      return null;
    }

    const aiSummaryPromise = provideSummaryInsights({
      country1: country1Data.name,
      country2: country2Data.name,
      tradeData: JSON.stringify({
        [country1Data.name]: country1Data.data,
        [country2Data.name]: country2Data.data,
      }),
    });

    const aiChartPromise = generateTradeComparisonChart({
        country1Name: country1Data.name,
        country1Data: JSON.stringify(country1Data.data),
        country2Name: country2Data.name,
        country2Data: JSON.stringify(country2Data.data),
    });

    const [aiSummary, aiChart] = await Promise.all([aiSummaryPromise, aiChartPromise]);

    const totalExports1 = country1Data.data.reduce((sum, d) => sum + d.exports, 0);
    const totalImports1 = country1Data.data.reduce((sum, d) => sum + d.imports, 0);
    const totalExports2 = country2Data.data.reduce((sum, d) => sum + d.exports, 0);
    const totalImports2 = country2Data.data.reduce((sum, d) => sum + d.imports, 0);

    const totalTradeVolume = totalExports1 + totalImports1 + totalExports2 + totalImports2;
    const balance1 = totalExports1 - totalImports1;
    const balance2 = totalExports2 - totalImports2;
    
    // For simplicity, this balance is from country1's perspective vs country2.
    // A more complex model would be needed for true bilateral balance.
    const totalTradeBalance = balance1 - balance2;

    let tradeSurplusCountry: string | null = null;
    if (totalTradeBalance > 0) {
        tradeSurplusCountry = country1Data.name;
    } else if (totalTradeBalance < 0) {
        tradeSurplusCountry = country2Data.name;
    }

    return {
      country1Data,
      country2Data,
      aiSummary: aiSummary || { summary: 'AI summary could not be generated.' },
      aiChart: aiChart || { chartDescription: 'AI chart could not be generated.', chartData: [] },
      stats: {
        totalTradeVolume,
        totalTradeBalance,
        tradeSurplusCountry
      }
    };
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return null;
  }
}
