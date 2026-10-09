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
    /** Users seen in the last 7 days, by the client they last used. */
    webUsers7Days: number;
    androidUsers7Days: number;
    iosUsers7Days: number;
    bothPlatformUsers: number;
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
    /** USD. Approved survey / offer earnings, bonuses excluded. */
    totalEarned: number;
    /** USD. Level, profile, daily, streak, referral... */
    totalBonus: number;
    bonusCount: number;
    /** USD taken back by rejections. */
    rejectedAmount: number;
    /** USD paid out. */
    withdrawn: number;
    lastEarningAt: string | null;
    /** Rejection score in percent. */
    rejectionRate: number;
    /** Low | Medium | High */
    riskLevel: string;
    fraudDecision: string;
    loginProvider: string;
    /** web | android | ios - the client the user was last seen on. */
    lastPlatform: string;
    /** Every client the user has used, e.g. "web,android". */
    platforms: string;
    appVersion: string;
    lastSeenAt: string | null;
    accountAgeDays: number;
    /** "1y 2m", "5m 12d", "9d" */
    accountAge: string;
}

/** One earning, bonus or rejection. */
export interface AdminEarningDto {
    id: number;
    userId: number;
    email: string;
    fullName: string;
    countryCode: string;
    /** USD; negative for a rejection. */
    amount: number;
    source: number;
    /** "Level bonus", "Referral commission", "Survey", "Survey rejected"... */
    type: string;
    /** earning | bonus | rejection */
    kind: 'earning' | 'bonus' | 'rejection';
    status: string;
    transactionId: string | null;
    createDate: string;
}

export interface AdminBonusTypeDto {
    source: number;
    type: string;
    count: number;
    users: number;
    amount: number;
}

export interface AdminBonusListDto {
    total: number;
    page: number;
    pageSize: number;
    totalAmount: number;
    byType: AdminBonusTypeDto[];
    rows: AdminEarningDto[];
}

export interface AdminUserSourceDto {
    source: number;
    type: string;
    isBonus: boolean;
    count: number;
    amount: number;
    rejectedCount: number;
    rejectedAmount: number;
}

export interface AdminUserDetailDto {
    user: AdminUserDto;
    bySource: AdminUserSourceDto[];
    earnings: AdminEarningDto[];
    payouts: AdminPayoutDto[];
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
    /** Also shown once a day as a popup when the user opens the Earn page (website and app). */
    showAsPopup: boolean;
    startDate: string | null;
    endDate: string | null;
    clickCount?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface AdminNotificationDto {
    id: number;
    title: string;
    body: string;
    url?: string | null;
    createdAt: string;
    /** all | web | android | ios */
    audience: string;
    targetCount: number;
    sentCount: number;
    failedCount: number;
}

export interface NotificationAudienceDto {
    /** False until DatabaseScripts/007 has been run. */
    available: boolean;
    webDevices: number;
    androidDevices: number;
    iosDevices: number;
    history: AdminNotificationDto[];
}

export interface SendNotificationRequest {
    title: string;
    body: string;
    url: string;
    audience: string;
}

export interface SendNotificationResult {
    isSuccess: boolean;
    message: string;
    targetCount: number;
    sentCount: number;
    failedCount: number;
}

export interface BulkUserActionResultDto {
    isSuccess: boolean;
    message: string;
    blocked: number;
    mailsSent: number;
    skipped: string[];
}
