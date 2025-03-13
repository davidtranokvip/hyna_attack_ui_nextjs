"use client";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  ZoomableGroup,
  Geography,
} from "react-simple-maps";
import Loading from "../elements/Loading";
import { Tooltip } from "antd";
import { useState, useEffect } from "react";

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

const Datalist: React.FC<SectionProps> = ({ domain, filteredAndSorted, blockingInterNet, blockedCountries }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1280);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section className="h-full">
      <div className={`grid gap-4 h-full ${isMobile 
        ? 'grid-cols-1' 
        : 'grid-cols-2 grid-rows-6'}`}
      >
        <div className={`card ${isMobile ? '' : 'col-[1] row-[1]'}`}>
          <div className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-[30px]'} leading-[normal]`}>
            TARGET ATTACK
          </div>
          <h2 className="text-red-700 text-xl truncate mb-0 px-3">
            {domain}
          </h2>
        </div>
        <div className={`card flex flex-col ${isMobile ? 'max-h-[400px]' : 'col-[2] row-[1_/_span_6]'} overflow-y-auto scrollbar-custom`}>
          <div className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-[30px]'} leading-[normal]`}>
            ATTACK SURFACE ANALYSIS
          </div>
          <div className={`flex flex-col mt-2 px-3 h-full ${filteredAndSorted && filteredAndSorted.length > 0 ? 'overflow-auto' : 'overflow-hidden'}`}>
            <table className="table-fixed">
              <thead className="sticky top-0 z-10 bg-card border-myborder">
                <tr>
                  <th className="text-left"><h4 className={`text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>Location</h4></th>
                  <th className="text-left"><h4 className={`text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>Code</h4></th>
                  <th className="text-right"><h4 className={`text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>IP address</h4></th>
                </tr>
              </thead>
              <tbody>
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((item: any, index) => (
                  <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                    >
                      <td className="py-2 border-t text-primary">{item.location}</td>
                      <td className="py-2 border-t text-primary">{item.code}</td>
                      <td className="py-2 border-t text-primary text-right">{item["IP address"]}</td>
                    </motion.tr>
                  ))
              ) : (
                Array.from({ length: isMobile ? 10 : 120 }).map((_, index) => (
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
            </table>
          </div>
        </div>

        {/* Map section */}
        <div className={`card flex flex-col ${isMobile ? 'min-h-[250px]' : 'col-[1] row-[2_/_span_3]'} overflow-hidden px-3`}>
          {filteredAndSorted.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            >
              <>
                <ComposableMap>
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
                            onMouseEnter={(event) => {
                              setTooltipContent(countryName);
                              setTooltipVisible(true);
                              setTooltipPosition({ x: event.clientX, y: event.clientY }); 
                            }}
                            onMouseLeave={() => {
                              setTooltipVisible(false); 
                            }}
                            onMouseMove={(event) => {
                              setTooltipPosition({ x: event.clientX, y: event.clientY }); 
                            }}
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
                <Tooltip
                  title={tooltipContent}
                  visible={tooltipVisible}
                  overlayStyle={{
                    position: 'fixed', 
                    left: tooltipPosition.x + 10, 
                    top: tooltipPosition.y + 10, 
                    pointerEvents: 'none', 
                  }}
                >
                  <span style={{ position: 'absolute', opacity: 0 }} />
                  </Tooltip>
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

        <div className={`card flex flex-col ${isMobile ? '' : 'col-[1] row-[5_/_span_2]'} overflow-hidden`}>
            <div className={`font-bold text-primary ${isMobile ? 'text-2xl' : 'text-[30px]'} leading-[normal]`}>
              NETWORK BLOCK DETECTION
            </div>
            {blockingInterNet?.length > 0 ? (
              <motion.ul  
              className="mt-3 px-3 leading-normal overflow-y-auto"
              initial="hidden"
              animate="visible"
              variants={listVariants}
              >
                {blockingInterNet.map((item: any, index: any) => (
                  <motion.li key={index} className="mb-2" variants={itemVariants}>
                    <div className="flex items-center justify-between">
                      <div className={`text-bold ${isMobile ? 'text-base' : 'text-lg'} text-primary leading-[normal]`}>
                        {item?.name}
                      </div>
                      <motion.div 
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-gray-500/10 ring-inset border ${item?.statusCode === 200 ? 'bg-primary text-black' : 'bg-red text-white'}`}
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
  );
};

export default Datalist;