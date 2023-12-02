import {
  Card,
  Metric,
  Text,
  Flex,
  BadgeDelta,
  DeltaType,
  Grid,
  type TextProps,
} from "@tremor/react";

const colors = {
  increase: "emerald",
  moderateIncrease: "emerald",
  unchanged: "orange",
  moderateDecrease: "rose",
  decrease: "rose",
};

const categories = [
  {
    title: "Overall requests",
    metric: "2,699",
    metricPrev: "1.259",
    delta: "134.3%",
    deltaType: "increase",
  },
  {
    title: "Automated responses",
    metric: "85.1%",
    metricPrev: "81.2",
    delta: "10.9%",
    deltaType: "moderateIncrease",
  },
  {
    title: "Unique Students",
    metric: "1,859",
    metricPrev: "1,912",
    delta: "25.3%",
    deltaType: "moderateDecrease",
  },
];

export default function KpiCards() {
  return (
    <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
      {categories.map((item) => (
        <Card key={item.title}>
          <Text>{item.title}</Text>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="truncate space-x-3"
          >
            <Metric>{item.metric}</Metric>
            <Text className="truncate">from {item.metricPrev}</Text>
          </Flex>
          <Flex justifyContent="start" className="space-x-2 mt-4">
            <BadgeDelta deltaType={item.deltaType} />
            <Flex justifyContent="start" className="space-x-1 truncate">
              <Text
                color={
                  colors[item.deltaType as DeltaType] as TextProps["color"]
                }
              >
                {item.delta}
              </Text>
              <Text className="truncate">to previous month</Text>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
}
