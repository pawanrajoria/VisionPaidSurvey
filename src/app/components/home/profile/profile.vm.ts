export interface IProfileVM {
    name?: string;
    emailId?: string;
    country?: string;
    dateOfBirth?: string;
    gender?: string;
    zip?: string;
    totalPointEarned: string;
    totalRewardRedeemed: string;
    totalSurveyCompleted: string;
    totalOfferCompleted: string;
    level: string;
}

export interface IUserActivityVM {
    points: number;
    attemptDate: Date;
    status: string;
}

export interface IUserHeading {
    title: string;
    subtitle: string;
    icon: string;
}

export interface IUserUpdateVM {

}

export interface IUserDetailsUpdateVM {

}

export interface IUserDeleteVM {

}