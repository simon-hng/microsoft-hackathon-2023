"use client";

import {
  Card,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import BarChartStacked from "./_components/bar-chart-stacked";
import KpiCard from "./_components/kpi-card";

export default function Dashboard() {
  return (
    <main className="mx-8">
      <Title>Dashboard</Title>
      <Text>Email Monitoring</Text>
      <TabGroup className="mt-6">
        <TabList>
          <Tab>Metrics</Tab>
          <Tab>Emails</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <KpiCard />
            <div className="mt-6">
              <BarChartStacked />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <div className="h-96" />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
