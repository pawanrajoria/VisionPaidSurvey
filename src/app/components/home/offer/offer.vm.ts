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
}

export interface IOfferTaskResponseDto {
    id: string;
    taskId: string;
    name: string | null;
    points: number;
    payable: boolean;
}