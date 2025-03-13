'use client';

import { getTeamApi, ITeamItem, ITeamRes } from "@/api/team";
import { createUserApi, deleteUserApi, getListUserApi, IUserItem, IUserReq, IUserRes, updateUserApi } from "@/api/users";
import { Avatar, Button, Card, Empty, Form, Popconfirm, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoEyeOff, IoEyeOffOutline } from "react-icons/io5";
import ModalAddUser from "./components/ModalAddUser";
import { getPermissionList, IPermissionItem, IPermissionRes } from "@/api/permissions";
import ModalEditUser from "./components/ModalEditUser";
import { serverApi } from "@/api/server";

interface PasswordVisibility {
    [key: number]: boolean;
}

const Page = () => {

    const [form] = Form.useForm<IUserReq>();
    const [error, setError] = useState("");

    const [tableData, setTableData] = useState<IUserItem[]>([]);
    const [editingItem, setEditingItem] = useState<IUserItem | undefined>();
    
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    
    const [permissions, setPermissions] = useState<IPermissionItem[]>([]);

    const [visiblePasswords, setVisiblePasswords] = useState<PasswordVisibility>({});
    
    const [teamData, setTeamData] = useState<ITeamItem[]>([]);

    const [serverData, setServerData] = useState<any[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: ITeamRes = await getTeamApi(); 
                if(response.status === 'success') {
                setTeamData(response.data);
                }
            } catch (error) {
                console.error('Error data', error);
            }
        };
        
        fetchData();
    }, [])

    useEffect(() => {
      const fetchServerData = async () => {
          if (selectedTeamId) {
              try {
                  const response = await serverApi.getServerForTeam(selectedTeamId);
                  if (response.status === 'success') {
                      setServerData(response.data);
                  }
              } catch (error) {
                  console.error('Error fetching servers', error);
                  setServerData([]);
              }
          } else {
              setServerData([]);
          }
      };
      
      fetchServerData();
  }, [selectedTeamId]);

  const fetchingData = async () => {
      try {
          setLoading(true);
          const response: IUserRes = await getListUserApi(); 
          if(response.status === 'success') {
            setLoading(false);
            setTableData(response.data);
          }
      } catch (error) {
          console.error('Error data', error);
      }
  };
  
  useEffect(() => {
    fetchingData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response: IPermissionRes = await getPermissionList(); 
            if(response.status === 'success') {
              setPermissions(response.data);
            }
        } catch (error) {
          console.error('Error data', error);
        }
    };
    
    fetchData();
  }, [])

  const showModalEdit = (record: IUserItem) => {
    setEditingItem(record);
    setSelectedTeamId(record.team_id);
    setOpenEdit(true);
  };
    
  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddModalOpen = () => {
    setSelectedTeamId(null);
    setOpenAdd(true);
  };

  const handleModalClose = () => {
    setOpenAdd(false);
    setSelectedTeamId(null);
    form.resetFields();
  };

  const handleEditModalClose = () => {
    setOpenEdit(false);
    setSelectedTeamId(null);
  };

  const handlAddData = async (request: IUserReq) => {
    try {
      const result = await createUserApi(request);
      if(result?.status === 'success') {  
          setOpenAdd(false);    
          form.resetFields();
          setSelectedTeamId(null);

          await fetchingData();
      }
    } catch (error: any) {
      Object.keys(error).forEach((field) => {
          form.setFields([{
          name: field as keyof IUserReq,
          errors: [error[field]]
          }]);
      });
    }
  }

    const handleUpdate = async (request: IUserItem) => {
      try {
        const result = await updateUserApi(request);
        if (result.status === 'success') {
            setOpenEdit(false);
            setSelectedTeamId(null);
            
            await fetchingData();
        }   
      } catch (error: any) {
          setError(error);
      }
    };
    
    const handleTeamChange = (teamId: number) => {
      setSelectedTeamId(teamId);
    };

    const handleDelete = async (id: number) => {
      try {
        const results = await deleteUserApi(id);
        if(results?.status === 'success') {
            setTableData(prev => prev.filter(item => item.id !== id));
        }
      } catch (error: any) {
          setError(error.message);
      }
    }

    const columns = [
      {
        title: 'Account',
        key: 'nameAccount',
        dataIndex: 'nameAccount',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: 'Password',
        dataIndex: 'rawPassword',
        key: 'rawPassword',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        render: (_: any, record: IUserItem) => (
          <Space size="middle">
            <span>{record.id && visiblePasswords[record.id] ? record.rawPassword : '••••••••'}</span>
            <div
              onClick={() => record.id && togglePasswordVisibility(record.id)}
              className="cursor-pointer"
              >
              {record.id && visiblePasswords[record.id] ? 
                <IoEyeOff /> : 
                <IoEyeOffOutline />
              }
            </div>
          </Space>
        )
      },
      {
        title: 'Team',
        key: 'team_name',
        dataIndex: 'team_name',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        sorter: (a: IUserItem, b: IUserItem) => {
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
  
          const aParts = getTeamParts(a.team_name);
          const bParts = getTeamParts(b.team_name);
  
          if (aParts.num !== bParts.num) {
          return aParts.num - bParts.num;
          }
          return aParts.suffix.localeCompare(bParts.suffix);
        },
      },
      {
        title: 'Server',
        key: 'server_name',
        dataIndex: 'server_name',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: 'Thread',
        key: 'thread',
        dataIndex: 'thread',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: 'entryTime',
        key: 'entryTime',
        dataIndex: 'entryTime',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: 'exitTime',
        key: 'exitTime',
        dataIndex: 'exitTime',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: 'Actions',
          key: 'actions',
          className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
          render: (_: any, record: IUserItem) => (
            <Space size="middle">
              <Button size="large" className="bg-primary float-end text-black" onClick={() => showModalEdit(record)}>EDIT</Button>
              <Popconfirm
                title="Delete data"
                description="Are you sure you want to delete?"
                okText="Yes"
                onConfirm={() => record.id && handleDelete(record.id)}
                cancelText="No">
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
          onClick={handleAddModalOpen}
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
                <Card title='USERS' extra={ButtonAdd()}>
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
              <ModalEditUser error={error} permissions={permissions} onSave={handleUpdate} teamData={teamData} open={openEdit} item={editingItem} onClose={handleEditModalClose} serverData={serverData} selectedTeamId={selectedTeamId} onTeamChange={handleTeamChange}  />
          )}
          <ModalAddUser teamData={teamData} permissions={permissions} form={form} onSave={handlAddData} open={openAdd} onClose={handleModalClose} serverData={serverData} selectedTeamId={selectedTeamId} onTeamChange={handleTeamChange}/>
        </>
    );
}

export default Page;