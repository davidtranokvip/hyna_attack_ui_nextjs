"use client";
import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/shared/lib/auth';
import ParticlesAnimation from '@/components/elements/ParticlesAnimation';
import { IUpdateReq, updatePassword } from '@/api/auth';
import NoticePass from "@/components/notice/NoticePass";
import { useRouter } from 'next/navigation';

const ChangePasswordPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [success, setSuccess] = useState(""); 

    const onFinish = async (formValues: IUpdateReq) => {
        try {
            setLoading(true);

            const result = await updatePassword(formValues);
            if (result.status === 'success') {
                setSuccess(result.message);
                form.resetFields();
                setTimeout(() => {
                    router.push("/");
                  }, 1500);
            }
        } catch (error: any) {
            Object.keys(error).forEach((field) => {
                form.setFields([{
                name: field as keyof IUpdateReq,
                errors: [error[field]]
                }]);
            });
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden h-full inner-body">
            <div className="content-body h-full flex flex-col justify-center items-center">
                <ParticlesAnimation />
                {success && (
                    <NoticePass success={success} setSuccess={setSuccess} myClass="text-8xl"/>
                )}
                <div className="mx-auto p-8 relative w-full max-w-2xl mb-6">
                    <Card title='Change Your Password' className="text-center">
                        <div className="text-center mb-6">
                            {user && <p className="text-gray-500 text-base">Account: {user.nameAccount}</p>}
                        </div>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            layout="vertical"
                            requiredMark={false}
                        >
                            <Form.Item name="currentPassword" label="Current Password"
                                rules={[
                                        {
                                            required: true,
                                            message: 'Required',
                                        },
                                ]}> 
                                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Current Password" size="large" />
                            </Form.Item>

                            <Form.Item name="newPassword" label="New Password" hasFeedback 
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                    {
                                        min: 8,
                                        message: 'Password must be at least 8 characters',
                                    },
                                ]}
                            >
                                <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="New Password"
                                size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="repeatPassword"
                                label="Repeat Password"
                                dependencies={['newPassword']}
                                hasFeedback
                                rules={[
                                {
                                    required: true,
                                    message: 'Required',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match'));
                                    },
                                }),
                                ]}
                            >
                                <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Repeat Password"
                                size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    size='large'
                                    htmlType="submit"
                                    iconPosition="end" loading={loading} disabled={loading}
                                    className="w-full mt-4"
                                >
                                Change Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;