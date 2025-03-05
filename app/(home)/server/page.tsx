'use client';

import { deleteServer, getServerList, IServerReq, IServerItem, IServerRes, createServer, updateServer } from "@/api/server";
import { Button, Card, Empty, Form, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ModalAddServer from "./components/ModalAddServer";
import ModalEditServer from "./components/ModalEditServer";

const Page = () => {

    const [form] = Form.useForm<IServerReq>();
    const [tableData, setTableData] = useState<IServerItem[]>([]);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [editingItem, setEditingItem] = useState<IServerItem | undefined>();

    const showModalEdit = (record: IServerItem) => {
        setEditingItem(record);
        setOpenEdit(true);
    };
    
    useEffect(() => {
        const fetchingData = async () => {
            try {
                const result: IServerRes = await getServerList();
                    if(result.status === 'success') {
                        setTableData(result.data);
                    }
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        }
        fetchingData();
    }, [form]);

    const handlAddData = async (request: IServerReq) => {
        try {
            const result = await createServer(request);
            if(result?.status === 'success') {
                setOpenAdd(false);    
                form.resetFields();
            }
        } catch (error: any) {
            Object.keys(error).forEach((field) => {
                form.setFields([{
                name: field as keyof IServerReq,
                errors: [error[field]]
                }]);
            });
        }
    }

    const handleUpdate = async (request: IServerItem) => {
        try {
            const result = await updateServer(request);
            if (result.status === 'success') {
                setOpenEdit(false);
            }   
        } catch (error: any) {
            setError(error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const results = await deleteServer(id);
            if(results.status === 'success') {
                setTableData(prev => prev.filter(item => item.id !== id));
            }
        } catch (error: any) {
            setError(error.message);
        }
    }

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          key: 'ip',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
          title: 'UserName',
          key: 'username',
          dataIndex: 'username',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
          title: 'Password',
          key: 'password',
          dataIndex: 'password',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
          title: 'Actions',
            key: 'actions',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: IServerItem) => (
                <Space size="middle">
                    <Button size="large" className="bg-primary float-end text-black" onClick={() => showModalEdit(record)}>EDIT</Button>
                    <Popconfirm
                        title="Delete data"
                        description="Are you sure you want to delete?"
                        okText="Yes"
                        onConfirm={() => record.id && handleDelete(record.id)}
                        cancelText="No"
                    >
                        <Button size="large" className="bg-primary float-end text-black">DELETE</Button>
                    </Popconfirm>
                </Space>
          ),
        },
    ];

    const ButtonAdd = () => {
        return (
            <Button
                size="large"
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
                        <Card title='SERVER' extra={ButtonAdd()}>
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
                <ModalEditServer error={error} onSave={handleUpdate} open={openEdit} item={editingItem} onClose={() =>setOpenEdit(false)}/>
            )}
            <ModalAddServer form={form} onSave={handlAddData} open={openAdd} onClose={() =>{setOpenAdd(false); form.resetFields()}}/>
        </>
    )
}

export default Page;