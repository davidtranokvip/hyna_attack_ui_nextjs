import { IServerItem } from "@/api/server";
import { ITeamItem, TreeNode } from "@/api/team";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Col, Form, Modal, Row, Input, TreeSelect, Select, Button } from "antd";
import { useEffect, useState } from "react";

interface IModalPermissionProps {
    open: boolean;
    item: ITeamItem;
    error: string; 
    onClose: () => void;
    onSave: (request: ITeamItem) => Promise<void>;
    treeData: TreeNode[],
    servers: IServerItem[];
}

interface IMethodDataType {
    id: number;
    name: string;
}

const ModalEditTeam: React.FC<IModalPermissionProps> = ({ error, open, item, onClose, onSave, treeData, servers }) => {

    const [form] = Form.useForm<ITeamItem>();
    const [valueParent, setValueParent] = useState<string>();

    const onChangeParent = (newValue: string) => {
        setValueParent(newValue);
    };

    useEffect(() => {
        if (open && item) {
            form.setFieldsValue({   
                id: item.id,
                name: item.name,
                parent_id: item.parent_id,
                servers: item.servers,
            });
        }
    }, [open, item, form]);

    useEffect(() => {
        if (error) {
            Object.entries(error).forEach(([field, message]) => {
                form.setFields([{
                    name: field as keyof ITeamItem,
                    errors: [message]
                }]);
            });
        }
    }, [error, form]);

    const handleSubmit = (formValues: ITeamItem) => {
            const values = { ...formValues, id: item.id };
            onSave(values);
    }

    const clearFieldError = (fieldName: keyof ITeamItem) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };

    return (
        <Modal 
            title="EDIT TEAM" 
            open={open}  
            width={1020}
            onCancel={onClose}
            footer={null}
        >
           <CustomFormStyled form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={[32, 16]} className="mb-4 px-2">
                    <Col span={12}>
                    <Form.Item name="name" label="Name Team" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                        <Input size='large' onChange={() => clearFieldError('name')} className="mt-2" autoComplete="off" placeholder="Enter Team" />
                    </Form.Item>
                </Col>   
                <Col span={12}>
                    <Form.Item name="parent_id" label="Parent" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                        <TreeSelect
                            showSearch
                            value={valueParent}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="Enter Parent"
                            allowClear
                            treeDefaultExpandAll
                            onChange={onChangeParent}
                            treeData={treeData}
                            />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item name="servers" label="Server" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                        <Select showSearch placeholder="Enter server" mode="multiple" allowClear>
                                {servers && servers.length > 0 ? (
                                    servers.map((item: IMethodDataType, index: number) => (
                                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                    ))
                                ) : (
                                    <Select.Option disabled>No servers available</Select.Option>
                                )}
                        </Select>
                    </Form.Item>
                </Col>   
            </Row>  
            <Button size="large" htmlType="submit" className="bg-primary text-black w-full">SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    );
}

export default ModalEditTeam;