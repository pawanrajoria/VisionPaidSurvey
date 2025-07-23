export interface AdminEarningResponseDto {
    totalEarning: number;
    todayEarning: number;
    totalUsers: number;
    totalRejection: number;
    totalWithdrawalAmount: number;
    totalRefrelEarn: number;
    totalLevelBonusEarn: number;
    earning: AdminTodayEarningResponseDto[];
    withdrawalRequests: AdminWithdrawalResponseDto[];
}

export interface AdminTodayEarningResponseDto {
    source: string;
    status: string;
    userName: string;
    country: string;
    amount: string;
}

export interface AdminWithdrawalResponseDto {
    source: string;
    sourceByName: string;
    sourceByImage: string;
    sourceById: string;
    userTotalEarning: number;
    userTotalRejection: number;
    rejectionRate: number;
    requestRaiseDate: string; // ISO date string, e.g. "2025-05-16T10:00:00Z"
    requestedAmount: number;
    userName: string;
    country: string;
}