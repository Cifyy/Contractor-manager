import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  Checkbox,
  Flex,
  Group,
  Loader,
  Modal,
  Select,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getCustomerContracts, getCustomers } from '@/services/api';
import { AddModalProp, Contract, FullContract } from '@/ts/Contract';
import { Customer } from '@/ts/Customer';
import {
  ContractItemName,
  CustomerContractList,
  CustomerContractsWrapper,
  OrderItem,
  OrderTileProps,
} from '@/ts/Order';
import { Product } from '@/ts/Product';
import { useAuth } from '../utils/AuthProvider';

const AddOrderModal: React.FC<AddModalProp<OrderTileProps>> = ({ close, opened, setObjects }) => {
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contracts, setContracts] = useState<CustomerContractList[]>([]);
  const [isInContract, setIsInContract] = useState(false);
  const { token } = useAuth();

  const [selectedContractItems, setSelecteContractItems] = useState<ContractItemName[]>([]);

  const [selectedCustomerContract, SetSelectedCustomerContract] = useState<
    CustomerContractsWrapper[] | undefined
  >(undefined);

  const timeoutRef = useRef<number>(-1);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  const [items, setItems] = useState<OrderItem[]>([]);

  // const customersContain = (customer_name: string) => {
  //   const found = customers.find((customer) => customer.name === customer_name)!;
  //   SetSelectedCustomerContract({ value: found.name, label: found.name });
  // };

  // const customerContracts = (contracts: Contra)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const loadedCustomers = await getCustomers(token!);
        setCustomers(loadedCustomers);
      } catch (err) {
        setError(String(err));
      }
    };
    const loadContracts = async () => {
      try {
        const loadedContracts = await getCustomerContracts(token!);
        // let tempArr: SelectCustomerContractWrapper[] = [];
        // loadedContracts.forEach((customerEntry) => {
        //   tempArr.push({
        //     value: customerEntry.name,
        //     label: customerEntry.name,
        //     contracts: customerEntry,
        //   });
        // });
        setContracts(loadedContracts);
      } catch (err) {
        setError(String(err));
      }
    };

    loadCustomers();
    loadContracts();
  }, []);

  const form = useForm({
    mode: 'uncontrolled',

    validate: {
      // customer_name: () => (customersContain(customerName) ? null : 'Podany klient nie istnieje'),
      // contract_date: (date: any) => (date && date[0] && date[1] ? null : 'Podaj date'),
      //   ...Object.fromEntries(
      //     items.map((item) => [
      //       `tax${item.id}`,
      //       (value) => (value < 100 ? null : 'Podatek musi być mniejszy od 100'),
      //     ])
      //   ),
    },
  });

  const pushForm = async (values: Record<string, any>) => {
    console.log(values);
    // console.log(JSON.stringify(values));
    try {
      // const customers = await updateContent<CustomerTileProps, CustomerTileProps>(
      //   token!,
      //   values,
      //   'addCustomer'
      // );
      // setCustomers(customers);
      // setError('');
      // close();
    } catch (err) {
      setError(String(err));
    }
    // const formData = new FormData(e.currentTarget);
    // console.log(formData);
    // console.log(formData.get('Nip'));
  };
  // const setCustomerContracts = (nip: string) => {
  const setCustomerContracts = (name: string) => {
    // const contractArr = contracts.find((e) => e.nip === nip)!;
    const contractArr = contracts.find((e) => name === e.name)!;
    if (contractArr === undefined) {
      form.setFieldError('selectedContract', 'Brak kontraktów dla klienta');
      setSelecteContractItems([]);
      SetSelectedCustomerContract(undefined);
      return;
    }
    form.clearFieldError('selectedContract');
    let tempArr: CustomerContractsWrapper[] = [];
    contractArr.contracts.forEach((customerEntry) => {
      tempArr.push({
        value: customerEntry.reference_name,
        label: customerEntry.reference_name,
        products: customerEntry.products,
      });
    });

    SetSelectedCustomerContract(tempArr);
  };

  const handleCustomerChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setCustomerName(val);
    setCustomerContracts(val);
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

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        setError(null);
      }}
      title="Dodawanie zamówienia"
    >
      <form onSubmit={form.onSubmit((values) => pushForm(values))}>
        <Autocomplete
          required={true}
          value={customerName}
          key={form.key('customer_name')}
          {...form.getInputProps('customer_name')}
          data={data}
          onChange={handleCustomerChange}
          rightSection={loading ? <Loader size={16} /> : null}
          label="Nazwa klienta"
          placeholder="Nazwa klienta"
        />
        <Group gap={5} mt={12}>
          <Text>Zamówienie z kontraktu</Text>
          <UnstyledButton onClick={() => setIsInContract(!isInContract)}>
            <Checkbox
              checked={isInContract}
              tabIndex={-1}
              size="sm"
              mr="xl"
              styles={{ input: { cursor: 'pointer' } }}
              aria-hidden
              key={form.key('is_in_contract')}
              {...form.getInputProps('is_in_contract', { type: 'checkbox' })}
            />
          </UnstyledButton>
        </Group>
        {isInContract ? (
          <Flex>
            <Select
              w={200}
              mt="md"
              mb={24}
              required={true}
              data={selectedCustomerContract}
              // comboboxProps={{ withinPortal: true }}
              // data={contracts
              //   .filter((contract) => contract.name === customerName)
              //   .map((contract) => contract.contracts)
              //   .map((contract) => ({
              //     value: String(contract.reference_name),
              //     label: String(contract.reference_name),
              //   }))}
              key={form.key(`selectedContract`)}
              {...form.getInputProps(`selectedContract`)}
              onChange={(value) => {
                if (!value) {
                  setSelecteContractItems([]);
                  return;
                }
                const contract = selectedCustomerContract?.find(
                  (contract) => contract.value === value
                );
                setSelecteContractItems(contract!.products);
              }}
              placeholder="Wybierz kontrakt"
              label="Kontrakt"
            />
            <Flex direction={'column'} ml={6}>
              <Text fw={500} mt={18} size="sm" ta="center">
                Zawartość kontraktu
              </Text>
              {selectedContractItems?.map((item, index) => (
                <Group>
                  <Text fw={500} size="sm">
                    {item.name + ': '}
                  </Text>
                  <Text size="sm">{item.amount + 'szt.'}</Text>
                </Group>
              ))}
            </Flex>
          </Flex>
        ) : (
          <>
            <Group>
              <TextInput
                required={true}
                label="Kraj"
                placeholder="Kraj"
                key={form.key('country')}
                {...form.getInputProps('country')}
              />
              <TextInput
                required={true}
                label="Województwo"
                placeholder="Województwo"
                key={form.key('province')}
                {...form.getInputProps('province')}
              />
            </Group>
            <Group>
              <TextInput
                required={true}
                label="Miasto"
                placeholder="Miasto"
                key={form.key('city')}
                {...form.getInputProps('city')}
              />
              <TextInput
                required={true}
                label="Kod pocztowy"
                placeholder="Kod pocztowy"
                key={form.key('post_code')}
                {...form.getInputProps('post_code')}
              />
            </Group>
            <TextInput
              required={true}
              label="Ulica"
              placeholder="Ulica"
              key={form.key('street')}
              {...form.getInputProps('street')}
            />
            <TextInput
              label="Ulica 2"
              mb={24}
              placeholder="Ulica 2 (opcjonalne)"
              key={form.key('street2')}
              {...form.getInputProps('street2')}
            />{' '}
          </>
        )}

        {/* <Autocomplete
          required={true}
          value={contract_name}
          key={form.key('contract_name')}
          {...form.getInputProps('contract_name')}
          data={data}
          onChange={handleChange}
          rightSection={loading ? <Loader size={16} /> : null}
          label="Nazwa kontraktu"
          placeholder="Nazwa kontraktu"
        />
        <Flex justify={'space-around'} mt={12}>
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
        ))} */}
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

export default AddOrderModal;
