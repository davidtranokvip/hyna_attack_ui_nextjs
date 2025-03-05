import { CustomFormStyled } from "@/app/assets/styles/FormAntCustom";
import { Button, Col, Form, FormInstance, Input, Modal, Row, Select, Table } from "antd";
import { attackTypeSystem, dataTypeSystem, inputTypeSystem } from "./data";
import { useEffect, useRef, useState } from "react";
import { ISettingReq } from "@/api/settings";
import { IInputKeyValue } from "@/shared/types/MainType";

interface IModalSettingProps {
    open: boolean;
    form: FormInstance<ISettingReq>;
    onClose: () => void;
    onSave: (request: ISettingReq[]) => Promise<void>;
}

const { TextArea } = Input;

const ModalAddSetting: React.FC<IModalSettingProps> = ({ open, onClose, onSave, form }) => {
    const tableRef = useRef<HTMLDivElement>(null);
    const [valueKey, setValueKey] = useState<IInputKeyValue[]>([]);
    const [lastAddedId, setLastAddedId] = useState<number | null>(null);

    useEffect(() => {
        if (lastAddedId && tableRef.current) {
            const newRow = tableRef.current.querySelector(`.ant-table-row:last-child`);
            if (newRow) {
                newRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setLastAddedId(null);
            }
        }
    }, [lastAddedId]);

    useEffect(() => {
        if (!open) {
            setValueKey([]);
            form.resetFields();
        }
    }, [open, form]);

    const handleSubmit = (formValues: ISettingReq) => {

        if (valueKey.length === 0) {
            console.error('Không có dữ liệu trong bảng');
            return;
        }

        const valueArray = valueKey.map(item => ({
            value: item.value,
            key: item.key,
            label: item.label
        }));
        const types = Array.isArray(formValues.type) ? formValues.type : [formValues.type];
        const settingRequests: ISettingReq[] = types.map(type => ({
            type: type,
            stt: formValues.stt,
            description: formValues.description || '',
            group: formValues.group || '',
            input: formValues.input || '',
            value: valueArray
        }));
        onSave(settingRequests)
    }

    const generateId = () => {
        if (valueKey.length === 0) return 1;
        return Math.max(...valueKey.map(item => item.id)) + 1;
    };

    const handleAddRow = () => {
        const newId = generateId();
        const newRow: IInputKeyValue = {
            id: newId,
            value: '',
            label: '',
            key: ''
        };
        setValueKey([...valueKey, newRow]);
        setLastAddedId(newId);
    };
    
    const handleDeleteRow = (id: number) => {
        const updatedList = valueKey.filter(item => item.id !== id);
        setValueKey(updatedList);
    };

    const handleRowChange = (id: number, field: keyof IInputKeyValue, value: string | number) => {
        setValueKey(prev => 
            prev.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const clearFieldError = (fieldName: keyof ISettingReq) => {
        form.setFields([{
            name: fieldName,
            errors: []
        }]);
    };

    const columns = [
        {
            title: 'VALUE',
            dataIndex: 'value',
            key: 'value',
            width: '31%',
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
            render: (text: string | number, record: IInputKeyValue) => (
                <Input 
                    size='large'
                    autoComplete="off"
                    onChange={(e) => handleRowChange(record.id, 'value', e.target.value)}
                    placeholder="Enter value"
                />
            )
        },
        {
            title: 'LABEL',
            dataIndex: 'label',
            key: 'label',
            width: '31%',
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
            render: (text: string, record: IInputKeyValue) => (
                <Input 
                    size='large'
                    autoComplete="off"
                    onChange={(e) => handleRowChange(record.id, 'label', e.target.value)}
                    placeholder="Enter label"
                />
            )
        },
        {
            title: 'KEY',
            dataIndex: 'key',
            key: 'key',
            width: '31%',
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
            render: (text: string, record: IInputKeyValue) => (
                <Input 
                    size='large'
                    autoComplete="off"
                    onChange={(e) => handleRowChange(record.id, 'key', e.target.value)}
                    placeholder="Enter key"
                />
            )
        },
        {
            title: '',
            key: '',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: any) => (
                <Button size="large" className="bg-primary float-end text-black" onClick={() => handleDeleteRow(record.id)}>-</Button>
            )
        },
    ];

    return (
        <Modal 
            title="ADD SETTING" 
            open={open}  
            width={1020}
            onCancel={onClose}
            footer={null}
        >
           <CustomFormStyled form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={[32, 32]}>
                    <Col span={6}> 
                        <Form.Item label="STT" name="stt" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Input 
                                size='large'
                                autoComplete="off"
                                onChange={() => clearFieldError('stt')}
                                placeholder="Enter stt"
                            />
                        </Form.Item>
                    </Col>  
                    <Col span={6}>
                        <Form.Item name="type" label="MODE ATTACK" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Select size="large" onChange={() => clearFieldError('type')} className="mt-2" placeholder="Enter mode attack" mode="multiple" allowClear>
                                {attackTypeSystem.map(type => (
                                    <Select.Option key={type.value} value={type.value}>
                                        {type.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> 
                    <Col span={6}> 
                        <Form.Item label="GROUP VIEW" name="group" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Select size="large" onChange={() => clearFieldError('group')} className="mt-2" showSearch placeholder="Enter group attack" allowClear>
                                {dataTypeSystem.map(group => (
                                    <Select.Option key={group.value} value={group.value}>
                                        {group.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>  
                    <Col span={6}> 
                        <Form.Item label="INPUT TYPE" name="input" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <Select size="large" onChange={() => clearFieldError('input')} className="mt-2" showSearch placeholder="Enter input type" allowClear>
                                {inputTypeSystem.map(input => (
                                    <Select.Option key={input.value} value={input.value}>
                                        {input.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>  
                    
                    <Col span={24}> 
                        <Form.Item label="DESCRIPTION" name="description" className="font-bold text-primary text-[30px] leading-[normal] mb-0">
                            <TextArea 
                                style={{maxHeight: 80}}
                                rows={4}
                                placeholder="Enter description"
                            />
                        </Form.Item>
                    </Col>   
                    <Col span={24} ref={tableRef}> 
                        <Table
                            columns={columns}
                            dataSource={valueKey}
                            pagination={false}
                            rowKey="id"
                            scroll={{ y: 24 * 8}}
                            locale={{ emptyText: null }}
                            style={{ marginBottom: 32, tableLayout: 'fixed', background: '#2c2c2c', border: "1px solid #444444", borderRadius: '0.375rem' }}
                            />
                    </Col>   
                </Row>
                <div className="flex gap-3 items-center mb-3 justify-start">
                    <Button size="large" type="dashed" className="bg-primary text-black" onClick={handleAddRow}>+</Button>
                    <Button size="large" htmlType="submit" className="bg-primary text-black con">SUBMIT</Button>
                </div>
           </CustomFormStyled>
        </Modal>
    )
}

export default ModalAddSetting;