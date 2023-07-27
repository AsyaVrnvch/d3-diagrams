export enum ChartType {
  Linear = "linear",
  Grouped = "grouped",
  Stacked = "stacked",
}

export interface DiagramData {
  id: number;
  name: string;
  year: number;
  likes: number;
}

export const networkColor: { [key: string]: string } = {
  Instagram: "red",
  Facebook: "blue",
  Patreon: "green",
};

export const networkOrder: { [key: string]: number } = {
  Instagram: -23,
  Facebook: -7,
  Patreon: 9,
};

export const data: DiagramData[] = [
  { id: 1, name: "Instagram", year: 2018, likes: 1500 },
  { id: 2, name: "Instagram", year: 2019, likes: 1100 },
  { id: 3, name: "Instagram", year: 2020, likes: 1550 },
  { id: 4, name: "Instagram", year: 2021, likes: 1300 },
  { id: 5, name: "Instagram", year: 2022, likes: 1100 },
  { id: 6, name: "Facebook", year: 2018, likes: 1250 },
  { id: 7, name: "Facebook", year: 2019, likes: 1400 },
  { id: 8, name: "Facebook", year: 2020, likes: 1200 },
  { id: 9, name: "Facebook", year: 2021, likes: 1450 },
  { id: 10, name: "Facebook", year: 2022, likes: 1600 },
  { id: 11, name: "Patreon", year: 2018, likes: 1400 },
  { id: 12, name: "Patreon", year: 2019, likes: 1300 },
  { id: 13, name: "Patreon", year: 2020, likes: 1150 },
  { id: 14, name: "Patreon", year: 2021, likes: 1250 },
  { id: 15, name: "Patreon", year: 2022, likes: 1600 },
];
