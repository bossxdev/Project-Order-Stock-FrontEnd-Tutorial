import React, { useState, useEffect } from 'react';
import { Table, Card, Radio, Button, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { warehouseById } from 'api/Warehouse';
import { productsById, updateProducts } from 'api/Products';
import { shelf } from 'api/Shelf';

const columns = [
    { title: 'รายการ', dataIndex: 'productName', key: 'productName' },
    { title: 'รหัสสินค้า', dataIndex: 'productId', key: 'productId' },
    { title: 'ราคา/หน่วย (บาท)', dataIndex: 'pricePerUnit', key: 'pricePerUnit' },
    { title: 'สถานะ', dataIndex: 'status', key: 'status' },
    { title: 'ยอดรวม (ชิ้น)', dataIndex: 'quantity', key: 'quantity' }
];

const productColumns = (selectedRadio, setSelectedRadio, showModal, index) => [
    {
        key: 'shelfName',
        render: (_, record) => (
            <div>
                <Radio
                    checked={selectedRadio === record._id}
                    onChange={() => setSelectedRadio(record._id, index)}
                    style={{ marginRight: 8 }}
                />
                <span onClick={() => showModal(record)} style={{ cursor: 'pointer' }}>
                    {record.shelfName}
                </span>
            </div>
        )
    }
];

const ProductDetailsTable = ({ product, showModal, selectedShelfIds, setSelectedShelfId, index }) => {
    const [selectedRadio, setSelectedRadio] = useState(selectedShelfIds[index] || null);

    useEffect(() => {
        setSelectedShelfId(selectedRadio, index);
    }, [selectedRadio]);

    return (
        <Table
            columns={productColumns(selectedRadio, setSelectedRadio, showModal, index)}
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
    return date.toLocaleDateString('en-CA');
};

export default function ShelfPage({ warehouseId }) {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [warehouseData, setWarehouseData] = useState(null);
    const [productData, setProductData] = useState([]);
    const [shelfData, setShelfData] = useState([]);
    const [selectedShelfIds, setSelectedShelfIds] = useState({});

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

    const showModal = (record) => {
        // Filter products that match the selected shelfId
        const matchingProducts = productData.filter(product => product.shelfId === record._id);

        setModalContent({
            shelfName: record.shelfName,
            createdAt: formatDate(record.createdAt),
            status: record.status,
            products: matchingProducts,
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = async () => {
        if (productData.length > 0) {
            let updateResponse;

            for (let i = 0; i < productData.length; i++) {
                const productId = productData[i]._id;
                const selectedShelfId = selectedShelfIds[i];
                updateResponse = await updateProducts(productId, { shelfId: selectedShelfId });

                // Update the productData state with the new shelfId
                if (updateResponse) {
                    setProductData(prevProductData =>
                        prevProductData.map(product =>
                            product._id === productId ? { ...product, shelfId: selectedShelfId } : product
                        )
                    );
                }
            }

            if (updateResponse) {
                message.success("บันทึกข้อมูลชั้นวางสำเร็จ!");
            } else {
                message.error("บันทึกข้อมูลชั้นวางไม่สำเร็จ");
            }
        }
    };

    const setSelectedShelfId = (shelfId, index) => {
        setSelectedShelfIds((prev) => ({ ...prev, [index]: shelfId }));
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
                    expandedRowRender: (record, index) => (
                        <ProductDetailsTable
                            product={shelfData.length > 0 ? shelfData.map(detail => ({ ...detail, key: detail._id, shelfName: detail.shelfName })) : []}
                            showModal={showModal}
                            selectedShelfIds={selectedShelfIds}
                            setSelectedShelfId={setSelectedShelfId}
                            index={index}
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
                <Button type="primary" onClick={handleSave}>บันทึก</Button>
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
                            <div><strong>ชื่อชั้นวาง:</strong> {modalContent.shelfName}</div>
                            <div><strong>วันที่สร้าง:</strong> {modalContent.createdAt}</div>
                            <div><strong>สถานะคลังสินค้า:</strong> {modalContent.status}</div>
                        </Card>
                        <Card title="รายการสินค้า" style={{ marginBottom: 16 }}>
                            <Table
                                columns={[
                                    { title: 'ชื่อสินค้า', dataIndex: 'productName', key: 'productName' },
                                    { title: 'จำนวน', dataIndex: 'quantity', key: 'quantity' }
                                ]}
                                dataSource={modalContent.products}
                                pagination={false}
                                size="small"
                            />
                        </Card>
                    </div>
                )}
            </Modal>
        </>
    );
}
