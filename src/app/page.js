"use client";
import React from 'react';
import { Layout, Typography, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styled from 'styled-components';
import LoginForm from '../components/LoginForm';

const { Content } = Layout;
const { Paragraph } = Typography;

const FormContainer = styled.div`
  width: 100%;
  max-width: 350px;
  text-align: center;
  padding: 20px;
  background: #2a2a2a;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input-affix-wrapper {
    border-radius: 20px;
  }

  .login-form-button {
    width: 100%;
    border-radius: 20px;
  }
`;

const LoginPage = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
      <Head>
        <title>Login | Your App Name</title>
        <meta name="description" content="Login Create by GPT 555" />
      </Head>
      <Layout className="layout" style={{ minHeight: '100vh', backgroundColor: '#1E1E1E' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FormContainer>
            <div style={{ marginBottom: 24 }}>
              {/* <Image src="/logo.png" alt="Logo" width={241} height={55} /> */}
              <Paragraph style={{ color: '#DDDDDD', fontSize: 20, marginTop: 24 }}>
                Login Create by GPT 555
              </Paragraph>
            </div>
            <StyledForm
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="site-form-item-icon" />} 
                  placeholder="Username" 
                  aria-label="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                />
              </Form.Item>
              <Form.Item>
                <Link href="/forgot-password" passHref>
                  <span style={{ color: '#DDDDDD', cursor: 'pointer' }}>Forgot password</span>
                </Link>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
              </Form.Item>
            </StyledForm>
          </FormContainer>
        </Content>
      </Layout>
    </>
  );
};

export default LoginPage;
