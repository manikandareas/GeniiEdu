export type ActRes<TData = any> = {
    success: boolean;
    message?: string;
    error?: any;
    data?: TData;
};
