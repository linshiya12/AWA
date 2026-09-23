# 05 — MVP Definition

**Product:** AWA — AI Creation Guide Platform
**Sources of truth:** `docs/01-PROBLEM.md`, `docs/02-USER-RESEARCH.md`, `docs/03-REQUIREMENTS.md`, `docs/04-FEATURES.md`
**Document stage:** MVP scope only. No UX design, screens, architecture, data model, APIs or technology.
**Status:** Revised — scope expanded by product decision

---

# 1. MVP Objective

> **Prove that a person who wants to create something with AI will pay for a curated prompt, a reasoned tool recommendation and short usage guidance — and will adapt that prompt in their own words when it is not quite right — arriving at a usable result with less effort than they would manage alone.**

| Element | Value |
|---|---|
| **Primary user** | A business or marketing user producing visual assets for their own work (§5) |
| **Core problem** | Does not know which tool suits the task or what to write (`P-§2.2`); and can describe a needed change but not compose it (`UR-§4.3`) |
| **AWA value** | A curated prompt, adaptable in plain language, with a reasoned tool recommendation and usage steps — connected in one place |
| **Desired outcome** | A usable result in fewer attempts, with more confidence that the approach was right (`P-§14`) |
| **Commercial outcome** | Enough people pay, at a price that exceeds what serving them costs |

**The objective now contains a commercial clause it did not before.** That is the substantive change: the product must prove not only that it helps, but that it can be sold and served profitably.

---

# 2. Core Product Hypothesis

> **We believe that a business or marketing user who needs visual assets** *(**ASSUMPTION** — `UR-§1.1` records the primary user as UNKNOWN)* **will pay for a ready-made prompt, a recommended tool and short guidance** *(**ASSUMPTION** — willingness to pay is untested)*, **and will use AI-assisted customization to adapt it when the template is close but not exact** *(**ASSUMPTION** — `UR-§9 UC-6` calls this possibly the shakiest assumption in the product)*, **resulting in a usable result in fewer attempts** *(**ASSUMPTION** — `UR-§8` records that neither side of the comparison has ever been measured)*.

**Every clause is an assumption.** No user research has been conducted. `03-REQUIREMENTS.md` records that no user pain could be classified as FACT.

## 2.1 The sub-hypothesis that matters most

Unchanged, and now more urgent because it is being tested with money on the line (`P-§12.6`, `UR-§16 V-2`):

> **We believe a curated prompt written by someone who knows the tool is meaningfully better than what the user would get by asking a general-purpose AI assistant for a prompt.**

**Classification: ASSUMPTION, and still unexamined.** A general assistant is free, instant, and addresses all four documented difficulties at once. §17.1 requires the demonstration to test this directly.

## 2.2 The commercial hypothesis, now testable

> **We believe the price a user will pay exceeds what it costs to serve them, including AI customization.**

**Classification: UNKNOWN, not assumption.** `P-§18` records the cost per customization as unknown. Until it is measured (§13), this hypothesis cannot be evaluated even in principle.

---

# 3. MVP Scope

All 47 features from `04-FEATURES.md`, classified.

## 3.1 Included — 44 features

### Group 1 — Discovery and delivery (14)

| ID | Feature | Reasoning |
|---|---|---|
| FEAT-001 | Category Browsing | Entry point |
| FEAT-002 | Nested Catalog Navigation | Reaching a specific job |
| FEAT-003 | Catalog Search | `UR-§4.6` — finding a known need without navigating the tree. Included from launch rather than deferred |
| FEAT-004 | Template Filtering | Narrows a list of templates by attribute; supports choice once a node has more than a handful of templates |
| FEAT-005 | AI Model Filter | `UR-§5.3` — a user who already has a specific tool sees only prompts written for it. **Included at launch by decision, ahead of the usage data that would otherwise justify it** |
| FEAT-006 | Product Boundary Communication | `UR-§14.3` — the most likely misconception. Now also protects the purchase decision |
| FEAT-007 | No-Match Path | `UR-§11.2` — likely at launch; the richest source of demand data |
| FEAT-008 | Template Preview and Selection | The user must be able to choose |
| FEAT-010 | Prompt Delivery | The product |
| FEAT-011 | Prompt Export | Value is realised outside AWA |
| FEAT-016 | Tool Recommendations with Reasoning | Half of the core value |
| FEAT-017 | External Tool Handoff | The boundary |
| FEAT-018 | No-Recommendation Handling | **Newly required.** With an admin-managed catalog, a template can be published without an assignment; the prompt must still be delivered |
| FEAT-020 | Usage Guidance Delivery | The third documented difficulty |
| FEAT-009 | Saved Templates | `UR-§4.6` — returning to something useful without searching again. **Merged with the Collections feature in `features.md`**: a user organises saved templates into named private lists, and a template can sit in more than one list |

### Group 2 — AI customization (3)

| ID | Feature | Reasoning for inclusion |
|---|---|---|
| FEAT-013 | Prompt Customization by Description | Bridges a general template and a specific need. `UR-§4.3` separates *not knowing what to write* from *not being able to express what you know*; templates address the first, this addresses the second |
| FEAT-015 | Customization Safeguards | **Mandatory with FEAT-013.** A failed or unusable request must cost the user nothing (FR-017, FR-018) |
| FEAT-043 | Customization Expenditure Control | **Mandatory with FEAT-013.** `P-§18` — cost per use is unknown, so an unbounded cost against a fixed price is an unbounded loss |

### Group 3 — Access, subscription and payment (7)

| ID | Feature | Reasoning for inclusion |
|---|---|---|
| FEAT-021 | Free Access Tier | Everything except the prompt stays free, so a visitor can assess before paying (`UR-§2.5`) |
| FEAT-022 | Prompt Access Control | The paywall. The prompt is the paid product (`P-§11.1`) |
| FEAT-023 | Subscription Terms Disclosure | `UR-§10 Scenario D` — a subscriber later asked to buy credits may feel charged twice. Disclosure before purchase is the only mitigation |
| FEAT-024 | Subscription Lifecycle Handling | Defines what happens when a time-limited subscription ends |
| FEAT-025 | Single Session Enforcement | Prevents one subscription serving several people |
| FEAT-042 | Payment Configuration | Required to take money at all |
| FEAT-045 | Degraded Mode | **Mandatory with FEAT-013 and FEAT-022 together.** An AI outage must not withhold prompt access, which is what the subscription paid for (NFR-001) |

### Group 4 — Credits (3)

| ID | Feature | Reasoning for inclusion |
|---|---|---|
| FEAT-026 | Customization Allowance Management | Connects customization usage to what the user paid |
| FEAT-027 | Allowance Purchase | Lets a frequent customizer continue |
| FEAT-047 | User Content Handling | **Newly required.** The MVP collects typed change requests. NFR-003 requires the retention period to be defined and stated — decided in §3.3 |

### Group 5 — Admin panel (12)

| ID | Feature | Reasoning for inclusion |
|---|---|---|
| FEAT-030 | Catalog Structure Management | The catalog must grow without engineering |
| FEAT-031 | Template Management | Templates are the catalog |
| FEAT-032 | Prompt Authoring with Preview | `UR-§8` — quality risk sits with the content team; preview is the only control before a prompt reaches a paying user |
| FEAT-033 | Prompt Version History and Reversion | **Full, not partial.** Prompts will be revised; reversion and history are now required, not just version recording |
| FEAT-034 | AI Tool and Model Registry | Tools change constantly (`P-§15`) |
| FEAT-035 | Tool and Model Assignment with Inheritance | Without inheritance, associations must be repeated per template |
| FEAT-036 | Guidance Management | Guidance must be maintained as tools change |
| FEAT-037 | Live Content Publishing | **The point of the admin panel.** Changes reach users without a release |
| FEAT-038 | Content Gap Detection | Directs limited authoring capacity (`UR-§2.6`) |
| FEAT-040 | User Access Management | Required once accounts and payments exist |
| FEAT-041 | Support Adjustments | `UR-§10` — failed customizations, poor results and session evictions all need a manual remedy, or every case becomes a refund |
| FEAT-039 | Language and Translation Management | An administrator adds a language and its translations from the panel; it becomes selectable on the frontend with no release. **English is the only language guaranteed to exist at launch; further languages are entirely admin-configured, not a fixed list** |

### Group 6 — Learning and continuity (4)

| ID | Feature | Reasoning |
|---|---|---|
| FEAT-028 | Outcome Feedback | AWA cannot observe the external output; self-report is the only quality signal |
| FEAT-029 | Customization Demand Signal | **Newly available.** Recurring change requests reveal missing templates — the only signal derived from an act users perform for their own benefit |
| FEAT-044 | Usage, Outcome and Cost Reporting | **Newly required.** Without cost reporting, FEAT-043's limit is nominal |
| FEAT-046 | Input Preservation | **Newly required.** The journey now contains real interruptions: a subscription prompt, a session eviction, a customization failure |

## 3.2 Excluded — 3 features

| ID | Feature | Why still excluded |
|---|---|---|
| FEAT-014 | Voice Input for Customization | A second external capability, a second cost line and a second failure mode, for a route typed customization already covers. Typing is the route at launch |
| FEAT-012 | Manual Prompt Editing | Direct editing would blur the measurement of whether the provided prompt and the AI customization each carry value |
| FEAT-019 | Tool Availability Monitoring | Links can be checked by hand at launch catalog size |

## 3.3 Launch Rules

Settled values. These are the rules the build implements; they are not open questions.

| Rule | Value | Basis |
|---|---|---|
| **Primary user** | The solo business or marketing user (§5) | §5.2 |
| **Categories at launch** | 1 — Image Generation, expandable through the admin panel from day one | §5.4 |
| **Templates at launch** | 20–30, all with a published prompt | §7.3 |
| **Free sample templates** | **3 templates are fully readable without a subscription.** Chosen by an administrator | `04-FEATURES` CR-002; mitigates FC-1, where the subscription decision is otherwise made on a concealed prompt |
| **Initial allowance** | **10 customizations**, granted when a subscription starts | FEAT-030 |
| **Customization rate limit** | **20 per user per hour**, enforced independently of remaining allowance | `08 §5`; `13 §12.1` |
| **Cap behaviour when the cap is reached** | **Customization pauses for everyone. Prompt access is unaffected. Administrators are notified before the limit is reached, and affected users are told the capability is temporarily paused, with no fault implied and no mention of budgets** | FEAT-043 acceptance criteria; FEAT-045; `11 §P3` |
| **End-of-term behaviour** | **Prompts already delivered remain readable. No new prompt deliveries and no customizations after the term ends.** Recorded on the subscription at purchase so a later policy change cannot alter existing terms | `UR-§14.2`; `07 §5.4` |
| **Renewal** | **Manual.** The user purchases a new term. No automatic renewal at launch | Nothing in the build sequence (§18) implements a recurring mandate |
| **Sessions** | **One active session per account.** Signing in elsewhere ends the previous session with the reason stated | FEAT-025; `07 §5.2` |
| **Feedback outcome scale** | **Two options: it worked / it did not work.** A free-text comment is optional and appears after the choice | `11 §4.2` |
| **Retention of user-provided content** | **12 months** from creation, covering typed change requests, feedback comments and unmet-need descriptions. Stated to users before collection | `NFR-003`; `decisions.md` D-1 |
| **Financial records** | Allowance ledger, payment transactions and audit entries are retained indefinitely | `07 §14` |

## 3.4 Requires Product Decision

Three items cannot be determined from the documentation. Each blocks a specific build stage.

| Item | Why it cannot be decided here | Blocks |
|---|---|---|
| **Credit pack sizes and prices** | **REQUIRES PRODUCT DECISION.** Depends on the measured cost per customization, which `P-§18` records as unknown. Pricing set before that measurement would be a guess | Stage 4 (§18) |
| **The monthly expenditure cap value** | **REQUIRES PRODUCT DECISION.** Same dependency — the ceiling must be set relative to a known unit cost | Stage 4 (§18) |
| **Success criteria targets** (§10) | **REQUIRES PRODUCT DECISION.** `P-§20` records that no targets are established, and none can be derived from a product that has not run | Post-launch review |

---

# 4. MVP Feature Set

44 features. Every one traces to a confirmed requirement in `03-REQUIREMENTS.md`.

| ID | Feature | Requirement(s) | Why needed | Priority | Depends on |
|---|---|---|---|---|---|
| FEAT-001 | Category Browsing | FR-001 | Entry point | P0 | Catalog content |
| FEAT-002 | Nested Navigation | FR-002 | Reaching a specific job | P0 | FEAT-030 |
| FEAT-003 | Catalog Search | FR-003 | Find a known need without navigating the tree | P1 | FEAT-030, FEAT-031 |
| FEAT-004 | Template Filtering | FR-004 | Narrow a list by attribute | P1 | FEAT-031 |
| FEAT-005 | AI Model Filter | FR-005 | See only prompts written for a tool already owned | P1 | FEAT-034, FEAT-035 |
| FEAT-006 | Boundary Communication | FR-006 | Ensures the user understands what they are buying | P0 | — |
| FEAT-007 | No-Match Path | FR-007, FR-009 | Common at launch; demand data | P0 | FEAT-038 |
| FEAT-008 | Template Preview and Selection | FR-008 | The user must choose — **behind a paywall now** | P0 | FEAT-031 |
| FEAT-009 | Saved Templates | FR-010 | Return to a template without searching again; merged with Collections | P1 | Accounts |
| FEAT-010 | Prompt Delivery | FR-011 | The product | P0 | FEAT-022, FEAT-032 |
| FEAT-011 | Prompt Export | FR-012 | Value realised externally | P0 | FEAT-010 |
| FEAT-013 | Prompt Customization | FR-015 | Adapts a template to a specific need | P0 | FEAT-026, FEAT-043, AI service |
| FEAT-015 | Customization Safeguards | FR-017, FR-018 | Failure must cost the user nothing | P0 | FEAT-013, FEAT-026 |
| FEAT-016 | Tool Recommendations | FR-019 | Half the core value | P0 | FEAT-035 |
| FEAT-017 | External Tool Handoff | FR-020 | Completes the journey | P0 | FEAT-016 |
| FEAT-018 | No-Recommendation Handling | FR-021 | A content gap must not withhold the paid product | P1 | FEAT-038 |
| FEAT-020 | Usage Guidance | FR-023 | The third documented difficulty | P1 | FEAT-036 |
| FEAT-021 | Free Access Tier | FR-025 | Assessment before payment | P0 | FEAT-022 |
| FEAT-022 | Prompt Access Control | FR-026, NFR-002 | The business model | P0 | Accounts, FEAT-042 |
| FEAT-023 | Subscription Terms Disclosure | FR-027 | Prevents the two-charges perception | P0 | FEAT-026 |
| FEAT-024 | Subscription Lifecycle | FR-028 | Defined behaviour at end of term | P0 | FEAT-022 |
| FEAT-025 | Single Session Enforcement | FR-029 | Prevents shared subscriptions | P1 | Accounts, FEAT-046 |
| FEAT-026 | Allowance Management | FR-030–032, FR-034, NFR-006 | Connects usage to payment | P0 | FEAT-013, FEAT-022 |
| FEAT-027 | Allowance Purchase | FR-033 | Continued use | P1 | FEAT-026, FEAT-042 |
| FEAT-028 | Outcome Feedback | FR-035 | The only quality signal | P1 | FEAT-033 |
| FEAT-029 | Customization Demand Signal | FR-036 | Reveals missing templates from real demand | P1 | FEAT-013, FEAT-038 |
| FEAT-030 | Catalog Structure Management | FR-037 | The catalog must grow without engineering | P0 | FEAT-037 |
| FEAT-031 | Template Management | FR-038 | Templates are the catalog | P0 | FEAT-032 |
| FEAT-032 | Prompt Authoring with Preview | FR-039 | The only quality control before a paying user | P0 | FEAT-037 |
| FEAT-033 | Version History and Reversion | FR-040 | Makes "did the rewrite help?" answerable | P0 | FEAT-028 |
| FEAT-034 | Tool and Model Registry | FR-041 | Tools change constantly | P0 | FEAT-037 |
| FEAT-035 | Assignment with Inheritance | FR-042 | Associations must not be repeated per template | P0 | FEAT-034 |
| FEAT-036 | Guidance Management | FR-043 | Guidance must be maintained | P1 | FEAT-037 |
| FEAT-037 | Live Content Publishing | FR-044, NFR-013 | The point of the admin panel | P0 | FEAT-030–036 |
| FEAT-038 | Content Gap Detection | FR-045 | Directs limited authoring capacity | P1 | FEAT-007, 018, 029 |
| FEAT-039 | Language and Translation Management | FR-046 | Admin adds a language; users select it on the frontend | P1 | FEAT-037 |
| FEAT-040 | User Access Management | FR-047 | Required once accounts exist | P1 | Accounts |
| FEAT-041 | Support Adjustments | FR-048, NFR-016 | Every failure otherwise becomes a refund | P1 | FEAT-026, FEAT-040 |
| FEAT-042 | Payment Configuration | FR-049, NFR-005 | Required to take money | P0 | — |
| FEAT-043 | Expenditure Control | FR-050 | Cost per use is unknown | P0 | FEAT-044 |
| FEAT-044 | Usage, Outcome and Cost Reporting | FR-051 | Without it, FEAT-043's limit is nominal | P1 | FEAT-028, 033, 043 |
| FEAT-045 | Degraded Mode | NFR-001 | An AI outage must not withhold prompt access | P0 | FEAT-013, FEAT-043 |
| FEAT-046 | Input Preservation | NFR-012 | The journey now has real interruptions | P0 | FEAT-015, 022, 025 |
| FEAT-047 | User Content Handling | NFR-003 | The MVP collects typed change requests | P0 | FEAT-013 |

**P0: 28 · P1: 16. Total 44.**

---

# 5. Primary MVP User

`UR-§1.1` records four candidate primary users and states that **which is primary is UNKNOWN**. `04-FEATURES` FC-7 records that designing for all four is equivalent to designing for none.

**This is unchanged by the scope expansion, and it matters more now**, because a paid product aimed at nobody in particular converts worse than a free one.

## 5.1 The primary user — the solo business or marketing user

**A person producing visual assets for their own business or their own work, without a designer.**

| Aspect | Detail |
|---|---|
| **Goal** | An on-brand, usable visual asset quickly, without hiring anyone |
| **Starting problem** | Knows roughly what they want; does not know which tool or what to type (`UR-§2.3`) |
| **Needs from AWA** | A prompt for the job, the ability to adjust it in their own words, a named tool with a reason, and enough steps to run it |
| **Successful completion** | They produce something they use — and subscribe, or renew |

## 5.2 Why this group over the other three

| Group | For | Against | Verdict |
|---|---|---|---|
| Business/marketing (solo) | Plausibly the clearest willingness to pay (`UR-§2.3`); the need plausibly recurs; reachable | Their deeper problem is *team consistency*, which is out of scope (FC-2) | **Selected** |
| AI beginner | Needs the whole chain, so value is most visible | May use once and never return; least able to judge quality before paying | Strong second |
| Creator / designer | Most frequent potential user | May consider prompt-writing part of their craft (`UR-§2.2`) | Not first |
| Developer / technical | Clear need for structured prompts | Most able to write their own; least likely to pay (`UR-§2.4`) | Not first |

## 5.3 What this decision accepts

- **This is a decision, not a research finding.** `UR-§1.1` records the primary user as unvalidated. If it proves wrong, the launch produces a clean answer to the wrong question.
- **The team-consistency limitation is knowingly accepted.** If this group is confirmed as primary, FC-2 becomes a live gap requiring `CR-003`.
- **Do not widen to all four.** Mixed users produce mixed signals that cannot be separated afterwards.

## 5.4 Category scope at launch

**One category at launch — Image Generation**, including simple poster and social work, and expand through the admin panel (FEAT-030) once launched.

| Reason | Basis |
|---|---|
| Plausibly the most frequent need for the chosen user | `UR-§9 UC-1` |
| Cheapest per attempt on external tools, so failed attempts do not deter | `UR-§9 UC-2` |
| Prompt conventions relatively stable versus video | `UR-§9 UC-2` |
| Avoids the developer/website category, whose users are least likely to pay | `UR-§2.4` |

**Depth over breadth.** Twenty to thirty good templates in one category is a defensible launch catalog. Five in each of five categories is not — and someone who has just paid and finds nothing that fits will ask for a refund.

**The admin panel changes this from a constraint into a plan.** FEAT-037 means the catalog can grow from launch day onward without a release, which is the reason the panel is now in scope.

---

# 6. Primary MVP User Flow

**One journey. Search, filtering and saving are available throughout but are not separate steps — they help reach step 4 faster.**

| # | User action | AWA response | Requirement | Feature |
|---|---|---|---|---|
| 1 | Arrives with a creation need | Presents the category; states plainly that AWA provides a prompt and guidance, not the finished asset | FR-001, FR-006 | FEAT-001, 006 |
| 2 | Enters the category | Presents subcategories | FR-002 | FEAT-002 |
| 3 | Narrows to a specific job — or searches, or filters by tag or by AI model | Presents the templates | FR-002, FR-003, FR-004, FR-005 | FEAT-002, 003, 004, 005 |
| 4 | Considers the templates, optionally saving one to a collection for later | Shows what each produces and which tools it targets | FR-008, FR-010 | FEAT-008, 009 |
| 5 | Selects one | **Prompt is shown concealed** unless this is one of the 3 free sample templates (§3.3), with what a subscription provides stated | FR-026, FR-027 | FEAT-022, 023 |
| 6 | **Subscribes** | Account created; access granted; initial customization allowance issued | FR-030, FR-049 | FEAT-042, 026 |
| 7 | Reads the prompt | Full prompt delivered | FR-011 | FEAT-010 |
| 8 | *Optional:* types a change in plain language | Allowance and cap checked; a revised prompt returned; one unit consumed **on success only** | FR-015, FR-031 | FEAT-013, 015, 026 |
| 9 | Reads the tool recommendations | 1–3 tools, each with a reason | FR-019 | FEAT-016 |
| 10 | Reads the guidance | Brief steps for that tool | FR-023 | FEAT-020 |
| 11 | Takes the prompt | Delivered in one action | FR-012 | FEAT-011 |
| 12 | Goes to the tool | A route provided | FR-020 | FEAT-017 |
| 13 | **Produces the output there** | **Nothing — outside AWA entirely** | — | — |
| 14 | Returns | Asks whether it worked | FR-035, FR-040 | FEAT-028, 033 |

## 6.1 Preserved failure paths

| # | Situation | Response | Feature |
|---|---|---|---|
| F1 | Nothing in the catalog fits | Say so; capture what they were looking for; surface it as a gap | FEAT-007, 038 |
| F2 | They see the concealed prompt and do not subscribe | **The conversion moment.** `UR-§10 Scenario A` calls it the single most important untested moment in the product. Must be observable | FEAT-022 |
| F3 | Customization fails or the request is unusable | Previous prompt unchanged; **no unit consumed**; the user told plainly | FEAT-015 |
| F4 | The expenditure cap is reached | Customization pauses; **prompt access unaffected**; admins alerted. **See FC-3 in §14** | FEAT-043, 045 |
| F5 | Signed out by a login elsewhere | Reason stated; work not lost | FEAT-025, 046 |
| F6 | Allowance exhausted | Customize becomes a purchase route; **prompts still work** | FEAT-027, 034 |

## 6.2 Two notes on this flow

**The purchase sits at step 5–6**, at the point of highest value. `UR-§13` records this as the highest-stakes decision the user makes. **Three free sample templates (§3.3) ease this** — a visitor can read a real prompt before paying for any other.

**Step 8 is optional and costs money on every use.** The flow works completely without it — a user who never customizes has still received what they paid for. F4 and F6 guarantee that.

---

# 7. MVP Inputs

## 7.1 Required from the user

| Input | Where |
|---|---|
| Category, subcategory, template selections | Steps 2–4 |
| Account details and payment | Step 6 |

## 7.2 Optional from the user

| Input | Where | Note |
|---|---|---|
| A described change, typed | Step 8 | Costs one unit of allowance on success. Maximum 20 customizations per hour per user |
| Outcome report | Step 14 | Essential to the MVP's purpose |
| Free-text comment | Step 14 | The richest qualitative signal (`UR-§7.2`) |
| Description of what they wanted | Path F1 | High-value demand data |

## 7.3 Supplied by the platform

**Now authored through the admin panel rather than prepared before launch** — that is the point of FEAT-030–037.

| Content | Minimum at launch |
|---|---|
| Categories | 1 (§5.4), expandable from day one |
| Subcategories | Enough to divide the category into recognisable jobs |
| Templates with published prompts | 20–30. **A template cannot be published without a prompt** (FEAT-031) |
| Template descriptions | One per template, sufficient to choose behind the paywall |
| AI tool information | Every tool referenced, with a reason per recommendation |
| Tool/model associations | Every template covered, directly or by inheritance (FEAT-035) |
| Usage guidance | Per subcategory at minimum |
| The AI's rewriting instruction | Governs FEAT-013's behaviour |
| Plan and credit pack definitions | Priced from the cost measurement in §13 |

---

# 8. MVP Outputs

| Output | Contains | Who receives it | Requirement |
|---|---|---|---|
| **The prompt** | The full curated prompt for the template | Subscribers | FR-011, FR-012 |
| **A revised prompt** | The prompt adapted to a described change | Subscribers with allowance | FR-015 |
| **Tool recommendations** | 1–3 tools, each with a reason | Everyone | FR-019 |
| **A route to the tool** | A means of reaching it | Everyone | FR-020 |
| **Usage guidance** | Brief steps for that tool | Everyone | FR-023 |
| **Access state** | What the subscription grants, and until when | The subscriber | FR-027, FR-028 |
| **Allowance state** | Remaining units, and the cost of an action before taking it | The subscriber | FR-032 |
| **Outcome record** | The report, attributed to the exact prompt version | The team | FR-035, FR-040 |
| **Unmet-need record** | What a user wanted when nothing matched | The team | FR-007, FR-045 |
| **Demand signal** | Recurring change requests, in aggregate | The team | FR-036 |
| **Cost report** | Spend against the configured limit | The team | FR-050, FR-051 |

**No other outputs.** The MVP produces **no image, video, poster or other asset** — that happens on the external tool, outside AWA.

---

# 9. Illustrative MVP Demo Scenario

> **Labelled as illustrative.** A constructed demonstration, not a real user and not research.

### Starting situation
A person runs a small business and needs a product photograph of an item they sell, for a listing. No photographer, no design skills. They know AI can produce images.

### User problem
They do not know which of several image tools to use, and their own attempts look obviously artificial. They have tried twice and abandoned it.

### AWA journey
1. Arrives and reads, in one line, that AWA gives them a prompt and tells them where to use it — not that it makes the image.
2. Enters **Image Generation**, narrows to **Product Photography → E-commerce Listing Shots**.
3. Picks the template whose description matches a plain product on a white background.
4. **The prompt is concealed.** What a subscription provides is stated plainly, alongside the tool recommendations and guidance, which are visible.
5. **Subscribes.** The prompt appears — detailed, referencing lighting, lens and background in a way they would not have written. An initial customization allowance is issued.
6. The product is a **leather wallet**, not what the template assumed. They tap Customize and type: *"make it a leather wallet, and vertical for a phone listing."* A revised prompt returns in a few seconds. **One unit consumed.**
7. Reads two recommended tools, each with one line explaining why.
8. Reads four steps: where to paste it, which setting to change, what to adjust if the first result is too dark.
9. Takes the prompt.

### AWA result
A prompt adapted to their actual product, a named tool with a reason, and four steps.

### External AI tool
They open the recommended tool, paste the prompt, apply the named setting, and generate. **Entirely outside AWA.**

### Final outcome
They get an image they use on the listing, return to AWA and report that it worked.

### What this demonstrates
- The full value chain: curated prompt → adapted in the user's own words → reasoned tool → usage steps
- The product boundary, visibly
- The purchase decision at its real position in the journey
- Customization earning its cost on a genuine mismatch, not a contrived one

### What it does not demonstrate
- That the curated prompt beats what a general AI assistant would have produced

**That remains the most important thing a demonstration could reveal**, and §17.1 requires it to be shown.

---

# 10. MVP Success Criteria

`P-§20` records that no targets are established and none can be derived from a product that has not run. Every target below is marked **REQUIRES PRODUCT DECISION** and must be set before the post-launch review, not invented now.

## 10.1 Product success — can the journey be completed?

| Criterion | Target |
|---|---|
| A participant reaches the concealed prompt unaided | **REQUIRES PRODUCT DECISION** |
| A participant completes purchase without assistance | **REQUIRES PRODUCT DECISION** |
| A participant customizes successfully on the first attempt | **REQUIRES PRODUCT DECISION** |
| A participant takes the prompt to the recommended tool | **REQUIRES PRODUCT DECISION** |
| A participant correctly states what AWA does after using it | **REQUIRES PRODUCT DECISION** |

## 10.2 User success — did it help?

| Criterion | Target |
|---|---|
| Reports the result was usable | **REQUIRES PRODUCT DECISION** |
| Reports fewer attempts than expected | **REQUIRES PRODUCT DECISION** — see the baseline problem below |
| Reports the tool recommendation was right | **REQUIRES PRODUCT DECISION** |
| Reports the customization produced what they asked for | **REQUIRES PRODUCT DECISION** |

> **The baseline problem.** `UR-§8` and `04-FEATURES` FG-3 record that the central claim — fewer attempts — cannot be measured without a baseline of current effort that does not exist and **cannot be created after launch**. Ask each early user, before they use AWA, how many attempts their last similar task took. One question, and the only chance to gather it.

## 10.3 Validation success — is the hypothesis worth pursuing?

| Criterion | Why it decides |
|---|---|
| Users return for the next task | Recurrence is the precondition for a subscription (`P-§11.3`) |
| In blind comparison, the curated prompt beats a general assistant's | **If this fails, nothing else rescues the product** |
| Unmet demand clusters into identifiable gaps | Clustered means a catalog can serve this audience |
| Users attribute a good outcome to AWA rather than the tool | If they credit the tool, they will not renew (`UR-§15`) |
| Customization is used, and its use correlates with satisfaction | Determines whether it earns its cost |

## 10.4 Commercial success — now measurable

| Signal | Note |
|---|---|
| Visitors who see the concealed prompt and subscribe | **The conversion moment.** `UR-§10 Scenario A` |
| Subscribers who buy additional allowance | Whether credits are understood and wanted |
| **Revenue per subscriber minus cost to serve them** | **The number that decides whether the model works.** Requires §13's cost measurement |
| Renewal, once the first term ends | The real test of recurrence |
| Refund requests, and their stated reasons | The clearest signal of a mismatch between expectation and delivery |

## 10.5 MVP criteria are not long-term KPIs

| MVP criteria | Long-term KPIs *(not for now)* |
|---|---|
| Can a user complete the journey? | Lifetime value |
| Did the prompt produce a usable result? | Cohort retention curves |
| Is a curated prompt better than the free alternative? | Catalog coverage across five categories |
| Does revenue exceed cost to serve? | Market share |
| Do users return? | Feedback volume at scale |

---

# 11. Out of Scope for MVP

Three features remain excluded.

| Excluded | Why it is not needed at launch |
|---|---|
| **Voice input for customization** (FEAT-014) | A second external capability, a second cost line and a second failure mode, providing a second route to something typed customization already delivers. Typing is the route at launch |
| **Manual prompt editing** (FEAT-012) | Would blur the measurement of whether the provided prompt and the AI customization each carry value. Add once both are understood |
| **Tool availability monitoring** (FEAT-019) | Links can be checked by hand at launch catalog size. Becomes necessary as the catalog and tool list grow |

**Also out of scope, from `P-§21` and unchanged:** community-submitted templates · direct execution on external tools · multi-step project mode · team accounts · output comparison across tools · prompt sharing by link.

---

# 12. MVP vs Full Product

| Area | MVP (launch) | Future product |
|---|---|---|
| **Primary user** | One group — the solo business/marketing user (§5) | Four candidate groups, once `V-1` resolves which is primary |
| **Core workflow** | Browse → template → paywall → prompt → customize → tool → guidance → leave → report | Unchanged in shape |
| **Categories** | 1 at launch, **expandable from day one through the admin panel** | 5 confirmed, extensible without limit (`P-§16`) |
| **Templates** | 20–30 at launch, growing continuously | An expanding maintained catalog |
| **Prompt experience** | Curated prompt plus typed AI customization | Plus voice input (FEAT-014) and manual editing (FEAT-012) |
| **Discovery** | **Navigation, search, attribute filtering and AI model filtering, all at launch** | Unchanged |
| **Access** | Subscription-gated prompt access | Unchanged |
| **Customization limits** | Allowance plus purchase | Unchanged |
| **Feedback** | Outcome report, demand signal, gap detection, reporting | Plus automatic feedback-driven re-ranking (`OD-38`) |
| **Content operation** | Full self-serve panel with live publishing | Plus availability monitoring (FEAT-019) |
| **Languages** | **English at launch; further languages added by an administrator and selectable on the frontend, from day one** | Unchanged — this is not deferred |
| **Retention features** | **Saved templates and collections, at launch** | History, if `OD-12` confirms |
| **Renewal** | Manual repurchase | Automatic renewal with a recurring mandate |

**The gap between launch and full product is three features.**

**Nothing in the right-hand column is invented.** Every entry appears in `04-FEATURES.md` as a confirmed feature or in `P-§21` as future scope.

---

# 13. MVP Dependencies

## 13.1 Required

| Dependency | Detail | Risk if absent |
|---|---|---|
| **A measured cost per customization** | Run AWA's real prompts and realistic user phrasings through the chosen service. `P-§18` records this as UNKNOWN | Credits cannot be priced and the cap value cannot be set (§3.4) |
| **An AI capability for prompt rewriting** | `09 §2` places this at **AI Model** level — a single-shot text transformation. Not an assistant, not an agent | FEAT-013 cannot exist |
| **A payment arrangement** | Configured and verified before live use (FEAT-042) | No revenue, and a broken checkout reaching a real customer |
| **User accounts** | Required by the paywall — access is a per-user decision | FEAT-022 cannot exist |
| **Prompt quality** | Every prompt genuinely better than what the user would write. `UR-§8` — quality risk sits with the content team | Weak prompts behind a paywall lead to refunds |
| **Content authored through the panel** | 20–30 templates with prompts, descriptions, tool associations and guidance | No catalog, no product |
| **Current external tools** | Each reachable and behaving as the guidance describes, checked before launch | Guidance that does not match the tool discredits AWA, not the tool |
| **A pre-launch baseline question** | One question per early user about their last similar task | Without it, the central claim is unmeasurable, permanently |
| **Someone to read the results** | Time allocated to interpret feedback, demand signals and cost reports | Evidence nobody reads has not been gathered |

## 13.2 Decided, and implemented per §3.3

| Item | Rule to implement |
|---|---|
| Cap behaviour when the cap is reached | Customization pauses for everyone; prompt access is unaffected |
| End-of-term behaviour | Prompts already delivered remain readable; no new deliveries or customizations |
| Retention of user-provided content | 12 months, stated to users before collection |

## 13.3 Not required

| Not required | Why |
|---|---|
| A speech-to-text capability | FEAT-014 excluded from launch |
| Agreements with external tool providers | AWA links to them; a link is not an integration (`09 §2.4`) |
| An agentic framework | `09 §3` — the customization is a single transformation, not an agent |
| Team or multi-seat capability | Out of scope (`P-§21`); see FC-2 |

---

# 14. MVP Risks

| # | Risk | Type | Basis | Mitigation available |
|---|---|---|---|---|
| **R1** | **A general AI assistant produces an equally good prompt** | Adoption | `P-§12.6`, unanswered across five documents | Test directly before launch (§17.1). **Costs an afternoon** |
| **R2** | A subscriber holding allowance is stopped when the expenditure cap is reached | Business | FEAT-043, FEAT-026 | **Decided (§3.3):** customization pauses, prompt access is unaffected, administrators are notified before the limit binds. The residual risk is a subscriber holding credits they cannot spend — mitigated by setting the cap high enough that it does not bind in normal operation |
| **R3** | Users are surprised by what happens when their subscription ends | Product | `UR-§14.2` | **Decided (§3.3):** prompts already delivered remain readable; no new deliveries or customizations. Stated at purchase (FEAT-023) and recorded on the subscription |
| **R4** | **Cost per customization exceeds what the price supports** | Business | `P-§18` — unknown | Measure before pricing (§13). Credit prices and the cap value remain **REQUIRES PRODUCT DECISION** until that measurement exists (§3.4) |
| **R5** | Few subscribe from a concealed prompt | Business | `04-FEATURES` FC-1; `UR-§10 Scenario A` | **Decided (§3.3):** three templates are fully readable without a subscription, so a visitor can judge prompt quality before paying |
| R6 | The chosen primary user is wrong | User | `UR-§1.1` — unvalidated | Selected deliberately (§5); market narrowly to that group so the result is interpretable |
| R7 | Prompts are not good enough | Content | `UR-§8` | Have prompts written by whoever is best at it; test each against a self-written prompt before publishing |
| R8 | The catalog is too small and paying users find no fit | Content | `UR-§11.2` | Depth in one category (§5.4); treat F1 records as urgent, not background |
| R9 | Customization is rarely used, or does not help | Value | `UR-§9 UC-6` — the shakiest assumption in the product | Measure usage and satisfaction separately — compare users who customized against those who did not. If low, the cost and complexity were not worth it |
| R10 | The need does not recur | Business | `V-3` | Observe renewal rather than assuming it |
| R11 | An external tool changes after launch | Tool | `UR-§11.4` — the largest structural risk | Check before launch; FEAT-019 becomes necessary sooner than planned |
| R16 | **The AI model filter is built before the usage data that would justify it** | Scope | `UR-§5.3` records it is unknown whether users pick a tool per task or stick to one tool. Included by decision (§3.4) rather than validated first | Watch actual filter usage from launch; if unused, the effort was spent early rather than wasted, since removing an unused filter is simpler than adding a missing one |
| R17 | **A translated prompt may not perform well on the external AI tool**, even though the AWA interface is correctly translated | Content | `UR-§12` — UNKNOWN whether prompt wording in a non-English language produces good results on tools trained mainly on English prompts | Translating the interface does not guarantee the prompt works. Treat non-English templates as needing their own quality check, not just a translation pass |
| R12 | Users are confused by two payment mechanisms | Business | `UR-§10 Scenario D` | FEAT-023 — state it before purchase, not on hitting the limit. Usability-test the wording |
| R13 | Content authoring capacity is lower than the catalog needs | Content | `UR-§2.6` — the product's practical ceiling, never measured | **Measure hours per template from day one.** FEAT-038 directs the capacity; nothing increases it |
| R14 | A poor launch result has several possible causes | Scope | Launch scope covers a wide feature set | Compare satisfaction between customizers and non-customizers; talk to people who declined |
| R15 | Scope creeps into the remaining three features | Scope | This document's own risk | Treat §4 as fixed. Any addition must displace something |

---

# 15. MVP Validation Questions

## Critical — must be answered

| # | Question | How |
|---|---|---|
| V-C1 | **Is a curated prompt better than a general AI assistant's?** | Blind side-by-side comparison. **Can and should be run before building** |
| V-C2 | Can a user complete the journey unaided and state correctly what AWA does? | Observation |
| V-C3 | **Will anyone subscribe having seen only a concealed prompt?** | The conversion rate at F2. Now directly measurable |
| V-C4 | **Is customization used, and does it help?** | Usage rate; satisfaction split between users who customized and those who did not |
| V-C5 | Do users choose a tool per task, or use one tool for everything? | Ask directly. The model filter is already built (§3.4); this determines whether it becomes primary navigation or stays a minor control |
| V-C6 | Does the need recur — do they return and renew? | Observe over the first term |
| V-C7 | **Does revenue per subscriber exceed cost to serve?** | Requires the cost measurement in §3.4. **The number that decides the model** |
| V-C8 | Is unmet demand clustered or scattered? | F1 records |
| V-C9 | Do users understand subscription and allowance as separate things? | Usability-test the wording before launch; then watch refund reasons |

## Important

| # | Question |
|---|---|
| V-I1 | Which of prompt, tool recommendation and guidance do users value most? |
| V-I2 | Do they read the guidance, or skip to taking the prompt? |
| V-I3 | Can they choose the right template from the description alone, behind a paywall? *(FC-1)* |
| V-I4 | How many attempts did their last similar task take, before AWA? *(the baseline — must be asked first)* |
| V-I5 | Do they attribute a good outcome to AWA or to the tool? |
| V-I6 | **How long does the team take to author one template?** *(the first real data on the ceiling in `UR-§2.6`)* |
| V-I7 | What proportion of customizations fail or are unusable? *(a direct cost line, not just a quality metric — `09 §4.3`)* |
| V-I8 | Does the one-device restriction affect willingness to subscribe? |
| V-I9 | **Do users use search or filtering at all**, given the catalog starts at only 20–30 templates? |
| V-I10 | **Do users save templates into collections**, and do they return to them? |
| V-I11 | **Does a non-English prompt actually produce good results on the external tool**, not just a correctly translated interface? |

## Future

| # | Question |
|---|---|
| V-F1 | Which of the other four categories has demand? |
| V-F3 | Would users want a full history, beyond saved collections? |

---

# 16. MVP Acceptance Criteria

The MVP is complete when all of the following can be demonstrated.

| # | Criterion |
|---|---|
| A1 | A user matching the chosen primary user can enter and reach the category unaided |
| A2 | They can navigate to a specific job within the category |
| A3 | They can select a template from its description alone, **without seeing the prompt** |
| A4 | The prompt is concealed until they subscribe, and **is not obtainable by any other route** (NFR-002) |
| A5 | What a subscription provides — including that customization is limited separately — is stated **before** purchase |
| A6 | They can complete purchase and immediately receive prompt access and an initial allowance |
| A7 | They receive the full prompt for the selected template |
| A8 | They can request a change in their own words, typed, and receive a revised prompt |
| A9 | **A failed or unusable customization consumes no allowance, leaves the previous prompt intact, and says so** |
| A10 | **Exhausted allowance does not affect prompt access** |
| A11 | **When the expenditure cap is reached, prompt access is unaffected and affected users are told why without implying fault** |
| A12 | They receive 1–3 tool recommendations, each with a stated reason |
| A13 | They receive brief usage guidance |
| A14 | They can take the prompt away in one action |
| A15 | They can reach the recommended external tool |
| A16 | They can produce their intended output **on that external tool** and identify it as usable |
| A17 | They can report the outcome, attributed to the exact prompt version they saw |
| A18 | Where nothing fits, they are told plainly and can record what they were looking for |
| A19 | After using it, they correctly describe what AWA does — specifically, that it does not produce the asset |
| A20 | **An administrator can create a category, publish a template with a prompt, assign a tool, and see the change live — without a software release** |
| A21 | **An administrator can revise a prompt and revert it, with history intact and feedback attributed per version** |
| A22 | A subscription reaching its end behaves as stated at purchase |
| A23 | A session started on a second device ends the first, with the reason stated and work not lost |
| A24 | The complete journey, arrival to outcome report, can be demonstrated end to end |

**A16 and A19 remain the two that matter most.** A16 is the only criterion proving value was delivered rather than offered. A19 protects every other measurement.

**A9, A10 and A11 protect the user against mechanisms built to protect the business**, and should be tested explicitly rather than assumed.

---

# 17. Demo Readiness

The demonstration proves value, not polish.

| # | Must be demonstrable | Ready when |
|---|---|---|
| 1 | The person has a real creation goal | A genuine task |
| 2 | They encounter the documented problem | They can say which tool and what to write are genuinely unclear |
| 3 | They enter AWA | The boundary is stated in the first screenful |
| 4 | They reach the concealed prompt and understand the offer | What a subscription provides is clear before payment |
| 5 | They subscribe and receive access | Purchase completes; prompt appears; allowance issued |
| 6 | They adapt the prompt in their own words | A revised prompt returns, and it is visibly better suited |
| 7 | AWA delivers the full value | Prompt, reasoned recommendation and steps — all three, connected |
| 8 | The output works in the external workflow | It runs on the recommended tool and produces something usable |
| 9 | The intended outcome is achieved | They have the asset and say it is good enough |
| 10 | **An admin change appears live** | Edit a prompt; a user generation reflects it within seconds |

## 17.1 What the demo must also include

**A comparison.** Alongside the AWA prompt, run the same brief through a general-purpose AI assistant and put both outputs side by side.

Uncomfortable, and the single most useful thing the demo can contain. If AWA's prompt does not visibly win, the product does not yet have a reason to exist — and now people are being asked to pay for it. Far better discovered in a demonstration than in refund requests.

## 17.2 What the demo does not need

Visual design, branding, animation, more than one category, more than a handful of templates in the path being shown, voice input, or the remaining excluded features.

---

# 18. MVP Scope Decision

## Build — 44 features

**Discovery and delivery (14):** FEAT-001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 016, 017, 018, 020
**AI customization (3):** FEAT-013, 015, 043
**Access, subscription and payment (7):** FEAT-021, 022, 023, 024, 025, 042, 045
**Credits (3):** FEAT-026, 027, 047
**Admin panel (12):** FEAT-030, 031, 032, 033, 034, 035, 036, 037, 038, 039, 040, 041
**Learning and continuity (4):** FEAT-028, 029, 044, 046

**Plus:** 20–30 templates in one category, authored through the panel, each with a prompt, description, tool association with reasoning, and guidance.

## Recommended build sequence

The scope is large enough that order matters. Dependencies, not preference:

| # | Stage | Why here |
|---|---|---|
| 1 | Admin panel and content model, including tool/model registry and language management (FEAT-030–040) | Nothing else can be tested without content. Building this first lets the catalog be authored in parallel, in whatever languages are configured |
| 2 | Discovery and prompt delivery, including search, filtering, the model filter and saved templates (FEAT-001–011, 016–018, 020) | The free journey, end to end, before anything is charged for. Discovery features ship together since they all read the same catalog |
| 3 | Accounts, paywall and payment (FEAT-021–025, 042, 046) | Revenue. Requires the cap and end-of-term rules from §3.3 |
| 4 | Credits and expenditure control (FEAT-026, 027, 043, 044, 045) | **Before customization, not after.** Building the AI rewrite without cost control ships something with no brake |
| 5 | Typed customization (FEAT-013, 015, 047) | Requires stage 4 |
| 6 | Learning (FEAT-028, 029, 038, 041) | Can run alongside stages 2–5 |

**The one sequencing rule that must not be broken: stage 4 before stage 5.** `04-FEATURES` and `09 §4.1` both make the point — an AI rewrite without cost control has no brake, and it will get used.

## Do not build yet — 3 features

Voice input · manual prompt editing · tool availability monitoring.

Each is valid and deferred, with a stated trigger in §11.

## Decided before building

The rules the build implements, from §3.3. No stage waits on these.

| # | Rule | Applies at |
|---|---|---|
| 1 | Cap reached → customization pauses, prompt access unaffected, administrators notified first | Stage 4 |
| 2 | Term ends → prompts already delivered stay readable; no new deliveries or customizations | Stage 3 |
| 3 | Three templates fully readable without a subscription | Stage 3 |
| 4 | Initial allowance of 10 customizations | Stage 4 |
| 5 | 20 customizations per user per hour | Stage 5 |
| 11 | English is the only guaranteed language at launch; further languages are entirely admin-configured, not a fixed set | Stage 1 |
| 12 | Saved templates are organised into user-created collections; a template may sit in more than one | Stage 2 |
| 6 | Feedback outcome is binary: worked / did not work | Stage 6 |
| 7 | User-provided content retained 12 months, stated before collection | Stage 5 |
| 8 | Renewal is manual; no recurring mandate | Stage 3 |
| 9 | One active session per account | Stage 3 |
| 10 | Primary user: the solo business or marketing user | Everything |

## Requires product decision before the stage that needs it

| # | Item | Blocks |
|---|---|---|
| 1 | **Cost per customization** — measured on AWA's own prompts, not estimated | Items 2 and 3 |
| 2 | **Credit pack sizes and prices** — set from item 1 | Stage 4 |
| 3 | **The monthly expenditure cap value** — set from item 1 | Stage 4 |

## Core user journey

> A solo business or marketing user arrives with a real need, navigates to a specific job, selects a template from its description, meets a concealed prompt, subscribes, receives the prompt, adapts it in their own words to match their actual product, reads two reasoned tool recommendations and four usage steps, takes the prompt to the tool, produces an image they use, and returns to report that it worked.

## Core hypothesis

> A curated prompt written for a specific job — adaptable in plain language, paired with a reasoned tool recommendation and short usage steps — lets a non-expert produce a usable result with less effort than they would manage alone, is meaningfully better than what a general AI assistant would give them, and is worth paying for at a price that exceeds the cost of serving them.

## Evidence required to proceed beyond launch

| # | Evidence |
|---|---|
| E1 | Users complete the journey unaided and correctly describe what AWA does |
| E2 | A clear majority report the result was usable |
| E3 | **In blind comparison, the curated prompt visibly beats a general assistant's prompt** |
| E4 | A meaningful proportion of those who reach the concealed prompt subscribe |
| E5 | **Revenue per subscriber exceeds the measured cost of serving them** |
| E6 | Customization is used, and users who customize report better outcomes than those who do not |
| E7 | Users return, and renew |
| E8 | Unmet demand is clustered, indicating a catalog can serve this audience |
| E9 | Measured authoring effort indicates the catalog can be maintained |

**E3 remains the gate, and E5 is the second.** If the curated prompt does not beat the free alternative, nothing else matters. If revenue does not exceed cost to serve, the product works and the business does not.

E3 is still the cheapest to test, and it can still be run before a single feature is built.

---

# 19. Source Traceability

| MVP element | Requirement | Feature | User need | Problem |
|---|---|---|---|---|
| Category browsing | FR-001 | FEAT-001 | Reach a relevant task | No bounded starting point (`P-§2.2`) |
| Nested navigation | FR-002 | FEAT-002 | Reach a specific job | Broad categories cannot reach a specific need |
| Boundary communication | FR-006 | FEAT-006 | Understand what is offered | Misconception that AWA generates output (`UR-§14.3`) |
| No-match path | FR-007, FR-009 | FEAT-007 | Proceed rather than leave | Small catalog at launch (`UR-§11.2`) |
| Template selection | FR-008 | FEAT-008 | Choose confidently | Choosing blind behind a paywall (`UR-§13`) |
| Search, filter, model filter | FR-003–005 | FEAT-003, 004, 005 | Find or narrow to a relevant template | Difficulty finding content; prompts not portable between models (`UR-§4.6`, `UR-§5.3`) |
| Saved templates and collections | FR-010 | FEAT-009 | Return to a template without searching again | Difficulty returning to something useful (`UR-§4.6`) |
| Prompt delivery | FR-011 | FEAT-010 | Obtain a prompt they could not write | Does not know what to write (`P-§2.2`) |
| Prompt export | FR-012 | FEAT-011 | Use it on the external tool | Value realised outside AWA (`P-§1`) |
| **Customization** | FR-015 | FEAT-013 | Adapt a template to a real need | Can describe a change but not compose it (`UR-§4.3`) |
| **Customization safeguards** | FR-017, FR-018 | FEAT-015 | Not be charged for a failure | Fairness (`UR-§11.1`) |
| Tool recommendations | FR-019 | FEAT-016 | Choose a tool with confidence | Does not know which tool suits (`P-§2.2`) |
| Tool handoff | FR-020 | FEAT-017 | Reach the tool | The journey continues elsewhere |
| Usage guidance | FR-023 | FEAT-020 | Run the prompt correctly first time | Does not know how to operate the tool (`P-§2.2`) |
| **Free tier and paywall** | FR-025, FR-026 | FEAT-021, 022 | Assess before paying; the business model | `P-§11.1` |
| **Subscription disclosure** | FR-027 | FEAT-023 | Know the terms in advance | Two charges perceived as one product (`UR-§10 D`) |
| **Subscription lifecycle** | FR-028 | FEAT-024 | Not be surprised by losing access | Unresolved expectation (`UR-§14.2`) |
| **Allowance management** | FR-030–032, FR-034 | FEAT-026 | Know what an action costs before taking it | Fairness (`UR-§13`) |
| **Expenditure control** | FR-050 | FEAT-043 | *(protects the business)* | Cost per use is unknown (`P-§18`) |
| **Admin content management** | FR-037–044 | FEAT-030–037 | *(serves the operator)* | Guidance decays as tools change (`P-§15`) |
| **Version history** | FR-040 | FEAT-033 | *(serves the operator)* | Measuring whether a change helped (`P-§20`) |
| Outcome feedback | FR-035 | FEAT-028 | *(serves the team)* | AWA cannot observe the output (`P-§15`) |
| **Demand signal** | FR-036 | FEAT-029 | *(serves the team)* | Catalog gaps visible only by absence (`P-§20`) |
| Language management | FR-046 | FEAT-039 | Reach beyond a single language | Admin-added, frontend-selectable, from launch |
| Primary user choice | — | — | — | Primary user UNKNOWN (`UR-§1.1`) — **a decision, not a finding** |
| One category at launch | — | — | — | Depth over breadth; `UR-§9`, `UR-§2.4` |
| Recommended build sequence | — | — | — | **An MVP decision.** Dependencies, per `04-FEATURES` and `09 §4.1` |

---

## Closing note

Launch scope is 44 of the 47 features. The three exclusions are in §11, each with a trigger for when it returns.

§3.3 sets thirteen launch rules the build implements directly. §3.4 lists the three items that cannot be determined from the documentation — all three wait on one measurement.

**That measurement is the cost per customization.** Credit prices and the expenditure cap both derive from it, and `P-§18` records it as unknown. Run twenty real prompts and real user phrasings through the chosen capability and record the figures before stage 4 begins.

One test remains worth running early and costs an afternoon: write curated prompts for three briefs, ask a general AI assistant for prompts for the same three, run all six on the same tool, and compare the outputs blind.