import React, { useEffect, useLayoutEffect, useState } from 'react';
import header from '../components/css/Header.module.scss';
import ContractTile from '../components/ContractTile';
import { getContracts, getContractTiles } from '../services/api';
import { Contract, ContractTileProps } from '../ts/Contract';

import '../components/css/Contracts.modules.scss';

import { IconSearch } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Code, rem, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AddContractModal from '@/components/modals/AddContractModal';
import { useAuth } from '../components/utils/AuthProvider';

const Contracts = () => {
  const navigate = useNavigate();
  // const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || localStorage.getItem('contractSearch') || ''
  );
  const [contracts, setContracts] = useState<ContractTileProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  useLayoutEffect(
    () => () => {
      sessionStorage.setItem('contractsScrollPosition', window.scrollY.toString());
    },
    []
  );
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('contractsScrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem('scrollPosition');
    }
  }, [contracts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('contractSearch', searchQuery);
    setSearchParams(params);
  }, [searchQuery]);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        if (!token) {
          throw 'No token';
        }
        const loadedContracts = await getContractTiles(token);
        setContracts(loadedContracts);
      } catch (err) {
        if (String(err).includes('token')) {
          navigate('/login', { replace: true });
        }
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    loadContracts();
  }, []);

  const display = (contract: Contract) => {
    if (
      contract.customer_name.toLocaleLowerCase().includes(searchQuery) ||
      contract.reference_name.toLocaleLowerCase().includes(searchQuery)
    )
      return true;
    return false;
  };

  return (
    <div className={header.main}>
      <div className={header.header}>
        <span className={header.title}>Kontrakty</span>
        <div className={header.addButton} onClick={open}>
          <div className={header.horizontalPlus}></div>
          <div className={header.verticalPlus}></div>
        </div>
      </div>
      <AddContractModal opened={opened} close={close} setObjects={setContracts}></AddContractModal>
      <form
        // onSubmit={handleSearch}
        className={header.searchForm}
      >
        <TextInput
          style={{ flex: '0 1 250px' }}
          type="text"
          radius="xl"
          miw={80}
          mr={16}
          size="sm"
          placeholder="Szukaj..."
          value={searchQuery}
          onChange={(e) => {
            localStorage.setItem('contractSearch', e.target.value ?? '');
            setSearchQuery(e.target.value.toLowerCase());
          }}
          leftSection={<IconSearch size={18} stroke={1.5} />}
        />
      </form>
      {loading ? (
        <div className={header.loading}>Ładowanie...</div>
      ) : (
        <div className={header.list}>
          <div>{error}</div>
          {contracts.map(
            (contract) =>
              display(contract) && <ContractTile {...contract} key={contract.id}></ContractTile>
          )}
        </div>
      )}
    </div>
  );
};

export default Contracts;
