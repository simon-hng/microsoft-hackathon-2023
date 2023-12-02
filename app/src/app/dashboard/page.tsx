"use client";

import { Card, Text, Metric, DonutChart, Title } from "@tremor/react";

const DonutChartComp = () => {
  const cities = [
    {
      name: "New York",
      sales: 9800,
    },
    {
      name: "London",
      sales: 4567,
    },
    {
      name: "Hong Kong",
      sales: 3908,
    },
    {
      name: "San Francisco",
      sales: 2400,
    },
    {
      name: "Singapore",
      sales: 1908,
    },
    {
      name: "Zurich",
      sales: 1398,
    },
  ];

  const valueFormatter = (number: number) =>
    `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

  return (
    <>
      <Card className="max-w-lg">
        <Title>Sales</Title>
        <DonutChart
          className="mt-6"
          data={cities}
          category="sales"
          index="name"
          valueFormatter={valueFormatter}
          colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
        />
      </Card>
    </>
  );
};

export default function Dashboard() {
  return (
    <>
      <main className="bg-gray-100 dark:bg-gray-900">
        <div className="min-h-screen flex flex-col p-4 py-28">
          <h1>Dashboard</h1>

          <DonutChartComp />
          <Card className="max-w-xs mx-auto">
            <Text>Sales</Text>
            <Metric>$ 34,743</Metric>
          </Card>
        </div>
      </main>
    </>
  );
}
