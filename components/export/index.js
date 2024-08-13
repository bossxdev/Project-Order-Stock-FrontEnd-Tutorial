import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Checkbox, Input, message } from 'antd';
import { useRouter } from "next/router";
import { exports, createExports } from 'api/Export';

const { TextArea } = Input;

export default function ExportPage() {
    const router = useRouter();
    const [exportData, setExportData] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [formData, setFormData] = useState({});


    const handleOk = () => {};
    const handleCancel = () => {
        router.push('/warehouse'); // Navigate to /shelf
    };

    // useEffect(() => {
    //     const fetchExportData = async () => {
    //         const response = await exportsById(warehouseId);
    //         setExportData(response);
    //     };

    // }, [warehouseId]);


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

    const handleSave = async () => {
        console.log("handleSave",selectedKeys.length);
        
        if (selectedKeys.length === 0) {
            message.warning('โปรดเลือกรายการสินค้าที่ต้องการบันทึก');
            return;
        }

        const createFormData = selectedKeys.map(key => ({
            productId: key,
            sequence: formData[key]?.sequence,
            quantity: formData[key]?.quantity,
            outQuantity: formData[key]?.outQuantity || 0,
            total: formData[key]?.totalQuantity,
            note: formData[key]?.note || ''
        }));

        console.log('createFormData', createFormData);

        // try {
        //     // เรียก API เพื่อบันทึกข้อมูลการนำสินค้าออกจากคลัง
        //     const response = await createExports(createFormData)

        //     if (response) {
        //         message.success('บันทึกข้อมูลสำเร็จ');
        //     } else {
        //         message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        //     }
        // } catch (error) {
        //     message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        //     console.error('Error:', error);
        // }
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

    const summaryRow = () => {
        const totalQuantity = data.reduce((total, record) => {
            if (selectedKeys.includes(record.key)) {
                return total + record.totalQuantity;
            }
            return total;
        }, 0);
    
        const discount = 0; // กำหนดค่าส่วนลดตามต้องการ
        const additionalTax = 0; // กำหนดค่าภาษีเพิ่มเติมตามต้องการ
    
        const totalAmount = totalQuantity - discount + additionalTax;
    
        return (
            <>
                <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={5} />
                    <Table.Summary.Cell>
                        <strong>ยอดรวมสุทธิ:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>{totalQuantity}</Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row style={{ border: 'none'  }}>
                    <Table.Summary.Cell colSpan={5} />
                    <Table.Summary.Cell>
                        <strong>ส่วนลด:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>{discount}</Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row style={{ border: 'none'  }}>
                    <Table.Summary.Cell colSpan={5} />
                    <Table.Summary.Cell>
                        <strong>ภาษีเพิ่มเติม:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>{additionalTax}</Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row style={{ border: 'none'  }}>
                    <Table.Summary.Cell colSpan={5} />
                    <Table.Summary.Cell>
                        <strong>ยอดรวมทั้งหมด:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>{totalAmount}</Table.Summary.Cell>
                </Table.Summary.Row>
            </>
        );
    };

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
            <div style={{ marginTop: 16 }}>
                <strong>หมายเหตุ:</strong>
                <Input.TextArea
                    rows={4}
                    value={additionalInfo}
                    onChange={e => setAdditionalInfo(e.target.value)}
                    placeholder=""
                />
            </div>
            <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Button type="default" style={{ marginRight: 10 }} onClick={handleCancel}>ปิด</Button>
                <Button type="primary" danger style={{ marginRight: 8 }} onClick={handleCancel}>ยกเลิก</Button>
                <Button type="primary" onClick={handleSave}>บันทึก</Button>
            </div>
        </>
    );
}