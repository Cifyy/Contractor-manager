import React from 'react';
import classes from '../css/FulfilledOrderTile.module.scss';
import { Paper } from '@mantine/core';
import { OrderTileProps } from '@/ts/Order';

const UnfulfilledOrderTile = ({ order }: { order: OrderTileProps }) => {
  return (
    <Paper className={classes.orderTile} withBorder radius="md" p="xs">
      <div className={classes.leftInfo}>
        <div className={classes.customerName}>{order.customer_name}</div>
        <div className={classes.contractName}>{order.contract_name} </div>
      </div>
      <div className={classes.rightInfo}>
        {order.reference_name && (
          <div className={classes.referenceName}>
            <div className={classes.referenceNameTag}>Numer:</div>
            <div className={classes.referenceName}>{order.reference_name}</div>
          </div>
        )}

        <div className={classes.date}>
          <div className={classes.orderDateTag}>Złożone: </div>
          <div className={classes.orderDate}>{order.date.toLocaleDateString()}</div>
        </div>
        <div className={classes.value}>
          <div className={classes.valueTag}>Wartość brutto:</div>
          <div className={classes.valueAmount}>{order.value}zł</div>
        </div>
      </div>
    </Paper>
  );
};

export default UnfulfilledOrderTile;
