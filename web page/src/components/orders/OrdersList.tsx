import React, { useEffect } from 'react';
import { OrderTileProps } from '@/ts/Order';
import FulfilledOrderTile from './FulfilledOrderTile';
import UnfulfilledOrderTile from './UnfulfilledOrderTile';

const OrdersList = ({
  fulfilledFilter,
  orders,
}: {
  fulfilledFilter: boolean;
  orders: OrderTileProps[];
}) => {
  useEffect(() => {
    console.log(-1 * +fulfilledFilter);
  }, [fulfilledFilter]);
  return (
    <>
      {orders
        .filter((order) => (fulfilledFilter ? order.fulfilled : !order.fulfilled))
        .sort((o1, o2) => (o2.date.getTime() - o1.date.getTime()) * (fulfilledFilter ? -1 : 1))
        .map((order) =>
          fulfilledFilter ? (
            <FulfilledOrderTile key={order.id} order={order} />
          ) : (
            <UnfulfilledOrderTile key={order.id} order={order} />
          )
        )}
    </>
  );
};

export default OrdersList;
