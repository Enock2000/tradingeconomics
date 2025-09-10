'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Country } from '@/lib/trade-data';
import { useToast } from '@/hooks/use-toast';

export function CountrySelectorForm({
  countries,
  initialCountry1,
  initialCountry2,
}: {
  countries: Country[];
  initialCountry1?: string;
  initialCountry2?: string;
}) {
  const [country1, setCountry1] = useState(initialCountry1 || '');
  const [country2, setCountry2] = useState(initialCountry2 || '');
  const router = useRouter();
  const { toast } = useToast();

  const handleCompare = () => {
    if (!country1 || !country2) {
      toast({
        title: 'Selection Incomplete',
        description: 'Please select two countries to compare.',
        variant: 'destructive',
      });
      return;
    }
    if (country1 === country2) {
      toast({
        title: 'Invalid Selection',
        description: 'Please select two different countries.',
        variant: 'destructive',
      });
      return;
    }
    router.push(`/?country1=${country1}&country2=${country2}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Countries</CardTitle>
        <CardDescription>
          Choose two countries from the lists below to compare their trade data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-6">
          <div className="md:col-span-2">
            <Select value={country1} onValueChange={setCountry1}>
              <SelectTrigger id="country1" aria-label="Select first country">
                <SelectValue placeholder="Select first country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select value={country2} onValueChange={setCountry2}>
              <SelectTrigger id="country2" aria-label="Select second country">
                <SelectValue placeholder="Select second country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCompare} className="w-full md:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
