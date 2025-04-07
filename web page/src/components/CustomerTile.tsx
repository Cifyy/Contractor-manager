import React, { FC } from 'react';
import classes from './css/CustomerTile.module.scss';
import { Link } from 'react-router-dom';
import { Box, Center, Paper, RingProgress } from '@mantine/core';
import { Customer, CustomerTileProps } from '../ts/Customer';

const customerTile: FC<CustomerTileProps> = ({
  nip,
  name,
  customerType,
  city,
  province,
  contracts_value,
  contracts_utilization_value,
}) => {
  const utilization_percentage = Math.round((contracts_utilization_value / contracts_value) * 100);

  return (
    <Link to={`/klienci/${nip}`} className={classes.customLink}>
      <Paper className={classes.customerTile} withBorder radius="md" p="xs">
        <div className={classes.leftInfo}>
          <div className={classes.customerName}>{name}</div>
          <div className={classes.provinceName}>
            {city}
            {city ? ', ' : ''}
            {province}
          </div>
        </div>
        {contracts_value && (
          <div className={classes.contractValue}>
            <div className={classes.contractValueTag}>Wartość kontraktów:</div>
            <div className={classes.contractValueAmount}>
              {contracts_value ? contracts_value + 'zł' : 'Brak'}
            </div>
          </div>
        )}
        {contracts_utilization_value ? (
          <RingProgress
            size={70}
            roundCaps
            thickness={7}
            sections={[{ value: utilization_percentage, color: '#509fe4' }]}
            label={
              <Center fw={600}>
                <span>{utilization_percentage}%</span>
              </Center>
            }
          />
        ) : (
          <RingProgress
            size={70}
            roundCaps
            thickness={7}
            sections={[
              { value: utilization_percentage, color: contracts_value > 0 ? '#EAEDF0' : '#ffffff' },
            ]}
          />
        )}
      </Paper>
    </Link>
  );
};

export default customerTile;
