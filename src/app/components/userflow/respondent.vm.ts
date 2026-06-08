export class RespondentEntryRequestVM {
    requestUrl: string = "";
    duid: string = "";
    refredUrl?: string = "";
    browser?: string = "";
    languageCode?: string = "";
}

export class RespondentEntryResponseVM {
    redirectUrl: string = "";
    isFailed: boolean = false;
    respondentToken: string = "";
    countryCode: string = "";
    ip: string = "";
    zipCode: string = "";
    city: string = "";
    isQualified: boolean = false;
    qualifications?: Array<QualQuestionVM>;
}

export class RespondentSubmitVM {
    respondentToken: string = "";
    surveyQualId: number = 0;
    qualId: number = 0;
    qualTypeId: number = 0;
    answerText: string = "";
    isLast: boolean = false;
    preCodes?: Array<number> = [];
}

export class RespondentEndSurveyVM {
    requestUrl: string = "";
    duid?: string;
}

export class RespondentEndSurveyResponseVM {
    requestUrl: string = "";
}


export class QualQuestionVM {
    orderId: number = 0;
    qKey: string = "";
    qText: string = "";
    qAnsText?: string = "";
    qTypeToken: string = "";
    src: string = "";
    searchingVariable: string = "";
    qSubTypeToken?: string;
    qId: number = 0;
    surveyQualId: number = 0;
    qAnswers: Array<QualQuestionAnswerVM> = []
}

export class QualQuestionAnswerVM {
    preCode: number = 0;
    text: string = "";
    key: string = "";
    isChecked: boolean = true;
}