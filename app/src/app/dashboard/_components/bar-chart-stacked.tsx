import { Card, Title, BarChart, Text } from "@tremor/react";

const data = [
  {
    Month: "Jan 21",
    "Manual answer required": 29,
    "Automatically answered": 108,
  },
  {
    Month: "Feb 21",
    "Manual answer required": 2,
    "Automatically answered": 120,
  },
  {
    Month: "Jan 22",
    "Manual answer required": 14,
    "Automatically answered": 200,
  },
  {
    Month: "Feb 22",
    "Manual answer required": 15,
    "Automatically answered": 192,
  },
];

const valueFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export default function BarChartStacked() {
  return (
    <Card>
      <Title>Request Monitoring</Title>
      <Text>Requests by status</Text>
      <BarChart
        className="mt-4 h-80"
        data={data}
        index="Month"
        categories={["Automatically answered", "Manual answer required"]}
        colors={["emerald", "red"]}
        valueFormatter={valueFormatter}
        stack={true}
      />
    </Card>
  );
}
