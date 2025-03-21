
'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Empty, Table, Statistic, Row, Col, Popconfirm, TableProps } from "antd";
import ParticlesAnimation from "@/components/elements/ParticlesAnimation";
import {
  FaNetworkWired,
  FaShieldAlt,
  FaCrosshairs,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getListProcesses, stopMultipleProcesses, stopProcesses } from "@/api/attack";
import { useAuth } from "@/shared/lib/auth";

interface TableData {
  id?: string;
  domain: string;
  attack_time: string;
  server_id: number;
  server_name: string;
  remaining_time: string;
  concurrents: number;
  pid: number;
}
  
const Page = () => {
  const { user } = useAuth();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableProps<TableData>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
  };
  
  const fetchData = async () => {
    try {
      setIsConnecting(true);
      const result = await getListProcesses();
      console.log(result);
      if (result.status === 'success') {
        const newTableData: TableData[] = result.data.map((item) => ({
          domain: item.domain,
          attack_time: item.attack_time,
          remaining_time: item.remaining_time,
          concurrents: item.concurrents,
          server_id: item.server_id,
          server_name: item.server_name,
          pid: item.pid,
        }));
        setIsConnecting(false);
        setTableData(newTableData);
      }
    } catch (error) {
      console.error("Error fetching process list:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelAllAttacks = async () => {
    if (tableData.length === 0) {
      return;
    }
    setIsConnecting(true);  
    try {
      const pidNumbers = selectedRowKeys.map(key => Number(key));
      const selectedItems = tableData.filter(item => selectedRowKeys.includes(item.pid));
      const serverIds = selectedItems.map(item => item.server_id);
      const result = await stopMultipleProcesses(
        pidNumbers, 
        user?.isAdmin ? serverIds : undefined
      );
      if (result.status === 'success') {
        setIsConnecting(false);
        setSelectedRowKeys([]);
        fetchData();
      }
    } catch (error) {
      setIsConnecting(false);
      console.error("Error stopping all processes:", error);
    }
  };
  
  const handleCancelAttack = async (pid: number, server_id: number) => {
    setIsConnecting(true);

    try {
      const result = await stopProcesses(pid, user?.isAdmin ? server_id : undefined);
      if (result.status === 'success') {
        setIsConnecting(false);
        fetchData()
      }
    } catch (error) {
      setIsConnecting(false);
      console.error("Error fetching process list:", error);
    }
  };
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "Domain",
        dataIndex: "domain",
        key: "domain",
        width: '20%',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: "Attack Time",
        dataIndex: "attack_time",
        key: "attack_time",
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: "Concurrents",
        dataIndex: "concurrents",
        key: "concurrents",
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
        title: 'Option',
        key: 'option',
        className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
        render: (_: any, record: TableData) => (
          <Popconfirm
            title="Cancel Attack"
            description="Do you want to stop the attack?"
            okText="Yes"
            onConfirm={() => record.pid && handleCancelAttack(record.pid, record.server_id)}
            cancelText="No"
          >
            <Button size="large" className="bg-primary float-end text-black">Cancel</Button>
          </Popconfirm>
        ),
      },
    ];

    if (user?.isAdmin) {
      baseColumns.splice(3, 0, {
        title: "Server",
        dataIndex: "server_name",
        key: "server_name",
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      });
    }

    return baseColumns;
  }, [user]);

  const emptyData = {
    emptyText: (
      <Empty
        className="h-full py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="text-gray-400">
            No active attacks
          </span>
        }
      />
    ),
  };

  return (
    <div className="overflow-hidden h-full inner-body">
      <div className="content-body h-full relative">
        <ParticlesAnimation />
        <div className="mx-auto p-8 relative flex flex-col justify-center items-center h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl mb-6"
          >
            <Row gutter={16} justify="center">
              <Col span={8}>
                <Card className="bg-gray-800 text-white">
                  <Statistic
                    title={<span className="text-primary">Active Attacks</span>}
                    value={tableData.length}
                    prefix={<FaCrosshairs className="mr-2 text-red-500" />}
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className="bg-gray-800 text-white">
                  <Statistic
                    title={<span className="text-primary">Total concurrents</span>}
                    // value={`${scheduledTasks.current}/${scheduledTasks.total}`}
                    prefix={<FaNetworkWired className="mr-2 text-blue-500" />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className="bg-gray-800 text-white">
                  <Statistic
                    title={<span className="text-primary">Preset</span>}
                    // value={`${presetTasks.current}/${presetTasks.total}`}
                    prefix={<FaShieldAlt className="mr-2 text-yellow-500" />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-5xl"
          >
            <Card title="ATTACK MANAGER" className="w-full" extra={
                <Popconfirm
                  title="Cancel All Attacks"
                  description="Do you want to stop all attacks?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={handleCancelAllAttacks}
                  disabled={tableData.length === 0}
                >
                  <Button 
                    size="small" 
                    danger 
                    type="primary"
                    disabled={tableData.length === 0}
                  >
                    Cancel Selected ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              }>
              <div className="h-full flex flex-col">
                <Table
                  rowSelection={{ type: 'checkbox', ...rowSelection }}
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  rowKey="pid"
                  locale={emptyData}
                  scroll={{ y: 24 * 16 }}
                  loading={isConnecting}
                  style={{
                    background: "#2c2c2c",
                    border: "1px solid #444444",
                    borderRadius: "0.375rem",
                    flex: "1 1 auto",
                    overflow: "auto",
                  }}
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );

};

export default Page;