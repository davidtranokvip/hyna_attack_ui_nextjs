
'use client';

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button, Card, Empty, Table, Statistic, Row, Col } from "antd";
// import { terminateServerAttack } from "@/api/attack";
// import { useSearchParams } from 'next/navigation';
// import CountdownTimer from "@/components/elements/CountDownTimer";
import ParticlesAnimation from "@/components/elements/ParticlesAnimation";
import {
  // FaTrash,
  FaNetworkWired,
  FaShieldAlt,
  FaCrosshairs,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getListProcesses, stopProcesses } from "@/api/attack";

// interface LogMessage {
//   data: {
//     domain: string;
//     attack_time: number;
//     attack: number;
//     server: string;
//   };
//   status: string;
//   message: string;
// }

interface TableData {
  id?: string;
  domain: string;
  attack_time: string;
  server?: string;
  remaining_time: string;
  concurrents: number;
  pid: number;
}

const Page = () => {

  // const searchParams = useSearchParams();
  // const attackId = searchParams.get('attackId');
  // const [logsByServer, setLogsByServer] = useState<Map<string, LogMessage[]>>(
    // new Map()
  // );
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  // const [scheduledTasks, setScheduledTasks] = useState({
  //   current: 0,
  //   total: 100,
  // });
  // const [presetTasks, setPresetTasks] = useState({ current: 0, total: 100 });

  const columns = [
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
    },
    {
      title: "Attack Time",
      dataIndex: "attack_time",
      key: "attack_time",
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      // render: (seconds: number) => <CountdownTimer totalSeconds={seconds} />
    },
    {
      title: "Remaining Time",
      dataIndex: "remaining_time",
      key: "remaining_time",
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      // render: (seconds: number) => <CountdownTimer totalSeconds={seconds} />
    },
    {
      title: "Concurrents",
      dataIndex: "concurrents",
      key: "concurrents",
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      // render: (seconds: number) => <CountdownTimer totalSeconds={seconds} />
    },
    {
      title: "PID",
      dataIndex: "pid",
      key: "pid",
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      // render: (seconds: number) => <CountdownTimer totalSeconds={seconds} />
    },
    {
      title: 'Option',
      key: '',
      className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
      render: (_: any, record: TableData) => (
        <Button danger onClick={() => handleTerminateConfirm(record.pid)}>
          CANCEL
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListProcesses(); // Gọi API
        // console.log("Fetched data:", response);

        if (response?.data) {
          const newTableData: TableData[] = response.data.map((item) => ({
            domain: item.domain,
            attack_time: item.attack_time,
            remaining_time: item.remaining_time,
            concurrents: item.concurrents,
            pid: item.pid,
          }));

          setTableData(newTableData);
        }
      } catch (error) {
        console.error("Error fetching process list:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    try {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        reconnection: true,
        timeout: 10000,
        transports: ['websocket']
      });

      newSocket.on("connect", () => {
        setIsConnecting(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error('socket', error)
        setIsConnecting(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.error('socket', error)
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    // socket.on("log_message", (message: LogMessage) => {
    //   const domain = message.data.domain;

      // setLogsByServer((prevLogs) => {
      //   const newLogs = new Map(prevLogs);
      //   const serverLogs = newLogs.get(domain) || [];
      //   newLogs.set(domain, [...serverLogs, message]);
      //   return newLogs;
      // });
    // });

    return () => {
      socket.off("log_message");
    };
  }, [socket]);

  const handleTerminate = async (pid: number) => {
    setIsConnecting(true);

    if (!pid) {
      console.error("No pid available");
      return;
    }

    try {
      const response = await stopProcesses(pid);

      if (response?.data) {
        const newTableData: TableData[] = response.data.map((item) => ({
          domain: item.domain,
          attack_time: item.attack_time,
          remaining_time: item.remaining_time,
          concurrents: item.concurrents,
          pid: item.pid,
        }));

        setIsConnecting(false);
        setTableData(newTableData);
      }
    } catch (error) {
      setIsConnecting(false);
      console.error("Error fetching process list:", error);
    }
  };

  const handleTerminateConfirm = (pid: number) => {
    const isConfirmed = window.confirm(`Do you really want to terminate process PID: ${pid}?`);
    if (isConfirmed) {
      handleTerminate(pid);
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
    <div className="overflow-hidden h-full inner-body">
      <div className="content-body h-full relative">
        <ParticlesAnimation />
        <div className="mx-auto p-8 relative flex flex-col justify-center items-center h-full w-full">

          {/* HÀNG 1 - THỐNG KÊ */}
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
                    title={<span className="text-gray-300">Active Attacks</span>}
                    value={tableData.length}
                    prefix={<FaCrosshairs className="mr-2 text-red-500" />}
                    valueStyle={{ color: "#ff4d4f" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className="bg-gray-800 text-white">
                  <Statistic
                    title={<span className="text-gray-300">Scheduled</span>}
                    // value={`${scheduledTasks.current}/${scheduledTasks.total}`}
                    prefix={<FaNetworkWired className="mr-2 text-blue-500" />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card className="bg-gray-800 text-white">
                  <Statistic
                    title={<span className="text-gray-300">Preset</span>}
                    // value={`${presetTasks.current}/${presetTasks.total}`}
                    prefix={<FaShieldAlt className="mr-2 text-yellow-500" />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
            </Row>
          </motion.div>

          {/* HÀNG 2 - ATTACK MANAGER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-5xl"
          >
            <Card title="ATTACK MANAGER" className="w-full">
              <div className="h-full flex flex-col">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  rowKey="id"
                  locale={emptyData}
                  scroll={{ y: 24 * 24 }}
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

          {/* TRẠNG THÁI KẾT NỐI */}
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

export default Page;