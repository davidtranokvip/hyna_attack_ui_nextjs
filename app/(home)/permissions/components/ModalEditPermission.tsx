import { IPermissionItem, IPermissionReq } from "@/api/permissions";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Col, Form, Modal, Row, Input, Button } from "antd";
import { useEffect, useState } from "react";

interface IModalPermissionProps {
    open: boolean;
    item: IPermissionItem;
    error: string; 
    onClose: () => void;
    onSave: (request: IPermissionItem) => Promise<void>;
}

const ModalEditPermission: React.FC<IModalPermissionProps> = ({ error, open, item, onClose, onSave }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (open && item ) {
            form.setFieldsValue({   
                id: item.id,
                name: item.name,
                route: item.route,
                module: item.module,
            });
        }
    }, [item, form, open]);

    useEffect(() => {
        if (!open) {
            setIsSubmitting(false);
        }
    }, [open]);

    useEffect(() => {
        if (error) {
            Object.entries(error).forEach(([field, message]) => {
                form.setFields([{
                    name: field,
                    errors: [message]
                }]);
            });
        }
    }, [error, form]);

    const handleSubmit = async (formValues: IPermissionItem) => {
        setIsSubmitting(true);
        
        try {
            const values = { ...formValues, id: item.id };
            await onSave(values);
        } catch (error) {
            console.error('Error updating permission:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const clearFieldError = (fieldName: keyof IPermissionReq) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };

    return (
        <Modal 
            title="EDIT PERMISSION" 
            open={open}  
            width={1020}
            onCancel={onClose}
            footer={null}
        >
           <CustomFormStyled form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={[32, 32]}>
                    <Col span={12}>
                            <Form.Item name="name" label="Permissions Name" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                                <Input size='large' onChange={() => clearFieldError('name')} className="mt-2" autoComplete="off" placeholder="Enter permission" />
                            </Form.Item>
                    </Col>   
                    <Col span={12}>
                        <Form.Item name="route" label="Route" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('route')} className="mt-2" autoComplete="off" placeholder="Enter route" />
                        </Form.Item>
                    </Col>   
                    <Col span={24}>
                        <Form.Item name="module" label="Module" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('module')} className="mt-2" autoComplete="off" placeholder="Enter module" />
                        </Form.Item>
                    </Col>   
                </Row>
                <Button size="large" htmlType="submit" className="bg-primary text-black mt-3 w-full" iconPosition="end" loading={isSubmitting} disabled={isSubmitting}>SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    )
}

export default ModalEditPermission;