# Running ad campaigns (Google, Telegram, …)

The flow is **ad → country landing page → verified sign-up → profile → surveys over weeks**.
Never point an ad straight at a survey.

## 1. Ad URLs

Send each country's ads to its landing page and tag the link with `utm_*` values:

```
https://profitpiller.com/en-in/surveys/india?utm_source=google&utm_medium=cpc&utm_campaign=in_search_paid_surveys
https://profitpiller.com/en-us/surveys/united-states?utm_source=google&utm_medium=cpc&utm_campaign=us_search_paid_surveys
https://profitpiller.com/hi-in/surveys/india?utm_source=telegram&utm_medium=paid_post&utm_campaign=in_channel_xyz
https://profitpiller.com/en-in?utm_source=telegram&utm_medium=channel&utm_campaign=pp_official
```

| Parameter      | Use for                                   | Examples                                   |
|----------------|-------------------------------------------|--------------------------------------------|
| `utm_source`   | Where the click came from                 | `google`, `telegram`, `facebook`           |
| `utm_medium`   | Type of traffic                           | `cpc`, `paid_post`, `channel`, `referral`  |
| `utm_campaign` | One campaign = one country + one idea     | `in_search_paid_surveys`                   |
| `utm_content`  | Which ad / creative (optional)            | `banner_a`, `post_0411`                    |
| `utm_term`     | Keyword (Google: `{keyword}`) (optional)  |                                            |

Keep values lower-case with underscores; the report groups by them exactly.
Google Ads auto-tagging adds `gclid` by itself — keep it on.

## 2. What happens on the site

- `AttributionService` (src/app/attribution.service.ts) stores the values from the landing URL
  in the browser for 90 days. A later visit with new campaign values replaces them; a plain
  visit never does.
- Sign-up (email or Google) sends them to the API, which saves them once per member in
  `application."UserAcquisitions"` (SurveyAPI `DatabaseScripts/015_user_acquisition.sql` —
  **run it before the first campaign**).
- GTM events for ad conversions:
  - `sign_up` — email sign-up submitted, or a first Google sign-in (`method`, `signup_source`,
    `signup_medium`, `signup_campaign`)
  - `email_verified` — the confirmation link was opened
  - `login` — a returning Google sign-in

  In GTM, fire the Google Ads conversion tag on `sign_up` and keep the Conversion Linker tag on all pages.

## 2b. Android app campaigns

The app (ProfitpillerAPK) reads the **Google Play install referrer** on first launch
(`InstallReferrerPlugin.java` + `src/services/attribution.service.ts`) and sends it with sign-up,
so app members land in the same report with Platform = `android`.

- **Google Ads app campaigns:** nothing to tag. Google adds a `gclid` to the referrer and the
  member shows up as `google / cpc`. In Google Ads, import the Firebase event **`sign_up`**
  as the conversion (Tools → Conversions → Import → Google Analytics / Firebase), not just installs.
- **Telegram and other links:** point them at the Play Store with a `referrer` parameter.
  Its value is the utm string, URL-encoded (`=` → `%3D`, `&` → `%26`):

  ```
  https://play.google.com/store/apps/details?id=com.cralpkresearch.profitpiller&referrer=utm_source%3Dtelegram%26utm_medium%3Dchannel%26utm_campaign%3Dpp_official
  ```

- Organic Play installs show as `google-play / organic`, sideloaded APKs as `sideload / direct`,
  iPhone sign-ups as `app-store / (unknown)` (iOS has no install referrer).
- Firebase events: `sign_up` / `register` (with `method`, `signup_source`, `signup_medium`,
  `signup_campaign`), `email_verified`. They no longer contain the member's email address.

## 3. Reading the results

Admin → **Traffic sources** (API: `GET admin/acquisition-report?from=YYYY-MM-DD&to=YYYY-MM-DD`).
Per source / medium / campaign:

| Column | Watch for |
|---|---|
| Verified %, Profile done % | Low = bots or people who only wanted to look |
| Active in 7 days % | Did they actually take a survey? |
| Blocked, Rejection rate | Fraud and low-quality answers — survey buyers judge us on this |
| Revenue / sign-up (90d) | Must be clearly above the ad cost per sign-up |

Start small (2–3 weeks, 2–3 countries, Google Search first). Scale a campaign only when
revenue per sign-up beats its cost **and** its rejection rate is no worse than "(none)".
