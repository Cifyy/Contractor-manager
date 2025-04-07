import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import classes from '../components/css/Customers.module.scss';
import header from '../components/css/Header.module.scss';
import { IconSearch } from '@tabler/icons-react';
import {
  Link,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Select, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import CustomerTile from '@/components/CustomerTile';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import { useAuth } from '../components/utils/AuthProvider';
import { getCustomersTiles } from '../services/api';
import { Customer, CustomerTileProps } from '../ts/Customer';

// import '@mantine/core/styles.css';
const Customers: FC = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || localStorage.getItem('search') || ''
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(
    searchParams.get('city') || localStorage.getItem('selected_city') || ''
  );
  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    searchParams.get('province') || localStorage.getItem('selected_province') || ''
  );
  const [postFilter, setPostFilter] = useState<string | null>(
    searchParams.get('post') || localStorage.getItem('pneumatic_post') || ''
  );

  const [opened, { open, close }] = useDisclosure(false);

  const [customers, setCustomers] = useState<CustomerTileProps[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  //   const handleSearch = (e: SubmitEvent) => {
  useLayoutEffect(
    () => () => {
      sessionStorage.setItem('customerScrollPosition', window.scrollY.toString());
    },
    []
  );
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('customerScrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, [customers]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedProvince) params.set('province', selectedProvince);
    if (postFilter) params.set('post', postFilter);
    setSearchParams(params);
  }, [searchQuery, selectedCity, selectedProvince, postFilter]);

  const handleSearch = (e: any) => {
    const value = e.target.value.toLowerCase();
    localStorage.setItem('search', value ?? '');
    e.preventDefault();
    setSearchQuery(value);
    // setSearchParams((prev) => {
    //   const updated = new URLSearchParams(prev);
    //   if (value) updated.set('search', value);
    //   else updated.delete('search');
    //   return updated;
    // });
  };

  function compareName(a: CustomerTileProps, b: CustomerTileProps) {
    return a.name.localeCompare(b.name);
  }
  const customerFilter = (customer: CustomerTileProps) => {
    if (postFilter === 'Tak') {
      if (customer.pneumatic_post === null || customer.pneumatic_post === false) return false;
      // console.log(customer.pneumatic_post);
    } else if (postFilter === 'Nie') {
      if (customer.pneumatic_post === null || customer.pneumatic_post === true) return false;
    }
    const superString =
      customer.city +
      customer.province +
      ' ' +
      customer.customerType +
      ' ' +
      customer.nip +
      ' ' +
      customer.name;
    if (selectedCity && customer.city != selectedCity) return false;
    if (selectedProvince && customer.province != selectedProvince) return false;
    return superString.toLowerCase().includes(searchQuery.toLowerCase());
  };

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        if (!token) {
          throw 'No token';
        }
        // const loadedCustomers = await getCustomers(token);
        const loadedCustomers = await getCustomersTiles(token);
        // console.log(loadedCustomers);
        setError('');
        loadedCustomers.sort(compareName);
        setCustomers(loadedCustomers);
      } catch (err) {
        if (String(err).includes('token')) {
          navigate('/login', { replace: true });
        }
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
    console.log('Loaded customers!');
  }, []);

  return (
    <div className={header.main}>
      <div className={header.header}>
        <span className={header.title}>Klienci</span>
        <div className={header.addButton} onClick={open}>
          <div className={header.horizontalPlus}></div>
          <div className={header.verticalPlus}></div>
        </div>
      </div>
      <AddCustomerModal
        opened={opened}
        close={close}
        setCustomers={setCustomers}
      ></AddCustomerModal>

      <form onSubmit={handleSearch} className={header.searchForm}>
        <Select
          className={classes.selector}
          radius="xl"
          comboboxProps={{ withinPortal: true }}
          data={['Tak', 'Nie']}
          value={postFilter}
          onChange={(e) => {
            setPostFilter(e);
            localStorage.setItem('pneumatic_post', e ?? '');
          }}
          placeholder="Poczta Pneumatyczna"
        />
        <Select
          miw={100}
          className={classes.selector}
          radius="xl"
          comboboxProps={{ withinPortal: true }}
          // data={cities}
          value={selectedCity}
          data={[
            ...new Map(
              customers.filter((item) => item.city !== null).map((item) => [item.city, item])
            ).values(),
          ].map((customer) => ({
            value: String(customer.city),
            label: String(customer.city),
          }))}
          onChange={(e) => {
            setSelectedCity(e);
            localStorage.setItem('selected_city', e ?? '');
          }}
          placeholder="Miasto"
          // onChange={(e) => (e === null ? setSelectedCity('') : setSelectedCity(e))}
        />
        <Select
          miw={100}
          className={classes.selector}
          radius="xl"
          value={selectedProvince}
          comboboxProps={{ withinPortal: true }}
          data={[
            ...new Map(
              customers
                .filter((item) => item.province !== null)
                .map((item) => [item.province, item])
            ).values(),
          ].map((customer) => ({
            value: String(customer.province),
            label: String(customer.province),
          }))}
          onChange={(e) => {
            setSelectedProvince(e);
            localStorage.setItem('selected_province', e ?? '');
          }}
          placeholder="Województwo"
          // onChange={(e) => (e === null ? setSelectedProvince('') : setSelectedProvince(e))}
        />

        <TextInput
          style={{ flex: '0 1 250px' }}
          type="text"
          radius="xl"
          miw={80}
          mr={16}
          size="sm"
          placeholder="Szukaj..."
          value={searchQuery}
          onChange={(e) => handleSearch(e)}
          leftSection={<IconSearch size={18} stroke={1.5} />}
        />
      </form>
      {loading ? (
        <div className={header.loading}>Ładowanie...</div>
      ) : (
        <div className={header.list}>
          <div>{error}</div>
          {customers.map(
            (customer) =>
              customerFilter(customer) && (
                <CustomerTile key={`Key_${customer.nip}`} {...customer}></CustomerTile>
              )
          )}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Customers;

{
  /* <input
          type="text"
          placeholder="Szukaj..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */
}
