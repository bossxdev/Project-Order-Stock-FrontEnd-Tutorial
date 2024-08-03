import React, { useState } from 'react';
import { Table, Tabs, Button, Dropdown, Menu, Checkbox, Modal } from 'antd';
import CreateProductModal from 'components/product';
import {useRouter} from "next/router";

const dataSources = {
    1: [
        { key: '1', name: 'Stock A', date: '2024-07-30', status: 'Active', author: 'Admin' },
    ],
    2: [
        { key: '3', productName: 'Product A', productCode: 'P001', refer: 'Ref001', value: 100 },
        { key: '4', productName: 'Product B', productCode: 'P002', refer: 'Ref002', value: 200 },
    ]
};

export default function WarehousePage() {
    const router = useRouter(); // Hook for navigation
    const [currentTab, setCurrentTab] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPromptVisible, setIsPromptVisible] = useState(false);

    const handleTabChange = (key) => {
        setCurrentTab(key);
    };

    const handleCreateProduct = () => {
        setIsModalVisible(true);
    };

    const handlePrompt = () => {
        setIsPromptVisible(true);
    };

    const handleCreate = (values) => {
        console.log('Product data:', values);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsPromptVisible(false);
    };

    const handleMenuClick = (e) => {
        if (e.key === '1') {
            router.push('/shelf');
        }
        if (e.key === '3') {
            router.push('/export');
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">แก้ไข</Menu.Item>
            <Menu.Item key="2">ลบ</Menu.Item>
            <Menu.Item key="3">ใบนำออก</Menu.Item>
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
        { title: 'วันที่', dataIndex: 'date', key: 'date' },
        { title: 'ชื่อคลังสินค้า', dataIndex: 'name', key: 'name' },
        { title: 'สถานะคลังสินค้า', dataIndex: 'status', key: 'status' },
        { title: 'ดูแลโดย', dataIndex: 'author', key: 'author' },
    ];

    const createStockColumn = [
        {
            title: '',
            dataIndex: 'select',
            key: 'select',
            render: () => <Checkbox />
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'productName',
            key: 'productName'
        },
        {
            title: 'รหัสสินค้า',
            dataIndex: 'productCode',
            key: 'productCode'
        },
        {
            title: 'อ้างอิง',
            dataIndex: 'refer',
            key: 'refer'
        },
        {
            title: 'จำนวน',
            dataIndex: 'value',
            key: 'value'
        },
    ];

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
