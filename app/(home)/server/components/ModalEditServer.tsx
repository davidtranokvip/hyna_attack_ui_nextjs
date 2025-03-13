import { IServerItem, IServerReq } from "@/api/server";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";


interface IModalServerProps {
    open: boolean;
    item: IServerItem;
    error: string; 
    onClose: () => void;
    onSave: (request: IServerItem) => Promise<void>;
}
const ModalEditServer: React.FC<IModalServerProps> = ({ error, open, item, onClose, onSave }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    useEffect(() => {
        if (!open) {
            setIsSubmitting(false);
        }
    }, [open]);
    useEffect(() => {
            if (open && item ) {
                form.setFieldsValue({   
                    id: item.id,
                    name: item.name,
                    ip: item.ip,
                    username: item.username,
                    password: item.password,
                    thread: item.thread,
                });
            }
    }, [item, form, open]);

    useEffect(() => {
        if (error) {
            const errorObj = typeof error === 'string' ? JSON.parse(error) : error;
            Object.entries(errorObj).forEach(([field, message]) => {
                form.setFields([{
                    name: field,
                    errors: [message as string],
                }]);
            });
        }
    }, [error, form]);

    const handleSubmit = async (formValues: IServerItem) => {
        setIsSubmitting(true);
        try {
                const values = { ...formValues, id: item.id };
                await onSave(values);
            
        } catch (error) {
                console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const clearFieldError = (fieldName: keyof IServerReq) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };

    return (
        <Modal 
            title="EDIT SERVER" 
            open={open}  
            width={1020}
            onCancel={onClose}
            footer={null}
        >
           <CustomFormStyled form={form} onFinish={handleSubmit} layout="vertical">
                <Row gutter={[32, 32]}>
                    <Col span={12}>
                            <Form.Item name="name" label="Name Server" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                                <Input size='large' onChange={() => clearFieldError('name')} className="mt-2" autoComplete="off" placeholder="Enter name sever" />
                            </Form.Item>
                    </Col>   
                    <Col span={12}>
                        <Form.Item name="thread" label="Thread" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('thread')} className="mt-2" autoComplete="off" placeholder="Enter thread" />
                        </Form.Item>
                    </Col>   
                    <Col span={8}>
                        <Form.Item name="ip" label="IP" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('ip')} className="mt-2" autoComplete="off" placeholder="Enter ip" />
                        </Form.Item>
                    </Col>   
                    <Col span={8}>
                        <Form.Item name="username" label="Username" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('username')} className="mt-2" autoComplete="off" placeholder="Enter username" />
                        </Form.Item>
                    </Col>   
                    <Col span={8}>
                        <Form.Item name="password" label="Password" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('password')} className="mt-2" autoComplete="off" placeholder="Enter password" />
                        </Form.Item>
                    </Col>   
                </Row>
                <Button size="large" htmlType="submit" className="bg-primary text-black mt-3 w-full" iconPosition="end" loading={isSubmitting} disabled={isSubmitting}>SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    )
}

export default ModalEditServer;