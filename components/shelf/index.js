import React, { useState, useEffect } from 'react';
import { Table, Card, Radio, Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { warehouseById } from 'api/Warehouse';
import { productsById } from 'api/Products';
import { shelf } from 'api/Shelf';  // Import the shelf function

const columns = [
    { title: 'รายการ', dataIndex: 'productName', key: 'productName' },
    { title: 'รหัสสินค้า', dataIndex: 'productId', key: 'productId' },
    { title: 'ราคา/หน่วย (บาท)', dataIndex: 'pricePerUnit', key: 'pricePerUnit' },
    { title: 'สถานะ', dataIndex: 'status', key: 'status' },
    { title: 'ยอดรวม (ชิ้น)', dataIndex: 'quantity', key: 'quantity' }
];

const productColumns = (selectedRadio, setSelectedRadio, showModal) => [
    {
        key: 'shelfName',
        render: (_, record) => (
            <div>
                <Radio
                    checked={selectedRadio === record.key}
                    onChange={() => setSelectedRadio(record.key)}  // Set the selected radio to the specific record key
                    style={{ marginRight: 8 }}
                />
                <span onClick={() => showModal(record.key)} style={{ cursor: 'pointer' }}>
                    {record.shelfName}
                </span>
            </div>
        )
    }
];

const ProductDetailsTable = ({ product, showModal }) => {
    const [selectedRadio, setSelectedRadio] = useState(null);

    return (
        <Table
            columns={productColumns(selectedRadio, setSelectedRadio, showModal)}
            dataSource={product}
            pagination={false}
            showHeader={false}
            size="small"
            style={{ margin: '0' }}
        />
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // This format is YYYY-MM-DD
};

export default function ShelfPage({ warehouseId }) {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [warehouseData, setWarehouseData] = useState(null);
    const [productData, setProductData] = useState([]);
    const [shelfData, setShelfData] = useState([]);

    useEffect(() => {
        const fetchWarehouseData = async () => {
            const response = await warehouseById(warehouseId);
            setWarehouseData(response);
        };

        const fetchProductData = async () => {
            const response = await productsById(warehouseId);
            setProductData(Array.isArray(response) ? response : []);
        };

        const fetchShelfData = async () => {
            const response = await shelf();
            setShelfData(Array.isArray(response) ? response : []);
        };

        fetchWarehouseData();
        fetchProductData();
        fetchShelfData();
    }, [warehouseId]);

    const showModal = (id) => {
        setModalContent(`Warehouse ID: ${id}`);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (!warehouseData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Card title="รายละเอียดคลังสินค้า" style={{ marginBottom: 16 }}>
                <div><strong>ชื่อคลังสินค้า:</strong> {warehouseData.warehouseName}</div>
                <div><strong>วันที่สร้าง:</strong> {formatDate(warehouseData.createdAt)}</div>
                <div><strong>สถานะคลังสินค้า: </strong>
                    <span style={{ color: warehouseData.status === 'Open' ? 'darkblue' : warehouseData.status === 'Closed' ? 'red' : 'inherit' }}>
                        {warehouseData.status}
                    </span>
                </div>
            </Card>
            <Table
                columns={columns}
                dataSource={productData}
                pagination={false}
                expandable={{
                    expandedRowRender: (record) => (
                        <ProductDetailsTable
                            product={
                                shelfData.length > 0
                                    ? shelfData.map(detail => ({
                                        ...detail,
                                        key: detail.shelfId, // Ensure a unique key for each record
                                        shelfName: detail.shelfName
                                    }))
                                    : []
                            }
                            showModal={showModal}
                        />
                    ),
                    expandIcon: () => null,
                    expandedRowKeys: productData.map(record => record.key),
                    rowExpandable: () => true,
                }}
                style={{ marginTop: 16 }}
            />

            <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Button type="default" style={{ marginRight: 8 }} onClick={handleCancel}>ยกเลิก</Button>
                <Button type="primary">บันทึก</Button>
            </div>
            <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                cancelText="ปิด"
                closable={false}
                width={800}
                okButtonProps={{ style: { display: 'none' } }}
            >
                {modalContent && (
                    <div>
                        <Card title="รายละเอียดชั้นวาง" style={{ marginBottom: 16 }}>
                            <div><strong>ชื่อชั้นวาง:</strong> ชั้นวาง 1</div>
                            <div><strong>วันที่สร้าง:</strong> 01/08/2024</div>
                            <div><strong>สถานะคลังสินค้า:</strong> Open</div>
                        </Card>
                        <Card title="รายการสินค้า" style={{ marginBottom: 16 }} />
                        <Card title="รายการนำออก" style={{ marginBottom: 16 }} />
                    </div>
                )}
            </Modal>
        </>
    );
}
