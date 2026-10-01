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
    requestRaiseDate: string; // ISO date string, e.g. "2026-05-16T10:00:00Z"
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
export interface AdminDailyCountDto {
    day: string;
    count: number;
}

export interface AdminOverviewDto {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    unverifiedUsers: number;
    newUsersToday: number;
    newUsersLast7Days: number;
    pendingPayoutCount: number;
    pendingPayoutAmount: number;
    paidOutAmount: number;
    outstandingBalance: number;
    earningsToday: number;
    onboardingCompleted: number;
    checkinsToday: number;
    signups: AdminDailyCountDto[];
}

export interface AdminUserDto {
    id: number;
    email: string;
    fullName: string;
    countryCode: string;
    status: number;
    statusName: string;
    currentLevel: number | null;
    referredBy: number | null;
    createdAt: string;
    balance: number;
    profileCompleted: boolean;
    completed: number;
    rejected: number;
    rejectionRate: number;
    fraudDecision: string;
    loginProvider: string;
    accountAgeDays: number;
}

export interface AdminUserListDto {
    total: number;
    page: number;
    pageSize: number;
    users: AdminUserDto[];
    highlightRejectionPercent: number;
    blockRejectionPercent: number;
}

export interface AdminPayoutDto {
    payoutId: number;
    userId: number;
    email: string;
    fullName: string;
    countryCode: string;
    amount: number;
    method: string;
    status: number;
    statusName: string;
    requesteDate: string;
    processeDate: string | null;
    payoutEmailId: string | null;
    payoutByName: string | null;
    balance: number;
}

export interface PriorityOfferAdminDto {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    clickUrl: string;
    points: number;
    tag: string | null;
    countryCode: string | null;
    device: string | null;
    sortOrder: number;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    clickCount?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface BulkUserActionResultDto {
    isSuccess: boolean;
    message: string;
    blocked: number;
    mailsSent: number;
    skipped: string[];
}
