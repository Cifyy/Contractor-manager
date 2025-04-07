import { useState } from 'react';
import {
  Button,
  Center,
  Checkbox,
  Group,
  Modal,
  Select,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { updateContent } from '@/services/updateContent';
import { AddCustomerModalProps, CustomerTileProps } from '@/ts/Customer';
import { useAuth } from '../utils/AuthProvider';

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ close, opened, setCustomers }) => {
  const [value, onChange] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const form = useForm({
    mode: 'uncontrolled',
    // initialValues: {
    //   with_address: false,
    // },

    validate: {
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      province: (prov) =>
        (!value || prov.slice(-1)) != ' ' ? null : 'Pusty znak nie jest dozwolony',
      city: (city) => (!value || city.slice(-1) != ' ' ? null : 'Pusty znak nie jest dozwolony'),
    },
  });

  const pushForm = async (values: Record<string, any>) => {
    console.log(values);
    // console.log(JSON.stringify(values));
    try {
      const customers = await updateContent<CustomerTileProps[], CustomerTileProps[]>(
        token!,
        values,
        'addCustomer'
      );
      setCustomers(customers);
      setError('');
      close();
    } catch (err) {
      setError(String(err));
    }
    // const formData = new FormData(e.currentTarget);
    // console.log(formData);
    // console.log(formData.get('Nip'));
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        setError(null);
      }}
      title="Dodawanie klienta"
    >
      <form onSubmit={form.onSubmit((values) => pushForm(values))}>
        <TextInput
          required={true}
          label="Nazwa klienta"
          key={form.key('name')}
          {...form.getInputProps('name')}
          placeholder="Szpital"
        />
        <TextInput
          required={true}
          label="Nip"
          key={form.key('nip')}
          {...form.getInputProps('nip')}
          placeholder="Numer nip w formacie xxx-xxx-xxx"
          mb={24}
        />
        <Group gap={5} mb={12}>
          <Text>Dodaj adres</Text>
          <UnstyledButton onClick={() => onChange(!value)}>
            <Checkbox
              checked={value}
              tabIndex={-1}
              size="xs"
              mr="xl"
              styles={{ input: { cursor: 'pointer' } }}
              aria-hidden
              key={form.key('with_address')}
              {...form.getInputProps('with_address', { type: 'checkbox' })}
            />
          </UnstyledButton>
        </Group>
        {value && (
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
        <TextInput
          required={true}
          label="Typ klienta"
          placeholder="Typ klienta np. Szpital, Laboratorium"
          key={form.key('customer_type')}
          {...form.getInputProps('customer_type')}
        />
        <Select
          mb={12}
          mt="md"
          comboboxProps={{ withinPortal: true }}
          data={[
            { value: 'true', label: 'Tak' },
            { value: 'false', label: 'Nie' },
          ]}
          onChange={(e) => {
            if (e === 'true') form.setFieldValue('pneumatic_post', true);
            else if (e === 'false') form.setFieldValue('pneumatic_post', false);
            if (e === null) form.setFieldValue('pneumatic_post', null);
          }}
          defaultValue={'Brak informacji'}
          placeholder="Poczta pneumatyczna, domyślnie brak wartości"
          label="Poczta pneumatyczna"
          clearable
        />
        <TextInput
          label="Dodatkowe informacje"
          placeholder="Dodatkowe informacje (opcjonalne)"
          key={form.key('additional_info')}
          {...form.getInputProps('additional_info')}
          mb={24}
        />
        <Text mih={12} mb={20} size="sm" c={'#f03e3e'}>
          {error}
        </Text>
        <Group align="center" justify="end">
          <Button type={'submit'}>Dodaj</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;
