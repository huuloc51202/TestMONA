import React from 'react';
import { Modal} from 'antd';
import {  Typography } from 'antd';


const { Title } = Typography;

const ConfirmOrder = ({ orderData, onClose }) => {
    const total = orderData.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const change = orderData.paymentMethod === 'cash' ? orderData.cashGiven - total : 0;
  
    return (
      <Modal title="Confirm Order" visible={true} onCancel={onClose} footer={null}>
        <Title level={4}>Customer Info</Title>
        <p>Name: {orderData.customerName}</p>
        <p>Email: {orderData.customerEmail}</p>
        <p>Phone: {orderData.customerPhone}</p>
  
        <Title level={4}>Cart Info</Title>
        <ul>
          {orderData.cart.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price} x {item.quantity}
            </li>
          ))}
        </ul>
  
        <Title level={4}>Payment Info</Title>
        <p>Payment Method: {orderData.paymentMethod}</p>
        {orderData.paymentMethod === 'cash' && (
          <>
            <p>Cash Given: {orderData.cashGiven}</p>
            {change > 0 && <p>Change to return: {change}</p>}
          </>
        )}
        <p>Total: {total}</p>
      </Modal>
    );
};

export default ConfirmOrder
