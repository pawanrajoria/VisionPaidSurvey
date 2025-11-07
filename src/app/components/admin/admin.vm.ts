export interface AdminEarningResponseDto {
    earning: number;
    totalUsers: number;
    rejection: number;
    refrelEarn: number;
    levelBonusEarn: number;

    earnings: AdminTodayEarningResponseDto[];
    withdrawalRequests: AdminWithdrawalResponseDto[];
    topEarningUsers: AdminTopEarningUserResponseDto[];
    userActivityLog: UserActivityLogDashboardResponseDto[];
}

export interface AdminTodayEarningResponseDto {
    source: string;
    status: string;
    userName: string;
    country: string;
    amount: string;
    earnDate: Date;
    clientName: string;
    userBalance: number;
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

export interface UserActivityLogDashboardResponseDto {
    userId: number;
    userName: string;
    country: string;
    earning: number;
    rejection: number;
    earningCount: number;
    rejectionCount: number;
    postbackLogCount: number;
    activityCount: number;
    userBalance: number;
}