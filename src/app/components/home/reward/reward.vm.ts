import { PayoutMethodEnum } from "./reward.enum";

export interface UserWithdrawalRequestVM {
    point: number;
    method: PayoutMethodEnum;
    giftCardId: number;
    giftCardName: string;
    giftCardImage: string;
    emailId: string;
    typeId: number;
    upiId?: string;
}

export interface IRewardInfoVM {
    giftCards: IGiftCardVM[];
    transferCards: ITransferCardVM[];
}

export interface IGiftCardVM extends ICommonCardVM {

}

export interface ITransferCardVM extends ICommonCardVM {

}

export interface ICommonCardVM {
    productId?: number;
    name?: string;
    description?: string;
    orderQuantityLimit?: number;
    termsAndConditionsInstructions?: string;
    expiryAndValidity?: string;
    categories?: string;
    imageUrl?: string;
    maxValue?: number;
    minValue?: number;
    minPoints?: number;
    typeId?: number;
    currencyCode?: string;
    options?: IOptionCardVM[];
}

export interface IOptionCardVM {
    points?: string;
    amount?: string;
}

export interface RewardCategory {
    name: string;
    count: number;
    icon: string;
    items: RewardItem[];
    type: PayoutMethodEnum;
}

export interface RewardItem {
    id: number;
    name: string;
    subText: string;
    currencyCode: string;
    image: string;
    options: RedemptionOption[];
}


export interface RedemptionOption {
    value: number; // e.g., 5 for $5 USD
    points: number;
    isAvailable: boolean;
    productId: number;
    productName: string;
    imageUrl: string;
    emailId: string;
    upiId: string;
    typeId: number;
}