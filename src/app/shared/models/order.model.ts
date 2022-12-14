export interface IProductionOrder {
    order: number;
    batch: string;
    serial: number;
    upn: number;
    cfn: string;
    description: string;
    machine: string;
    line: string;
    preWeigh: number;
    prodTime: string;
    recipe: string;
    location: string;
    wetWeigh: number;
    wetResult: number;
    wetPassFail: boolean;
    dryWeigh: number;
    wpp: number;
    passFail: boolean;
    passes: number;
    comment: string;
    stFile: string;
    flow: number;
    size: string;
    lowerDry: number;
    targetDry: number;
    upperDry: number;
    lowerWet: number;
    targetWet: number;
    upperWet: number;
    rejectCode: string;
    shift: string;
}
