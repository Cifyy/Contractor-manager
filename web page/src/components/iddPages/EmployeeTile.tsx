import React, { FC } from 'react';
import classes from '../css/EmployeeTile.module.scss';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { Paper } from '@mantine/core';
import { Employee } from '@/ts/Customer';

const EmployeeTile: FC<Employee> = ({ id, name, surname, email, phone, role }) => {
  return (
    <Paper className={classes.employee} withBorder radius="md" p="xs">
      <div className={classes.employee}>
        <div className={classes.nameHolder}>
          <div className={classes.name}>
            {name} {surname}
          </div>
          <div className={classes.role}>{role}</div>
        </div>
        {phone && (
          <div className={classes.phone}>
            <IconPhone stroke={1.25} color="#868e96" height="20" />
            {/* +48 123 213 213 */}
            {phone}
          </div>
        )}
        {email && (
          <div className={classes.email}>
            <IconMail stroke={1.25} color="#868e96" height="20" />
            {/* jakubczyk.malarczykos.pl@gmail.com */}
            {email}
          </div>
        )}
      </div>
    </Paper>
  );
};

export default EmployeeTile;
