import React, { useEffect } from 'react';
import { Form, Input, Modal } from "antd";

export default function EditModal({ visible, onCreate, onCancel, productName, productId }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                productName,
                productId,
            });
        }
    }, [visible, productName, productId, form]);

    return (
        <Modal
            visible={visible}
            title="แก้ไขสินค้า"
            okText="แก้ไข"
            cancelText="ยกเลิก"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('ตรวจสอบฟอร์มล้มเหลว:', info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="form_in_modal">
                <Form.Item
                    name="productName"
                    label="ชื่อสินค้า"
                    rules={[{ required: true, message: 'กรุณาใส่ชื่อสินค้า!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="productId"
                    label="รหัสสินค้า"
                    rules={[{ required: true, message: 'กรุณาใส่รหัสสินค้า!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="price"
                    label="ราคา"
                    rules={[{ required: true, message: 'กรุณาใส่ราคา!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name="quantity"
                    label="จำนวน"
                    rules={[{ required: true, message: 'กรุณาใส่จำนวน!' }]}
                >
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
