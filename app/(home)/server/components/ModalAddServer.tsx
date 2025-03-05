import { IServerReq } from "@/api/server";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Col, Form, FormInstance, Modal, Row, Input, Button } from "antd";

interface ModalServerProps {
    open: boolean;
    form: FormInstance<IServerReq>;
    onClose: () => void;
    onSave: (request: IServerReq) => Promise<void>;
}

const ModalAddServer: React.FC<ModalServerProps> = ({ open, onClose, onSave, form }) => {

    const handleSubmit = async (values: IServerReq) => {
        try {
            await onSave(values);
        } catch (errors) {
            console.error(errors);
        }
    };

    const clearFieldError = (fieldName: keyof IServerReq) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };

    return (
        <Modal 
            title="ADD SERVER" 
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
                        <Form.Item name="ip" label="IP" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('ip')} className="mt-2" autoComplete="off" placeholder="Enter ip" />
                        </Form.Item>
                    </Col>   
                    <Col span={12}>
                        <Form.Item name="username" label="Username" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('username')} className="mt-2" autoComplete="off" placeholder="Enter username" />
                        </Form.Item>
                    </Col>   
                    <Col span={12}>
                        <Form.Item name="password" label="Password" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('password')} className="mt-2" autoComplete="off" placeholder="Enter password" />
                        </Form.Item>
                    </Col>   
                </Row>
                <Button size="large" htmlType="submit" className="bg-primary text-black mt-3 w-full">SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    );
}

export default ModalAddServer;