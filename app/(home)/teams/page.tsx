'use client';

import { addTeamApi, deleteTeamApi, getParentApi, getTeamApi, ITeamItem, ITeamReq, ITeamRes, ParentItem, TreeNode, updateTeamApi } from "@/api/team";
import { Button, Card, Empty, Form, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ModalAddTeam from "./components/ModalAddTeam";
import ModalEditTeam from "./components/ModalEditTeam";
import { serverApi, IServerItem, IServerRes } from "@/api/server";

const Page = () => {

    const [form] = Form.useForm<ITeamReq>();
    const [error, setError] = useState("");
    const [tableData, setTableData] = useState<ITeamItem[]>([]);
    const [editingItem, setEditingItem] = useState<ITeamItem | undefined>();
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [parent, setParent] = useState<ParentItem[]>([]);
    const [servers, setServers] = useState<IServerItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const showModalEdit = (record: ITeamItem) => {
        setEditingItem(record);
        setOpenEdit(true);
    };
    
    const fetchingData = async () => {
        try {
            setLoading(true);
            const result: ITeamRes = await getTeamApi();
                if(result.status === 'success') {
                    setLoading(false);
                    setTableData(result.data);
                }
        } catch (error) {
            console.error('Error data', error);
        }
    }
   
    useEffect(() => {
        fetchingData();
    }, [form]);

    useEffect(() => {
        const fetchingData = async () => {
        try {
            const result: IServerRes = await serverApi.getAll();
                if(result.status === 'success') {
                    setServers(result.data);
                }
        } catch (error) {
            console.error('Error data', error);
        }
    }
    fetchingData();
    }, [form]);

    useEffect(() => {
        const fetchParent = async () => {
            try {
                const result = await getParentApi();
                setParent(result.data);
            } catch (error) {
                console.error('Error data', error);
            }
        };
    
        fetchParent();
    }, [tableData]);

    const treeData = transformToTreeData(parent);

    function transformToTreeData(items: ParentItem[]): TreeNode[] {
        return items.map(item => ({
            title: item.name,
            value: item.id,
            children: item.children ? transformToTreeData(item.children) : [],
        }));
    }

    const handlAddData = async (request: ITeamReq) => {
        try {
            const result = await addTeamApi(request);
            if(result?.status === 'success') {
                setOpenAdd(false);    
                form.resetFields();

                await fetchingData();

            }
        } catch (error: any) {
            Object.keys(error).forEach((field) => {
                form.setFields([{
                name: field as keyof ITeamReq,
                errors: [error[field]]
                }]);
            });
        }
    }

    const handleUpdate = async (request: ITeamItem) => {
         try {
            const result = await updateTeamApi(request);
            if (result.status === 'success') {
                setOpenEdit(false);

                await fetchingData();
            }   
        } catch (error: any) {
            setError(error);
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const results = await deleteTeamApi(id);
            if(results?.status === 'success') {
                setTableData(prev => prev.filter(item => item.id !== id));
            }
        } catch (error: any) {
            setError(error.message);
        }
    }

    const columns = [
        {
            title: 'Team',
            dataIndex: 'name',
            key: 'name',
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
            sorter: (a: ITeamItem, b: ITeamItem) => {
                const getTeamParts = (name: string) => {
                    const match = name.match(/TEAM\s*(\d+)(\D*)/i);
                    if (match) {
                        return {
                        num: parseInt(match[1], 10),
                        suffix: match[2].toUpperCase(),
                        };
                    }
                    return { num: 0, suffix: '' };
                };
                
                const aParts = getTeamParts(a.name);
                const bParts = getTeamParts(b.name);
            
                if (aParts.num !== bParts.num) {
                    return aParts.num - bParts.num;
                }
                return aParts.suffix.localeCompare(bParts.suffix);
            },
        },
        {
            title: 'Group',
            dataIndex: 'parent_name',
            key: 'parent_name',
            sorter: (a: ITeamItem, b: ITeamItem) => {
                const parentA = a.parent_name || '';
                const parentB = b.parent_name || '';
                return parentA.localeCompare(parentB);
            },
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: ITeamItem) => {
                return record.parent_name ? record.parent_name :  <Tag color="green">NONE</Tag>;
            }
        },
        {
            title: 'Server',
            key: 'server_name',
            dataIndex: 'server_name',
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: ITeamItem) => {
                if (!record.server_name || record.server_name.length === 0) {
                    return <Tag color="green">NONE</Tag>;
                }
                return (
                <>
                    {record.server_name.map((srv: string) => (
                        <Tag color="magenta" key={srv}>{srv}</Tag>
                    ))}
                </>
                );
            }
        },
        {
        title: 'Actions',
            key: 'actions',
            className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
            render: (_: any, record: ITeamItem) => (
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
                        <Card title='TEAM' extra={ButtonAdd()}>
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
                <ModalEditTeam error={error} servers={servers} onSave={handleUpdate} treeData={treeData} open={openEdit} item={editingItem} onClose={() =>setOpenEdit(false)}/>
            )}
            <ModalAddTeam form={form} servers={servers} onSave={handlAddData} open={openAdd} onClose={() =>{setOpenAdd(false); form.resetFields()}} treeData={treeData} />
        </>
    )
}


export default Page;