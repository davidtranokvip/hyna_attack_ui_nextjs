'use client';

import { getUserLog, IUserLog } from "@/api/users";
import { Card, Empty, Table } from "antd";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";
dayjs.extend(utc);

const Page = () => {

    const [tableData, setTableData] = useState<IUserLog['data']>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchingData = async () => {
            setLoading(true)
            try {
                const result = await getUserLog();
                if (result.status === 'success') {
                    setTableData(result.data || []);
                }
            } catch (error) {
                    console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchingData();
    }, []);
    const handlePageChange = (page: number, pageSize: number) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    };

    const columns = [
      {
        title: 'Account',
        key: 'name_account',
        dataIndex: 'name_account',
        className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
          title: 'IP Address',
          key: 'ip',
          dataIndex: 'ip',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      {
          title: 'Detail',
          key: 'detail',
          dataIndex: 'detail',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
      },
      { 
          title: 'Time active',
          key: 'time_active',
          dataIndex: 'time_active',
          className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
            render: (time_active: string) => {
                return dayjs(time_active).utc().format('DD/MM/YYYY HH:mm:ss');
            }
      },
    ];

    const emptyData = {
      emptyText: <Empty />
    };

    return (
        <>
          <div className="overflow-hidden h-full inner-body">
            <div className="content-body h-full">
              <div className="mx-auto p-8 relative">
                <Card title='USERS LOG'>
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                      position: ['bottomCenter'],
                      current: currentPage,
                      pageSize: pageSize,
                      onChange: handlePageChange,
                      total: tableData.length,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50'],
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      className: 'text-primary'
                  }}
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
        </>
    )
}

export default Page;