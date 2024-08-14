import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Checkbox, Input } from 'antd';
import { useRouter } from "next/router";
import { warehouseById } from 'api/Warehouse'; // Make sure to replace with the actual path

const { TextArea } = Input;

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
};

export default function ExportPage({ warehouseId }) {
    const router = useRouter();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [warehouseData, setWarehouseData] = useState({ warehouseName: '', createdAt: '', status: '' });

    useEffect(() => {
        const fetchWarehouseData = async () => {
            const data = await warehouseById(warehouseId); // Assuming you are passing the warehouse ID via URL query
            setWarehouseData({
                warehouseName: data.warehouseName,
                createdAt: data.createdAt,
                status: data.status,
            });
        };

        fetchWarehouseData();
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
        { title: 'จำนวนสินค้านำออก', dataIndex: 'outQuantity', key: 'outQuantity' },
        { title: 'จำนวนสินค้าคงเหลือ', dataIndex: 'totalQuantity', key: 'totalQuantity' },
        {
            title: 'หมายเหตุ',
            dataIndex: 'note',
            key: 'note',
            render: () => <TextArea rows={1} />
        }
    ];

    const data = [
        {
            key: '1',
            sequence: 1,
            productName: 'Product A',
            quantity: 200,
            outQuantity: 100,
            totalQuantity: 100,
        },
        {
            key: '2',
            sequence: 2,
            productName: 'Product B',
            quantity: 100,
            outQuantity: 50,
            totalQuantity: 50,
        }
    ];

    const totalQuantity = data.reduce((total, record) => {
        if (selectedKeys.includes(record.key)) {
            return total + record.totalQuantity;
        }
        return total;
    }, 0);

    const summaryRow = () => (
        <Table.Summary.Row>
            <Table.Summary.Cell colSpan={5} />
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
            <Table columns={columns} dataSource={data} pagination={false} style={{ marginTop: 16 }} summary={summaryRow} />
            <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Button type="default" style={{ marginRight: 8 }} onClick={handleCancel}>ยกเลิก</Button>
                <Button type="primary">บันทึก</Button>
            </div>
        </>
    );
}
