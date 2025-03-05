'use client';

import { Card, Popconfirm, Table, TableProps } from 'antd';
import React from 'react';

const dataList =  [
    {
      "target": "https://q88.com",
      "id": 138,
      "time": "1h 59m 11s",
    },
    {
        "target": "https://q88.com",
        "id": 198,
        "time": "1h 59m 11s",
    },
]

const Page = () => {

    const handelCancelAttack = (id: number) => {
        console.log(id);
    }

    const columns: TableProps['columns'] = [
        {
            title: 'TARGET',
            dataIndex: 'target',
            key: 'target',
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center bor",
        },
        {
            title: 'TIME ATTACK',
            dataIndex: 'time',
            key: 'time',
            className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
        },
        {
            title: 'Actions',
              key: 'actions',
              className: "bg-card py-2 text-primary text-[1.125rem] leading-[normal] text-center",
              render: (_: any, record: any) => (
                    <Popconfirm
                        title="Cancel attack"
                        description="Are you sure you want to cancel attack?"
                        okText="Yes"
                        onConfirm={() => record.id && handelCancelAttack(record.id)}
                        cancelText="No"
                    >
                        <button type="submit" className="font-base py-1 px-2 bg-primary float-end text-black text-xl rounded transition-all duration-300 ease-in-out active:opacity-10 hover:shadow-md hover:shadow-[#00ff00]">
                            CANCEL
                        </button>
                    </Popconfirm>
            ),
        },
      ];

    return (
        <div className="overflow-hidden h-full inner-body">
            <div className="content-body h-full">
                <div className="mx-auto p-8 relative">
                    <Card title='ATTACK MANAGER'>
                        <Table
                        pagination={false}
                        rowKey="id"
                        locale={{ emptyText: null }}
                        showHeader={false}
                        columns={columns}
                        dataSource={dataList}
                        style={{ marginBottom: 16, tableLayout: 'fixed', background: '#2c2c2c', border: "1px solid #444444", borderRadius: '0.375rem' }}
                        />
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page;