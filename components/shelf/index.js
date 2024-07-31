import React, {useState} from 'react';
import {Table, Card, Radio, Button} from 'antd';
import {useRouter} from "next/router";

// Main table columns
const columns = [
    {
        title: 'รายการ',
        dataIndex: 'item',
        key: 'item',
    },
    {
        title: 'รหัสสินค้า',
        dataIndex: 'productCode',
        key: 'productCode',
    },
    {
        title: 'ราคา/หน่วย (บาท)',
        dataIndex: 'pricePerUnit',
        key: 'pricePerUnit',
    },
    {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'ยอดรวม (ชิ้น)',
        dataIndex: 'totalQuantity',
        key: 'totalQuantity',
    }
];

// Data for the main table
const data = [
    {
        key: '1',
        item: 'Product A',
        productCode: 'P001',
        pricePerUnit: 100,
        status: 'In Stock',
        totalQuantity: 50,
        productDetails: [
            {key: '1', stock: 'Stock 1'},
            {key: '2', stock: 'Stock 2'},
        ]
    },
    {
        key: '2',
        item: 'Product B',
        productCode: 'P002',
        pricePerUnit: 150,
        status: 'Out of Stock',
        totalQuantity: 0,
        productDetails: [
            {key: '1', stock: 'Stock 3'},
            {key: '2', stock: 'Stock 4'},
        ]
    }
];

// Sub-table columns
const productColumns = (selectedRadio, handleRadioChange) => [
    {
        title: '',
        key: 'select',
        render: (_, record) => (
            <div>
                <Radio
                    checked={selectedRadio === record.key}
                    onChange={() => handleRadioChange(record.key)}
                />
                {` ${record.stock}`}
            </div>
        ),
    }
];

const ProductDetailsTable = ({product}) => {
    const [selectedRadio, setSelectedRadio] = useState(null);

    const handleRadioChange = (key) => {
        setSelectedRadio(key);
    };

    return (
        <Table
            columns={productColumns(selectedRadio, handleRadioChange)}
            dataSource={product}
            pagination={false}
            showHeader={false}  // Hide the header row
            size="small"
            style={{margin: '0'}}
        />
    );
};

export default function ShelfPage() {
    const router = useRouter()

    const handleCancel = () => {
        router.push('/warehouse'); // Navigate to the home route
    };

    return (
        <>
            <Card title="รายละเอียดคลังสินค้า" style={{marginBottom: 16}}>
                <div><strong>ชื่อคลังสินค้า:</strong> คลังสินค้า A</div>
                <div><strong>วันที่สร้าง:</strong> 01/08/2024</div>
                <div><strong>สถานะคลังสินค้า:</strong> Open</div>
            </Card>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                expandable={{
                    expandedRowRender: (record) => <ProductDetailsTable product={record.productDetails}/>,
                    expandIcon: () => null, // Hides the expand/collapse icon
                    expandedRowKeys: data.map(record => record.key), // Expand all rows by default
                    rowExpandable: () => true, // Make all rows expandable
                }}
                style={{marginTop: 16}}
            />
            <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Button type="default" style={{ marginRight: 8 }} onClick={handleCancel}>ยกเลิก</Button>
                <Button type="primary">บันทึก</Button>
            </div>
        </>
    );
}
