'use client';

import { deletePermission, getPermissionList, IPermissionReq, IPermissionItem, IPermissionRes, createPermission, updatePermission } from "@/api/permissions";
import { Button, Card, Empty, Form, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ModalAddPermission from "./components/ModalAddPermission";
import ModalEditPermission from "./components/ModalEditPermission";

const Page = () => {
    const [form] = Form.useForm<IPermissionReq>();
    const [tableData, setTableData] = useState<IPermissionItem[]>([]);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [editingItem, setEditingItem] = useState<IPermissionItem | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    const showModalEdit = (record: IPermissionItem) => {
        setEditingItem(record);
        setOpenEdit(true);
    };

    const fetchingData = async () => {
        try {
            setLoading(true);
            const result: IPermissionRes = await getPermissionList();
                if(result.status === 'success') {
                    setLoading(false);
                    setTableData(result.data);
                }
        } catch (error) {
            console.error('Error fetching', error);
        }
    }
    useEffect(() => {
        fetchingData();
    }, []);

    const handlAddData = async (request: IPermissionReq) => {
        try {
            const result = await createPermission(request);
            if(result?.status === 'success') {
                setOpenAdd(false);    
                form.resetFields();

                await fetchingData();
            }
        } catch (error: any) {
            Object.keys(error).forEach((field) => {
                form.setFields([{
                name: field as keyof IPermissionReq,
                errors: [error[field]]
                }]);
            });
        }
    }

    const handleUpdate = async (request: IPermissionItem) => {
        try {
            const result = await updatePermission(request);
            if (result.status === 'success') {
                setOpenEdit(false);

                await fetchingData();
            }   
        } catch (error: any) {
            setError(error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const results = await deletePermission(id);
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
          title: 'Route',
          dataIndex: 'route',
          key: 'route',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
          title: 'Module',
          key: 'module',
          dataIndex: 'module',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
          title: 'Actions',
            key: 'actions',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: IPermissionItem) => (
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
                        <Card title='PERIMISSION' extra={ButtonAdd()}>
                            <Table
                                columns={columns}
                                dataSource={tableData}
                                pagination={false}
                                loading={loading}
                                rowKey="id"
                                scroll={{ y: 24 * 24}}
                                locale={emptyData}
                                style={{ background: '#2c2c2c', border: "1px solid #444444", borderRadius: '0.375rem' }}
                                />
                        </Card>
                    </div>
                </div>
            </div>
            {editingItem && (
                <ModalEditPermission error={error} onSave={handleUpdate} open={openEdit} item={editingItem} onClose={() =>setOpenEdit(false)}/>
            )}
            <ModalAddPermission form={form} onSave={handlAddData} open={openAdd} onClose={() =>{setOpenAdd(false); form.resetFields()}}/>
        </>
    );
}

export default Page;