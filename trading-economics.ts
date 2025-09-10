'use server';
import { tradeData, type Country, type TradeData, type TradeYearData } from './trade-data';

const BASE_URL = 'https://api.tradingeconomics.com';

function getApiKey() {
    const apiKey = process.env.TRADING_ECONOMICS_API_KEY;
    if (!apiKey) {
        console.warn("Trading Economics API key not found. Using guest:guest credentials. This will limit API access.");
        return "guest:guest";
    }
    return apiKey;
}

// Maps Trading Economics country names to our internal 3-letter codes
const countryCodeMapping: Record<string, string> = {
    "United States": "USA",
    "China": "CHN",
    "Japan": "JPN",
    "Germany": "DEU",
    "India": "IND",
    "United Kingdom": "GBR",
    "Brazil": "BRA",
    "Canada": "CAN",
};

export async function getCountries(): Promise<Country[]> {
    const apiKey = getApiKey();
    const url = `${BASE_URL}/indicators?c=${apiKey}`;
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        const data: {Country: string}[] = await response.json();
        
        const supportedCountryNames = Object.keys(countryCodeMapping);
        
        const countries = data
            .map(c => c.Country)
            // Deduplicate countries
            .filter((value, index, self) => self.indexOf(value) === index)
            .filter(countryName => supportedCountryNames.includes(countryName))
            .map(countryName => ({
                name: countryName,
                code: countryCodeMapping[countryName]
            }));

        if (countries.length > 0) return countries;
        
        console.warn("Could not fetch countries from API, using fallback data.");
        return Object.values(tradeData).map(c => ({ name: c.name, code: c.code }));

    } catch (error) {
        console.error("Error fetching countries:", error);
        console.warn("Using fallback static country data.");
        return Object.values(tradeData).map(c => ({ name: c.name, code: c.code }));
    }
}

export async function getCountryTradeData(countryCode: string): Promise<TradeData | null> {
    const staticData = tradeData[countryCode];
    if (!staticData) return null;

    const apiKey = getApiKey();
    const countryNameForApi = staticData.name;
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;
    
    const fetchPromises: Promise<{year: number, value: number, type: 'exports' | 'imports'}>[] = [];

    for (let year = startYear; year <= currentYear; year++) {
        const exportsUrl = `${BASE_URL}/v1/historical/country/${encodeURIComponent(countryNameForApi)}/indicator/Exports?c=${apiKey}&d1=${year}-01-01&d2=${year}-12-31`;
        const importsUrl = `${BASE_URL}/v1/historical/country/${encodeURIComponent(countryNameForApi)}/indicator/Imports?c=${apiKey}&d1=${year}-01-01&d2=${year}-12-31`;
        
        const fetchExport = fetch(exportsUrl, { cache: 'no-store' })
            .then(async (res) => {
                if (!res.ok) return [];
                 const text = await res.text();
                // API can return empty string for no data
                if (!text) return [];
                return JSON.parse(text);
            })
            .then(data => ({ year, value: data[0]?.Value || 0, type: 'exports' as const}))
            .catch(err => {
                console.error(`Failed to fetch exports for ${countryNameForApi} ${year}:`, err);
                return { year, value: 0, type: 'exports' as const};
            });

        const fetchImport = fetch(importsUrl, { cache: 'no-store' })
            .then(async (res) => {
                if (!res.ok) return [];
                const text = await res.text();
                // API can return empty string for no data
                if (!text) return [];
                return JSON.parse(text);
            })
            .then(data => ({ year, value: data[0]?.Value || 0, type: 'imports' as const}))
            .catch(err => {
                console.error(`Failed to fetch imports for ${countryNameForApi} ${year}:`, err);
                return { year, value: 0, type: 'imports' as const};
            });

        fetchPromises.push(fetchExport, fetchImport);
    }
    
    try {
        const results = await Promise.all(fetchPromises);
        const yearlyData: Record<number, Partial<TradeYearData>> = {};
        
        results.forEach(result => {
            if (!yearlyData[result.year]) yearlyData[result.year] = { year: result.year };
            if (result.type === 'exports') {
                yearlyData[result.year].exports = result.value / 1_000_000_000;
            } else {
                yearlyData[result.year].imports = result.value / 1_000_000_000;
            }
        });

        const finalData = Object.values(yearlyData).map(d => ({
            year: d.year!,
            exports: d.exports || 0,
            imports: d.imports || 0,
        })).filter(d => d.exports > 0 || d.imports > 0);

        if (finalData.length > 0) {
             return {
                ...staticData,
                data: finalData,
            };
        }
        
        console.warn(`Could not fetch trade data for ${staticData.name} from API, using fallback data.`);
        return staticData;

    } catch(error) {
        console.error(`Error fetching trade data for ${staticData.name}:`, error);
        console.warn(`Using fallback static data for ${staticData.name}.`);
        return staticData;
    }
}

// This function is not used in the current implementation but can be useful.
export async function getCountryDetails(countryCode: string): Promise<any> {
    const staticData = tradeData[countryCode];
    if (!staticData) return null;
    const countryNameForApi = staticData.name.toLowerCase().replace(/ /g, '-');
    const apiKey = getApiKey();
    const url = `${BASE_URL}/v1/country/${countryNameForApi}?c=${apiKey}`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error(`Error fetching details for ${staticData.name}:`, error);
        return null;
    }
}
