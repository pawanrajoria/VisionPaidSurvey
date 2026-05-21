export interface IProfileQuestionDtos {
    categoryName: string;
    qualifications: IProfileQuestionDetailsDtos[];
}

export interface IProfileQuestionDetailsDtos {
    qualificationId: number;
    questionId: number;
    questionName: string;
    isSelected: boolean;
    typeId: number;
    answers: IProfileQuestionAnswerDetailsDtos[];
}

export interface IProfileQuestionAnswerDetailsDtos {
    answerName: string;
    preCode?: number;          // nullable → optional
    answerText?: string;       // nullable → optional
    isSelected: boolean;
    answerId?: number;
    qualificationId?: number;
    questionId?: number;
    languageId?: number;
}