/**
 * Where a member goes after a survey ends without a complete.
 *
 * A survey opens in a new tab; when the partner screens the member out, the exchange sends that tab to
 * /survey/getSurveyInventory?status=N, a bare page with nothing to do next. Instead that tab now goes back to the
 * app page the survey was started from (Earn, Surveys...) and shows the "Survey Disqualified" popup there.
 */
export const SURVEY_RETURN_PATH_KEY = 'SurveyReturnPath';
export const SURVEY_RESULT_PARAM = 'surveyResult';
export const SURVEY_RESULT_TERMINATE = 'terminate';

/** Remembers the app page a survey is started from ("/en-us/app/earn"). Only in-app pages are kept. */
export function rememberSurveyReturnPath(win: Window | null, routerUrl: string): void {
    const path = (routerUrl || '').split(/[?#]/)[0];
    if (!win || !/^\/[a-z]{2}(-[a-z]{2})?\/app\//i.test(path)) return;
    try { win.localStorage.setItem(SURVEY_RETURN_PATH_KEY, path); } catch { /* storage blocked */ }
}

/** The remembered page, or the Earn page of the given locale. */
export function surveyReturnPath(win: Window | null, locale: string): string {
    let path: string | null = null;
    try { path = win?.localStorage.getItem(SURVEY_RETURN_PATH_KEY) ?? null; } catch { path = null; }
    return path && /^\/[a-z]{2}(-[a-z]{2})?\/app\//i.test(path) ? path : `/${locale || 'en-us'}/app/earn`;
}
