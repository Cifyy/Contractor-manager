import { useEffect, useState } from 'react';
import {
  IconBuildingWarehouse,
  IconContract,
  IconLogout,
  IconTruckDelivery,
  IconUser,
} from '@tabler/icons-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Code, Group } from '@mantine/core';
import { useAuth } from './utils/AuthProvider';
import classes from './css/Navbar.module.css';

const data = [
  { link: '/zamowienia', label: 'Zamówienia', icon: IconTruckDelivery },
  { link: '/klienci', label: 'Klienci', icon: IconUser },
  { link: '/kontrakty', label: 'Kontrakty', icon: IconContract },
  { link: '/magazyn', label: 'Magazyn', icon: IconBuildingWarehouse },
];

export function Navbar() {
  // const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState('');
  const { setToken } = useAuth();
  const location = useLocation();
  useEffect(() => {
    const currentPath = data.find((d) => {
      if (d.link === location.pathname) {
        return true;
      }
    });
    // console.log(curentPath);
    setActive(currentPath?.label ?? 'Magazyn');
  }, []);

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={(event) => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          {/* <MantineLogo size={28} /> */}
          <span className={classes.expansLogo}>Panel</span>
          <Code fw={700} fz={14}>
            v0.7
          </Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <Link
          to="/login"
          className={classes.link}
          onClick={(event) => {
            setToken(null);
            // event.preventDefault();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Wyloguj</span>
        </Link>
      </div>
    </nav>
  );
}
