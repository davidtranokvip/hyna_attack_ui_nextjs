import { IPermissionReq } from "@/api/permissions";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Button, Col, Form, FormInstance, Input, Modal, Row } from "antd";

interface IModalPermissionProps {
    open: boolean;
    form: FormInstance<IPermissionReq>;
    onClose: () => void;
    onSave: (request: IPermissionReq) => Promise<void>;
}

const ModalAddPermission: React.FC<IModalPermissionProps> = ({ open, onClose, onSave, form }) => {
    
    const handleSubmit = async (values: IPermissionReq) => {
        try {
            await onSave(values);
        } catch (errors) {
            console.error(errors);
        }
    };

    const clearFieldError = (fieldName: keyof IPermissionReq) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };


    return (
        <Modal 
            title="ADD PERMISSION" 
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
                <Button size="large" htmlType="submit" className="bg-primary text-black mt-3 w-full">SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    )
}

export default ModalAddPermission;