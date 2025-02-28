'use client';

import React, { useState } from 'react';
import { Select, Slider, Input, SelectProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import SceneWrapper from '@/components/SceneWrapper';

interface SliderSingleProps {
  concurrents: Record<number, string>;
  attack_time: Record<number, string>;
}

interface IServerAttackType {
  value: string;
  label: string;
  ip: string;
}

const HynaInterface = () => {
  const [selectedState, setSelectedState] = useState('hyna-warrior');

  const states = [
    { value: 'hyna-warrior', label: 'HYNA WARRIOR' },
    { value: 'hyna-varryka', label: 'HYNA VARRYKA' }
  ];

  const [serverAttacks, setServerAttacks] = useState<string[]>([]);

  const serverOptions = [
    { value: "64.112.72.50", label: "Server 1", ip: "64.112.72.50" },
    { value: "91.202.4.121", label: "Server 2", ip: "91.202.4.121" },
  ];
  const handleChangeServerttack = (value: unknown): void => {
    setServerAttacks(value as string[]);
  };

  const handleStateChange: SelectProps['onChange'] = (value) => {
    setSelectedState(value as string);
  };

  const rightPanelVariants = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },  
    exit: { opacity: 0, y: -100 }
  };

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

  const RightPanelContent = () => {
    if (selectedState === 'hyna-warrior') {
      return (
        <div className="h-full grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)'}}>
            
            <div className="flex flex-col border rounded-md bg-card p-3">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-3">CONCURRENTS</div>
                <Slider tooltip={{ open: true }} step={1} marks={concurrents} defaultValue={0}/>
            </div>
            
            <div className="flex flex-col border rounded-md bg-card p-3">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">CORE STRENGTH</div>
                <div className="text-sm text-primary mb-3">
                  Select2 will work on RTL websites if the <code>dir</code>{" "}
                  attribute is set on the <code>select</code> or any parents of it.
                  You can also initialize Select2 with the{" "}
                  <code>dir: &quot;rtl&quot;</code> configuration option.
                </div>
                <CustomSelectStyled 
                    size='large'
                    defaultValue="proxy2.txt"
                    options={[{ value: 'proxy.txt', label: 'HYNA POWER' }, { value: 'proxy2.txt', label: 'RADIANT SABER' }]}
                />
            </div>
            
            <div className="flex flex-col border rounded-md bg-card p-3">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">MODE</div>
                  <div className="text-sm text-primary mb-3">
                    Select2 will work on RTL websites if the <code>dir</code>{" "}
                    attribute is set on the <code>select</code> or any parents of it.
                    You can also initialize Select2 with the{" "}
                    <code>dir: &quot;rtl&quot;</code> configuration option.
                  </div>
                <CustomSelectStyled 
                    size='large'
                    defaultValue="blade"
                    options={[{ value: 'blade', label: 'Blade' }]}
                />
            </div>
            
            <div className="flex flex-col border rounded-md bg-card p-3">
              <div className="font-bold text-primary text-[30px] leading-[normal] mb-3">ATTACK TIME</div>
              <Slider tooltip={{ open: true }} min={1} max={24} marks={attack_time} defaultValue={1}/>
            </div>
              <Request />
            <div className="flex flex-col border rounded-md bg-card p-3">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">BYPASS RATELIMIT</div>
                <div className="text-sm text-primary mb-3">
                  Select2 will work on RTL websites if the
                </div>
                <CustomSelectStyled 
                    size='large'
                    defaultValue="rate-limit"
                    options={[{ value: 'rate-limit', label: 'Rate Limit' }]}
                    style={{ width: '100%' }}
                />
            </div>

            <div className="flex flex-col border rounded-md bg-card p-3 col-span-2">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">SPOOF</div>
                <div className="text-sm text-primary mb-3">
                  Select2 will work on RTL websites if the <code>dir</code>
                </div>
                <CustomSelectStyled 
                  size='large'
                  defaultValue="yes"
                  options={[{ value: 'yes', label: 'YES' }]}
                />
            </div>
            <div className="flex flex-col border rounded-md bg-card p-3 col-span-2">
                <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">SERVERS</div>
                <div className="text-sm text-primary mb-3">
                  Select2 will work on RTL websites if the <code>dir</code>
                </div>
                <CustomSelectStyled size='large' className="mt-2" value={serverAttacks} placeholder="Select type attack" mode="multiple" allowClear onChange={handleChangeServerttack}>
                  {serverOptions.map((item: IServerAttackType, index: number) => (
                    <Select.Option key={index} value={item.value}>
                      <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-gray-400">{item.ip}</div>
                        </div>
                    </Select.Option>
                  ))}
              </CustomSelectStyled>
            </div>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div className="flex flex-col border rounded-md bg-card p-3 col-span-2">
            <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">SERVERS</div>
            <div className="text-sm text-primary mb-3">
              Select the servers you want to use for the attack
            </div>
             
          </div>
        </div>
      );
    }
  };

  const getSelectedLabel = () => {
    const selected = states.find(state => state.value === selectedState);
    return selected ? selected.label : '';
  };

  return (
    <div className="inner-body">
        <div className="content-body" style={{ minHeight: 'auto' }}>
            <div className="mx-auto p-6">
                <div className="h-full flex gap-x-6">
                    <div className="h-full p-4 flex flex-col w-[525px] min-w-[525px] max-w-[525px] fixed t-0 l-0">
                        <SceneWrapper height="h-[410px]" />
                    <div className="mb-4">
                      <h2 className="text-center text-primary text-xxl font-extrabold">STATE : {getSelectedLabel()}</h2>
                      <div className="flex flex-col border rounded-md bg-card p-3 col-span-2">
                        <div className="text-sm text-primary mb-3">
                          Select2 will work on RTL websites if the <code>dir</code>
                        </div>
                        <CustomInputStyled size='large' className="mb-2" autoComplete="off" placeholder="Enter permission" />
                        <CustomSelectStyled 
                          size='large'
                          value={selectedState}
                          onChange={handleStateChange}
                          options={states}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                        <button className="font-black py-3 bg-primary float-end text-black text-4xl rounded transition-all duration-300 ease-in-out active:opacity-10 hover:shadow-md hover:shadow-[#00ff00]">ATTACK</button>
                  </div>
                  <div
                        className="right-panel"
                        style={{
                        // Chừa khoảng trống bằng đúng độ rộng phần bên trái
                        marginLeft: "525px",
                        width: "calc(100% - 525px)", // tùy chỉnh
                        }}
                    >
                  <AnimatePresence mode="wait">
                      <motion.div
                      key={selectedState}
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
        </div>
  );
};

const Request: React.FC = () => {

    const [value, setValue] = useState(0);
    const steps = [20, 40, 60 , 80, 100];

        const onChange = (newValue: number) => {
        setValue(newValue);
    };
        
    return (
        <div className="flex flex-col border rounded-md bg-card p-3">
            <div className="font-bold text-primary text-[30px] leading-[normal] mb-2">REQUESTS</div>
            <Slider 
                tooltip={{ open: true }}
                value={value}
                onChange={onChange} 
                max={100}
                step={1}
            />
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

const CustomInputStyled = styled(Input)`
  border-radius: 0.375rem;
  color: rgb(0, 255, 0) !important;
  border: 0.0625rem solid #444444 !important;
  background: #202020 !important;
  &::placeholder {
      color: #666;
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
`;

export default HynaInterface;