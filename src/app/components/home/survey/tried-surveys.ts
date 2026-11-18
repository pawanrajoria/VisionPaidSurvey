/**
 * Surveys the member opened recently, kept in the browser, so "Start best survey" moves on to the next match
 * instead of sending them back into a survey that just screened them out (for any partner, CPX included).
 */
const KEY = 'pp_tried_surveys';
const WINDOW_MS = 24 * 3_600_000;

interface SurveyLike {
    clickUrl?: string | null;
    name?: string | null;
    providerName?: string | null;
    isHot?: boolean;
    isProfileSurvey?: boolean;
}

/** Stable id of a listed survey: its exchange token (SR), else its link without the member parameters. */
export function surveyKey(survey: SurveyLike): string {
    const url = survey.clickUrl ?? '';
    const sr = /[?&]SR=([^&#]+)/i.exec(url);
    if (sr) return 'sr:' + decodeURIComponent(sr[1]).toLowerCase();
    const cleaned = url.replace(/([?&])(tid|uid|subid_\d|ext_user_id|user_id|transaction_id)=[^&#]*/gi, '$1');
    return 'url:' + (cleaned || `${survey.providerName ?? ''}|${survey.name ?? ''}`).toLowerCase();
}

function read(): Record<string, number> {
    try {
        const all = JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, number>;
        const now = Date.now();
        for (const k of Object.keys(all)) if (now - all[k] > WINDOW_MS) delete all[k];
        return all;
    } catch {
        return {};
    }
}

export function markSurveyTried(survey: SurveyLike) {
    try {
        const all = read();
        all[surveyKey(survey)] = Date.now();
        localStorage.setItem(KEY, JSON.stringify(all));
    } catch { /* storage blocked: best survey simply does not skip */ }
}

/**
 * The best survey to start from an already ranked list: the profiling survey when it is there, else the first one
 * not opened in the last 24 hours. The router entry ("Hot") routes to a new client survey each time, so it is not
 * skipped. Falls back to the top of the list when everything was tried.
 */
export function pickBestSurvey<T extends SurveyLike>(ranked: T[]): T | undefined {
    if (!ranked.length) return undefined;
    const profile = ranked.find(s => s.isProfileSurvey);
    if (profile) return profile;
    const tried = read();
    return ranked.find(s => s.isHot || !tried[surveyKey(s)]) ?? ranked[0];
}
