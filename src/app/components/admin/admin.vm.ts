export interface AdminEarningResponseDto {
    totalEarning: number;
    todayEarning: number;
    totalUsers: number;
    todayUsers: number;
    totalRejection: number;
    todayRejection: number;
    totalWithdrawalAmount: number;
    todayWithdrawalAmount:number;
    totalRefrelEarn: number;
    totalLevelBonusEarn: number;
    todayClicks: number;
    todayPostbacks: number;
    earning: AdminTodayEarningResponseDto[];
    withdrawalRequests: AdminWithdrawalResponseDto[];
    topEarningUsers: AdminTopEarningUserResponseDto[];
}

export interface AdminTodayEarningResponseDto {
    source: string;
    status: string;
    userName: string;
    country: string;
    amount: string;
    earnDate:Date; 
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

export interface AdminTopEarningUserResponseDto {
    userId: number;
    userName: string;
    country: string;
    totalEarning: number;
    earningCount: number;
    todayEarning: number;
    rejectionCount: number;
    rejectionAmount: number;
}