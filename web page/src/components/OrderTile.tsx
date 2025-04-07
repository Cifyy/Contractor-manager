import React, { FC } from 'react';
import classes from './css/CustomerTile.module.scss';
import { Center, Paper, RingProgress } from '@mantine/core';
import { Customer } from '../ts/Customer';

const OrderTile: FC<Customer> = ({ nip, name }) => {
  return (
    <Paper className={classes.customerTile} withBorder radius="md" p="xs">
      <div className={classes.leftInfo}>
        <div className={classes.customerName}>{name}</div>
        <div className={classes.provinceName}>Kraków, Małopolskie</div>
      </div>
      <div className={classes.contractValue}>
        <div className={classes.contractValueTag}>Wartość kontraktów:</div>
        <div className={classes.contractValueAmount}>43989,99zł</div>
      </div>
      <RingProgress
        size={70}
        roundCaps
        thickness={7}
        sections={[{ value: 80, color: '#509fe4' }]}
        label={
          <Center fw={600}>
            <span>90</span>
          </Center>
        }
      />
    </Paper>
  );
};

export default OrderTile;
