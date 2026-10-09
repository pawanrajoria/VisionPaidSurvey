export interface IOnboardingStatus {
    available: boolean;
    completed: boolean;
    rewardPoints: number;
    dateOfBirth?: string | null;
    gender: number;
    zip?: string | null;
    questionCount: number;
}

export interface IDailyCheckinStatus {
    available: boolean;
    claimedToday: boolean;
    streak: number;
    todayPoints: number;
    streakBonusEveryDays: number;
    streakBonusPoints: number;
    daysToStreakBonus: number;
}

export interface IChecklist {
    profileCompleted: boolean;
    firstSurveyDone: boolean;
    firstOfferDone: boolean;
    invitedFriend: boolean;
    firstCashout: boolean;
}

export interface IStreakDay {
    date: string;
    label: string;
    done: boolean;
    isToday: boolean;
}

export interface IStreakStatus {
    available: boolean;
    current: number;
    longest: number;
    completedToday: boolean;
    week: IStreakDay[];
    drawEveryDays: number;
    daysToDraw: number;
    drawsAvailable: number;
    maxPrizePoints: number;
    /** False: the streak pays no cash; it earns badges instead of a prize draw. */
    cashPrizes?: boolean;
    badges?: IStreakBadge[];
    surveysCompleted: number;
    leaderboardThreshold: number;
    leaderboardUnlocked: boolean;
    surveysToUnlock: number;
}

export interface IStreakBadge {
    days: number;
    /** starter | week | fortnight | month | century */
    key: string;
    earned: boolean;
}

export interface ISurveyLimit {
    isLimited: boolean;
    accountAgeDays: number;
    newUserDays: number;
    rejectionRate: number;
    trustedMaxRejectionPercent: number;
}

export interface ICashoutRule {
    isFirstCashout: boolean;
    firstMinimumUsd: number;
    firstMinimumPoints: number;
    /** Minimum for every cashout. */
    minimumUsd?: number;
    minimumPoints?: number;
}

export interface IEngagementSummary {
    onboarding: IOnboardingStatus;
    daily: IDailyCheckinStatus;
    checklist: IChecklist;
    streak: IStreakStatus;
    surveyLimit: ISurveyLimit;
    cashout: ICashoutRule;
}

export interface ILeaderboardEntry {
    rank: number;
    name: string;
    countryCode: string;
    points: number;
    surveys: number;
    isMe: boolean;
}

export interface ILeaderboard {
    locked: boolean;
    surveysCompleted: number;
    threshold: number;
    surveysToUnlock: number;
    weekStartUtc: string;
    weekEndUtc: string;
    myRank: number;
    myPoints: number;
    entries: ILeaderboardEntry[];
}

export interface IUserSettings {
    timeZone?: string | null;
    countryCode: string;
    hasPassword: boolean;
    lastLoginProvider: string;
    loginProviders: string[];
}

/** Level number -> tier. Blue 1-4, Bronze 5-10, Silver 11-20, Gold 21-30, Diamond 31+. */
export interface ITier {
    key: string;
    name: string;
    from: number;
    to: number | null;
    perk: string;
    color: string;
}

export const TIERS: ITier[] = [
    { key: 'blue', name: 'Blue', from: 1, to: 4, perk: 'Everyone starts here – start earning to unlock more perks!', color: '#2196f3' },
    { key: 'bronze', name: 'Bronze', from: 5, to: 10, perk: 'You are on your way – keep earning to reach Silver.', color: '#cd7f32' },
    { key: 'silver', name: 'Silver', from: 11, to: 20, perk: 'Enjoy a special Bonus Day every week', color: '#8a94a6' },
    { key: 'gold', name: 'Gold', from: 21, to: 30, perk: 'Get access to Exclusive Reward Discounts', color: '#d4a106' },
    { key: 'diamond', name: 'Diamond', from: 31, to: null, perk: 'Early Access to New Features and Premium Offers', color: '#3aa8c1' }
];

export function tierForLevel(level: number | string | null | undefined): ITier {
    const value = Math.max(1, Number(level) || 0);
    return TIERS.find(t => value >= t.from && (t.to === null || value <= t.to)) ?? TIERS[0];
}

export interface ICompleteOnboardingRequest {
    dateOfBirth: string;
    gender: number;
    zip: string;
    answeredCount: number;
}

export interface IBonusResult {
    isSuccess: boolean;
    message: string;
    pointsAwarded: number;
    balance: number;
    streak: number;
}

export interface IPriorityOffer {
    id: number;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    clickUrl: string;
    points: number;
    tag: string;
    device: string;
    isInternal: boolean;
    /** Show once a day as a dismissible popup. */
    showAsPopup?: boolean;
}

/** sessionStorage flag: the user chose "later" - don't force the welcome flow again this session. */
export const ONBOARDING_SKIPPED_KEY = 'onboardingSkipped';
