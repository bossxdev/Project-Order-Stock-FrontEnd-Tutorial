import React, {useState} from 'react';
import {Table, Card, Radio, Button, Modal} from 'antd';
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
const productColumns = (selectedRadio, handleRadioChange, showModal) => [
    {
        title: '',
        key: 'select',
        render: (_, record) => (
            <div>
                <Radio
                    checked={selectedRadio === record.key}
                    onChange={() => handleRadioChange(record.key)}
                />
                <span
                    onClick={() => showModal(record.key)}
                    style={{cursor: 'pointer', marginLeft: 8}}
                >
          {` ${record.stock}`}
        </span>
            </div>
        ),
    }
];

const ProductDetailsTable = ({product, showModal}) => {
    const [selectedRadio, setSelectedRadio] = useState(null);

    const handleRadioChange = (key) => {
        setSelectedRadio(key);
    };

    return (
        <Table
            columns={productColumns(selectedRadio, handleRadioChange, showModal)}
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const showModal = (id) => {
        setModalContent(`Warehouse ID: ${id}`);
        setIsModalVisible(true);
    };

    const handleOk = () => {
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                    expandedRowRender: (record) => <ProductDetailsTable product={record.productDetails}
                                                                        showModal={showModal}/>,
                    expandIcon: () => null, // Hides the expand/collapse icon
                    expandedRowKeys: data.map(record => record.key), // Expand all rows by default
                    rowExpandable: () => true, // Make all rows expandable
                }}
                style={{marginTop: 16}}
            />
            <div style={{position: 'fixed', bottom: 16, right: 16}}>
                <Button type="default" style={{marginRight: 8}} onClick={handleCancel}>ยกเลิก</Button>
                <Button type="primary">บันทึก</Button>
            </div>
            <Modal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                closable={false}
                width={800}
            >
                {modalContent && (
                    <div>
                        <Card title="รายละเอียดชั้นวาง" style={{marginBottom: 16}}>
                            <div><strong>ชื่อชั้นวาง:</strong> ชั้นวาง 1</div>
                            <div><strong>วันที่สร้าง:</strong> 01/08/2024</div>
                            <div><strong>สถานะคลังสินค้า:</strong> Open</div>
                        </Card>
                        <Card title="รายการสินค้า" style={{marginBottom: 16}}/>
                        <Card title="รายการนำออก" style={{marginBottom: 16}}/>
                    </div>
                )}
            </Modal>
        </>
    );
}
