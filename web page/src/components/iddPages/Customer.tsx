import React, { useEffect, useState } from 'react';
import classes from '../css/Customer.module.scss';
import { IconClipboardOff, IconHomeOff, IconUserOff } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Paper,
  RingProgress,
  Text,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { getCustomerInfo } from '@/services/customer';
import { updateContent } from '@/services/updateContent';
import { CustomerInfo } from '@/ts/Customer';
import ContractTile from '../ContractTile';
import AddEmployeeModal from '../modals/AddEmployeeModal';
import { useAuth } from '../utils/AuthProvider';
import AddressTile from './AddressTile';
import EmployeeTile from './EmployeeTile';

const Customer = () => {
  const { nip } = useParams();
  const { token } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);

  //   const [customers, setCustomers] = useState<CustomerTileProps[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [utilization_percentage, setUtilization_percentage] = useState(0);

  const [textArea, setTextArea] = useState<string | null | undefined>('');
  const [textAreaError, setTextAreaError] = useState<string | null>(null);

  const [saveDisabled, setSaveDisabled] = useState(true);
  //   const [customerName, setCustomerName] = useState('');

  // const [contractDate, SetContractDate] = useState<[Date | null, Date | null]>([null, null]);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const updateInfo = async () => {
    try {
      const newCustomer = await updateContent<CustomerInfo, CustomerInfo>(
        token!,
        { nip: nip, additional_info: textArea },
        'employeeInfo'
      );
      newCustomer.contracts?.forEach((e: any) => {
        e.start_date = new Date(e.start_date);
        e.end_date = new Date(e.end_date);
      });
      setTextAreaError('');
      setCustomerInfo(newCustomer);
      setSaveDisabled(true);
    } catch (err) {
      setTextAreaError(String(err));
    }
  };

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        if (!token || !nip) {
          throw 'No token or nip';
        }

        const loadedCustomer = await getCustomerInfo(token, nip);
        setError('');
        console.log(loadedCustomer);
        setCustomerInfo(loadedCustomer);
        setTextArea(loadedCustomer?.additional_info);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
      setUtilization_percentage(
        Math.round(
          ((customerInfo?.contracts_utilization_value ?? 0) /
            (customerInfo?.contracts_value ?? 1)) *
            100
        )
      );
    };
    loadCustomer();
  }, []);
  return (
    <div className={classes.main}>
      <AddEmployeeModal
        nip={customerInfo?.nip ?? ''}
        opened={opened}
        close={close}
        setCustomer={setCustomerInfo}
      ></AddEmployeeModal>
      {loading ? (
        <div className={classes.loading}>Ładowanie...</div>
      ) : (
        <>
          <div className={classes.header}>
            <div className={classes.title}>
              <span className={classes.name}>{customerInfo!.name.toUpperCase()}</span>
              <span className={classes.nip}>{customerInfo!.customer_type}</span>
            </div>
          </div>

          <Paper className={classes.mainInfo} withBorder radius="md" p="xs">
            <div className={classes.mainInfo}>
              <div className={classes.leftInfo}>
                <div className={classes.nipTag}>Nip:</div>
                <div className={classes.customerNip}> {nip}</div>
              </div>
              {customerInfo?.pneumatic_post && (
                <div className={classes.postInfo}>
                  <div className={classes.nipTag}>Poczta:</div>
                  <div className={classes.postVal}>
                    {' '}
                    {customerInfo?.pneumatic_post ? 'Tak' : 'Nie'}
                  </div>
                </div>
              )}
              {customerInfo?.contracts_value && (
                <div className={classes.contractValue}>
                  <div className={classes.contractValueTag}>Wartość kontraktów:</div>
                  <div className={classes.contractValueAmount}>
                    {customerInfo?.contracts_value ? customerInfo?.contracts_value + 'zł' : 'Brak'}
                  </div>
                </div>
              )}
              {customerInfo?.contracts_utilization_value && (
                <div className={classes.contractValue}>
                  <div className={classes.contractUtilValueTag}>Wykorzystano:</div>
                  <div className={classes.contractUtilValueAmount}>
                    {customerInfo?.contracts_utilization_value
                      ? customerInfo?.contracts_utilization_value + 'zł'
                      : '0zł'}
                  </div>
                </div>
              )}
              {customerInfo?.contracts_utilization_value ? (
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
                      color: (customerInfo?.contracts_value ?? 0 >= 0) ? '#EAEDF0' : '#ffffff',
                    },
                  ]}
                />
              )}
            </div>
          </Paper>

          <div className={classes.twoInARowCon}>
            <div className={classes.employees}>
              <div className={classes.employeesHeader}>
                <div>Pracownicy</div>
                <div className={classes.addButton} onClick={open}>
                  <div className={classes.horizontalPlus}></div>
                  <div className={classes.verticalPlus}></div>
                </div>
              </div>
              <div className={classes.employeesList}>
                {!customerInfo?.employees && (
                  <Flex
                    direction={'column'}
                    justify={'center'}
                    align={'center'}
                    fz={'0.8rem'}
                    c={'#868e96'}
                    fw={700}
                  >
                    <IconUserOff />
                    Brak pracowników
                  </Flex>
                )}
                {customerInfo?.employees?.map((employee) => (
                  <EmployeeTile {...employee} key={employee.id}></EmployeeTile>
                ))}
              </div>
            </div>
            <div className={classes.adresses}>
              <div className={classes.addressHeader}>Adresy</div>
              <div className={classes.addressList}>
                {!customerInfo?.addresses && (
                  <Flex
                    direction={'column'}
                    justify={'center'}
                    align={'center'}
                    fz={'0.8rem'}
                    c={'#868e96'}
                    fw={700}
                  >
                    <IconHomeOff />
                    Brak adresów
                  </Flex>
                )}
                {customerInfo?.addresses?.map((address) => (
                  <AddressTile
                    {...address}
                    key={`Key_${address.street}${address.street2}`}
                  ></AddressTile>
                ))}
              </div>
            </div>
          </div>
          <div className={classes.twoInARowCon}>
            <div className={classes.contractList}>
              <div className={classes.contractHeader}>Konktrakty</div>
              {!customerInfo?.contracts && (
                <Flex
                  direction={'column'}
                  justify={'center'}
                  align={'center'}
                  fz={'0.8rem'}
                  c={'#868e96'}
                  fw={700}
                >
                  <IconClipboardOff />
                  Brak kontraktów
                </Flex>
              )}
              {customerInfo?.contracts?.map((contract) => (
                <ContractTile {...contract} key={contract.id}></ContractTile>
              ))}
            </div>
            <div className={classes.additionalInfo}>
              <div className={classes.additionalHeader}>Dodatkowe informacje</div>
              <Textarea
                autosize
                className={classes.additionalInfoArea}
                value={textArea?.toString()}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setTextArea(value);
                  setSaveDisabled(value.trim() === customerInfo?.additional_info);

                  // setCustomerInfo((oldCustomer) => {
                  //   if (!Object.hasOwn(oldCustomer!, 'additional_info')) {
                  //     oldCustomer!['additional_info'] = '';
                  //   }
                  //   oldCustomer!.additional_info = value;
                  //   return oldCustomer;
                  // });
                }}
              />
              <Group align="center" justify="end" mt={8}>
                <Text size="sm" c={'#f03e3e'}>
                  {textAreaError}
                </Text>
                <Button disabled={saveDisabled} onClick={updateInfo} size="xs">
                  Zapisz
                </Button>
              </Group>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Customer;
