'use client';

import { IPermissionId, IPermissionItem } from "@/api/permissions";
import { ITeamItem } from "@/api/team";
import { IUserReq } from "@/api/users";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Button, Col, Form, FormInstance, Input, Modal, Row, Select, Switch, TimePicker } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { GiEntryDoor, GiExitDoor } from "react-icons/gi";

interface IModalUserProps {
    open: boolean;
    form: FormInstance;
    onClose: () => void;
    onSave: (request: IUserReq) => Promise<void>;
    permissions: IPermissionItem[];
    teamData: ITeamItem[];
    serverData: any[];
    selectedTeamId: number | null;
    onTeamChange: (teamId: number) => void;
}

const ModalAddUser: React.FC<IModalUserProps> = ({ open, onClose, onSave, form, permissions, teamData, serverData, selectedTeamId, onTeamChange  }) => {
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<IPermissionId[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const timeFormat = 'HH:mm';

    useEffect(() => {
        if (!open) {
            setSelectedPermissionIds([]);
            setSelectedTeam(null);
            setIsSubmitting(false);
        }
    }, [open]);

    useEffect(() => {
        if (selectedTeam !== null) {
            form.setFieldsValue({
                server_id: undefined,
                thread: ''
            });
        }
    }, [selectedTeam, form]);

    const handleTogglePermission = (permissionId: number, checked: boolean) => {
        if (checked) {
            setSelectedPermissionIds(prev => [...prev, { id: permissionId }]);
        } else {
            setSelectedPermissionIds(prev => prev.filter(item => item.id !== permissionId));
        }
    };
    
    const isPermissionSelected = (permissionId: number): boolean => {
        return selectedPermissionIds.some(item => item.id === permissionId);
    };
    
    const handleTeamChange = (value: number) => {
        onTeamChange(value);
        form.setFieldsValue({
            server_id: undefined,
            thread: undefined
        });
        clearFieldError('server_id');
        clearFieldError('thread');
    };

    const handleSubmit = async (values: IUserReq) => {
        setIsSubmitting(true);

        const formattedValues = {
            ...values,
            permissions: selectedPermissionIds,
            entryTime: values.entryTime && dayjs.isDayjs(values.entryTime) 
                ? values.entryTime.format(timeFormat) 
                : values.entryTime,
            exitTime: values.exitTime && dayjs.isDayjs(values.exitTime) 
                ? values.exitTime.format(timeFormat) 
                : values.exitTime
        };

        try {
            await onSave(formattedValues);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearFieldError = (fieldName: keyof IUserReq) => {
        form.setFields([{
            name: fieldName as string,
            errors: []
        }]);
    };

    return (
        <Modal 
            title="ADD USER" 
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
                    <Form.Item name="nameAccount" label="Name" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                        <Input size='large' onChange={() => clearFieldError('nameAccount')} autoComplete="off" className="mt-2" placeholder="Enter name account" />
                    </Form.Item>
                </Col>   
                <Col span={12}>
                    <Form.Item name="password" label="Password" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                        <Input size='large' onChange={() => clearFieldError('password')} autoComplete="off" className="mt-2" placeholder="Enter password" />
                    </Form.Item>
                </Col>   
                <Col span={12}>
                    <Form.Item name="team_id" label="Team" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                        <Select size='large' onChange={handleTeamChange} showSearch placeholder="Select Team" allowClear>
                            {teamData
                                .filter((item: ITeamItem) => item.parent_id !== null)
                                .map((item: ITeamItem, index: number) => (
                                    <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col> 
                <Col span={12}>
                    <Form.Item 
                        name="entryTime" 
                        label="Entry Time" 
                        className="font-bold text-primary text-[30px] leading-[normal] mb-0"
                    >
                        <TimePicker 
                            size='large'
                            format={timeFormat}
                            className="mt-2 w-full"
                            placeholder="Select entry time"
                            suffixIcon={<GiEntryDoor />}
                            onChange={() => clearFieldError('entryTime')}
                            minuteStep={5}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        name="exitTime" 
                        label="Exit Time" 
                        className="font-bold text-primary text-[30px] leading-[normal] mb-0"
                    >
                        <TimePicker 
                            size='large'
                            format={timeFormat}
                            className="mt-2 w-full"
                            placeholder="Select exit time"
                            suffixIcon={<GiExitDoor />}
                            onChange={() => clearFieldError('exitTime')}
                            minuteStep={5}
                        />
                    </Form.Item>
                </Col>
                {selectedTeamId && (
                    <>
                        <Col span={12}>
                            <Form.Item 
                                name="server_id" 
                                label="Server" 
                                className="font-bold text-primary text-[30px] leading-[normal] mb-0"
                            >
                                <Select 
                                    size='large' 
                                    showSearch 
                                    placeholder="Select server" 
                                    allowClear
                                    onChange={() => clearFieldError('server_id')}
                                >
                                    {serverData.map((item) => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="thread" 
                                label="Thread" 
                                className="font-bold text-primary text-[30px] leading-[normal] mb-0"
                            >
                                <Input 
                                    size='large' 
                                    onChange={() => clearFieldError('thread')} 
                                    autoComplete="off" 
                                    className="mt-2" 
                                    placeholder="Enter thread" 
                                />
                            </Form.Item>
                        </Col>
                    </>
                )}
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
                <Button htmlType="submit" size="large" className="bg-primary text-black mt-3 w-full" iconPosition="end" loading={isSubmitting} disabled={isSubmitting}>SUBMIT</Button>
           </CustomFormStyled>
        </Modal>
    )
}

export default ModalAddUser;