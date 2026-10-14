export interface IOfferResponseDto {
    offerId: number;
    offerName: string | null;
    imageUrl: string | null;
    device: string[];
    offerCategory: string[] | null;
    clickUrl: string | '';
    description: string | null;
    requirements: string | null;
    disclaimer: string | null;
    expireTime: Date | null;
    confirmationTime: string | null;
    points: number;
    isGame: boolean;
    tasks: IOfferTaskResponseDto[];
    rating: number;
    currentDevice?: string;
    providerName: string;
    payoutType:string;
    max: number;
    /** Direct offers from our own affiliate networks: shown first, in the compact "Priority offers" strip. */
    isPriority?: boolean;
    /** Countries the offer accepts (empty = all). */
    countries?: string[] | null;
    /** Kind of task, e.g. "Survey", "Sign up + confirm email". */
    paymentModel?: string | null;
}

export interface IOfferTaskResponseDto {
    id: string;
    taskId: string;
    name: string | null;
    points: number;
    payable: boolean;
}