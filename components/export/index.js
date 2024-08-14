import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Checkbox, Input, InputNumber, message } from 'antd';
import { useRouter } from "next/router";
import { warehouseById } from 'api/Warehouse';
import { productsById, updateProducts } from 'api/Products';
import { createExports } from 'api/Export';

const { TextArea } = Input;

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
};

const generateDocumentNumber = () => {
    const random = Math.floor(Math.random() * 10000);
    return `QT2024-${random.toString().padStart(4, '0')}`;
};

export default function ExportPage({ warehouseId }) {
    const router = useRouter();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [warehouseData, setWarehouseData] = useState({ warehouseName: '', createdAt: '', status: '' });
    const [productsData, setProductsData] = useState([]);

    useEffect(() => {
        const fetchWarehouseData = async () => {
            const data = await warehouseById(warehouseId);
            setWarehouseData({
                warehouseName: data.warehouseName,
                createdAt: data.createdAt,
                status: data.status,
            });
        };

        const fetchProductsData = async () => {
            const data = await productsById(warehouseId);
            setProductsData(data.map((product, index) => ({
                key: String(index + 1),
                id: product._id,
                sequence: index + 1,
                productName: product.productName,
                quantity: product.quantity,
                outQuantity: product.outQuantity || 0,
                totalQuantity: product.quantity - (product.outQuantity || 0),
            })));
        };

        fetchWarehouseData();
        fetchProductsData();
    }, [warehouseId]);

    const handleCancel = () => {
        router.push('/warehouse');
    };

    const handleCheckboxChange = (key) => {
        setSelectedKeys(prevSelectedKeys => {
            const isSelected = prevSelectedKeys.includes(key);
            if (isSelected) {
                return prevSelectedKeys.filter(item => item !== key);
            } else {
                return [...prevSelectedKeys, key];
            }
        });
    };

    const handleOutQuantityChange = (value, key) => {
        setProductsData(prevData => prevData.map(item => {
            if (item.key === key) {
                if (value > item.quantity) {
                    message.error(`${item.productName} จำนวนสินค้านำออกมากกว่าจำนวนสินค้า`);
                    return {
                        ...item,
                        outQuantity: item.outQuantity,
                    };
                }
                return {
                    ...item,
                    outQuantity: value,
                    totalQuantity: item.quantity - value,
                };
            }
            return item;
        }));
    };

    const handleSave = async () => {
        try {
            const selectedProducts = productsData.filter(product => selectedKeys.includes(product.key));

            // Generate the document number
            const documentNumber = generateDocumentNumber();

            // Update each product's quantity
            await Promise.all(selectedProducts.map(product => {
                const updateData = { quantity: product.totalQuantity };
                return updateProducts(product.id, updateData);
            }));

            // Create the export record
            const exportData = {
                exportId: documentNumber
            };

            await createExports(exportData);

            message.success(`สร้างเอกสารใบนำออกสำเร็จ! ${documentNumber}`);
        } catch (error) {
            message.error("สร้างเอกสารใบนำออกไม่สำเร็จ!");
        }
    };

    const columns = [
        {
            title: 'ลำดับ',
            dataIndex: 'sequence',
            key: 'sequence',
            render: (text, record, index) => (
                <Checkbox onChange={() => handleCheckboxChange(record.key)}>
                    {index + 1}
                </Checkbox>
            )
        },
        { title: 'ชื่อสินค้า', dataIndex: 'productName', key: 'productName' },
        { title: 'จำนวนสินค้า', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'จำนวนสินค้านำออก',
            dataIndex: 'outQuantity',
            key: 'outQuantity',
            render: (text, record) => (
                <InputNumber
                    min={0}
                    max={record.quantity}
                    value={record.outQuantity}
                    onChange={(value) => handleOutQuantityChange(value, record.key)}
                />
            )
        },
        { title: 'จำนวนสินค้าคงเหลือ', dataIndex: 'totalQuantity', key: 'totalQuantity' }
    ];

    const totalQuantity = productsData.reduce((total, record) => {
        if (selectedKeys.includes(record.key)) {
            return total + record.totalQuantity;
        }
        return total;
    }, 0);

    const summaryRow = () => (
        <Table.Summary.Row>
            <Table.Summary.Cell colSpan={3} />
            <Table.Summary.Cell>
                <strong>ยอดรวมสุทธิ:</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell>{totalQuantity}</Table.Summary.Cell>
        </Table.Summary.Row>
    );

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
            <Table columns={columns} dataSource={productsData} pagination={false} style={{ marginTop: 16 }} summary={summaryRow} />
            <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Button type="default" style={{ marginRight: 8 }} onClick={handleCancel}>ยกเลิก</Button>
                <Button type="primary" onClick={handleSave}>บันทึก</Button>
            </div>
        </>
    );
}
