import { Button, Modal } from '@mantine/core';
import { AddCustomerModalProps } from '@/ts/Customer';

const ChangeStockModal: React.FC<AddCustomerModalProps> = ({ close, opened, setCustomers }) => {
  return (
    <Modal opened={opened} onClose={close} title="Authentication">
      <Button
      // onClick={() => {
      //   setCustomers([{ nip: 'siema', name: 'yo;p'}]);
      // }}
      ></Button>
    </Modal>
  );
};

export default ChangeStockModal;
