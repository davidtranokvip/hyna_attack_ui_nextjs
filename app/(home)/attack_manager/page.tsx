
'use client';

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button, Card, Empty, Table } from "antd";
import { terminateServerAttack } from "@/api/attack";
import { useSearchParams } from 'next/navigation';
import CountdownTimer from "@/components/elements/CountDownTimer";
import ParticlesAnimation from "@/components/elements/Backgroun";

interface LogMessage {
  data: {
    target: string;
    attack_time: string;
    attack_id: number;
    thread: number;
  }[];
  status: string;
  message: string;
}

interface TableData {
  target: string;
  attack_time: string;
  attack_id: number;
  thread: number;
}

const data: LogMessage["data"] = [
  {
      attack_id: 2,
      target: 'https:://789bet.vn',
      thread: 30,
      attack_time: '2h',
  },
  {
      attack_id: 2,
      target: 'https:://789bet.vn',
      thread: 30,
      attack_time: '2h',
  },
  {
      attack_id: 2,
      target: 'https:://789bet.vn',
      thread: 30,
      attack_time: '2h',
  },
  {
      attack_id: 2,
      target: 'https:://789bet.vn',
      thread: 30,
      attack_time: '2h',
  },
]

const Page = () => {

  const searchParams = useSearchParams();
  const attackId = searchParams.get('attackId');
  const [logsByServer, setLogsByServer] = useState<Map<string, LogMessage[]>>(
    new Map()
  );
  const [tableData, setTableData] = useState<TableData[]>(data);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleTerminate = async(target: string) => {
    try {
      console.log(target);
    } catch (error) {
      console.log(error);
    }
  }
  const columns = [
    {
      title: 'Site',
      dataIndex: 'target',
      key: 'target',
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
    },
    {
      title: 'Time',
      dataIndex: 'attack_time',
      key: 'attack_time',
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      render: (seconds: number) => <CountdownTimer totalSeconds={seconds} />
    },
    {
      title: 'Thread',
      dataIndex: 'thread',
      key: 'thread',
      className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      render: (seconds: number) => <CountdownTimer totalSeconds={seconds} />
    },
    {
      title: 'Option',
        key: '',
        className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
        render: (_: any, record: TableData) => (
          <Button onClick={() => handleTerminate(record.target)}>CANCEL</Button>
      ),
    },
];

  // useEffect(() => {
  //   const newTableData: TableData[] = [];
    
  //   logsByServer.forEach((messages) => {
  //     if (messages.length > 0) {
  //       const firstMessage = messages[0];
        
  //       newTableData.push({
  //         id: `${firstMessage.data.domain}-${firstMessage.data.attack}`,
  //         domain: firstMessage.data.domain,
  //         attack_time: firstMessage.data.attack_time,
  //         attack: firstMessage.data.attack,
  //         server: firstMessage.data.server
  //       });
  //     }
  //   });
    
  //   setTableData(newTableData);
  // }, [logsByServer]);

  // useEffect(() => {
  //   try {
  //     const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  //       reconnection: true,
  //       timeout: 10000,
  //       transports: ['websocket']
  //     });

  //     newSocket.on("connect", () => {
  //       setIsConnecting(false);
  //     });

  //     newSocket.on("connect_error", (error) => {
  //       console.error('socket', error)
  //       setIsConnecting(false);
  //     });

  //     setSocket(newSocket);

  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   } catch (error) {
  //     console.error('socket', error)
  //     setIsConnecting(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("log_message", (message: LogMessage) => {
  //     const domain = message.data.domain;

  //     setLogsByServer((prevLogs) => {
  //       const newLogs = new Map(prevLogs);
  //       const serverLogs = newLogs.get(domain) || [];
  //       newLogs.set(domain, [...serverLogs, message]);
  //       return newLogs;
  //     });
  //   });

  //   return () => {
  //     socket.off("log_message");
  //   };
  // }, [socket]);

  // const handleTerminate = async (server: string) => {
  //   if (!attackId) {
  //     console.error("No attack ID available");
  //     return;
  //   }
  //   try {
  //     await terminateServerAttack(parseInt(attackId), server);
  //     setLogsByServer((prevLogs) => {
  //       const newLogs = new Map(prevLogs);
  //       newLogs.delete(server);
  //       return newLogs;
  //     });
  //   } catch (error) {
  //     setTableData([]);
  //     console.error('error data', error);
  //   }
  // };
  
  const emptyData = {
    emptyText: <Empty className="h-full"/>
  };

  return (
    <div className="overflow-hidden h-full inner-body">
      <div className="content-body h-full relative">
        <ParticlesAnimation />
        <div className="mx-auto p-8 relative flex justify-center items-center h-full w-full">
          <Card title='ATTACK MANAGER' className="w-3/4" >
            <div className="h-full flex flex-col">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                rowKey="id"
                locale={emptyData}
                scroll={{ y: 24 * 24}}
                loading={isConnecting}
                style={{ background: '#2c2c2c', border: "1px solid #444444", borderRadius: '0.375rem', flex: '1 1 auto', overflow: 'auto' }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;