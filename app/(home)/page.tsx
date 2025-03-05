"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence  } from "framer-motion";
import SceneWrapper from "@/components/SceneWrapper";
import NoticeError from "@/components/notice/NoticeError";
import Datalist from "@/components/dashboard/DataList";

const targetLocation = "Vietnam, Ho Chi Minh City";
const baseUrl = process.env.NEXT_PUBLIC_BASE_API_LOCAL;
const baseUrlBlock = process.env.NEXT_PUBLIC_BASE_API_BLOCKING_LOCAL;

export default function Home() {
 
  const [target, setTarget] = useState("");
  const [result, setResult] = useState<[]>([]);
  const [blockingInterNet, setBlockingInterNet] = useState<[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState("");
  const [domain, setDomain] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setResult([]);
    setBlockingInterNet([]);

    if (!target) {
      console.error("Please enter a target.");
      return;
    }
    const cleanedUrl = target.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
    setIsSearched(true);
    setDomain(cleanedUrl);
    const forbiddenDomains = ['gov', 'chinhphu.vn', 'baochinhphu.vn'];

    if (forbiddenDomains.some(domain => cleanedUrl.includes(domain))) {
      setError("DON'T ATTACK WEBSITE GOV");
      return;
    }

    try {
      const blockSite = await axios.get(`${baseUrlBlock}/site`, {
        params: {
          domain: target
        }
      });
      const response = await axios.post(`${baseUrl}/check`, {target});
      setBlockingInterNet(blockSite?.data);
      setResult(response?.data?.data);
    } catch (error: any) {
      console.log(error);
      setError("ERROR DURING SEARCH");
    }
    
  };

  const filteredAndSorted = result && result.length > 0
    ? result
        .filter((item: any) => item?.code !== 'no data' && item?.code !== null)
        .slice()
        .sort((a: any, b: any) => {
          if (a.location === targetLocation && b.location !== targetLocation)
            return -1;
          if (b.location === targetLocation && a.location !== targetLocation)
            return 1;
          return 0;
        })
  : [];

  const blockedCountries: string[] = filteredAndSorted
    .map((item: any) => {
      if (item.code != 200) {
        return item.location.split(",")[0].trim();
      } else {
        return null;
      }
    }).filter((country): country is string => country !== null);

  const blockedNetworks = blockingInterNet
    .filter((item: any) => item.statusCode !== 200)
    .map((item: any) => item.name);

  const netWorks = blockingInterNet
    .filter((item: any) => item.statusCode !== 200)
  const description = `Phân tích hoàn tất: Website ${domain} đang ${blockedCountries.length > 10 ? 'chặn' : 'mở'} trên phạm vi quốc tế nhưng ${netWorks.length > 0 ? `bị blocked từ các nhà mạng ${blockedNetworks}` : `vẫn hoạt động bình thường từ các nhà mạng` } tại VIỆT NAM _`;

  console.log(blockingInterNet);
  return (
    <>
      {error && (
        <NoticeError error={error} setError={setError} myClass="text-5xl mb-0 leading-[3.5rem]" />
      )}
      <div className="overflow-hidden h-full inner-body">
        <div className="content-body h-full">
          <div className="mx-auto p-8 relative h-full">
            <div className="grid gap-4 h-full grid-cols-3 grid-rows-2">
              <motion.div 
                layout
                className={`flex flex-col row-span-2 ${
                  isSearched ? 'col-start-1 col-end-2' : 'col-start-2 col-end-3'
                }`}
                transition={{ duration: 0.5, ease: ["easeOut", "easeIn"], }}
              >
                <SceneWrapper myClass="h-[450px] mb-3" />
                  <AnimatePresence>
                    {isSearched && (
                      <motion.h2
                        key="animated-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.1, ease: ["easeIn", "easeOut"], }}
                        exit={{ opacity: 0 }}
                        className="text-5xl mb-3 text-center text-primary font-bold leading-[normal] z-40"
                      >
                        {'HYNA EYE'.split('').map((letter, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.4, ease: ["easeIn", "easeOut"], }}
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </motion.h2>
                    )}
                  </AnimatePresence>
                  <form className="w-full" onSubmit={handleSubmit}>   
                    <div className="input-group search-area card">
                      <input 
                         type="text" 
                         autoComplete="off"
                         className="block font-semibold w-full bg-card text-primary flex-1 leading-5 text-xl focus:outline-none focus:ring-0" 
                         placeholder="Hyna Eye is ready. Enter a domain to analyze..." 
                         value={target}
                         onChange={(e) => setTarget(e.target.value)} 
                       />
                     </div>
                   </form>	
                   {filteredAndSorted.length > 0 && blockingInterNet.length > 0 &&
                      <motion.div 
                      className="px-3 py-2 mt-3 border rounded-md bg-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                    >
                       <div className="text-primary text-2xl font-light m-2 leading-[normal]">
                         {description.split('').map((letter, index) => (
                           <motion.span
                             key={index}
                             initial={{ opacity: 0, y: -20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 1.2, delay: index * 0.02, ease: 'easeOut', }}
                           >
                             {letter}
                           </motion.span>
                         ))}
                       </div>
                     </motion.div>
                   }
                 </motion.div>
               <motion.div
                 className="col-span-2 row-span-2" 
                 initial={{ opacity: 0, y: 100 }}
                 animate={{ 
                   opacity: isSearched ? 1 : 0,
                   y: isSearched ? 0 : 100,
                   display: isSearched ? 'block' : 'none'
                 }}
                 transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
               >
                 {isSearched && <Datalist blockingInterNet={blockingInterNet} domain={domain} filteredAndSorted={filteredAndSorted} blockedCountries={blockedCountries}/>}
               </motion.div>
             </div>
           </div>
         </div>
     </div>
    </>
  );
}
