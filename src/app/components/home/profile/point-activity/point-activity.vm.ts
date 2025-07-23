export interface IProfileActivityEarningVM {
    pendingEarnings: Array<IProfilePayoutRequestVM>;
    earnings: Array<IProfileEarningVM>;
    payoutRequests: Array<IProfilePayoutRequestVM>;
}

export interface IProfileEarningVM {
    points: number;
    balance: number;
    earnDate: Date;
    status: string;
    provider: string;
}

export interface IProfilePayoutRequestVM {
    status: string;
    requestDate: Date;
    approvedDate?: Date;
    method: string;
    points: number;
    giftCardName?: string;
    giftCardImage?: string;
}