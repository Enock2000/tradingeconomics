export interface Country {
  name: string;
  code: string;
}

export interface TradeYearData {
  year: number;
  exports: number; // in billions USD
  imports: number; // in billions USD
}

export interface TradeData {
  name: string;
  code: string;
  data: TradeYearData[];
  commodities: {
    exports: string[];
    imports: string[];
  };
}

// Keeping this as a fallback if API fails
export const countries: Country[] = [
  { name: 'United States', code: 'USA' },
  { name: 'China', code: 'CHN' },
  { name: 'Japan', code: 'JPN' },
  { name: 'Germany', code: 'DEU' },
  { name: 'India', code: 'IND' },
  { name: 'United Kingdom', code: 'GBR' },
  { name: 'Brazil', code: 'BRA' },
  { name: 'Canada', code: 'CAN' },
];

export const tradeData: Record<string, TradeData> = {
  USA: {
    name: 'United States',
    code: 'USA',
    data: [
      { year: 2020, exports: 2124.5, imports: 2810.9 },
      { year: 2021, exports: 2530.2, imports: 3388.7 },
      { year: 2022, exports: 3009.1, imports: 3957.5 },
      { year: 2023, exports: 3053.5, imports: 3829.1 },
    ],
    commodities: {
      exports: ['Refined Petroleum', 'Crude Petroleum', 'Cars', 'Integrated Circuits'],
      imports: ['Cars', 'Crude Petroleum', 'Computers', 'Pharmaceuticals'],
    },
  },
  CHN: {
    name: 'China',
    code: 'CHN',
    data: [
      { year: 2020, exports: 2590.6, imports: 2055.6 },
      { year: 2021, exports: 3364.0, imports: 2687.5 },
      { year: 2022, exports: 3593.6, imports: 2716.0 },
      { year: 2023, exports: 3380.0, imports: 2556.8 },
    ],
    commodities: {
      exports: ['Broadcasting Equipment', 'Computers', 'Integrated Circuits', 'Office Machine Parts'],
      imports: ['Integrated Circuits', 'Crude Petroleum', 'Iron Ore', 'Soybeans'],
    },
  },
  JPN: {
    name: 'Japan',
    code: 'JPN',
    data: [
      { year: 2020, exports: 641.4, imports: 635.5 },
      { year: 2021, exports: 757.2, imports: 772.8 },
      { year: 2022, exports: 746.9, imports: 897.4 },
      { year: 2023, exports: 717.4, imports: 777.9 },
    ],
    commodities: {
      exports: ['Cars', 'Integrated Circuits', 'Machinery', 'Car Parts'],
      imports: ['Crude Petroleum', 'Petroleum Gas', 'Coal Briquettes', 'Broadcasting Equipment'],
    },
  },
  DEU: {
    name: 'Germany',
    code: 'DEU',
    data: [
      { year: 2020, exports: 1380.2, imports: 1171.9 },
      { year: 2021, exports: 1603.6, imports: 1367.4 },
      { year: 2022, exports: 1655.8, imports: 1538.4 },
      { year: 2023, exports: 1688.4, imports: 1477.7 },
    ],
    commodities: {
      exports: ['Cars', 'Machinery', 'Pharmaceuticals', 'Car Parts'],
      imports: ['Cars', 'Car Parts', 'Petroleum Gas', 'Pharmaceuticals'],
    },
  },
  IND: {
    name: 'India',
    code: 'IND',
    data: [
        { year: 2020, exports: 275.5, imports: 368.0 },
        { year: 2021, exports: 422.0, imports: 613.1 },
        { year: 2022, exports: 453.3, imports: 720.4 },
        { year: 2023, exports: 432.0, imports: 672.7 },
    ],
    commodities: {
        exports: ['Refined Petroleum', 'Diamonds', 'Pharmaceuticals', 'Rice'],
        imports: ['Crude Petroleum', 'Coal Briquettes', 'Petroleum Gas', 'Gold'],
    },
  },
  GBR: {
    name: 'United Kingdom',
    code: 'GBR',
    data: [
        { year: 2020, exports: 388.9, imports: 554.4 },
        { year: 2021, exports: 468.7, imports: 636.5 },
        { year: 2022, exports: 531.7, imports: 785.1 },
        { year: 2023, exports: 538.2, imports: 739.0 },
    ],
    commodities: {
        exports: ['Cars', 'Gold', 'Gas Turbines', 'Crude Petroleum'],
        imports: ['Cars', 'Gold', 'Crude Petroleum', 'Petroleum Gas'],
    },
  },
    BRA: {
    name: 'Brazil',
    code: 'BRA',
    data: [
        { year: 2020, exports: 209.2, imports: 166.1 },
        { year: 2021, exports: 280.8, imports: 234.7 },
        { year: 2022, exports: 334.5, imports: 292.3 },
        { year: 2023, exports: 339.7, imports: 240.8 },
    ],
    commodities: {
        exports: ['Soybeans', 'Iron Ore', 'Crude Petroleum', 'Corn'],
        imports: ['Refined Petroleum', 'Fertilizers', 'Crude Petroleum', 'Car Parts'],
    },
  },
  CAN: {
    name: 'Canada',
    code: 'CAN',
    data: [
        { year: 2020, exports: 407.2, imports: 427.6 },
        { year: 2021, exports: 504.6, imports: 512.3 },
        { year: 2022, exports: 596.8, imports: 588.6 },
        { year: 2023, exports: 567.1, imports: 559.5 },
    ],
    commodities: {
        exports: ['Crude Petroleum', 'Cars', 'Gold', 'Petroleum Gas'],
        imports: ['Cars', 'Car Parts', 'Delivery Trucks', 'Crude Petroleum'],
    },
  },
};
