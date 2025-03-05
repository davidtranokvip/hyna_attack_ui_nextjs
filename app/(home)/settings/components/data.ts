import { ISelectDataType } from "@/shared/types/MainType";

const attackTypeSystem: ISelectDataType[] = [
    {
        value: 'hyna_warrior',
        label: 'HYNA WARRIOR',
    },
    {
        value: 'hyna_valkyra',
        label: 'HYNA VALKYRA',
    }
];


const inputTypeSystem: ISelectDataType[] = [
    {
        value: 'select',
        label: 'SELECT',
    },
    {
        value: 'slider',
        label: 'SLIDER',
    },
    {
        value: 'toggle',
        label: 'TOGGLE',
    }
];


const dataTypeSystem: ISelectDataType[] = [
    {
        value: 'concurrents',
        label: 'CONCURRENTS',
    },
    {
        value: 'core_strength',
        label: 'CORE STRENGTH',
    },
    {
        value: 'mode',
        label: 'MODE',
    },
    {
        value: 'attack_time',
        label: 'ATTACK TIME',
    },
    {
        value: 'request',
        label: 'REQUESTS',
    },
    {
        value: 'bypass_ratelimit',
        label: 'BYPASS RATELIMIT',
    },
    {
        value: 'death_sword_http',
        label: 'DEATH SWORD - HTTP',
    },
    {
        value: 'spoof',
        label: 'SPOOF',
    },
    {
        value: 'option',
        label: 'DEATH SWORD OPTION',
    },
];

export { dataTypeSystem, attackTypeSystem, inputTypeSystem };