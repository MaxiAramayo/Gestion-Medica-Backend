export interface templateReport {
    id: number;
    title: string;
    description: string;
    doctorId: number;
}

export interface templateReportUpdate {
    title?: string;
    description?: string;
}