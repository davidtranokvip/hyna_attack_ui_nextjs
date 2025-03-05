'use client';

import { IPermissionId, IPermissionItem } from "@/api/permissions";
import { ITeamItem } from "@/api/team";
import { IUserItem } from "@/api/users";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Button, Col, Form, Input, Modal, Row, Select, Switch } from "antd";
import { useEffect, useState } from "react";

interface IModalUserProps {
    open: boolean;
    error: string; 
    item: IUserItem;
    onClose: () => void;
    onSave: (request: IUserItem) => Promise<void>;
    permissions: IPermissionItem[];
    teamData: ITeamItem[]; 
}


const ModalEditUser: React.FC<IModalUserProps> = ({ error, open, onClose, onSave, item, permissions, teamData }) => {

    const [form] = Form.useForm<IUserItem>();
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<IPermissionId[]>([]);

    useEffect(() => {
            if (open && item) {
                form.setFieldsValue({   
                    id: item.id,
                    email: item.email,
                    password: item.rawPassword,
                    nameAccount: item.nameAccount,
                    team_id: item.team_id,
                });

                if (item.permissions && item.permissions.length > 0) {
                    setSelectedPermissionIds(item.permissions);
                } else {
                    setSelectedPermissionIds([]);
                }
            }
    }, [open, item, form]);

    useEffect(() => {
        if (error) {
            Object.entries(error).forEach(([field, message]) => {
                form.setFields([{
                    name: field as keyof IUserItem,
                    errors: [message]
                }]);
            });
        }
    }, [error, form]);
    const handleTogglePermission = (permissionId: number, checked: boolean) => {
        if (checked) {
            setSelectedPermissionIds(prev => [...prev, { id: permissionId }]);
        } else {
            setSelectedPermissionIds(prev => prev.filter(item => item.id !== permissionId));
        }
    };
    console.log(selectedPermissionIds);
    const isPermissionSelected = (permissionId: number): boolean => {
        return selectedPermissionIds.some(item => item.id === permissionId);
    };

    const handleSubmit = (formValues: IUserItem) => {
        onSave({
            ...formValues,
            permissions: selectedPermissionIds,
            id: item.id
        });
    }

    const clearFieldError = (fieldName: keyof IUserItem) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };

    return (
        <Modal 
            title="EDIT USER" 
            open={open}  
            width={1020}
            onCancel={onClose}
            footer={null}
        >
           <CustomFormStyled form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={[32, 16]} className="mb-4 px-2">
                    <Col span={12}>
                        <Form.Item name="email" label="Email" className="font-bold text-primary text-[30px] leading-[normal] mb-0" >
                            <Input size='large' onChange={() => clearFieldError('email')} autoComplete="off" className="mt-2" placeholder="Enter email" />
                        </Form.Item>
                    </Col>   
                    <Col span={12}>
                        <Form.Item name="password" label="Password" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('password')} autoComplete="off" className="mt-2" placeholder="Enter password" />
                        </Form.Item>
                    </Col>   
                    <Col span={12}>
                        <Form.Item name="nameAccount" label="Name" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input size='large' onChange={() => clearFieldError('nameAccount')} autoComplete="off" className="mt-2" placeholder="Enter name account" />
                        </Form.Item>
                    </Col>   
                    <Col span={12}>
                        <Form.Item name="team_id" label="Team" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Select size='large' showSearch placeholder="Select Team" allowClear>
                                {teamData
                                    .filter((item: ITeamItem) => item.parent_id !== null)
                                    .map((item: ITeamItem, index: number) => (
                                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> 
                    <Col span={24}>
                        <h3 className="text-primary text-lg mb-2">Permissions</h3>
                        <Row gutter={[16, 16]}>
                            {permissions.map(permission => {
                                if (!permission.id) return null;
                                return (
                                    <Col span={8} key={permission.id}>
                                        <div className="flex items-center justify-between p-2 border border-[#444444] rounded">
                                            <div>
                                                <div className="text-white">{permission.name}</div>
                                                <div className="text-gray-400 text-sm">
                                                    {permission.route}
                                                </div>
                                            </div>
                                            <Switch
                                                checked={isPermissionSelected(permission.id)}
                                                onChange={(checked) => handleTogglePermission(permission.id,  checked)}
                                                className="bg-[#444444]"
                                            />
                                        </div>
                                    </Col>
                                )}
                            )}
                        </Row>
                    </Col>  
                </Row>
                <Button htmlType="submit" size="large" className="bg-primary text-black mt-3 w-full">SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    );
}

export default ModalEditUser;