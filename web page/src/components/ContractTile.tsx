import React, { FC } from 'react';
// import './css/ContractTile.modules.scss';

import classes from './css/ContractTile.module.scss';
import { Link } from 'react-router-dom';
import { Center, Paper, RingProgress } from '@mantine/core';
import { ContractTileProps } from '../ts/Contract';

const ContractTile: FC<ContractTileProps> = ({
  id,
  nip,
  reference_name,
  customer_name,
  start_date,
  end_date,
  contract_value,
  contract_utilization_value,
}) => {
  const timeLeft = end_date.getTime() - Date.now();
  const daysLeft = Math.ceil(timeLeft / 86400000);

  const utilization_percentage = Math.round((contract_utilization_value / contract_value) * 100);
  // console.log(utilization_percentage);
  return (
    <Link to={`/kontrakty/${id}`} className={classes.customLink}>
      <Paper className={classes.paperContainer} withBorder radius="md" p="xs">
        <div className={classes.contractTile}>
          <div className={classes.leftInfo}>
            <div className={classes.contractName}>{reference_name}</div>
            <div className={classes.customerName}>{customer_name}</div>
          </div>
          <div className={classes.dates}>
            <div className={classes.startDate}>Do: {end_date.toLocaleDateString()}</div>
            {daysLeft >= 0 ? (
              <div className={classes.timeLeft}>Pozostało: {daysLeft} dni</div>
            ) : (
              <div className={classes.timeLeft}>Zakończony</div>
            )}
          </div>
          <div className={classes.value}>
            <div className={classes.valueTag}>Wartość brutto:</div>
            <div className={classes.valueAmount}>{contract_value}zł</div>
          </div>
          {contract_utilization_value ? (
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
                {
                  value: utilization_percentage,
                  color: contract_value > 0 ? '#EAEDF0' : '#ffffff',
                },
              ]}
            />
          )}
          {/* </div> */}
        </div>
      </Paper>
    </Link>
  );
};

export default ContractTile;
