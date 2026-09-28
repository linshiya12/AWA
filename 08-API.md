# 08 — MVP API Contract

**Product:** AWA — AI Creation Guide Platform
**Sources:** `docs/01-PROBLEM.md` … `docs/07-DATABASE.md`
**Status:** Contract definition for the 44-feature launch scope, against the public/private database split

---

# API Decision

**API: REQUIRED.**

`06 §6` — two clients (public and admin surfaces), authorization on every request that could return prompt text, state-changing operations involving money, and one inbound external call.

**40 active endpoint groups:** 26 public · 1 inbound webhook · 13 admin groups. **One further ID, API-019, is retired** — see §2.19.

---

# 1. Conventions

| Aspect | Contract |
|---|---|
| Authentication | Session-based. Public reads need none; anything user-scoped does |
| Access levels | Visitor · Subscriber · Administrator |
| Ownership | Checked in addition to role on any endpoint accepting a record id |
| Idempotency | Required on `POST /prompts/{id}/customize` and `POST /checkout` |
| Concurrency | Admin writes carry a version token; stale writes are rejected (409) |
| Pagination | Only on `/admin/reports` and `/admin/audit` |
| Versioning | Not required — two clients, one team, no third-party consumer |
| **Database** | **Every endpoint below is annotated with which of the two databases (`07 §0`) it reads or writes. Neither database is ever reached except through this API — `06 §5.0`** |
| Language | Catalog-reading endpoints accept an optional `lang` query parameter (a `language_id` from `GET /languages`). Absent or unrecognised, content is served in the default language. A requested language with no translation for a given field falls back to the default field value — never an empty or placeholder string (FR-046) |

## Error codes

| Status | Meaning |
|---|---|
| 400 | Invalid input |
| 401 | Not signed in |
| **402** | Payment required — `reason`: `subscription_required` or `allowance_exhausted` |
| 403 | Signed in, not permitted, or not the caller's record |
| 404 | Not found, or not visible to this caller |
| 409 | Stale admin write, or duplicate idempotency key in flight |
| 422 | Understood but not actionable |
| 429 | Rate limited |
| **503** | AI capability unavailable, or spend cap reached (`reason`: `capacity_paused`) |

---

# 2. Public Endpoints

## API-001 · `GET /catalog/{path?}`
Node children and templates. No path returns the root.
**Auth:** none · **Database:** Public only · **Side effects:** none · **Errors:** 404 unknown or hidden path
**Traceability:** FR-001, FR-002 / FEAT-001, 002

**Query parameters, both new this revision:**

| Parameter | Feature | Behaviour |
|---|---|---|
| `attribute` (repeatable, `type:value`) | FEAT-004 | Only templates matching **all** given attributes are returned. Active filters are echoed back so the client can render them as removable |
| `model` (an `ai_model` id) | FEAT-005 | Only templates whose resolved tool assignment includes this model are returned |
| `lang` | FEAT-039 | Resolves `name`/`description` in the requested language, falling back to default |

```json
{
  "node": { "id": "cat_a1", "name": "Product Photography",
            "breadcrumb": [{ "id": "cat_root", "name": "Image Generation" }] },
  "children": [{ "id": "cat_b2", "name": "E-commerce Shots", "templateCount": 8 }],
  "templates": [{ "id": "tpl_39", "name": "Plain product on white",
                  "description": "A clean catalogue shot on white.",
                  "previewUrl": "https://…" }],
  "activeFilters": { "attribute": ["style:minimalist"], "model": null },
  "resultCount": 6
}
```

Hidden nodes and their subtrees are absent, not flagged. **When filters exclude everything, `templates` is an empty array and `resultCount` is 0** — FEAT-004's acceptance criteria require the user be told and able to clear filters, not shown a bare empty screen; the empty array plus echoed `activeFilters` is what the interface renders that state from.

## API-002 · `GET /templates/{id}`
Everything the result screen needs **except the prompt**.
**Auth:** none · **Database:** Public (template, tools, guidance); **Private, read-only** (the entitlement check against the caller's subscription, if signed in) · **Side effects:** none · **Errors:** 404
**Traceability:** FR-008, FR-019, FR-023, FR-026 / FEAT-008, 016, 020, 022

**Query parameter:** `lang` — same resolution rule as API-001, applied to `description`, tool `reasoning`, and guidance step instructions.

```json
{
  "template": { "id": "tpl_39", "name": "…", "description": "…", "previewUrl": "…" },
  "tools": [{ "id": "tool_7", "name": "Tool A",
              "reasoning": "Handles product realism better than the alternatives.",
              "destination": "https://…", "pricingNote": "Paid, free trial" }],
  "guidance": { "presentation": "written",
                "steps": [{ "position": 1, "instruction": "Paste the prompt…" }] },
  "access": { "entitled": false, "reason": "subscription_required", "promptLength": 412 }
}
```

**Prompt text is absent from the payload entirely** when not entitled — NFR-002. `promptLength` supports the concealed state, and is read from the private `template_version` this template's `current_version_id` points at — the one place this endpoint touches the private database, and only to report a character count, never the text. Tools and guidance resolve up the ancestor chain.

## API-003 · `POST /templates/{id}/prompt`
Deliver the prompt.
**Auth:** subscriber · **Database:** reads Public (`template.current_version_id`), reads Private (`template_version.prompt_text`, resolved via that reference), writes Private (`delivered_prompt`) · **Errors:** 401 · 402 `subscription_required` · 404
**Traceability:** FR-011, FR-040 / FEAT-010, 033

```json
{ "deliveredPromptId": "dp_5512", "promptText": "A minimalist product photograph of …",
  "baseVersionId": "ver_140", "isCustomized": false, "allowanceRemaining": 9 }
```

**POST, not GET** — it creates the record that anchors later feedback, and a GET would be cacheable.
**Does not consult allowance** — FR-034: exhausted allowance never blocks prompt access.
**This is the endpoint that walks the one public-to-private reference in the whole model** (`07 §8.1`): it reads `template.current_version_id` from the public database, then resolves that id against `template_version` in the private database. If the reference is stale — pointing at a version that no longer exists — that is the cross-database consistency risk `07 §22` item 10 names, not a case this contract can validate away.

## API-004 · `POST /prompts/{id}/customize`
Revise a prompt from a described change via external LLM transformation.
**Auth:** subscriber, with allowance, owning the prompt · **Database:** Private only, throughout
**Traceability:** FR-015, FR-017, FR-018, FR-050 / FEAT-013, 015, 026, 043

> **Implementation Note — Direct In-App Context Customization:**
> On the template detail page, subscribers customize their **Context Prompt** deterministically on the client side by combining their thoughts with the template context blueprint. This in-browser combination **does not call API-004 and does not deduct credits**. API-004 and its credit ledger/safeguards remain dedicated to external generative model transformations.

**Request**
```json
{ "changeText": "Make it a leather wallet, vertical for a phone listing.",
  "idempotencyKey": "c_9f3a2b" }
```

| Field | Required | Notes |
|---|---|---|
| `changeText` | **Yes** | The described change, typed. **No audio field exists** — FEAT-014 is excluded from launch (`05-MVP §3.2`); every request is typed, and there is no second input path to validate against |
| `idempotencyKey` | Yes | A repeat returns the first result and performs no new work |

**Check order — nothing costs money before step 7**

```
1 authenticated        → 401
2 active subscription  → 402 subscription_required
3 allowance available  → 402 allowance_exhausted
4 spend cap reached    → 503 capacity_paused
5 rate limit           → 429 (limit: 20 per user per hour — `05-MVP §3.3`)
6 owns the prompt      → 403
7 HOLD one unit
8 transform the prompt         ── external
9 validate output
     ok   → consume unit, create delivered_prompt, 200
     else → release unit, 422 or 503
```

**Success (200)**
```json
{ "attemptId": "att_881", "outcome": "succeeded", "deliveredPromptId": "dp_5513",
  "promptText": "A minimalist vertical product photograph of a leather wallet …",
  "baseVersionId": "ver_140", "isCustomized": true,
  "allowanceConsumed": 1, "allowanceRemaining": 8 }
```

**Unusable (422)** — `{ "outcome": "unusable", "allowanceConsumed": 0, "promptUnchanged": true, "message": "Couldn't tell what to change…" }`

**Failed — external service (503)** — `{ "outcome": "failed", "allowanceConsumed": 0, "retryable": true, "reason": "service_unavailable", "message": "Couldn't customize right now — no credit was used." }`

**Failed — spend cap reached (503)** — `{ "outcome": "failed", "allowanceConsumed": 0, "retryable": true, "reason": "capacity_paused", "message": "Customization is temporarily paused. Try again shortly." }`
**Wording is fixed by `05-MVP §3.3`: no mention of budgets, caps, or fault.** Prompt delivery (API-003) is unaffected by this state — only this endpoint pauses.

**Output validation before return:** non-empty · not truncated · no leaked instruction · derived from the input · within the length ceiling.

**Rate limiting: required.** The only endpoint with unbounded per-call cost, at 20 per user per hour (`05-MVP §3.3`), enforced independently of remaining allowance.

**Side effects:** creates `customization_attempt` always; `delivered_prompt` on success; 2–3 `allowance_ledger` entries. Updates `spend_period.spent`, cached balance. Calls AI transformation. **No transcription call — there is nothing to transcribe.**

**Cost note:** step 8 costs money regardless of outcome. The user is not charged on failure; the business is. `service_cost` is recorded on every attempt.

## API-005 · `POST /feedback`
**Auth:** subscriber, owning the prompt · **Database:** Private · **Creates:** `feedback`
`{ "deliveredPromptId": "dp_5513", "outcome": "worked", "comment": "…" }`

**`outcome` is one of two values, decided in `05-MVP §3.3`: `worked` or `did_not_work`.** No third value, no scale. Comment optional, shown after the choice. **Attaches to the delivered prompt, not the template version** — keeps base-prompt quality separable from customization quality.

## API-006 · `POST /unmet-needs`
**Auth:** none · **Database:** writes Private (`unmet_need`); the `categoryId` supplied is validated against Public · **Rate limited**
`{ "categoryId": "cat_b2", "description": "…" }` — both required.

## API-007 · `POST /events`
**Auth:** none · **Database:** Private · **Creates:** `interaction_event` · **Rate limited**
`{ "visitReference": "v_7d2", "events": [{ "type": "concealed_prompt_shown", "templateId": "tpl_39", "occurredAt": "…" }] }`

**Event types, per `07 §6.7`** — three added this revision: `searched_or_filtered`, `saved_to_collection`, `language_changed`, alongside the original nine (`template_viewed`, `concealed_prompt_shown`, `subscribed`, `prompt_delivered`, `customization_requested`, `prompt_taken`, `departed_to_tool`, `returned_after_departure`, `no_match_reached`).

Accepts batches. **Must tolerate a keepalive send** — the departure event fires as the browser navigates away.

## API-008 · `GET /plans`
**Auth:** none · **Database:** Private (`plan`, `credit_pack`) — served here without authentication despite living in the private database; `06 §5.2` is explicit that private storage does not restrict what the application layer answers publicly.

Plans and credit packs with prices. Needed before an account exists.

## API-009 · `POST /checkout`
**Auth:** signed in · **Database:** writes Private, pending `payment_transaction` · **Calls:** payment provider · **Rate limited**
`{ "purchaseType": "plan" | "pack", "purchaseId": "…", "idempotencyKey": "…" }`
Returns a provider-hosted destination. **Grants nothing.**

## API-010 · `POST /webhooks/payments`
**Auth:** provider signature, verified. Not a session. · **Database:** Private, throughout
**Idempotent on the provider's reference** — a repeat grants nothing further.
**Side effects:** creates/updates `subscription`, appends an allowance grant, updates the transaction.
**This endpoint grants entitlement — not the browser returning from checkout.**

## API-011 · `GET /me`
**Auth:** signed in · **Database:** Private, plus a Public read to resolve `preferredLanguage.name` for display
```json
{ "user": { "id": "usr_12", "email": "…", "role": "member", "preferredLanguageId": "en" },
  "subscription": { "state": "active", "endsAt": "2027-03-04",
                    "endBehaviour": "retain_delivered" },
  "allowance": { "remaining": 8 } }
```
**`endBehaviour` is always `retain_delivered`** — the only value, decided in `05-MVP §3.3`: prompts already delivered remain readable; no new deliveries or customizations after term end.

## API-012 to API-018 · Account, session, and prompts

| ID | Endpoint | Database | Notes |
|---|---|---|---|
| API-012 | `POST /accounts` | Private | Rate limited. No account enumeration |
| API-013 | `POST /sessions` | Private | **Ends any existing session** (FEAT-025) and records the reason, so the other device can be told |
| API-014 | `DELETE /sessions/current` | Private | Sign out |
| API-015 | `POST /password-resets` | Private | Identical response whether or not the address exists |
| API-016 | `POST /password-resets/confirm` | Private | Single-use token; ends existing sessions |
| API-017 | `GET /prompts` | Private | subscriber · the caller's own delivered prompts |
| API-018 | `GET /prompts/{id}` | Private | subscriber + ownership · one prompt with its customization lineage |

## API-019 · Retired

**`POST /uploads` no longer exists.** It accepted audio for transcription, and transcription belonged to FEAT-014, which `05-MVP §3.2` excludes from launch. There is no replacement and no successor endpoint — **the ID is retired, not reassigned**, so nothing that once referenced API-019 silently points at a different contract. If FEAT-014 returns (`06 §17.6`), this is the number a reintroduced upload endpoint would most naturally take back.

---

# 3. New Endpoints — Search, Language, Collections

Appended from API-031 onward, continuing after the highest number in the original 44-feature-scope contract (API-030), per the instruction to keep existing IDs stable rather than renumber around them.

## API-031 · `GET /search?q={term}`
Search across the whole catalog — categories and templates by name and description — not scoped to one node.
**Auth:** none · **Database:** Public only · **Side effects:** none
**Traceability:** FR-003 / FEAT-003

```json
{
  "query": "wallet",
  "categories": [{ "id": "cat_b2", "name": "E-commerce Shots" }],
  "templates": [{ "id": "tpl_39", "name": "Plain product on white", "categoryPath": "…" }],
  "resultCount": 4
}
```

**Distinct from API-001's `attribute`/`model` filters.** Search looks across the entire catalog by name and text; filtering narrows the list already being viewed inside one node. `06 §13` — no dedicated search index; this runs as a direct query over `template.name`, `template.description`, and `category.name` in the public database.

## API-032 · `GET /languages`
The languages available for selection.
**Auth:** none · **Database:** Public only
**Traceability:** FR-046 / FEAT-039

```json
{ "languages": [
    { "id": "en", "name": "English", "isDefault": true },
    { "id": "ml", "name": "Malayalam", "isDefault": false }
  ] }
```

Only `is_enabled = true` languages are listed. Used to populate a language switcher; the `id` values are what API-001/002's `lang` parameter accepts.

## API-033 to API-039 · Collections

FEAT-009. **No subscription required for any endpoint in this group** — `features.md §4.5` is explicit that saving is available to any signed-in user. All are private to the owner; there is no sharing.

| ID | Endpoint | Auth | Database | Notes |
|---|---|---|---|---|
| API-033 | `GET /collections` | Signed in | Private | The caller's own collections, with template counts |
| API-034 | `POST /collections` | Signed in | Private | `{ "name": "Product shots" }` |
| API-035 | `PATCH /collections/{id}` | Signed in + ownership | Private | Rename only |
| API-036 | `DELETE /collections/{id}` | Signed in + ownership | Private | Removes the list, not the templates |
| API-037 | `GET /collections/{id}` | Signed in + ownership | Private, joined with a Public read per template for current status | Templates in this collection, each flagged if hidden or withdrawn since being saved |
| API-038 | `POST /collections/{id}/templates` | Signed in + ownership | writes Private; `templateId` validated against Public | `{ "templateId": "tpl_39" }`. Saving the same template twice leaves one row (`07` V18) |
| API-039 | `DELETE /collections/{id}/templates/{templateId}` | Signed in + ownership | Private | Removes one template from one collection without affecting others |

**API-037's response shape:**
```json
{ "collection": { "id": "col_4", "name": "Product shots" },
  "templates": [
    { "id": "tpl_39", "name": "Plain product on white", "status": "available" },
    { "id": "tpl_12", "name": "…", "status": "unavailable", "reason": "Removed by the catalog team" }
  ] }
```
**A withdrawn template's row is never deleted from the collection** (`07 §6.10`) — it is shown as unavailable, with a short explanation, exactly as `features.md` requires.

---
# 4. Administrative Endpoints

All require administrator role. All content writes carry a version token and record an `audit_log` entry in the same transaction.

| ID | Group | Methods | Database | Feature |
|---|---|---|---|---|
| API-020 | `/admin/categories` | GET POST PATCH DELETE · `/{id}/move` · `/reorder` | Public | FEAT-030 |
| API-021 | `/admin/templates` | GET POST PATCH · `/{id}/publish` · `/{id}/hide` · `/{id}/attributes` (**new sub-route, FEAT-004**) | Public | FEAT-031, 004 |
| API-022 | `/admin/templates/{id}/versions` | GET POST · `/{vid}/restore` · `/preview` | **writes Private first, then Public** — the one two-step cross-database write in this contract | FEAT-032, 033 |
| API-023 | `/admin/tools` | GET POST PATCH · `/{id}/models` | Public | FEAT-034 |
| API-024 | `/admin/assignments` | GET POST PATCH DELETE | Public | FEAT-035 |
| API-025 | `/admin/guidance` | GET POST PATCH · `/{id}/steps` | Public | FEAT-036 |
| API-026 | `/admin/media` | POST DELETE | Public | FEAT-031, 036 |
| API-027 | `/admin/users` | GET PATCH · `/{id}/adjustments` | Private | FEAT-040, 041 |
| API-028 | `/admin/commerce` | GET PATCH — plans, packs, payment config, spend limit | Private | FEAT-042, 043 |
| API-029 | `/admin/reports` | GET — usage, feedback by version and `is_customized`, demand signal, cost vs limit, content gaps | **Both** — private evidence, joined in the application layer with public template/category names for display | FEAT-038, 044, 029 |
| API-030 | `/admin/audit` | GET | Private | NFR-016 |
| **API-040** | `/admin/languages` | GET POST PATCH — add a language, enable or disable it | Public | FEAT-039 |
| **API-041** | `/admin/translations` | GET POST PATCH — set a translation for one field of one content row, in one language | Public | FEAT-039 |

**All eleven of API-020 through API-030 keep their original IDs and routes unchanged from the previous revision**, except API-021, which gains the `/{id}/attributes` sub-route, and API-022, which gains the two-step-write annotation. Languages and translations are new groups, appended at API-040 and API-041 rather than inserted into the existing sequence.

**Five with specific behaviour:**

| Endpoint | Behaviour |
|---|---|
| `POST /versions/{vid}/restore` | Inserts a **new** version equal to the old one, into the **private** database. Nothing is edited or removed. The public `current_version_id` pointer updates only after the insert succeeds — `06 §5.4`, `07` V17 |
| `POST /versions/preview` | Renders what a user would receive, without publishing. Reads the draft version from the private database directly; never updates the public pointer |
| `POST /users/{id}/adjustments` | Grants allowance or extends access. Requires a reason; audit records the actor |
| `/admin/commerce` payment config | Credentials **write-only** — no read returns them. Must be verified before enabling |
| `PATCH /admin/templates/{id}/attributes` | Sets the `template_attribute` rows for a template. **The set of `attribute_type` values accepted here is `07 §4.3`'s REQUIRES PRODUCT DECISION** — this endpoint's request shape depends on that taxonomy being fixed first |

`DELETE` on content sets visibility off rather than removing — content is hidden, not deleted (`07 §9`).

---

# 5. Validation Rules

| # | Rule | Endpoint |
|---|---|---|
| 1 | Prompt text returned only with an active subscription | 003, 004, 017, 018 |
| 2 | Every prompt response records its base version | 003, 004 |
| 3 | **`changeText` is required and non-empty** | 004 |
| 4 | Allowance held before any paid call, released on any non-success | 004 |
| 5 | Spend cap checked **before** the paid call | 004 |
| 6 | Output validated before return | 004 |
| 7 | A repeated idempotency key returns the first result | 004, 009 |
| 8 | A payment reference already recorded grants nothing further | 010 |
| 9 | Unmet need carries both description and position | 006 |
| 10 | Feedback attaches to a prompt the caller owns | 005 |
| 11 | Feedback `outcome` is exactly `worked` or `did_not_work` | 005 |
| 12 | A template cannot be published without a current version | 022, 023 |
| 13 | A node cannot be moved beneath its own descendant | 021 |
| 14 | Stale admin writes are rejected | all admin writes |
| 15 | Payment credentials never returned by a read | 029 |
| 16 | **A version write completes in the private database before the public pointer is updated** | 023 |
| 17 | **Saving a template to the same collection twice leaves one row** | 038 |
| 18 | **Exactly one language has `is_default = true`** | 040 |
| 19 | **When filters exclude every template, the response states that plainly and echoes the active filters for clearing** | 001 |

---

# 6. Rate Limiting

| Endpoint | Required |
|---|---|
| API-004 customize | **Yes** — unbounded per-call cost, independent of allowance. **20 per user per hour**, decided (`05-MVP §3.3`) |
| API-012, 013, 015 | **Yes** — credential guessing, enumeration |
| API-009 checkout | Yes |
| API-006, 007, 031 | Yes, generous — unauthenticated write and read paths |
| All others | Not required at launch scale |

**API-004 is the only endpoint in this contract with a decided rate-limit value.** Every other rate-limited endpoint's specific number is not established in `01–07` and is not specified here.

---

# 7. Access Matrix

| Level | Endpoints |
|---|---|
| Anyone | 001, 002, 006, 007, 008, 031, 032 |
| Signed in | 009, 011, 012–016, 033–039 |
| Subscriber | 003, 004, 005, 017, 018 |
| Administrator | 020–030, 040, 041 |
| Signature-verified external | 010 |

**Collections (033–039) sit at "signed in," not "subscriber."** `features.md §4.5` states plainly that saving requires no subscription — the same boundary FEAT-022 draws around prompt text does not apply here.

---

# 8. External Boundary

**Called by us, inside existing endpoints:** AI text transformation only (API-004) — **no speech-to-text call exists in this contract**, since FEAT-014 is excluded · payment initiation (API-009) · message delivery (API-012, 015, and end-of-term notice).

**Called by them:** API-010 only.

**Never called:** Midjourney, Runway or any external creative AI tool. API-002 returns a destination; the user follows it manually. Direct execution is future scope (`P-§21`).

---

# 9. End-to-End Flow

```
GET /catalog/{path}  [optional: attribute, model, lang]     ── or ──     GET /search?q=
   ↓
GET /templates/{id}                    tools · guidance · entitlement
   ↓
[optional] POST /collections/{id}/templates      save for later, no subscription needed
   ↓
[not entitled]  GET /plans → POST /checkout → provider
                → POST /webhooks/payments   ← grants entitlement
   ↓
POST /templates/{id}/prompt            creates delivered_prompt (crosses public → private)
   ↓
[optional] POST /prompts/{id}/customize
   ↓
user copies · POST /events (keepalive on departure)
   ↓
EXTERNAL AI TOOL — no request, no response
   ↓
POST /feedback                         attributed to the delivered prompt, worked / did_not_work
```

---

# 10. Traceability

| Requirement | Feature | API |
|---|---|---|
| FR-001, FR-002 | FEAT-001, 002 | 001 |
| **FR-003** | **FEAT-003** | **031** |
| **FR-004** | **FEAT-004** | **001 (`attribute` param), 021 (`/attributes`)** |
| **FR-005** | **FEAT-005** | **001 (`model` param)** |
| FR-007 | FEAT-007 | 006 |
| FR-008, FR-019, FR-023 | FEAT-008, 016, 020 | 002 |
| **FR-010** | **FEAT-009** | **033–039** |
| FR-011, FR-040 | FEAT-010, 033 | 003 |
| FR-015, FR-017, FR-018 | FEAT-013, 015 | 004 |
| FR-021 | FEAT-018 | 002 (empty tool list is valid) |
| FR-025, FR-026 | FEAT-021, 022 | 001, 002, 003 |
| FR-027, FR-028 | FEAT-023, 024 | 008, 011 |
| FR-029 | FEAT-025 | 013 |
| FR-030–034 | FEAT-026, 027 | 004, 008, 009, 010, 011 |
| FR-035, FR-036 | FEAT-028, 029 | 005, 030 |
| FR-037–044 | FEAT-030–037 | 020–026 |
| FR-045 | FEAT-038 | 030 |
| **FR-046** | **FEAT-039** | **001, 002 (`lang` param), 032, 040, 041** |
| FR-047–051 | FEAT-040–044 | 027, 028, 029 |
| NFR-002 | FEAT-022 | 002, 003 |
| NFR-006 | FEAT-026 | 004 |
| NFR-016 | FEAT-041 | 030 |

**No endpoint** for FR-006 (interface copy), FR-012 (client copies text it holds), FR-020 (client follows a destination already returned), NFR-012 (interface state).

---

# 11. Open Items

| Item | Bearing |
|---|---|
| **Cost per customization; credit and cap pricing** | **REQUIRES PRODUCT DECISION** (`05-MVP §3.4`). Does not block this contract — the endpoints are correct regardless of the figure — but blocks configuring `/admin/commerce` for real use |
| **The `template_attribute` taxonomy** | **REQUIRES PRODUCT DECISION** (`07 §4.3`). `PATCH /admin/templates/{id}/attributes` and the `attribute` query parameter on API-001 cannot be finalised until it is fixed |
| **Whether Likes enters launch scope** | **REQUIRES PRODUCT DECISION** (`07 §19.1`). No endpoint exists for it here — see §12 below |
| Rate limit numbers other than API-004 | §6 says where, not how much |
| Retention for user content | **Decided: 12 months** (`05-MVP §3.3`) — no longer open. `DELETE /me` remains unbuilt; nothing in `01–07` requires it yet |
| Customization latency | If unacceptable, API-004 becomes accepted-then-poll |
| Prompt injection | No requirement in `03-REQUIREMENTS.md` to trace to. Handling is in §5 rule 6; the requirement should be added |
| **Cross-database identifier drift** | `07 §22` item 10. This contract cannot detect a stale `current_version_id` at request time; a periodic consistency check outside the API is the mitigation |

**Two items resolved since the previous revision of this document:** feedback outcome values (decided: `worked` / `did_not_work`) and end-of-term behaviour (decided: `retain_delivered`). Neither is an open item any longer.

---

# 12. Deferred Endpoints

| Endpoint | Excluded by |
|---|---|
| **`POST /uploads`** | **Retired as API-019.** FEAT-014 excluded (`05-MVP §3.2`) — no audio path exists |
| `PATCH /prompts/{id}` | FEAT-012 excluded — manual prompt editing |
| `GET /admin/tools/{id}/availability` | FEAT-019 excluded |
| `POST /shares` | Removed from the product |
| `POST /tools/{id}/execute` | Future scope |
| `DELETE /me` | No requirement yet; likely needed once a deletion path is designed |
| **`POST /templates/{id}/like`** | **Not built. Not excluded, not confirmed** — `features.md §4.4` describes a public one-tap like, but it has no FEAT identifier and was not part of the decision that set the 44-feature scope (`07 §19.1`). If confirmed, the natural shape is a toggle (`{}` body, 200 with the new count) at the next available ID, with a `likeCount` field added to API-001/002/003's template payloads |

---

# Summary

**40 active endpoint groups** — 26 public, 1 webhook, 13 admin — plus one retired ID (API-019) kept visible rather than reassigned.

**Four contract decisions:**

1. **Prompt delivery is a POST** — it creates the attribution record, and a GET would be cacheable.
2. **Entitlement is granted by the webhook**, never by the browser returning from checkout.
3. **API-004 requires an idempotency key** — the only endpoint where a duplicate spends real money.
4. **API-003 and API-022 are the two places this contract crosses the database boundary** — one reading it (delivering a prompt), one writing it (publishing or reverting one), and the second is the only two-step write in the entire API.