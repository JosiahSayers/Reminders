import { List, Text } from "@mantine/core";

interface Props {
  title: string;
  data: string | number;
}

export default function StatsListItem({ title, data }: Props) {
  return (
    <List.Item>
      <Text span fw={500}>
        {title}:
      </Text>{" "}
      {data}
    </List.Item>
  );
}
