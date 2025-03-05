'use client';

import { IServerItem } from "@/api/server";
import { ITeamReq, TreeNode } from "@/api/team";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Col, Select, Form, FormInstance, Modal, Row, TreeSelect, Input, Button } from "antd";
import { useState } from "react";

interface IModalAddProps {
    open: boolean;
    form: FormInstance<ITeamReq>;
    onClose: () => void;
    onSave: (request: ITeamReq) => Promise<void>;
    treeData: TreeNode[]
    servers: IServerItem[];
}

interface IMethodDataType {
    id: number;
    name: string;
}

const ModalAddTeam: React.FC<IModalAddProps> = ({ open, onClose, onSave, form, treeData, servers }) => {
    const [valueParent, setValueParent] = useState<string>();

    const onChangeParent = (newValue: string) => {
        setValueParent(newValue);
    };

    const handleSubmit = async (values: ITeamReq) => {
        try {
            await onSave(values);
        } catch (errors) {
            console.error(errors);
        }
    }; 

    const clearFieldError = (fieldName: keyof ITeamReq) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };
    return (
        <Modal 
            title="ADD TEAM" 
            open={open}  
            width={1020}
            onCancel={onClose}
            footer={null}
        >
           <CustomFormStyled form={form} onFinish={handleSubmit} layout="vertical">
                <Row gutter={[32, 32]}>
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
                <Button size="large" htmlType="submit" className="bg-primary text-black mt-3 w-full">SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    );
}

export default ModalAddTeam;