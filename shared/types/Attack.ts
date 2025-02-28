export interface IAttackPayload {
    domain: string;
    concurrents?: number;
    mode?: string;
    attack_time?: number;
    request?: number;
    core_strength?: string;
    bypass_ratelimit?: boolean;
    spoof?: boolean;
    typeAttack: "hyna_warrior" | "hyna_valkyra";
    servers?: string[];
    [key: string]: boolean | number | string | string[] | undefined;
}

export interface Setting {
    createdAt: string;
    group: string;
    id: number;
    type: string;
    updatedAt: string;
    value: { [key: string]: string }[];
}

export const INITIAL_ATTACK_CONFIG: IAttackPayload = {
    domain: "",
    concurrents: 0,
    mode: "xvfb-run node scam.js",
    attack_time: 1,
    request: 20,
    core_strength: "proxy.txt",
    death_sword_http: "--full true --extra true -F true --ratelimit true -C CLOUDFLARE",
    bypass_ratelimit: true,
    spoof: true,
    typeAttack: "hyna_warrior",
    servers: [],
};

export interface FormField {
    key: string;
    type: "select" | "slider";
    label: string;
    group: string;
    multiple?: boolean;
    options?: { value: string; label: string }[];
    steps?: number[];
}

export const DEFAULT_SERVER_ERROR = "";