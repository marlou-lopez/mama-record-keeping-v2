import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  createStyles,
  Divider,
  Drawer,
  Flex,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  ScrollArea,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId, useMediaQuery, useViewportSize } from '@mantine/hooks';
import { useState } from 'react';
import { Edit, Plus, Trash } from 'tabler-icons-react';

type CalendarListProps = {
  date?: Date | null;
};

const RecordItem = () => {
  return (
    <Paper p={'sm'} withBorder>
      <Flex justify={'space-between'} align={'center'}>
        <Text>1000</Text>
        <Badge>Pahabol</Badge>
      </Flex>
    </Paper>
  );
};
const CalendarListItem = () => {
  return (
    <div>
      <Flex mb={'xs'} align={'center'} justify={'space-between'}>
        <Text display={'flex'} fz={'xl'} fw={'bold'}>
          Peeva:
          <Text c="green" ml={'sm'}>
            2000
          </Text>
        </Text>
        <ActionIcon aria-label="Edit record button" variant="outline">
          <Edit size={16} />
        </ActionIcon>
      </Flex>
      <ScrollArea.Autosize maxHeight={300}>
        <Flex direction={'column'} gap={'xs'}>
          <RecordItem />
          <RecordItem />
        </Flex>
      </ScrollArea.Autosize>
    </div>
  );
};

type RecordItem = {
  id: string;
  amount: number | null;
  pahabol?: boolean;
};

type DropdownValue = {
  label: string;
  value: string;
};

const TestData: DropdownValue[] = [
  {
    value: '1',
    label: 'Peeva',
  },
  {
    value: '2',
    label: 'Evas',
  },
  {
    value: '3',
    label: 'Peeva-3',
  },
  {
    value: '4',
    label: 'Evas-4',
  },
];

type Entity = {
  id: string;
  recordItems: RecordItem[];
  pahabols: RecordItem[];
};

type FormValues = {
  entities: Entity[];
};

const CalendarListForm = () => {
  const { height: viewportHeight } = useViewportSize();
  const [entities, setEntities] = useState<string[]>([]);
  const form = useForm<FormValues>({
    initialValues: {
      entities: [],
    },
  });

  const isSmallViewport = viewportHeight < 700;
  const isMediumViewport = viewportHeight > 700 && viewportHeight < 1000;

  const totalAmount = form.values.entities.reduce((acc, cur) => {
    const recordItemsTotal = cur.recordItems.reduce(
      (a, c) => a + c.amount! ?? 0,
      0
    );
    const pahabolTotal = cur.pahabols.reduce((a, c) => a + c.amount! ?? 0, 0);
    return acc + (recordItemsTotal + pahabolTotal);
  }, 0);

  return (
    <Flex
      sx={{
        position: 'relative',
      }}
      direction={'column'}
      gap={'xl'}
    >
      <MultiSelect
        data-autofocus
        label="Select entity(ies):"
        data={TestData}
        placeholder="Entities to add the records in."
        size={'md'}
        value={entities}
        onChange={(values) => {
          setEntities(values);
          const existingEntities = form.values.entities;
          if (values.length > 0) {
            const newEntities: Entity[] = [
              ...existingEntities,
              {
                id: values.at(-1)!,
                recordItems: [
                  {
                    amount: null,
                    id: randomId(),
                    pahabol: false,
                  },
                ],
                pahabols: [],
              },
            ];
            form.setValues({
              entities: newEntities,
            });
          } else {
            form.setValues({
              entities: [],
            });
          }
        }}
      />
      <Divider />
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
        })}
      >
        <ScrollArea
          style={{
            height: isSmallViewport ? 350 : isMediumViewport ? 600 : 800,
          }}
        >
          <Flex direction={'column'} gap={4}>
            {TestData.filter((d) => entities.includes(d.value)).map(
              (entity, index) => {
                const recordItems = form.values.entities[index].recordItems;
                const recordItemsTotal = recordItems.reduce(
                  (a, c) => a + c.amount! ?? 0,
                  0
                );
                const pahabols = form.values.entities[index].pahabols;
                const pahabolTotal = pahabols.reduce(
                  (a, c) => a + c.amount! ?? 0,
                  0
                );

                return (
                  <Paper
                    withBorder
                    p={'md'}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    key={entity.value}
                  >
                    <Flex justify={'space-between'} p={4} gap={'xs'} mb={4}>
                      <Flex gap={'xs'}>
                        <Text>{entity.label}:</Text>
                        <Text
                          c={pahabols.length > 0 ? 'blue' : 'green'}
                          fw={pahabols.length > 0 ? 'initial' : 'bold'}
                        >
                          {pahabols.length === 0 && (
                            <Text span mr={2}>
                              ₱
                            </Text>
                          )}
                          {recordItemsTotal
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          {pahabols.length > 0 && (
                            <>
                              <Text span c={'yellow'}>
                                {' + '}
                                {pahabolTotal
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              </Text>
                              <Text span mx={2} c={'gray'}>
                                =
                              </Text>
                              <Text span fw={'bold'} c={'green'}>
                                <Text span mr={2}>
                                  ₱
                                </Text>
                                {pahabolTotal + recordItemsTotal}
                              </Text>
                            </>
                          )}
                        </Text>
                      </Flex>
                      <Switch
                        checked={
                          form.values.entities[index].pahabols?.length > 0
                        }
                        // {...form.getInputProps(`entities.${index}.mayPahabol`)}
                        onClick={() => {
                          if (
                            form.values.entities[index].pahabols?.length === 0
                          ) {
                            form.insertListItem(`entities.${index}.pahabols`, {
                              id: randomId(),
                              amount: null,
                            });
                          } else {
                            form.setFieldValue(
                              `entities.${index}.pahabols`,
                              []
                            );
                          }
                        }}
                        label="May pahabol"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      />
                    </Flex>
                    <Flex direction={'column'} gap={4}>
                      {form.values.entities[index].recordItems.map(
                        (recordItem, recordItemIndex) => {
                          return (
                            <Flex
                              key={recordItem.id}
                              px={4}
                              align={'center'}
                              gap={'xs'}
                            >
                              <NumberInput
                                // only activate autofocus for the succedding element
                                // because we need to preserve focus of the multiselect
                                autoFocus={recordItemIndex > 0}
                                placeholder="Enter amount"
                                hideControls
                                parser={(value) =>
                                  value && value.replace(/\₱\s?|(,*)/g, '')
                                }
                                formatter={(value) =>
                                  value && !Number.isNaN(parseFloat(value))
                                    ? `₱ ${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                      )
                                    : ''
                                }
                                {...form.getInputProps(
                                  `entities.${index}.recordItems.${recordItemIndex}.amount`
                                )}
                                sx={{
                                  flexGrow: 1,
                                }}
                              />
                              <Flex gap={'md'} align={'center'}>
                                <ActionIcon
                                  c={'red'}
                                  aria-label="Delete record"
                                  onClick={() => {
                                    if (
                                      form.values.entities[index].recordItems
                                        .length === 1
                                    ) {
                                      const newEntities = entities.filter(
                                        (e) => {
                                          return (
                                            e !== form.values.entities[index].id
                                          );
                                        }
                                      );
                                      setEntities(newEntities);
                                      form.setValues({
                                        entities: form.values.entities.filter(
                                          (e) =>
                                            e.id !==
                                            form.values.entities[index].id
                                        ),
                                      });
                                    } else {
                                      form.removeListItem(
                                        `entities.${index}.recordItems`,
                                        recordItemIndex
                                      );
                                    }
                                  }}
                                >
                                  <Trash size={16} />
                                </ActionIcon>
                              </Flex>
                            </Flex>
                          );
                        }
                      )}
                    </Flex>
                    <Center>
                      <Button
                        mt={8}
                        size="xs"
                        variant="subtle"
                        onClick={() => {
                          form.insertListItem(`entities.${index}.recordItems`, {
                            amount: null,
                            id: randomId(),
                            pahabol: false,
                          });
                        }}
                      >
                        <Plus size={12} />
                        <Text span ml={2}>
                          Add More
                        </Text>
                      </Button>
                    </Center>
                    {form.values.entities[index].pahabols.length > 0 && (
                      <>
                        <Flex
                          direction={'column'}
                          sx={(theme) => ({
                            borderLeft: '1px solid',
                            borderLeftColor: theme.colors.yellow,
                            marginLeft: 8,
                            paddingLeft: 16,
                            paddingRight: 8,
                          })}
                        >
                          <Text>
                            {entity.label} (Pahabol):{' '}
                            <Text span c={'yellow'}>
                              {' ₱ '}
                              {form.values.entities[index].pahabols.reduce(
                                (a, c) => a + c.amount! ?? 0,
                                0
                              )}
                            </Text>
                          </Text>
                          <Flex direction={'column'} gap={4}>
                            {form.values.entities[index].pahabols.map(
                              (pahabol, pahabolIndex) => (
                                <Flex align={'center'} key={pahabol.id}>
                                  <NumberInput
                                    autoFocus
                                    hideControls
                                    placeholder="Enter pahabol amount"
                                    {...form.getInputProps(
                                      `entities.${index}.pahabols.${pahabolIndex}.amount`
                                    )}
                                    parser={(value) =>
                                      value && value.replace(/\₱\s?|(,*)/g, '')
                                    }
                                    formatter={(value) =>
                                      value && !Number.isNaN(parseFloat(value))
                                        ? `₱ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ','
                                          )
                                        : ''
                                    }
                                    sx={{
                                      flexGrow: 1,
                                    }}
                                  />
                                  <ActionIcon
                                    onClick={() => {
                                      form.removeListItem(
                                        `entities.${index}.pahabols`,
                                        pahabolIndex
                                      );
                                    }}
                                    c={'red'}
                                  >
                                    <Trash size={16} />
                                  </ActionIcon>
                                </Flex>
                              )
                            )}
                          </Flex>
                        </Flex>
                        <Center mt={4}>
                          <Button
                            size={'xs'}
                            onClick={() => {
                              form.insertListItem(
                                `entities.${index}.pahabols`,
                                {
                                  amount: null,
                                  id: randomId(),
                                }
                              );
                            }}
                            variant={'subtle'}
                          >
                            <Plus size={12} />
                            <Text span ml={2}>
                              Add More Pahabol
                            </Text>
                          </Button>
                        </Center>
                      </>
                    )}
                  </Paper>
                );
              }
            )}
          </Flex>
        </ScrollArea>
        {form.values.entities.length > 0 && (
          <Flex justify={'space-between'} align={'center'} mt={'lg'}>
            <Text size={24}>
              Total:
              <Text span c={'green'} fw={'bold'}>
                {' ₱ '}
                {totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            </Text>
            <Button type={'submit'}>Submit</Button>
          </Flex>
        )}
      </form>
    </Flex>
  );
};

const CalendarList: React.FC<CalendarListProps> = ({ date }) => {
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const isWrapped = useMediaQuery('(max-width: 1024px)');
  return (
    <>
      <Flex direction={'column'} gap={'xl'}>
        <Flex justify={'end'} align={'center'}>
          <Button onClick={() => setOpenFormDrawer(true)}>Add Record</Button>
        </Flex>
        <ScrollArea
          offsetScrollbars
          style={{
            height: !isWrapped ? 700 : 200,
          }}
        >
          <Flex direction={'column'} gap={'lg'}>
            {new Array(5).fill(undefined).map((x) => (
              <CalendarListItem />
            ))}
          </Flex>
        </ScrollArea>
      </Flex>
      <Drawer
        title="Add Record"
        padding={'xl'}
        size={'xl'}
        position="right"
        opened={openFormDrawer}
        onClose={() => setOpenFormDrawer(false)}
      >
        <CalendarListForm />
      </Drawer>
    </>
  );
};

export default CalendarList;
