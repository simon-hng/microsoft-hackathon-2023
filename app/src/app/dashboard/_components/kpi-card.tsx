import { EmailLog } from "@/lib/types/logs";
import {
  Card,
  Metric,
  Text,
  Flex,
  Grid,
} from "@tremor/react";

interface KpiCardsProps {
  logs: EmailLog[];
}
export default function KpiCards({logs}: KpiCardsProps) {
  const categories = [
    {
      title: "Overall requests",
      metric: logs.length,
    },
    {
      title: "Automated responses",
      metric: "85.1%",
    },
    {
      title: "Unique Students",
      metric: logs.length,
    },
  ];

  return (
    <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
      {categories.map((item) => (
        <Card key={item.title}>
          <Text>{item.title}</Text>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-3 truncate"
          >
            <Metric>{item.metric}</Metric>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}
