import React, { useState, useEffect } from 'react';
import {Table, Tabs, Button, Dropdown, Menu, Checkbox, Modal, Select, Popconfirm, Image} from 'antd';
import CreateModal from 'components/product/modal/createModal';
import EditModal from 'components/product/modal/editModal';
import { useRouter } from "next/router";
import { products, createProducts, updateProducts, deleteProductById } from 'api/Products'; // Adjust the import path according to your project structure
import { warehouse } from 'api/Warehouse'; // Adjust the import path according to your project structure

const { Option } = Select;

// Helper function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // This format is YYYY-MM-DD
};

export default function WarehousePage() {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [dataSources, setDataSources] = useState({ 1: [], 2: [] });
    const [warehouseList, setWarehouseList] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editProduct, setEditProduct] = useState({ productName: '', productId: '', price: '', quantity: '' });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);  // Separate state for EditModal
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const warehouseResponse = await warehouse();
                const productsResponse = await products();
                setDataSources({ 1: warehouseResponse.data, 2: productsResponse.data });
                setWarehouseList(warehouseResponse.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (key) => {
        setCurrentTab(key);
    };

    const handleCreateProduct = () => {
        setIsModalVisible(true);
    };

    const handlePrompt = () => {
        setIsPromptVisible(true);
    };

    const handleCreate = async (values) => {
        try {
            await createProducts(values);
            setIsModalVisible(false);
            const productsResponse = await products();
            setDataSources((prev) => ({ ...prev, 2: productsResponse.data }));
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleEdit = async (values) => {
        try {
            const id = editProduct.id;
            await updateProducts(id, values);
            setIsEditModalVisible(false);
            const productsResponse = await products();
            setDataSources((prev) => ({ ...prev, 2: productsResponse.data }));
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsPromptVisible(false);
    };

    const handleMenuClick = (e) => {
        if (e.key === '1') {
            router.push({
                pathname: '/shelf',
                query: {warehouseId: String(warehouseList.map((wh) => (wh._id)))}
            });
        }
        if (e.key === '2') {
            router.push({
                pathname: '/export',
                query: {warehouseId: String(warehouseList.map((wh) => (wh._id)))}
            });
        }
    };

    const handleWarehouseSelect = (value) => {
        const { warehouseId, warehouseName } = JSON.parse(value);
        setSelectedWarehouse({ warehouseId, warehouseName });
    };

    const handleProductSelect = (record, selected) => {
        const newSelectedProducts = selected
            ? [...selectedProducts, record._id]
            : selectedProducts.filter(id => id !== record._id);
        setSelectedProducts(newSelectedProducts);
    };

    const handleProductNameSelect = (record) => {
        setEditProduct({ id: record._id, productName: record.productName, productId: record.productId, price: record.price, quantity: record.quantity });
        setIsEditModalVisible(true);
    };

    const handleUpdateProducts = async () => {
        if (selectedWarehouse && selectedProducts.length > 0) {
            for (const productId of selectedProducts) {
                await updateProducts(productId, {warehouse: selectedWarehouse});
            }
            // Refresh the products data
            const productsResponse = await products();
            setDataSources((prev) => ({ ...prev, 2: productsResponse.data }));
            setSelectedProducts([]);
            setIsPromptVisible(false);
        } else {
            console.log('Please select products and a warehouse');
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">ดู/แก้ไข</Menu.Item>
            <Menu.Item key="2">ใบนำออก</Menu.Item>
        </Menu>
    );

    const stockColumn = [
        {
            title: 'ควบคุม',
            dataIndex: 'action',
            key: 'action',
            render: () => (
                <Dropdown overlay={menu}>
                    <Button onClick={(e) => e.preventDefault()}>
                        ตัวเลือก <i className="anticon anticon-down" />
                    </Button>
                </Dropdown>
            ),
        },
        {
            title: 'วันที่',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => formatDate(text) // Apply date formatting here
        },
        {
            title: 'ชื่อคลังสินค้า',
            dataIndex: 'warehouseName',
            key: 'warehouseName'
        },
        {
            title: 'สถานะคลังสินค้า',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <span style={{ color: text === 'Open' ? 'darkblue' : text === 'Closed' ? 'red' : 'inherit' }}>
                    {text}
                </span>
            )
        },
        {
            title: 'ดูแลโดย',
            dataIndex: 'author',
            key: 'author'
        },
    ];

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProductById(id);
            const productsResponse = await products();
            setDataSources((prev) => ({ ...prev, 2: productsResponse.data }));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const createStockColumn = [
        {
            title: '',
            dataIndex: 'select',
            key: 'select',
            render: (text, record) => (
                <Checkbox onChange={(e) => handleProductSelect(record, e.target.checked)} />
            ),
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'productName',
            key: 'productName',
            render: (text, record) => (
                <Button type="link" onClick={() => handleProductNameSelect(record)}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'รหัสสินค้า',
            dataIndex: 'productId',
            key: 'productId'
        },
        {
            title: 'อ้างอิง',
            dataIndex: 'warehouseName',
            key: 'warehouseName'
        },
        {
            title: 'ราคา',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'จำนวน',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        { dataIndex: 'delete', key: 'delete', render: (text, record) => (
             <Popconfirm
                title="คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?"
                onConfirm={() => handleDeleteProduct(record._id)}
                okText="ใช่"
                cancelText="ไม่"
             >
                 <Button>
                     <Image height={20} width={20} src="/bin.png" preview={false} alt="Bin Icon" />
                     <p>ลบ</p>
                 </Button>
             </Popconfirm>
        ), }
    ];

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data: {error.message}</p>;
    }

    return (
        <>
            <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                <Tabs.TabPane tab="รายการคลังสินค้า" key="1" />
                <Tabs.TabPane tab="เพิ่มสินค้าในคลัง" key="2" />
            </Tabs>
            {currentTab === '2' && (
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button type="primary" size="large" onClick={handleCreateProduct}>
                        สร้างสินค้าใหม่
                    </Button>
                </div>
            )}
            <Table
                dataSource={dataSources[currentTab]}
                columns={currentTab === '1' ? stockColumn : createStockColumn}
            />
            {currentTab === '2' && (
                <div style={{ marginBottom: 16, textAlign: 'left' }}>
                    <Button type="primary" size="large" onClick={handlePrompt}>
                        เพิ่มสินค้า
                    </Button>
                </div>
            )}
            <Modal
                title="เพิ่มสินค้า"
                visible={isPromptVisible}
                onOk={handleUpdateProducts}
                onCancel={handleCancel}
            >
                <Select
                    placeholder="เลือกคลังสินค้า"
                    onChange={handleWarehouseSelect}
                    style={{ width: '100%' }}
                >
                    {Array.isArray(warehouseList) && warehouseList.length > 0 ? (
                        warehouseList.map((wh) => (
                            <Option
                                key={wh.id}
                                value={JSON.stringify({
                                    warehouseId: wh._id,
                                    warehouseName: wh.warehouseName,
                                })}
                            >
                                {wh.warehouseName}
                            </Option>
                        ))
                    ) : (
                        <Option disabled>No warehouses available</Option>
                    )}
                </Select>
                <p>ยืนยันที่จะเพิ่มสินค้าในคลังสินค้าหรือไม่?</p>
            </Modal>
            <CreateModal
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
            />
            <EditModal
                visible={isEditModalVisible}
                onCreate={handleEdit}
                onCancel={() => setIsEditModalVisible(false)}
                productName={editProduct.productName}
                productId={editProduct.productId}
                price={editProduct.price}
                quantity={editProduct.quantity}
            />
        </>
    );
}
