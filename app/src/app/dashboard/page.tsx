import {
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import BarChartStacked from "./_components/bar-chart-stacked";
import KpiCards from "./_components/kpi-card";
import { EmailLog } from "@/lib/types/logs";
import { kv } from "@vercel/kv";
import { EmailsList } from "./_components/emails-list";

export default async function Dashboard() {
  const data: EmailLog[] = await kv.zrange("email-logs", 0, 0);

  return (
    <main className="mx-8">
      <Title>Dashboard</Title>
      <Text>Email Monitoring</Text>

      <TabGroup className="mt-10">
        <TabList>
          <Tab>Metrics</Tab>
          <Tab>Emails</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <KpiCards logs={data}/>
            <div className="mt-6">
              <BarChartStacked />
            </div>
          </TabPanel>
          <TabPanel>
            <EmailsList logs={data} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
