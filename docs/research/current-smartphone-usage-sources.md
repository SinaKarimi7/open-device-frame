# Current Smartphone-Usage Sources

Research date: 2026-08-23

## Conclusion

There is **no credible, openly licensed public dataset that ranks the 500 most
actively used smartphone models worldwide today**. In particular, publicly
visible smartphone *sales* rankings cannot be relabelled as active installed-base
or usage rankings. A ranking made from the bundled Kaggle metadata would be a
curated candidate list, not a measured usage list.

This distinction matters for the catalog: records may truthfully be selected as
`reviewed catalog candidates`, but should not carry a `top-500-most-used` claim
unless the project obtains a licence for model-level usage data or collects its
own consented telemetry.

## Source assessment

| Source | What it measures / provides | Can it substantiate a global current top 500? | Licence / access |
| --- | --- | --- | --- |
| [StatCounter GlobalStats FAQ](https://gs.statcounter.com/faq) and [current mobile/tablet vendor chart](https://gs.statcounter.com/vendor-market-share/mobile-tablet/worldwide) | Aggregate web page-view usage from its network. Its methodology describes more than 3 billion monthly page views from 1M+ sites. | **No.** StatCounter explicitly says it does not publish mobile statistics by device, model, or user agent. Its public vendor/OS charts can only weight manufacturers in a proxy selection. | The FAQ identifies the downloadable data as CC BY-SA 3.0. Attribute StatCounter and retain compatible attribution if its values are stored. |
| [Counterpoint Smartphone Model Tracker](https://counterpointresearch.com/en/coverage/smartphones/smartphone-model-tracker) | Monthly/quarterly **sell-through** by OEM and model; the service says it covers 99% of the global market. | **Potentially, with a commercial licence, but not from the public site.** The public material exposes top-10 snapshots, such as [the Q1 2026 ranking](https://counterpointresearch.com/en/insights/iphone-17-global-best-selling-smartphone-in-q1-2026-top-10-take-25-percent-share), not 500 models and not active use. | Client subscription; public posts are insufficient for importing a 500-model rank. |
| [DeviceAtlas Data Explorer](https://www.deviceatlas.com/device-data/explorer) and its [FAQ](https://deviceatlas.com/deviceatlas-data-explorer-faqs) | Model-level **web-usage propensity**, by country, based on hundreds of thousands of websites. | **No open global top 500.** Explorer access requires login. Its own FAQ says the rank is web use, not device distribution/popularity; it is unweighted, excludes non-web devices, over-emphasises high-end devices, and includes tablets unless excluded. | DeviceAtlas copyright; account/API access and applicable terms are required. |
| [GSMA IMEI Database](https://imeidb.gsma.com/imei/loginpage) | Authoritative TAC-to-make/model identification. | **No.** It identifies models but does not publish a current-use ranking. | GSMA says its data products are copyright-protected and limited by licence; not suitable as a copied seed dataset. |
| [GSMA Device Identifier API](https://open-gateway.gsma.com/docs/device-identifier/api-reference) | Network-assisted lookup of the current subscriber device’s make/model/IMEI identifiers. | **No public aggregate ranking.** It is an operational API requiring access tokens and subscriber identifiers, not a historical model-ranking feed. | Operator/API authorization and privacy obligations apply. |
| [Global Smartphone Database 2025 on Kaggle](https://www.kaggle.com/datasets/rajibdab/global-smartphone-database-2025) | The locally supplied Apache-2.0 archive is used only for device metadata candidates (brand, model, type, release year). | **No.** It is not an observed active-use or sales dataset and contains no auditable global current-usage measurement. | Dataset page declares Apache-2.0; retain attribution and preserve the project's narrow metadata-only import policy. |

## Brand coverage and interpretation

The requested brands are legitimate catalog filters, but not evidence that every
brand has current global volume comparable to Apple or Samsung. Counterpoint's
[global quarterly shipment table](https://counterpointresearch.com/en/insights/global-smartphone-share)
publicly reports brand-level shipment shares for Apple, Samsung, Xiaomi and OPPO;
it is useful for deciding that those manufacturers deserve significant attention,
but it does not rank individual models or measure devices still in use. Google,
Huawei, Sony, and BlackBerry should therefore be represented only by the selected
candidate rules below, not invented usage shares.

BlackBerry needs special handling: BlackBerry stated that services for its legacy
devices stopped on 4 January 2022 in its [official notice](https://www.blackberry.com/us/en/support/devices/end-of-life).
That does not prove there are zero active handsets, but it means no current-model
or current-sales signal should be assumed. Keep any BlackBerry entries only as
explicitly labelled legacy catalog candidates.

## Recommended, reproducible next step

Until a licensed model-level usage source is supplied, create a **500-device
curated candidate set**, not a "most used" set:

1. Preserve all existing published entries.
2. Include every requested-brand model that appears in Counterpoint's public,
   dated top-10 release (while preserving the article URL and period).
3. Restrict the remaining local Kaggle metadata to the eight requested brands;
   allocate the remaining slots using the dated StatCounter vendor shares, then
   prefer recent releases and maintain breadth across flagship, mid-range and
   entry lines. This is a *current-usage-informed proxy*, not an observed model
   ranking. Do not assign a numeric `usageRank`.
4. Store the selection rule and source URL/retrieval date in a manifest. Mark each
   imported record `draft`; publish only after normal metadata and image review.
5. If a top-500 active-use assertion is required, obtain written permission and an
   export from Counterpoint or DeviceAtlas, or define a privacy-reviewed first-
   party telemetry programme. Record geography, observation window, unit (unique
   devices versus page views), handling of model variants, and licence in the
   manifest.

This gives the project an auditable, legally safer import path without presenting
availability in a metadata archive as real-world device usage.
