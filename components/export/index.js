import React, { useState } from 'react';
import { Table, Card, Button, Checkbox, Input } from 'antd';
import { useRouter } from "next/router";

const { TextArea } = Input;

export default function ExportPage() {
    const router = useRouter();
    const [selectedKeys, setSelectedKeys] = useState([]);

    const handleOk = () => {};
    const handleCancel = () => {
        router.push('/warehouse'); // Navigate to /shelf
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

    // Main table columns
    const columns = [
        {
            title: 'ลำดับ',
            dataIndex: 'sequence',
            key: 'sequence',
            render: (text, record, index) => <Checkbox onChange={() => handleCheckboxChange(record.key)}>{index + 1}</Checkbox>
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'จำนวนสินค้า',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'จำนวนสินค้านำออก',
            dataIndex: 'outQuantity',
            key: 'outQuantity',
        },
        {
            title: 'จำนวนสินค้าคงเหลือ',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
        },
        {
            title: 'หมายเหตุ',
            dataIndex: 'note',
            key: 'note',
            render: () => <TextArea rows={1} />
        }
    ];

// Data for the main table
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
                <div><strong>ชื่อคลังสินค้า:</strong> คลังสินค้า A</div>
                <div><strong>วันที่สร้าง:</strong> 01/08/2024</div>
                <div><strong>สถานะคลังสินค้า:</strong> Open</div>
            </Card>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                style={{ marginTop: 16 }}
                summary={summaryRow}
            />
            <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Button type="default" style={{ marginRight: 8 }} onClick={handleCancel}>ยกเลิก</Button>
                <Button type="primary">บันทึก</Button>
            </div>
        </>
    );
}