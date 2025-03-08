'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Select, Slider, Input, Form, Switch } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { createAttack } from '@/api/attack';
import { attackTypeSystem } from '../settings/components/data';
import { getSettingApi, ISettingRes, ISettingItem } from '@/api/settings';
import { convertToUppercaseWords } from '@/helpers/convertText';
import { useAuth } from '@/shared/lib/auth';
import { getServerList, IServerItem, IServerRes } from '@/api/server';
import { FiMonitor } from 'react-icons/fi';
import LoadingPage from '@/components/elements/LoadingPage';
import { useRouter } from "next/navigation";
import NoticeError from '@/components/notice/NoticeError';
import Image from "next/image";
const { Option } = Select;

interface IServerAttackType {
    id: number;
    ip: string;
    name: string;
}

const rightPanelVariants = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },  
    exit: { opacity: 0, y: -100 }
};

const Page = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const router = useRouter();
    const [typeAttack, setTypeAttack] = useState<string>(attackTypeSystem[0].value);
    const [settings, setSettings] = useState<ISettingItem[]>([]);
    const [servers, setServers] = useState<IServerItem[]>([]);
    const [concurrentValue, setConcurrentValue] = useState<number>(0);
    const [requestValue, setRequestValue] = useState<number>(0);
    const [isModeWithBlade, setIsModeWithBlade] = useState<boolean>(false);
    const [isModeDeathWork, setIsModeDeathWork] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [attackLoading, setAttackLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchingData = async () => {
        try {
            const result: IServerRes = await getServerList();
                if(result.status === 'success') {
                    setServers(result.data);
                }
        } catch (error) {
            console.error("Error fetching", error);
        }
    }
    fetchingData();
    }, []);

    const generateInitialValues = useCallback((settings: ISettingItem[]) => {
        const initialValues: Record<string, any> = {};
        const typeAttackSelect = settings.filter((setting) => setting.type === typeAttack);

        typeAttackSelect.forEach((setting) => {
            if (setting.input === "select" && setting.value.length > 0) {
                initialValues[setting.group] = setting.value[0].value;
            } else if (setting.input === "slider" && setting.value.length > 0) {
                const values = setting.value.map(item => 
                    typeof item.value === 'string' ? parseInt(item.value, 10) : item.value
                );
                initialValues[setting.group] = Math.min(...values);
            } else if (setting.group.toLowerCase() === "option" && setting.value.length > 0) {
                setting.value.forEach((option) => {
                    initialValues[option.key] = false;
                });
            }
        });

        return initialValues;
    }, [typeAttack]);

    useEffect(() => {
        let isMounted = true;
        const fetchingData = async () => {
            try {
                setIsLoading(true);
                const result: ISettingRes = await getSettingApi();
                if (!isMounted) return;
                
                if(result.status === 'success') {
                    const settingsData = result.data || [];
                    setSettings(settingsData);
                    
                    setTimeout(() => {
                        if (isMounted && settingsData.length > 0) {
                            try {
                                const initialValues = generateInitialValues(settingsData);
                                form.setFieldsValue(initialValues);
                            } catch (error) {
                                console.error("Error setting initial", error);
                            }
                        }
                    }, 0);

                    setIsLoading(false);    
                }
            } catch (error) {
                console.error("Error fetching", error);
            }
        }

        fetchingData();

        return () => {
            isMounted = false;
        };
    }, [generateInitialValues, form]);

    useEffect(() => {
        const typeAttackSelect = settings.filter((setting) => setting.type === typeAttack);
        const finalSetting = [...typeAttackSelect].sort((a, b) => a.stt - b.stt);
        const modeSetting = finalSetting.find(s => s.group.toLowerCase() === "mode");

        try {

            const requestSetting = finalSetting.find(s => s.group.toLowerCase() === "request");
            if (requestSetting && form.getFieldValue(requestSetting.group)) {
                setRequestValue(form.getFieldValue(requestSetting.group));
            }

            const concurrentSetting = finalSetting.find(s => s.group.toLowerCase() === "concurrents");
            if (concurrentSetting && form.getFieldValue(concurrentSetting.group)) {
                setConcurrentValue(form.getFieldValue(concurrentSetting.group));
            }

            if (modeSetting) {
                const modeValue = form.getFieldValue(modeSetting.group);
                if (modeValue) {
                    const selectedMode = modeSetting.value.find(v => 
                        v.value === modeValue || v.key === modeValue
                    );
                    if (selectedMode) {
                        const isBladeMode = selectedMode.label.toLowerCase().includes("blade");
                        const isDeathWorkMode = selectedMode.label.toLowerCase().includes("death sword");
                        setIsModeWithBlade(isBladeMode);
                        setIsModeDeathWork(isDeathWorkMode);
                    }
                }
            }
        } catch (error) {
            console.error("Error accessing", error);
        }
    }, [form, settings, typeAttack]);

    const renderGroupedSetting = () => { 
        const typeAttackSelect = settings.filter((setting) => setting.type === typeAttack);
        
        const finalSetting = [...typeAttackSelect].sort((a, b) => a.stt - b.stt);

        const concurrentsGroup = finalSetting.find(setting => 
            setting.group.toLowerCase() === "concurrents"
        );
        
        const totalThreads = concurrentsGroup 
            ? Math.max(...concurrentsGroup.value.map(item => 
                typeof item.value === 'string' ? parseInt(item.value, 10) : item.value
              )) 
            : 100;

        const filteredSettings = finalSetting.filter(setting => {
            const groupName = setting.group.toLowerCase();
            if (isModeWithBlade && groupName.includes("death_sword_http")) {
                return false;
            }
            if (isModeDeathWork && groupName.includes("spoof")) {
                return false;
            }
            
            return true;
        });

        return (   
            <>
                {filteredSettings.map((setting, index, array) => {
                    const isConcurrentsGroup = setting.group.toLowerCase() === "concurrents";
                    const isRequestGroup = setting.group.toLowerCase() === "request";
                    const isModeGroup = setting.group.toLowerCase() === "mode";
                    const isLastItemInOddArray = index === array.length - 1 && array.length % 2 !== 0;

                    const marks: Record<number, string> = setting.input === "slider" && !isRequestGroup 
                    ? setting.value.reduce((acc: Record<number, string>, item) => {
                        const numValue = typeof item.value === 'string' ? parseInt(item.value, 10) : item.value;
                        acc[numValue] = item.label;
                        return acc;
                    }, {})
                    : {};

                    const values = setting.input === "slider"
                        ? setting.value.map(item => typeof item.value === 'string' ? parseInt(item.value, 10) : item.value)
                        : [0, 100];

                    const min = Math.min(...values);
                    const max = Math.max(...values);
                 
                    return (
                        <div key={setting.id} className={`flex flex-col card ${isLastItemInOddArray ? 'col-span-2' : ''}`}>
                            <div className="font-bold text-primary text-[30px] leading-[normal] mb-3">{convertToUppercaseWords(setting.group)}</div>
                                {setting.description && (
                                    <div 
                                        className="text-sm text-primary mb-3" 
                                        dangerouslySetInnerHTML={{ __html: setting.description }}
                                    />
                                )}
                                {setting.input === "select" && (
                                    <Form.Item name={setting.group}>
                                        <Select size='large' onChange={(value) => {
                                        if (isModeGroup) {
                                            const selectedMode = setting.value.find(v => 
                                                v.value === value || v.key === value
                                            );
                                            if (selectedMode) {
                                                const isBladeMode = selectedMode.label.toLowerCase().includes("blade");
                                                const isDeathWorkMode = selectedMode.label.toLowerCase().includes("death sword");
                                                
                                                setIsModeWithBlade(isBladeMode);
                                                setIsModeDeathWork(isDeathWorkMode);
                                            }
                                        }
                                    }}>
                                        {setting.value.map((option) => (
                                            <Option key={option.key} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                    </Form.Item>
                                )}
                                {setting.input === "slider" && (
                                    <>
                                        <Form.Item name={setting.group}>
                                            <Slider min={min} max={max} step={1} marks={marks} onChangeComplete={(value) => {
                                                if (isConcurrentsGroup) {
                                                    setConcurrentValue(value);
                                                }
                                                if (isRequestGroup) {
                                                    setRequestValue(value);
                                                }
                                            }}/>
                                        </Form.Item>
                                        {isConcurrentsGroup && (
                                            <div className="text-primary text-xl">
                                                Remaining threads: {totalThreads - concurrentValue}
                                            </div>
                                        )}
                                        {isRequestGroup && (
                                            <div className="mt-3 flex justify-between items-center">
                                                {setting.value.map((option) => {

                                                    const buttonValue = typeof option.value === 'string' ? 
                                                    parseInt(option.value, 10) : option.value;
                                                    
                                                    const isActive = requestValue === buttonValue;
                                                    return (
                                                        <div 
                                                            key={option.key}
                                                            className={`p-2 rounded text-center cursor-pointer border transition-all duration-300 ease-in-out hover:opacity-90 text-xs 
                                                                ${isActive
                                                                    ? 'bg-primary text-black'
                                                                    : 'text-[#00ff00] bg-[#202020] border-[#00ff00]'
                                                                }`}   
                                                            onClick={() => {
                                                                form.setFieldsValue({
                                                                    [setting.group]: buttonValue
                                                                });
                                                                setRequestValue(buttonValue);
                                                            }}
                                                        >
                                                            Set range [{option.label}]
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}
                                {setting.input === "toggle" && (
                                    <div className="flex gap-5">
                                        {Object.entries(
                                            setting.value.reduce((acc: Record<string, { label: string; value: boolean }>, option) => {
                                            const key = option.key;
                                            const isTrue = typeof option.value === 'string' 
                                            ? option.value.includes("true") 
                                            : String(option.value).includes("true");
                                            
                                            if (!acc[key]) {
                                                acc[key] = {
                                                    label: option.label,
                                                    value: isTrue
                                                };
                                            }
                                            return acc;
                                        }, {})
                                        ).map(([key, { label, value }]) => (
                                            <Form.Item
                                                key={key}
                                                name={key}
                                                valuePropName="checked"
                                                initialValue={value}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        onChange={(checked) => {
                                                            form.setFieldsValue({ [key]: checked });
                                                        }}
                                                    />
                                                    <span className="text-primary">{label}</span>
                                                </div>
                                            </Form.Item>
                                        ))}
                                    </div>
                                )}
                        </div>
                    );
                })}
            </>  
        )
    }   

    const RightPanelContent = () => (
        <div className="h-full grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)'}}>
            {renderGroupedSetting()}

            {user?.isAdmin  && (
                    <div className="flex flex-col card col-span-2">
                    <>
                        <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">SERVERS</div>
                        <div className="text-sm text-primary mb-3">
                            MODE: <code>DEVIL</code>
                        </div>
                        <Form.Item name="servers" className="mb-0">
                            <Select
                                mode="multiple"
                                size='large'
                                placeholder="Server enter"
                                optionLabelProp="label"
                                className='custom'
                                >
                                {servers.map((server: IServerAttackType) => (
                                    <Option key={server.id} value={server.id} label={<span>{server.name}<span style={{ color: '#999', marginLeft: 8 }}>{server.ip}</span></span>}>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <FiMonitor className="text-xl" />
                                                <span>{server.name}</span>
                                            </div>
                                        <div className="text-xs text-gray-500">{server.ip}</div>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </>
                </div>
            )}
        </div>
    )

    const handleAttack = async(payload: any) => {
        try {
            setAttackLoading(false);
            if (!payload.domain || payload.domain.trim() === '') {
                setError('ENTER SITE');
                return;
            }
            setAttackLoading(true);
            const dataPayload = {
                ...payload,
                attack_time: payload.attack_time * 3600
            }
            const result = await createAttack(dataPayload);
            if(result.status === 'success') {
                setAttackLoading(false)
                router.push(`/attack_manager?attackId=${result.data.attack}`);
            }
        } catch (error: any){
            console.log('error attack', error);         
            setAttackLoading(false);
        }
    } 
    const handleChangeTypeAttack = (value: string) => {
        setTypeAttack(value);
    };

    const getSelectedLabel = () => {
        const selected = attackTypeSystem.find((state) => state.value === typeAttack);
        return selected ? selected.label : '';
    };

    return (
        <div className="inner-body">    
            {error && (
                <NoticeError error={error} setError={setError} myClass="text-5xl mb-0 leading-[3.5rem]" />
            )}
            {isLoading ? (
                <LoadingPage />
            ) : (
            <Form form={form} onFinish={handleAttack} layout="vertical">
                <div className="content-body" style={{ minHeight: 'auto' }}>
                    <div className="mx-auto p-6">
                        <div className="h-full flex gap-x-6">
                            <div className="h-full p-4 flex flex-col w-[525px] min-w-[525px] max-w-[525px] fixed t-0 l-0 z-10">
                                {/* <SceneWrapper myClass="h-[410px]" /> */}
                                <div className='w-full flex justify-center'>
                                    <Image
                                        src="/images/ddos.png"
                                        width={350}
                                        height={350}
                                        alt="Picture of the ddos"
                                    />
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-center text-primary text-2xl font-extrabold mb-4">STATE: {getSelectedLabel()}</h1>
                                    <div className="flex flex-col card">
                                        <div className="text-base text-primary mb-2">
                                            Consider between <code>HYNA Valkyra</code> and <code>HYNA Warrior</code> for the most effective attack
                                        </div>
                                        <Form.Item name="domain" className="mb-0">
                                            <Input size='large' className="mb-2" autoComplete="off" placeholder="Enter url website" />
                                        </Form.Item>
                                        <Form.Item name="typeAttack" className="mb-0" initialValue={typeAttack}>
                                            <Select 
                                                size='large'
                                                options={attackTypeSystem}
                                                onChange={handleChangeTypeAttack}
                                                />
                                        </Form.Item>
                                    </div>
                                </div>  
                                <button type="submit" disabled={attackLoading} className="font-black py-3 bg-primary float-end text-black text-4xl rounded transition-all duration-300 ease-in-out active:opacity-10 hover:shadow-md hover:shadow-[#00ff00]">
                                {attackLoading ? 'ATTACKING...' : 'ATTACK'}
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
            )}
        </div>
    );
}

export default Page;