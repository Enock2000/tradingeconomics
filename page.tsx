import { Suspense } from 'react';
import { Header } from '@/components/header';
import { CountrySelectorForm } from '@/components/country-selector-form';
import { ComparisonDashboard } from '@/components/comparison-dashboard';
import { getComparisonData } from '@/lib/actions';
import { getCountries } from '@/lib/trading-economics';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { WelcomeMessage } from '@/components/welcome-message';

async function ComparisonResults({
  country1,
  country2,
}: {
  country1: string;
  country2: string;
}) {
  const data = await getComparisonData(country1, country2);

  if (!data) {
    return (
      <div className="flex items-center justify-center rounded-lg border bg-card p-8 text-center text-card-foreground shadow-sm">
        <p>Could not load comparison data for the selected countries. Please try again.</p>
      </div>
    );
  }

  return <ComparisonDashboard {...data} />;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { country1?: string; country2?: string };
}) {
  const country1 = searchParams?.country1;
  const country2 = searchParams?.country2;

  const countries = await getCountries();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 lg:p-12">
        <CountrySelectorForm
          countries={countries}
          initialCountry1={country1}
          initialCountry2={country2}
        />
        <div className="flex-1">
          {country1 && country2 ? (
            <Suspense fallback={<DashboardSkeleton />}>
              <ComparisonResults country1={country1} country2={country2} />
            </Suspense>
          ) : (
            <WelcomeMessage />
          )}
        </div>
      </main>
    </div>
  );
}
