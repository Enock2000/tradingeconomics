import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TradeData } from '@/lib/trade-data';

interface MergedDataRow {
  year: number;
  country1Exports: number;
  country1Imports: number;
  country1Balance: number;
  country2Exports: number;
  country2Imports: number;
  country2Balance: number;
}

export function TradeDataTable({
  country1Data,
  country2Data,
}: {
  country1Data: TradeData;
  country2Data: TradeData;
}) {
  const mergedData: MergedDataRow[] = country1Data.data.map((d1) => {
    const d2 = country2Data.data.find((d) => d.year === d1.year)!;
    return {
      year: d1.year,
      country1Exports: d1.exports,
      country1Imports: d1.imports,
      country1Balance: d1.exports - d1.imports,
      country2Exports: d2.exports,
      country2Imports: d2.imports,
      country2Balance: d2.exports - d2.imports,
    };
  });

  const formatValue = (value: number) => `$${value.toFixed(2)}B`;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="align-bottom">Year</TableHead>
            <TableHead colSpan={3} className="text-center border-b">{country1Data.name}</TableHead>
            <TableHead colSpan={3} className="text-center border-b">{country2Data.name}</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-right">Exports</TableHead>
            <TableHead className="text-right">Imports</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Exports</TableHead>
            <TableHead className="text-right">Imports</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mergedData.map((row) => (
            <TableRow key={row.year}>
              <TableCell className="font-medium">{row.year}</TableCell>
              <TableCell className="text-right">{formatValue(row.country1Exports)}</TableCell>
              <TableCell className="text-right">{formatValue(row.country1Imports)}</TableCell>
              <TableCell className={`text-right font-medium ${row.country1Balance > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatValue(row.country1Balance)}</TableCell>
              <TableCell className="text-right">{formatValue(row.country2Exports)}</TableCell>
              <TableCell className="text-right">{formatValue(row.country2Imports)}</TableCell>
              <TableCell className={`text-right font-medium ${row.country2Balance > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatValue(row.country2Balance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
