import React, { FC } from 'react';
import classes from '../css/AddressTile.module.scss';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { Paper } from '@mantine/core';
import { CustomerAddress } from '@/ts/Customer';

const AddressTile: FC<CustomerAddress> = ({
  country,
  province,
  city,
  street,
  street2,
  post_code,
}) => {
  return (
    <Paper className={classes.address} withBorder radius="md" p="xs">
      <div className={classes.street}>
        <div className={classes.street}>{street}</div>
        {street2 && <div className={classes.street2}>{street2}</div>}
        <div className={classes.postCodeCity}>
          {post_code}, {city}
        </div>
        <div className={classes.countryProvince}>
          {province}, {country}
        </div>
      </div>
    </Paper>
  );
};

export default AddressTile;
