import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { Center, Flex, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core';

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

const data = [
  { label: 'Page views', stats: '456,578', progress: 65, color: 'teal', icon: 'up' },
] as const;

export function ProgressCircle() {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      //   <Paper withBorder radius="md" p="xs" key={stat.label}>
      //   <Group>
      <RingProgress
        size={80}
        roundCaps
        thickness={8}
        sections={[{ value: stat.progress, color: stat.color }]}
        label={
          <Center>
            <Icon size={20} stroke={1.5} />
          </Center>
        }
      />

      /* <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {stat.label}
          </Text>
          <Text fw={700} size="xl">
            {stat.stats}
          </Text>
        </div>
      </Group> */
      //   </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}
