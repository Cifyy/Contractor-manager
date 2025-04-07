import React, { useState } from 'react';
import header from '../components/css/Header.module.scss';
import { SegmentedControl, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddOrderModal from '@/components/modals/AddOrderModal';
import OrdersList from '@/components/orders/OrdersList';
import { OrderTileProps } from '@/ts/Order';
import classes from '../components/css/SegmentedControl.module.css';

const Orders = () => {
  const hardcodedOrders: OrderTileProps[] = [
    {
      id: 1,
      customer_name: 'Szpital Miejski im. Jana Pawła II',
      reference_name: '321-205',
      contract_name: 'Kontrakt-2024-01',
      value: 1250.5,
      date: new Date('2024-03-15'),
      fulfilled: true,
    },
    {
      id: 2,
      customer_name: 'Laboratorium MEDLAB',
      reference_name: '12',
      contract_name: null,
      value: 3200.0,
      date: new Date('2024-01-22'),
      fulfilled: false,
    },
    {
      id: 3,
      customer_name: 'Szpital Uniwersytecki',
      reference_name: null,
      contract_name: 'ONK/2024',
      value: 8750.25,
      date: new Date('2024-04-05'),
      fulfilled: true,
    },
    {
      id: 4,
      customer_name: 'Szpital im.Miszala Kołczyńskiego',
      reference_name: '20-30-12',
      contract_name: null,
      value: 5400.8,
      date: new Date('2024-02-18'),
      fulfilled: false,
    },
    {
      id: 5,
      customer_name: 'Laboratorium Genet',
      reference_name: null,
      contract_name: 'PLZ/20/24',
      value: 6200.0,
      date: new Date('2024-03-30'),
      fulfilled: true,
    },
    {
      id: 6,
      customer_name: 'Szpital Wojewódzki w Krakowie',
      reference_name: 'Ref-SWK',
      contract_name: 'Kontrakt-SWK-2024',
      value: 1500.0,
      date: new Date('2024-01-10'),
      fulfilled: true,
    },
    {
      id: 7,
      customer_name: 'Laboratorium ANLAB',
      reference_name: 'AD210k',
      contract_name: null,
      value: 2800.4,
      date: new Date('2024-04-12'),
      fulfilled: false,
    },
    {
      id: 8,
      customer_name: 'Klinika Kardiologii',
      reference_name: '12',
      contract_name: 'Kontrakt-KARDIO-2024',
      value: 9200.75,
      date: new Date('2024-03-01'),
      fulfilled: true,
    },
    {
      id: 9,
      customer_name: 'Szpital Uniwersytecki',
      reference_name: null,
      contract_name: null,
      value: 4300.6,
      date: new Date('2024-02-05'),
      fulfilled: false,
    },
    {
      id: 10,
      customer_name: 'Laboratorium BIOCHECK',
      reference_name: 'mek/2',
      contract_name: 'Kontrakt-BIO-2024',
      value: 7100.9,
      date: new Date('2024-04-20'),
      fulfilled: true,
    },
  ];
  const [orders, setOrders] = useState<OrderTileProps[]>(hardcodedOrders);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ordersType, setOrdersType] = useState('Niezrealizowane');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className={header.main}>
      <div className={header.header}>
        <span className={header.title}>Zamówienia</span>
        <div className={header.addButton} onClick={open}>
          <div className={header.horizontalPlus}></div>
          <div className={header.verticalPlus}></div>
        </div>
      </div>
      <AddOrderModal opened={opened} close={close} setObjects={setOrders}></AddOrderModal>
      <div className={header.searchForm}>
        <SegmentedControl
          radius="xl"
          size="sm"
          mr={18}
          data={['Niezrealizowane', 'Zrealizowane']}
          value={ordersType}
          onChange={setOrdersType}
          classNames={classes}
          // classNames={classes}
        />
      </div>
      {loading ? (
        <div className={header.loading}></div>
      ) : (
        <div className={header.list}>
          <OrdersList fulfilledFilter={ordersType === 'Zrealizowane'} orders={orders}></OrdersList>
          {/* {products.length > 0 ? <div> zamowiena</div> : <div></div>} */}
          {/* {products.map((product) => (
            <div>{product.name}</div>
          ))} */}
        </div>
      )}
    </div>
  );
};

export default Orders;
