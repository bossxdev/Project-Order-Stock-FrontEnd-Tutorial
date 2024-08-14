import React, { useState, useEffect } from 'react';
import { Table, Card, Radio, Button, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { warehouseById } from 'api/Warehouse';
import { productsById, updateProducts } from 'api/Products';
import { shelf } from 'api/Shelf';
import { exports } from 'api/Export';
import html2pdf from 'html2pdf.js';

const columns = [
    { title: 'รายการ', dataIndex: 'productName', key: 'productName' },
    { title: 'รหัสสินค้า', dataIndex: 'productId', key: 'productId' },
    { title: 'ราคา/หน่วย (บาท)', dataIndex: 'price', key: 'price' },
    { title: 'ยอดรวม (ชิ้น)', dataIndex: 'quantity', key: 'quantity' }
];

const productColumns = (selectedRadio, setSelectedRadio, showModal, index, shelfId) => [
    {
        key: 'shelfName',
        render: (_, record) => (
            <div>
                <Radio
                    checked={selectedRadio === record._id || shelfId === record._id}
                    onChange={() => setSelectedRadio(record._id, index)}
                    style={{ marginRight: 8 }}
                    disabled={shelfId === record._id} // Disable if another radio is already selected
                />
                <span onClick={() => showModal(record)} style={{ cursor: 'pointer' }}>
                    {record.shelfName}
                </span>
            </div>
        )
    }
];

const ProductDetailsTable = ({ product, showModal, setSelectedShelfId, index, shelfId }) => {
    const [selectedRadio, setSelectedRadio] = useState(shelfId || null);

    useEffect(() => {
        setSelectedShelfId(selectedRadio, index);
    }, [selectedRadio]);

    return (
        <Table
            columns={productColumns(selectedRadio, setSelectedRadio, showModal, index, shelfId)}
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
    const [exportData, setExportData] = useState([]);

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

        const fetchExportData = async () => {
            const response = await exports();
            setExportData(response);
        };

        fetchWarehouseData();
        fetchProductData();
        fetchShelfData();
        fetchExportData();
    }, [warehouseId]);

    const showModal = (record) => {
        const matchingProducts = productData.filter(product => product.shelfId === record._id);

        const formattedExports = exportData.map(exp => ({
            ...exp,
            createdAt: formatDate(exp.createdAt) // Format the createdAt date
        }));

        setModalContent({
            shelfName: record.shelfName,
            createdAt: formatDate(record.createdAt),
            status: record.status,
            products: matchingProducts,
            exports: formattedExports
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        router.push('/warehouse');
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    }

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

    const generatePDF = () => {
        const element = document.getElementById('modal-content'); // Capture the content by ID
        html2pdf().from(element).save(); // Convert and save as PDF
    };

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
                            shelfId={record.shelfId}  // Pass shelfId to check against the radio selection
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
                onCancel={handleModalCancel}
                cancelText="ปิด"
                closable={false}
                width={800}
                okButtonProps={{ style: { display: 'none' } }}
            >
                {modalContent && (
                    <div id="modal-content"> {/* Add ID here */}
                        <Card title="รายละเอียดชั้นวาง" style={{ marginBottom: 16 }}>
                            <div><strong>ชื่อชั้นวาง:</strong> {modalContent.shelfName}</div>
                            <div><strong>วันที่สร้าง:</strong> {modalContent.createdAt}</div>
                            <div><strong>สถานะคลังสินค้า: </strong>
                                <span style={{ color: modalContent.status === 'Open' ? 'darkblue' : modalContent.status === 'Closed' ? 'red' : 'inherit' }}>
                                    {modalContent.status}
                                </span>
                            </div>
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
                        <Card title="รายการนำออก" style={{ marginBottom: 16 }}>
                            <Table
                                columns={[
                                    { title: 'รหัสใบนำออก', dataIndex: 'exportId', key: 'exportId' },
                                    { title: 'วันที่สร้าง', dataIndex: 'createdAt', key: 'createdAt' }
                                ]}
                                dataSource={modalContent.exports}
                                pagination={false}
                                size="small"
                            />
                        </Card>
                    </div>
                )}
                {/* PDF Button */}
                <Button type="default" onClick={generatePDF}>พิมพ์</Button>
            </Modal>
        </>
    );
}
