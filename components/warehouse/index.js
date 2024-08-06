import React, { useState, useEffect } from 'react';
import { Table, Tabs, Button, Dropdown, Menu, Checkbox, Modal } from 'antd';
import CreateProductModal from 'components/product';
import { useRouter } from "next/router";
import { products } from 'api/Products'; // Adjust the import path according to your project structure
import { warehouse } from 'api/Warehouse'; // Adjust the import path according to your project structure

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
    const [dataSources, setDataSources] = useState({
        1: [],
        2: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const warehouseResponse = await warehouse();
                const productsResponse = await products();
                // Assuming response.data contains the products and warehouse arrays
                console.log('Warehouse:', warehouseResponse.data);
                console.log('Products:', productsResponse.data);
                setDataSources({
                    1: warehouseResponse.data,
                    2: productsResponse.data
                });
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
            // Re-fetch the data to update the table
            const productsResponse = await products();
            setDataSources((prev) => ({ ...prev, 2: productsResponse.data }));
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsPromptVisible(false);
    };

    const handleMenuClick = (e) => {
        if (e.key === '1') {
            router.push('/shelf');
        }
        if (e.key === '2') {
            router.push('/export');
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">แก้ไข</Menu.Item>
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
            key: 'status'
        },
        {
            title: 'ดูแลโดย',
            dataIndex: 'author',
            key: 'author'
        },
    ];

    const createStockColumn = [
        {
            title: '',
            dataIndex: 'select',
            key: 'select',
            render: () => <Checkbox />,
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: 'รหัสสินค้า',
            dataIndex: 'productId',
            key: 'productId'
        },
        {
            title: 'อ้างอิง',
            dataIndex: 'ref',
            key: 'ref'
        },
        {
            title: 'จำนวน',
            dataIndex: 'quantity',
            key: 'quantity'
        },
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
                onOk={() => console.log('Product added!')}
                onCancel={handleCancel}
            >
                <p>ยืนยันที่จะเพิ่มสินค้าในคลังสินค้าหรือไม่?</p>
            </Modal>
            <CreateProductModal
                visible={isModalVisible}
                onCreate={handleCreate}
                onCancel={handleCancel}
            />
        </>
    );
}
