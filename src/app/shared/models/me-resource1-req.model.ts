export interface IMeResourceReqModel {
    week: number;
    year: number;
    resource: string
}

export interface IMeDailyReqModel {
    week: number;
    year: number;
    dow: number;
    resource: string;
    shift: string;
}