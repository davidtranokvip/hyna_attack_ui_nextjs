import { useState, useEffect } from 'react';

interface Setting {
    group: string;
    value: Array<{
        label: string;
        value: string;
        key?: string;
    }>;
}

interface UseSettingsFormOptions {
    form: any;
    finalSetting: Setting[];
    modeSetting?: Setting;
}

export const useSettingsForm = ({ 
    form, 
    finalSetting, 
    modeSetting 
}: UseSettingsFormOptions) => {
    const [requestValue, setRequestValue] = useState<number>(0);
    const [concurrentValue, setConcurrentValue] = useState<number>(0);
    const [isModeWithBlade, setIsModeWithBlade] = useState<boolean>(false);
    const [isModeDeathWork, setIsModeDeathWork] = useState<boolean>(false);

    useEffect(() => {
        if (form) {
            // Request setting
            const requestSetting = finalSetting.find(s => s.group.toLowerCase() === "request");
            if (requestSetting && form.getFieldValue(requestSetting.group)) {
                setRequestValue(form.getFieldValue(requestSetting.group));
            }
            
            // Concurrent setting
            const concurrentSetting = finalSetting.find(s => s.group.toLowerCase() === "concurrents");
            if (concurrentSetting && form.getFieldValue(concurrentSetting.group)) {
                setConcurrentValue(form.getFieldValue(concurrentSetting.group));
            }

            // Mode setting
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
        }
    }, [form, finalSetting, modeSetting]);

    return {
        requestValue,
        concurrentValue,
        isModeWithBlade,
        isModeDeathWork
    };
};