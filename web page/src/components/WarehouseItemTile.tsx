import React, { FC } from 'react';
import classes from './css/WarehouseTile.module.scss';
import { Center, Paper, RingProgress } from '@mantine/core';
import { Product } from '../ts/Product';

const WarehouseItemTile: FC<Product> = ({ id, category, stock, name }) => {
  return (
    <Paper className={classes.itemTile} withBorder radius="md" p="xs">
      <div className={classes.model}>
        <div className={classes.name}>Model</div>
        <div className={classes.itemName}>{name}</div>
      </div>
      <div className={classes.amount}>
        <div className={classes.stock}>Ilość</div>
        <div className={classes.itemAmount}>{stock}</div>
      </div>
    </Paper>
  );
};

export default WarehouseItemTile;
