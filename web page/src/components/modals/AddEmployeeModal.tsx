import { useState } from 'react';
import { Button, Group, Modal, Text, TextInput } from '@mantine/core';

import 'dayjs/locale/pl';
import '@mantine/dates/styles.css';

import { useForm } from '@mantine/form';
import { updateContent } from '@/services/updateContent';
import { AddEmployeeModalProps, CustomerInfo } from '@/ts/Customer';
import { useAuth } from '../utils/AuthProvider';

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ nip, close, opened, setCustomer }) => {
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  //   const [customerName, setCustomerName] = useState('');

  // const [contractDate, SetContractDate] = useState<[Date | null, Date | null]>([null, null]);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const form = useForm({
    mode: 'uncontrolled',

    validate: {
      //   customer_name: () => (customersContain(customerName) ? null : 'Podany klient nie istnieje'),
      //   contract_date: (date: any) => (date && date[0] && date[1] ? null : 'Podaj date'),
      //   ...Object.fromEntries(
      //     items.map((item) => [
      //       `tax${item.id}`,
      //       (value) => (value < 100 ? null : 'Podatek musi być mniejszy od 100'),
      //     ])
      //   ),
    },
  });

  const pushForm = async () => {
    form.setFieldValue('nip', nip);
    // console.log(form.getValues());
    try {
      const newCustomer = await updateContent<CustomerInfo, CustomerInfo>(
        token!,
        form.getValues(),
        'employee'
      );
      newCustomer.contracts?.forEach((e: any) => {
        e.start_date = new Date(e.start_date);
        e.end_date = new Date(e.end_date);
      });
      setError('');
      setCustomer(newCustomer);
      form.clearFieldError;
      form.reset();
      close();
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        setError(null);
      }}
      title="Dodawanie pracownika"
    >
      <form onSubmit={form.onSubmit((values) => pushForm())}>
        <Group>
          <TextInput
            required={true}
            label="Imie"
            key={form.key('name')}
            {...form.getInputProps('name')}
            placeholder="Imie"
            mb={12}
          />
          <TextInput
            required={true}
            label="Nazwisko"
            key={form.key('surname')}
            {...form.getInputProps('surname')}
            placeholder="Nazwisko"
            mb={12}
          />
        </Group>

        <TextInput
          label="Rola"
          key={form.key('role')}
          {...form.getInputProps('role')}
          placeholder="Rola (opcjonalne)"
          mb={12}
        />
        <TextInput
          label="Numer telefonu"
          key={form.key('phone')}
          {...form.getInputProps('phone')}
          placeholder="Numer telefonu (opcjonalne)"
          mb={12}
        />
        <TextInput
          label="Email"
          key={form.key('email')}
          {...form.getInputProps('email')}
          placeholder="Email (opcjonalne)"
          mb={12}
        />
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

export default AddEmployeeModal;
