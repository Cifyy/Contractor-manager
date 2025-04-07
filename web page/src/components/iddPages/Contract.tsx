import React, { useEffect, useState } from 'react';
import classes from '../css/Customer.module.scss';
import { IconClipboardOff, IconHomeOff, IconUserOff } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { Center, Flex, Paper, RingProgress } from '@mantine/core';
import { getCustomerInfo } from '@/services/customer';
import { CustomerInfo } from '@/ts/Customer';
import ContractTile from '../ContractTile';
import { useAuth } from '../utils/AuthProvider';
import AddressTile from './AddressTile';
import EmployeeTile from './EmployeeTile';

const Contract = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [contractInfo, setContractInfo] = useState<CustomerInfo>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [utilization_percentage, setUtilization_percentage] = useState(0);

  useEffect(() => {
    const loadContract = async () => {
      try {
        if (!token || !id) {
          throw 'No token or id';
        }

        // const loadedCustomer = await getCustomerInfo(token, id);
        // setError('');
        // console.log(loadedCustomer);
        // setContractInfo(loadedContract);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    loadContract();
    // setUtilization_percentage(
    //   Math.round(
    //     customerInfo?.contracts_utilization_value ?? 0 / (customerInfo?.contracts_value ?? 1)
    //   ) * 100
    // );
  }, []);

  return (
    <>
      <div>Kontrakt o numerze id: {id}, ta strona nie jest dokończona</div>
    </>
    // <div className={classes.main}>
    //   {loading ? (
    //     <div className={classes.loading}>Ładowanie...</div>
    //   ) : (
    //     <>
    //       <div className={classes.header}>
    //         <div className={classes.title}>
    //           <span className={classes.name}>{customerInfo!.name.toUpperCase()}</span>
    //           <span className={classes.nip}>{customerInfo!.customer_type}</span>
    //         </div>
    //       </div>

    //       <Paper className={classes.mainInfo} withBorder radius="md" p="xs" mb={24}>
    //         <div className={classes.mainInfo}>
    //           <div className={classes.leftInfo}>
    //             <div className={classes.nipTag}>Nip:</div>
    //             <div className={classes.customerNip}> {nip}</div>
    //           </div>
    //           {customerInfo?.contracts_value && (
    //             <div className={classes.contractValue}>
    //               <div className={classes.contractValueTag}>Wartość kontraktów:</div>
    //               <div className={classes.contractValueAmount}>
    //                 {customerInfo?.contracts_value ? customerInfo?.contracts_value + 'zł' : 'Brak'}
    //               </div>
    //             </div>
    //           )}
    //           {customerInfo?.contracts_utilization_value && (
    //             <div className={classes.contractValue}>
    //               <div className={classes.contractUtilValueTag}>Wykorzystano:</div>
    //               <div className={classes.contractUtilValueAmount}>
    //                 {customerInfo?.contracts_utilization_value
    //                   ? customerInfo?.contracts_utilization_value + 'zł'
    //                   : '0zł'}
    //               </div>
    //             </div>
    //           )}
    //           {customerInfo?.contracts_utilization_value ? (
    //             <RingProgress
    //               size={70}
    //               roundCaps
    //               thickness={7}
    //               sections={[
    //                 { value: customerInfo?.contracts_utilization_value, color: '#509fe4' },
    //               ]}
    //               label={
    //                 <Center fw={600}>
    //                   <span>{customerInfo?.contracts_utilization_value}%</span>
    //                 </Center>
    //               }
    //             />
    //           ) : (
    //             <RingProgress
    //               size={70}
    //               roundCaps
    //               thickness={7}
    //               sections={[
    //                 {
    //                   value: utilization_percentage,
    //                   color: (customerInfo?.contracts_value ?? 0 >= 0) ? '#EAEDF0' : '#ffffff',
    //                 },
    //               ]}
    //             />
    //           )}
    //         </div>
    //       </Paper>

    //       <div className={classes.twoInARowCon}>
    //         <div className={classes.employees}>
    //           <div className={classes.employeesHeader}>
    //             <div>Pracownicy</div>
    //             <div className={classes.addButton}>
    //               <div className={classes.horizontalPlus}></div>
    //               <div className={classes.verticalPlus}></div>
    //             </div>
    //           </div>
    //           <div className={classes.employeesList}>
    //             {!customerInfo?.employees && (
    //               <Flex
    //                 direction={'column'}
    //                 justify={'center'}
    //                 align={'center'}
    //                 fz={'0.8rem'}
    //                 c={'#868e96'}
    //                 fw={700}
    //               >
    //                 <IconUserOff />
    //                 Brak pracowników
    //               </Flex>
    //             )}
    //             {customerInfo?.employees?.map((employee) => (
    //               <EmployeeTile {...employee} key={employee.id}></EmployeeTile>
    //             ))}
    //           </div>
    //         </div>
    //         <div className={classes.adresses}>
    //           <div className={classes.addressHeader}>Adresy</div>
    //           <div className={classes.addressList}>
    //             {!customerInfo?.addresses && (
    //               <Flex
    //                 direction={'column'}
    //                 justify={'center'}
    //                 align={'center'}
    //                 fz={'0.8rem'}
    //                 c={'#868e96'}
    //                 fw={700}
    //               >
    //                 <IconHomeOff />
    //                 Brak adresów
    //               </Flex>
    //             )}
    //             {customerInfo?.addresses?.map((address) => (
    //               <AddressTile
    //                 {...address}
    //                 key={`Key_${address.street}${address.street2}`}
    //               ></AddressTile>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //       <div className={classes.contractList}>
    //         <div className={classes.contractHeader}>Konktrakty</div>
    //         {!customerInfo?.contracts && (
    //           <Flex
    //             direction={'column'}
    //             justify={'center'}
    //             align={'center'}
    //             fz={'0.8rem'}
    //             c={'#868e96'}
    //             fw={700}
    //           >
    //             <IconClipboardOff />
    //             Brak kontraktów
    //           </Flex>
    //         )}
    //         {customerInfo?.contracts?.map((contract) => (
    //           <ContractTile {...contract} key={contract.id}></ContractTile>
    //         ))}
    //       </div>
    //     </>
    //   )}
    // </div>
  );
};

export default Contract;
