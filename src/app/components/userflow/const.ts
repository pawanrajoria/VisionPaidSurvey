import { AudioQuestionComponent } from "./take-survey/question/questionroot/questiontypes/audioquestion/audioquestion.component";
import { MultiPunchQuestionComponent } from "./take-survey/question/questionroot/questiontypes/multipunchquestion/multipunchquestion.component";
import { SinglePunchQuestionComponent } from "./take-survey/question/questionroot/questiontypes/singlepunchquestion/singlepunchquestion.component";
import { TextQuestionComponent } from "./take-survey/question/questionroot/questiontypes/textquestion/textquestion.component";
import { VideoQuestionComponent } from "./take-survey/question/questionroot/questiontypes/videoquestion/videoquestion.component";

export const QuestionTypeConstant = {
    OpenEnd: "1",
    SinglePunch: "2",
    MultiPunch: "3",
    NumberOpenPunch: "8",
    ZipOpenPunch: "10",
    Audio: "A0E2BF5C",
    Video: "19470B79"
};

export const questionTypeComponents = [
    { questionTypeId: QuestionTypeConstant.OpenEnd, componentName: TextQuestionComponent },
    { questionTypeId: QuestionTypeConstant.NumberOpenPunch, componentName: TextQuestionComponent },
    { questionTypeId: QuestionTypeConstant.ZipOpenPunch, componentName: TextQuestionComponent },
    { questionTypeId: QuestionTypeConstant.MultiPunch, componentName: MultiPunchQuestionComponent },
    { questionTypeId: QuestionTypeConstant.SinglePunch, componentName: SinglePunchQuestionComponent },
    { questionTypeId: QuestionTypeConstant.Video, componentName: VideoQuestionComponent },
    { questionTypeId: QuestionTypeConstant.Audio, componentName: AudioQuestionComponent },
];

export const ClientTypeConstant = {
    YourSurveys: "89841bc6-9d8a-4c31-9766-755ae10c5a45",
};


export const supportedLangs = [
    'en', // English
    'hi', // Hindi
    'es', // Spanish
    'fr', // French
    'de', // German
    'zh', // Chinese (Simplified)
    'ja', // Japanese
    'pt', // Portuguese
    'ru', // Russian
    'ar', // Arabic
    'it', // Italian
    'ko', // Korean
    'bn', // Bengali
    'mr', // Marathi
    'pa'  // Punjabi
];