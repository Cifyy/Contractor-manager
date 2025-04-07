import { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

import 'dayjs/locale/pl';
import '@mantine/dates/styles.css';

import { useForm } from '@mantine/form';
import { getCustomers, getProducts } from '@/services/api';
import { updateContent } from '@/services/updateContent';
import {
  AddModalProp,
  Contract,
  ContractItem,
  ContractTileProps,
  FullContract,
} from '@/ts/Contract';
import { Customer } from '@/ts/Customer';
import { Product } from '@/ts/Product';
import { useAuth } from '../utils/AuthProvider';

interface ContractItemList {
  id: number;
  item: ContractItem;
}

const AddContractModal: React.FC<AddModalProp<ContractTileProps>> = ({
  close,
  opened,
  setObjects,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { token } = useAuth();

  const timeoutRef = useRef<number>(-1);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  const [items, setItems] = useState<ContractItemList[]>([]);

  // const [contractDate, SetContractDate] = useState<[Date | null, Date | null]>([null, null]);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const loadedCustomers = await getCustomers(token!);
        setCustomers(loadedCustomers);
      } catch (err) {
        setError(String(err));
      }
    };
    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts(token!);
        setProducts(loadedProducts);
      } catch (err) {
        setError(String(err));
      }
    };
    loadCustomers();
    loadProducts();
  }, []);

  const customersContain = (customer_name: string) => {
    const found = customers.find((customer) => customer.name === customer_name);
    return found != undefined;
  };

  const form = useForm({
    mode: 'uncontrolled',

    validate: {
      customer_name: () => (customersContain(customerName) ? null : 'Podany klient nie istnieje'),
      contract_date: (date: any) => (date && date[0] && date[1] ? null : 'Podaj date'),
      //   ...Object.fromEntries(
      //     items.map((item) => [
      //       `tax${item.id}`,
      //       (value) => (value < 100 ? null : 'Podatek musi być mniejszy od 100'),
      //     ])
      //   ),
    },
  });

  const pushForm = async (values: Record<string, any>) => {
    if (items.length == 0) {
      setError('Dodaj produkty do kontraktu');
      return;
    }

    form.setFieldValue('customer_name', customerName);
    // console.log(values);

    const contractItems: ContractItem[] = items.map((item) => ({
      contract_reference_name: values.name,
      product_name: item.item.product_name,
      amount: item.item.amount,
      price: item.item.price,
      tax: item.item.tax,
    }));

    form.setFieldValue('products', items);
    // console.log(values);
    // console.log(form.getValues());

    const fullContract: FullContract = {
      nip: customers.find((customer) => customer.name === customerName)!.nip,
      customer_name: values.customer_name,
      reference_name: values.name,
      start_date: values.contract_date[0],
      end_date: values.contract_date[1],
      products: contractItems,
    };
    try {
      const newContracts = await updateContent<Contract[], ContractTileProps[]>(
        token!,
        fullContract,
        'contract'
      );
      newContracts.forEach((contract) => {
        contract.start_date = new Date(contract.start_date);
        contract.end_date = new Date(contract.end_date);
      });
      setError('');
      setObjects(newContracts);
      setItems([]);
      setCustomerName('');
      form.clearFieldError;
      form.reset();
      close();
    } catch (err) {
      setError(String(err));
    }
  };
  const addItem = () => {
    setItems((items) => [
      ...items,
      {
        id: Math.random(),
        item: {
          product_name: null,
          contract_reference_name: null,
          amount: null,
          price: null,
          tax: null,
        },
      },
    ]);
  };
  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setCustomerName(val);
    setData([]);

    if (val.trim().length === 0) {
      setLoading(false);
    } else {
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setLoading(false);

        setData([...new Set(customers.map((customer) => customer.name))]);
      }, 1000);
    }
  };

  const removeItem = (id: number) => () => {
    setItems((oldItems) => oldItems.filter((item) => item.id !== id));
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        setError(null);
      }}
      title="Dodawanie kontraktu"
    >
      <form onSubmit={form.onSubmit((values) => pushForm(values))}>
        <TextInput
          required={true}
          label="Numer kontraktu"
          key={form.key('name')}
          {...form.getInputProps('name')}
          placeholder="Numer kontraktu"
          mb={12}
        />
        <Autocomplete
          required={true}
          value={customerName}
          key={form.key('customer_name')}
          {...form.getInputProps('customer_name')}
          data={data}
          onChange={handleChange}
          rightSection={loading ? <Loader size={16} /> : null}
          label="Nazwa klienta"
          placeholder="Nazwa klienta"
        />
        <Flex justify={'space-around'} mt={12} w={300}>
          <DatePickerInput
            locale="pl"
            type="range"
            required={true}
            label="Data kontraktu"
            placeholder="Data kontraktu"
            // value={endDate}
            key={form.key('contract_date')}
            {...form.getInputProps('contract_date')}
            // onChange={setEndDate}
          />
        </Flex>
        <Flex mt={24} mb={18} justify={'space-between'}>
          <Text>Produkty:</Text>
          <Button size="compact-sm" onClick={addItem}>
            +
          </Button>
        </Flex>

        {items.map((listItem, index) => (
          <Flex direction="column" mb={24} key={listItem.id}>
            <Flex gap={5} justify={'space-between'} align={'center'}>
              <Select
                w={200}
                required={true}
                key={form.key(`model${listItem.id}`)}
                {...form.getInputProps(`model${listItem.id}`)}
                // comboboxProps={{ withinPortal: true }}
                data={products.map((product) => ({
                  value: String(product.name),
                  label: String(product.name),
                }))}
                onChange={(model) => (listItem.item.product_name = model)}
                placeholder="Wybierz produkt"
                label={`${index + 1}. Produkt`}
                // clearable
              />
              <Button mt={12} size="compact-sm" onClick={removeItem(listItem.id)}>
                -
              </Button>
            </Flex>
            <Flex mb={12} gap={5}>
              <NumberInput
                w={200}
                key={form.key(`amount${listItem.id}`)}
                {...form.getInputProps(`amount${listItem.id}`)}
                required={true}
                allowNegative={false}
                allowDecimal={false}
                value={Number(listItem.item.amount)}
                onChange={(amount) => (listItem.item.amount = Number(amount))}
                label="Ilość"
                placeholder="Ilość"
                hideControls={true}
              />
              <NumberInput
                w={200}
                key={form.key(`price${listItem.id}`)}
                {...form.getInputProps(`price${listItem.id}`)}
                required={true}
                allowNegative={false}
                value={Number(listItem.item.price)}
                onChange={(price) => (listItem.item.price = Number(price))}
                label="Cena za sztuke"
                placeholder="Cena za sztuke"
                hideControls={true}
              />
              <NumberInput
                w={200}
                key={form.key(`tax${listItem.id}`)}
                {...form.getInputProps(`tax${listItem.id}`)}
                required={true}
                allowNegative={false}
                allowDecimal={false}
                value={Number(listItem.item.tax)}
                onChange={(tax) => (listItem.item.tax = Number(tax))}
                label="Procent podatku"
                placeholder="Liczba 0-100"
                hideControls={true}
              />
            </Flex>
          </Flex>
        ))}
        <Group align="center" justify="end" mt={40}>
          <Text size="sm" c={'#f03e3e'}>
            {error}
          </Text>
          <Button type={'submit'}>Dodaj</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default AddContractModal;
