import React from 'react'
import {Card, Col, Row, Form, Input, Checkbox, Button} from 'antd'
import {useRouter} from 'next/router'

const Login = (props) => {
    const router = useRouter()
    const onFinish = async (values) => {
        console.log(values)
        await router.push(`/warehouse`)
    }

    return (
        <Row>
            <Col span={8}/>
            <Col span={8}>
                <Card style={{width: '100%'}}>
                    <Form
                        name="loginForm"
                        layout="vertical"
                        initialValues={{
                            remember: true,
                            username: 'inpangxm@gmail.com',
                            password: '12345678'
                        }}
                        onFinish={onFinish}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {required: true, message: 'Please input your username!'}
                            ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {required: true, message: 'Please input your password!'}
                            ]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{width: '100%'}}>
                                SIGN IN
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col span={8}/>
        </Row>
    )
}

export default Login
