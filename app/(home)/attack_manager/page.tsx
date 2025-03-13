"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button, Card, Empty, Table, Badge, Statistic, Row, Col } from "antd";
import { terminateServerAttack } from "@/api/attack";
import { useSearchParams } from "next/navigation";
import CountdownTimer from "@/components/elements/CountDownTimer";
import {
  FaTrash,
  FaNetworkWired,
  FaShieldAlt,
  FaCrosshairs,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface LogMessage {
  data: {
    domain: string;
    attack_time: number;
    attack: number;
    server: string;
  };
  status: string;
  message: string;
}

interface TableData {
  id: string;
  domain: string;
  attack_time: number;
  attack: number;
  server: string;
}

const AttackLogs = () => {
  const columns = [
    {
      title: "Target",
      dataIndex: "domain",
      key: "domain",
      className: "bg-card text-primary text-[1.125rem] leading-[normal]",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <Badge status="processing" color="#52c41a" />
          <span className="font-mono text-green-400">{text}</span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      className:
        "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
      render: (_: any, record: TableData) => (
        <div className="flex items-center justify-end gap-4">
          <div className="bg-black bg-opacity-30 px-4 py-2 rounded-md border border-gray-700">
            <CountdownTimer totalSeconds={record.attack_time} />
          </div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              danger
              onClick={() => handleTerminate(record.server)}
              icon={<FaTrash className="text-white" />}
              className="bg-red-800 hover:bg-red-700 border-red-900"
            />
          </motion.div>
        </div>
      ),
    },
  ];

  const searchParams = useSearchParams();
  const attackId = searchParams.get("attackId");
  const [logsByServer, setLogsByServer] = useState<Map<string, LogMessage[]>>(
    new Map()
  );
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [scheduledTasks, setScheduledTasks] = useState({
    current: 0,
    total: 100,
  });
  const [presetTasks, setPresetTasks] = useState({ current: 0, total: 100 });

  useEffect(() => {
    const newTableData: TableData[] = [];

    logsByServer.forEach((messages) => {
      if (messages.length > 0) {
        const firstMessage = messages[0];

        newTableData.push({
          id: `${firstMessage.data.domain}-${firstMessage.data.attack}`,
          domain: firstMessage.data.domain,
          attack_time: firstMessage.data.attack_time,
          attack: firstMessage.data.attack,
          server: firstMessage.data.server,
        });
      }
    });

    setTableData(newTableData);
  }, [logsByServer]);

  useEffect(() => {
    try {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        reconnection: true,
        timeout: 10000,
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        setIsConnecting(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("socket", error);
        setIsConnecting(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.error("socket", error);
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("log_message", (message: LogMessage) => {
      const domain = message.data.domain;

      setLogsByServer((prevLogs) => {
        const newLogs = new Map(prevLogs);
        const serverLogs = newLogs.get(domain) || [];
        newLogs.set(domain, [...serverLogs, message]);
        return newLogs;
      });
    });

    return () => {
      socket.off("log_message");
    };
  }, [socket]);

  const handleTerminate = async (server: string) => {
    if (!attackId) {
      console.error("No attack ID available");
      return;
    }
    try {
      await terminateServerAttack(parseInt(attackId), server);
      setLogsByServer((prevLogs) => {
        const newLogs = new Map(prevLogs);
        newLogs.delete(server);
        return newLogs;
      });
    } catch (error) {
      setTableData([]);
      console.error("error data", error);
    }
  };

  const emptyData = {
    emptyText: (
      <Empty
        className="h-full py-12"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="text-gray-400">
            No active attacks. System is idle.
          </span>
        }
      />
    ),
  };

  return (
    <div className="overflow-hidden h-full inner-body bg-gradient-to-b from-gray-900 to-black">
      <div className="content-body h-full">
        <div className="mx-auto p-8 relative flex flex-col justify-center items-center h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-3/4 mb-6"
          >
            <Row gutter={16}>
              <Col span={8}>
                <Card bordered={false} className="bg-gray-800 text-white">
                  <Statistic
                    title={
                      <span className="text-gray-300">Active Attacks</span>
                    }
                    value={tableData.length}
                    prefix={<FaCrosshairs className="mr-2 text-red-500" />}
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} className="bg-gray-800 text-white">
                  <Statistic
                    title={<span className="text-gray-300">Scheduled</span>}
                    value={`${scheduledTasks.current}/${scheduledTasks.total}`}
                    prefix={<FaNetworkWired className="mr-2 text-blue-500" />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} className="bg-gray-800 text-white">
                  <Statistic
                    title={<span className="text-gray-300">Preset</span>}
                    value={`${presetTasks.current}/${presetTasks.total}`}
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
            className="w-3/4"
          >
            <Card
              title={
                <div className="flex items-center gap-2 text-xl text-[#52c41a]">
                  <FaShieldAlt className="text-[#52c41a]" /> ATTACK MANAGER
                </div>
              }
              className="w-full shadow-lg border border-gray-700"
              headStyle={{
                background: "#1f1f1f",
                borderBottom: "1px solid #333",
              }}
              bodyStyle={{ padding: 0, background: "#262626" }}
            >
              <div className="h-full flex flex-col">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  rowKey="id"
                  locale={emptyData}
                  loading={false}
                  showHeader={false}
                  rowClassName="hover:bg-gray-800 transition-colors"
                  style={{
                    tableLayout: "fixed",
                    background: "#262626",
                    border: "1px solid #333",
                    borderRadius: "0.375rem",
                    flex: "1 1 auto",
                    overflow: "auto",
                  }}
                  className="attack-table"
                />
              </div>
            </Card>
          </motion.div>

          <div className="mt-6 text-gray-500 text-sm">
            {isConnecting
              ? "Establishing secure connection..."
              : "Secure connection established"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackLogs;
