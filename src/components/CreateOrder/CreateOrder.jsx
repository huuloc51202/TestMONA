import React, { useState } from 'react';
import { Button, Select, InputNumber, Form, Input, Radio, Modal, Table, Space } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import ConfirmOrder from '../ConfirmOrder/ConfirmOrder';

const { Option } = Select;
const { Title } = Typography;
const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 },
];

const CreateOrder = () => {
    const [form] = Form.useForm();
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cashGiven, setCashGiven] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
  
    // Add product to cart
    const handleAddProduct = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id === selectedProduct);
        const itemInCart = cart.find(item => item.id === product.id);
    
        if (itemInCart) {
            setCart(cart.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        setSelectedProduct(null);
    };
  
    // Remove product from cart
    const handleRemoveProduct = (id) => {
      setCart(cart.filter(item => item.id !== id));
    };
  
    // Table columns for cart items
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={value => {
                    const newCart = cart.map(item =>
                        item.id === record.id ? { ...item, quantity: value } : item
                    );
                    setCart(newCart);
                    }}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveProduct(record.id)}
                    >
                    Remove
                    </Button>
                </Space>
            ),
        },
    ];
  
    // Handle form submission
    const handleSubmit = (values) => {
        const orderData = {
            ...values,
            cart,
            paymentMethod,
            cashGiven: paymentMethod === 'cash' ? cashGiven : null,
        };
        setShowConfirmModal(true);
    };
  
    // Calculate total
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
    return (
        <div>
            <Card sx={{ p: 3, mb: 2 }}>
                <Title>Create Order</Title>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
                        <Input placeholder="Enter customer name" />
                    </Form.Item>
                    <Form.Item name="customerEmail" label="Customer Email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="Enter customer email" />
                    </Form.Item>
                    <Form.Item name="customerPhone" label="Customer Phone" rules={[{ required: true }]}>
                        <Input placeholder="Enter customer phone" />
                    </Form.Item>
        
                    <Form.Item label="Select Product">
                        <Select
                            value={selectedProduct}
                            onChange={setSelectedProduct}
                            placeholder="Select a product"
                            style={{ width: '100%' }}
                        >
                            {products.map(product => (
                                <Option key={product.id} value={product.id}>
                                    {product.name} - ${product.price}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            type="primary"
                            onClick={handleAddProduct}
                            style={{ marginTop: '10px' }}
                            icon={<ShoppingCartOutlined />}
                        >
                            Add to Cart
                        </Button>
                    </Form.Item>
        
                    <Table columns={columns} dataSource={cart} rowKey="id" pagination={false} />
        
                    <Title level={4}>Total: ${total}</Title>
        
                    <Form.Item label="Payment Method">
                        <Radio.Group value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                            <Radio value="cash">Cash</Radio>
                            <Radio value="card">Card</Radio>
                        </Radio.Group>
                    </Form.Item>
        
                    {paymentMethod === 'cash' && (
                        <Form.Item label="Cash Given">
                            <InputNumber
                            min={0}
                            value={cashGiven}
                            onChange={setCashGiven}
                            style={{ width: '100%' }}
                            />
                            {cashGiven > total && <p>Change to return: ${cashGiven - total}</p>}
                        </Form.Item>
                    )}
        
                    <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Proceed to Pay
                    </Button>
                    </Form.Item>
                </Form>
            </Card>
    
            {showConfirmModal && (
                <ConfirmOrder
                    orderData={{
                    customerName: form.getFieldValue('customerName'),
                    customerEmail: form.getFieldValue('customerEmail'),
                    customerPhone: form.getFieldValue('customerPhone'),
                    cart,
                    paymentMethod,
                    cashGiven,
                    }}
                    onClose={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
};
  

export default CreateOrder
