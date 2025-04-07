import React, { useEffect, useState } from 'react';
import header from '../components/css/Header.module.scss';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Group, Modal, NumberInput, Select, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getProducts } from '@/services/api';
import { pushPost } from '@/services/updateStock';
import { useAuth } from '../components/utils/AuthProvider';
import WarehouseItemTile from '../components/WarehouseItemTile';
import { Product } from '../ts/Product';

function compareProducts(a: Product, b: Product) {
  return a.name.localeCompare(b.name);
}

const Warehouse = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const [modelError, setModelError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | number>('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      if (!token) {
        throw 'No token';
      }
      const loadedProducts: Product[] = await getProducts(token);
      loadedProducts.sort(compareProducts);
      setProducts(loadedProducts);
    } catch (err) {
      if (String(err).includes('token')) {
        navigate('/login', { replace: true });
      }
      console.log(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const sendForm = async () => {
    console.log(selectedModel);
    console.log(amount);
    if (!amount || !selectedModel) {
      setModelError('Uzupełnij wszystkie pola!');
      return;
    }
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      const newData: Product[] = await pushPost(token, selectedModel, Number(amount));
      setProducts(newData);
    } catch (err) {
      if (String(err).includes('token')) {
        navigate('/login', { replace: true });
      }
      setModelError(String(err));
      return;
    }
    close();
    setModelError(null);
    setAmount('');
    setSelectedModel(null);
    loadProducts();
  };

  return (
    <>
      <Modal
        size="sm"
        zIndex={100}
        opened={opened}
        onClose={() => {
          close();
          setModelError(null);
        }}
        title="Zmiana stanu magazynowego"
        overlayProps={{
          backgroundOpacity: 0.3,
        }}
      >
        <Flex justify="center" align="center" direction="column">
          <Select
            w={200}
            mt="md"
            mb={24}
            comboboxProps={{ withinPortal: true }}
            data={products.map((product) => ({
              value: String(product.name),
              label: String(product.name),
            }))}
            onChange={setSelectedModel}
            placeholder="Wybierz model"
            label="Model"
            clearable
          />
          <NumberInput
            w={200}
            allowDecimal={false}
            value={amount}
            onChange={setAmount}
            label="Ilość"
            placeholder="Ilość do dodania / odjęcia"
          />
        </Flex>
        <Group mt="lg" justify="flex-end">
          <Text size="sm" c={'#f03e3e'}>
            {modelError}
          </Text>
          <Button onClick={sendForm}>Zapisz</Button>
        </Group>
      </Modal>

      <div className={header.main}>
        <div className={header.header}>
          <span className={header.title}>Magazyn</span>
          <div className={header.addButton} onClick={open}>
            <div className={header.horizontalPlus}></div>
            <div className={header.verticalPlus}></div>
          </div>
        </div>

        {loading ? (
          <div className={header.loading}>Ładowanie...</div>
        ) : (
          <div className={header.list}>
            <div>{error}</div>
            {products.map((product) => (
              <WarehouseItemTile key={product.id} {...product}></WarehouseItemTile>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Warehouse;
