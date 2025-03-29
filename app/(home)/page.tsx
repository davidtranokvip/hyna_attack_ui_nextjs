"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence  } from "framer-motion";
import NoticeError from "@/components/notice/NoticeError";
import Datalist from "@/components/dashboard/DataList";
import Image from "next/image";
import { checkHostApi } from "@/api/checkhost";

const targetCountry = "Vietnam";
const baseUrlBlockInternet = process.env.NEXT_PUBLIC_BASE_API_BLOCKING_INTERNET;

export default function Home() {
 
  const [target, setTarget] = useState("");
  const [result, setResult] = useState<[]>([]);
  const [blockingInterNet, setBlockingInterNet] = useState<[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState("");
  const [domain, setDomain] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1280);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setResult([]);
    setBlockingInterNet([]);

    if (!target) {
      setError("ENTER SITE");
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
      const [checkInternet, checkHost] = await Promise.all([
        axios.get(`${baseUrlBlockInternet}/site`, {
          params: { domain: target }
        }),
        checkHostApi({ host: target })
      ]);
  
      if (checkInternet?.data) {
        setBlockingInterNet(checkInternet.data);
      }
      
      if (checkHost?.data) {
        setResult(checkHost.data);
      }
    } catch (error: any) {
      console.error('error', error)
      setError("ERROR DURING SEARCH");
    }
  };

  const filteredAndSorted = result && result.length > 0
    ? result
        .filter((item: any) => item?.statusCode !== 'no data' && item?.statusCode !== null)
        .slice()
        .sort((a: any, b: any) => {
          if (a.country === targetCountry && b.country !== targetCountry)
            return -1;
          if (b.country === targetCountry && a.country !== targetCountry)
            return 1;
          return 0;
        })
  : [];

  const blockedCountries: string[] = filteredAndSorted
    .map((item: any) => {
      if (item.statusCode != 200) {
        return item.country;
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

  return (
    <>
      {error && (
        <NoticeError error={error} setError={setError} myClass="text-5xl mb-0 leading-[3.5rem]" />
      )}
      <div className={`${isMobile ? '' : 'h-full'} overflow-y-auto inner-body p-8`}>
        <div className="content-body h-full">
          <div className="mx-auto relative h-full">
            <div className={`grid gap-4 h-full ${isMobile 
                ? 'grid-cols-1' 
                : isSearched ? 'grid-cols-3 grid-rows-2' : 'grid-cols-3 grid-rows-2'
              }`}>
                <motion.div
                  layout
                  className={`flex flex-col items-center ${
                    isMobile
                      ? ''
                      : isSearched 
                        ? 'row-span-2 col-start-1 col-end-2' 
                        : 'row-span-2 col-start-2 col-end-3'
                  }`}
                  transition={{ duration: 0.5, delay: 0.2, ease: ["easeOut", "easeIn"], }}
                >
                  <Image
                    src="/images/logo.png"
                    width={isMobile ? 350 : 450}
                    height={isMobile ? 350 : 450}
                    className={`${isMobile ? 'mb-4' : ''}`}
                    alt="HYNY SYSTEM"
                  />  
                  <AnimatePresence>
                    {isSearched && (
                      <motion.h2
                        key="animated-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.2, ease: ["easeIn", "easeOut"], }}
                        exit={{ opacity: 0 }}
                        className={`${isMobile ? 'text-3xl' : 'text-5xl'} mb-3 text-center text-primary font-bold leading-[normal] z-40`}
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
                         className={`block font-semibold w-full bg-card text-primary flex-1 leading-5 ${isMobile ? 'text-lg' : 'text-xl'} focus:outline-none focus:ring-0`}
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
                      <div className={`text-primary ${isMobile ? 'text-lg' : 'text-2xl'} font-light m-2 leading-[normal]`}>
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
                className={`${isMobile ? '' : 'col-span-2 row-span-2'}`}
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
