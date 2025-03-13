'use client';

import { IPermissionId, IPermissionItem } from "@/api/permissions";
import { ITeamItem } from "@/api/team";
import { IUserItem } from "@/api/users";
import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Button, Col, Form, Input, Modal, Row, Select, Switch, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { GiEntryDoor, GiExitDoor } from "react-icons/gi";
import dayjs from 'dayjs';

interface IModalUserProps {
    open: boolean;
    error: string; 
    item: IUserItem;
    onClose: () => void;
    onSave: (request: IUserItem) => Promise<void>;
    permissions: IPermissionItem[];
    teamData: ITeamItem[]; 
    serverData: any[];
    selectedTeamId: number | null;
    onTeamChange: (teamId: number) => void;
}

const ModalEditUser: React.FC<IModalUserProps> = ({ error, open, onClose, onSave, item, permissions, teamData,  serverData, selectedTeamId, onTeamChange  }) => {

    const [form] = Form.useForm<IUserItem>();
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<IPermissionId[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const timeFormat = 'HH:mm';

    useEffect(() => {
            if (open && item) {

                const entryTimeDayjs = dayjs(item.entryTime, timeFormat);
                const exitTimeDayjs = dayjs(item.exitTime, timeFormat);

                form.setFieldsValue({   
                    id: item.id,
                    email: item.email,
                    password: item.rawPassword,
                    nameAccount: item.nameAccount,
                    team_id: item.team_id,
                    server_id: item.server_id,
                    thread: item.thread,
                    entryTime: entryTimeDayjs,
                    exitTime: exitTimeDayjs,
                });

                setSelectedTeam(item.team_id);

                if (item.permissions && item.permissions.length > 0) {
                    setSelectedPermissionIds(item.permissions);
                } else {
                    setSelectedPermissionIds([]);
                }
            }
    }, [open, item, form]);

    useEffect(() => {
        if (!open) {
            setIsSubmitting(false);
        }
    }, [open]);

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

    useEffect(() => {
        if (selectedTeam && form.getFieldValue('team_id') !== selectedTeam) {
            form.setFieldsValue({
                server_id: undefined,
                thread: undefined
            });
        }
    }, [selectedTeam, form]);

    const handleTeamChange = (value: number) => {
        onTeamChange(value);
        form.setFieldsValue({
            server_id: undefined,
            thread: undefined
        });
        clearFieldError('server_id');
        clearFieldError('thread');
    };

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

    const handleSubmit = async (formValues: IUserItem) => {
        setIsSubmitting(true);

        try {
            await onSave({
                ...formValues,
                entryTime: formValues.entryTime && dayjs.isDayjs(formValues.entryTime) 
                                ? formValues.entryTime.format(timeFormat) 
                                : formValues.entryTime,
                exitTime: formValues.exitTime && dayjs.isDayjs(formValues.exitTime) 
                    ? formValues.exitTime.format(timeFormat) 
                    : formValues.exitTime,
                permissions: selectedPermissionIds,
                id: item.id
            });
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
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
                                        type="number"
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
    );
}

export default ModalEditUser;