"use client";
import { motion } from "framer-motion";
// import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  ZoomableGroup,
  Geography,
} from "react-simple-maps";
import Loading from "../elements/Loading";
import { Table, TableProps } from "antd";

interface FilterItemType {
  id: number;
  location: string;
  code: string | number;
}

interface SectionProps {
  domain: string;
  filteredAndSorted: FilterItemType[];
  blockingInterNet: [];
  blockedCountries: string[];
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120
    }
  }
};

const columns: TableProps<FilterItemType>['columns'] = [
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
  },
  {
    title: 'Status',
    dataIndex: 'code',
    key: 'code',
    className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
  },
  {  
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    className: "bg-card text-primary text-[1.125rem] leading-[normal] text-center",
  },
];
const Datalist: React.FC<SectionProps> = ({ domain, filteredAndSorted, blockingInterNet, blockedCountries }) => {
  // const [tooltipContent, setTooltipContent] = useState("");
    return (
        <section className="h-full">
        <div className="grid gap-4 h-full grid-cols-2 grid-rows-6">
          <div className="card col-[1] row-[1]">
            <div className="font-bold text-primary text-[30px] leading-[normal]">TAGRET ATTACK</div>
            <h2 className="text-red-700 text-xl truncate mb-0 px-3">
              {domain}
            </h2>
          </div>
          <div className="card flex flex-col col-[2] row-[1_/_span_6] overflow-y-auto scrollbar-custom">
              <div className="font-bold text-primary text-[30px] leading-[normal]">ATTACK SURFACE ANALYSIS</div>
              <div className={`flex flex-col mt-2 px-3 h-full ${filteredAndSorted && filteredAndSorted.length > 0 ? 'overflow-auto' : 'overflow-hidden'}`}>
              <Table
                  columns={columns}
                  // dataSource={dataList}
                  loading={true}
                  style={{ height: '100%', tableLayout: 'fixed', background: '#2c2c2c', border: "1px solid #444444", borderRadius: '0.375rem' }}
                />
                {/* <table className="table-fixed">
                  <thead className="sticky top-0 z-10 bg-card border-myborder">
                    <tr>
                      <th className="text-left"><h4 className="text-primary text-xl">Location</h4></th>
                      <th className="text-left"><h4 className="text-primary text-xl">Code</h4></th>
                      <th className="text-right"><h4 className="text-primary text-xl">IP address</h4></th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredAndSorted.length > 0 ? (
                    filteredAndSorted.map((item: any, index) => (
                      <tr key={index} >
                        <td className="h-[38px] border-t">
                          <div className="flex items-center gap-4">
                            <div className="relative flex items-center gap-3">
                              {[...Array(6)].map((_, index) => (
                                <Loading index={index} key={index}/>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="border-t h-[38px]"></td>
                        <td className="border-t h-[38px]"></td>
                      </tr>
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                        >
                          <td className="h-[38px] py-2 border-t text-primary">{item.location}</td>
                          <td className="h-[38px] py-2 border-t text-primary">{item.code}</td>
                          <td className="h-[38px] py-2 border-t text-primary text-right">{item["IP address"]}</td>
                        </motion.tr>
                      ))
                  ) : (
                    Array.from({ length: 120 }).map((_, index) => (
                      <tr key={index} >
                        <td className="h-[38px] border-t">
                          <div className="flex items-center gap-4">
                            <div className="relative flex items-center gap-3">
                              {[...Array(6)].map((_, index) => (
                                <Loading index={index} key={index}/>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="border-t h-[38px]"></td>
                        <td className="border-t h-[38px]"></td>
                      </tr>
                     ))
                  )} 
                  </tbody>
                </table> */}
            </div>
          </div>
          <div className={`card flex flex-col col-[1] row-[2_/_span_3] overflow-hidden px-3`}>
            {filteredAndSorted.length > 0 ? (
              <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
              >
                <>
                  <ComposableMap >
                  <ZoomableGroup center={[0, 0]} zoom={1}>
                    <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                        {({ geographies }: any) =>
                        geographies.map((geo: any) => {
                          const countryName = geo.properties.name;
                          const isBlocked = blockedCountries.some(country => 
                            country.toLowerCase() === countryName.toLowerCase()
                        );
                          return (
                            <Geography
                              id="country-block-site"
                              key={geo.rsmKey}
                              geography={geo}
                              fill={isBlocked ? "red" : "#DDD"}
                              stroke="rgb(0, 255, 0)"
                              // onMouseEnter={() => {
                              //   setTooltipContent(countryName);
                              // }}
                              // onMouseLeave={() => {
                              //   setTooltipContent("");
                              // }}
                              style={{
                                default: { outline: "none" },
                                hover: { fill: "rgb(0, 255, 0)", outline: "none" },
                                pressed: { outline: "none" },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                  {/* <Tooltip anchorSelect="#country-block-site" content={tooltipContent} /> */}
                </>
              </motion.div>
            ) : (
              <div className="relative flex items-center justify-center h-full gap-3">
                {[...Array(8)].map((_, index) => (
                  <Loading index={index} key={index} />
                ))}
              </div>
            )}
          </div>
          <div className="card flex flex-col col-[1] row-[5_/_span_2] overflow-hidden">
              <div className="font-bold text-primary text-[30px] leading-[normal]">NETWORK BLOCK DETECTION</div>
              {blockingInterNet?.length > 0 ? (
                <motion.ul  
                className="mt-3 px-3"
                initial="hidden"
                animate="visible"
                variants={listVariants}
                >
                  {blockingInterNet.map((item: any, index: any) => (
                    <motion.li key={index} className="mb-2" variants={itemVariants}>
                      <div className="flex items-center justify-between">
                        <div className="text-bold text-lg text-primary leading-[normal]">{item?.name}</div>
                        <motion.div 
                          className={`badge ${item?.statusCode === 200 ? 'bg-primary' : 'bg-danger'}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
                          >
                          {item?.result}
                        </motion.div>
                      </div>
                    </motion.li>
                  ))}
              </motion.ul>
              ) : (
                [...Array(4)].map((_, index) => (
                  <div key={index} className="relative flex justify-center items-center gap-3 mb-2 h-[26px] mt-3 px-3 ">
                    {[...Array(8)].map((_, index) => (
                      <Loading index={index} key={index} />
                    ))}
                  </div>
                ))
              )}
            </div>
        </div>
      </section>
    )
}

export default Datalist;