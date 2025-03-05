'use client';

import { createSetting, deleteSettingApi, getSettingApi, ISettingRes, ISettingItem, ISettingReq, updateSettingApi } from "@/api/settings";
import { Button, Card, Empty, Form, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ModalAddSetting from "./components/ModalAddSetting";
import { convertToUppercaseWords } from "@/helpers/convertText";
import ModalEditSetting from "./components/ModalEditSetting";

interface ITableItem { 
    id: number;
    stt: number;
    type: string;
    group: string;
    input: string;
    value: string;
    description: string;
}

const Page = () => {

    const [form] = Form.useForm<ISettingReq>();
    const [error, setError] = useState("");
    const [tableData, setTableData] = useState<ITableItem[]>([]);
    const [editingItem, setEditingItem] = useState<ISettingItem | undefined>();
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);

    const showModalEdit = (record: ISettingItem) => {
        setEditingItem(record);
        setOpenEdit(true);
    };

    const restructureData = (settingItems: ISettingItem[]): ITableItem[] => {
        return settingItems.map(item => ({
            id: item.id,
            stt: item.stt,
            description: item.description,
            group: item.group,
            type: item.type,  
            input: item.input,
            value: JSON.stringify(item.value.map(v => ({
                key: String(v.key || ''),
                label: String(v.label || ''),
                value: v.value || ''
            })))
        }));
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result: ISettingRes = await getSettingApi();
                if(result.status === 'success') {
                    const restructuredData = restructureData(result.data ?? []);
                    setTableData(restructuredData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [form]);
    
    const handlAddData = async (request: ISettingReq[]) => {
        try {
            const result = await createSetting(request);
            if(result?.status === 'success') {
                setOpenAdd(false);    
                form.resetFields();
            }
        } catch (error: any) {
            Object.keys(error).forEach((field) => {
                form.setFields([{
                name: field as keyof ISettingReq,
                errors: [error[field]]
                }]);
            });
        }
    }

    const handleUpdate = async (request: ISettingItem) => {
        try {
            const result = await updateSettingApi(request);
            if (result.status === 'success') {
                setOpenEdit(false);
            }   
    
        } catch (error: any) {
            setError(error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const results = await deleteSettingApi(id);
            if(results?.status === 'success') {
                setTableData(prev => prev.filter(item => item.id !== id));
            }
        } catch (error: any) {
            setError(error.message);
        }
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
            title: 'Attack System',
            dataIndex: 'type',
            key: 'type',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: ITableItem) => (<span>{convertToUppercaseWords(record.type)}</span>)
        },
        {
            title: 'Mode Attack',
            dataIndex: 'group',
            key: 'group',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: ITableItem) => (<span>{convertToUppercaseWords(record.group)}</span>)
        },
        {
            title: 'Input type',
            dataIndex: 'input',
            key: 'input',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: ITableItem) => (<span>{convertToUppercaseWords(record.input)}</span>)
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: '31%',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
            title: 'Actions',
            key: 'actions',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: ITableItem) => (
                <Space size="middle">
                    <Button size="large" className="bg-primary float-end text-black" onClick={() => showModalEdit({
                        ...record, 
                        value: JSON.parse(`[${record.value}]`)
                    })}>EDIT</Button>
                    <Popconfirm
                        title="Delete data"
                        description="Are you sure you want to delete?"
                        okText="Yes"
                        onConfirm={() => handleDelete(record.id)}
                        cancelText="No"
                    >
                        <Button size="large" className="bg-primary float-end text-black">DELETE</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    const ButtonAdd = () => {
        return (
            <Button size="large" 
                type="primary" 
                icon={<FaPlus />}
                onClick={() => {setOpenAdd(true)}}
            >
                ADD
            </Button>
        )
    }

    const emptyData = {
        emptyText: <Empty />
    };

    return (
        <>
            <div className="overflow-hidden h-full inner-body">
                <div className="content-body h-full">
                    <div className="mx-auto p-8 relative">
                        <Card title='SETTING' extra={ButtonAdd()}>
                            <Table
                                columns={columns}
                                dataSource={tableData}
                                pagination={false}
                                rowKey="id"
                                scroll={{ y: 24 * 24}}
                                locale={emptyData}
                                style={{ tableLayout: 'fixed', background: '#2c2c2c', border: "1px solid #444444", borderRadius: '0.375rem' }}
                            />
                        </Card>
                    </div>
                </div>
            </div>
            {editingItem && (
                <ModalEditSetting error={error} onSave={handleUpdate} open={openEdit} item={editingItem} onClose={() =>setOpenEdit(false)}/>
            )}
            <ModalAddSetting form={form} onSave={handlAddData} open={openAdd} onClose={() =>{setOpenAdd(false); form.resetFields()}}/>
        </>
    )
}



export default Page;