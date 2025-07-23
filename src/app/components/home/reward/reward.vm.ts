import { PayoutMethodEnum } from "./reward.enum";

export interface UserWithdrawalRequestVM {
    point: number;
    method: PayoutMethodEnum;
    giftCardId: number;
    giftCardName: string;
    giftCardImage: string;
    emailId: string;
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
    minPoints?:number;
    typeId?: number;
    currencyCode?:string;
    options?: IOptionCardVM[];
}

export interface IOptionCardVM {
    points?: string;
    amount?: string;
}