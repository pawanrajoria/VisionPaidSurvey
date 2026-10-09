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
    rejectionRate: number;
    /** USD from surveys/offers (bonuses not included). */
    earnedAmount: number;
    /** USD taken back by rejections. */
    rejectedAmount: number;
    /** USD received as bonuses of every kind. */
    bonusAmount: number;
    bonusCount: number;
    fraudDecision: string;
    loginProvider: string;
    /** web | android | ios - the client the user was last seen on. */
    lastPlatform: string;
    /** Every client the user has used, e.g. "web,android". */
    platforms: string;
    appVersion: string;
    lastSeenAt: string | null;
    accountAgeDays: number;
}

/** One ledger row (earning, rejection or bonus). */
export interface AdminEarningItemDto {
    id: number;
    userId: number;
    email: string;
    fullName: string;
    countryCode: string;
    amount: number;
    kind: 'earning' | 'rejection' | 'bonus' | 'pending';
    /** "Survey", "Daily bonus", "Referral bonus", ... */
    typeName: string;
    status: string;
    providerName: string | null;
    transactionId: string | null;
    createdAt: string;
    /** Referral bonus: the friend whose earning paid it. */
    fromUserId: number | null;
    fromEmail: string | null;
    fromName: string | null;
}

export interface AdminAmountByTypeDto {
    typeName: string;
    count: number;
    amount: number;
}

export interface AdminUserDetailDto {
    user: AdminUserDto;
    bonuses: AdminAmountByTypeDto[];
    earningsBySource: AdminAmountByTypeDto[];
    history: AdminEarningItemDto[];
}

/** Users active today / last 7 days / last 30 days. */
export interface AdminActivityPeriodDto {
    period: 'today' | 'week' | 'month';
    active: number;
    /** Active and signed up before the period (came back). */
    returning: number;
    /** Active and signed up during the period. */
    new: number;
    /** Active and earned from a survey / offer in the period. */
    earned: number;
    notEarned: number;
}

export interface AdminProfitLineDto {
    providerName: string;
    revenue: number;
    revenueReversed: number;
    userEarnings: number;
    userReversed: number;
    profit: number;
    completes: number;
    rejections: number;
}

/** Money in (network revenue) and out (user payouts, bonuses) for a period, in USD. */
export interface AdminEarningsSummaryDto {
    period: string;
    revenue: number;
    revenueReversed: number;
    netRevenue: number;
    userEarnings: number;
    userReversed: number;
    netUserEarnings: number;
    bonusCost: number;
    profit: number;
    marginPercent: number;
    completes: number;
    rejections: number;
    byProvider: AdminProfitLineDto[];
    firstSurveyTest?: AdminFirstSurveyTestDto | null;
}

export interface AdminTestGroupDto {
    users: number;
    profitPerUser: number;
    /** % that completed a second survey. */
    repeatPercent: number;
}

/** First-survey bonus A/B test: keep the bonus only while incrementalProfitPerUser stays above 0. */
export interface AdminFirstSurveyTestDto {
    enabled: boolean;
    bonusUsd: number;
    treatmentPercent: number;
    withBonus: AdminTestGroupDto;
    withoutBonus: AdminTestGroupDto;
    incrementalProfitPerUser: number;
}

export interface AdminBonusReportDto {
    period: string;
    total: number;
    count: number;
    byType: AdminAmountByTypeDto[];
    items: AdminEarningItemDto[];
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
