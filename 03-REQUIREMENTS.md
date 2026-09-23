# 03 — Product Requirements

**Product:** AWA — AI Creation Guide Platform
**Sources of truth:** `docs/01-PROBLEM.md`, `docs/02-USER-RESEARCH.md`
**Document stage:** Requirements only. No features, user stories, UX, architecture, data model, APIs or technology.
**Status:** Baseline draft

---

## How to read this document

### Evidence basis

`01-PROBLEM.md` and `02-USER-RESEARCH.md` establish two different kinds of statement, and requirements derive differently from each:

| Basis | What it means | Requirement status |
|---|---|---|
| **Confirmed product decision** | An explicit decision recorded in the source documents (the product boundary, the journey, the subscription model, admin capabilities) | May become a confirmed requirement |
| **Confirmed constraint** | A structural limit recorded in the sources | May become a confirmed requirement |
| **Assumption** | A hypothesis about users that no research has confirmed | Marked **ASSUMPTION — REQUIRES VALIDATION** |

**The condition this baseline is written under.** No user research has been conducted. `02-USER-RESEARCH.md` §4 records that **no user pain point could be classified as FACT**. Consequently:

- Requirements tracing to a **product decision** are confirmed.
- Requirements tracing only to a **belief about users** carry the validation marker, even where they seem obvious.

A requirement marked ASSUMPTION is not a weak requirement. It is a requirement whose *justification* is untested. It may be built — but if validation overturns the assumption, it should be reconsidered rather than defended.

### Requirement traceability keys

| Key | Meaning |
|---|---|
| `P-§n` | Section n of `01-PROBLEM.md` |
| `UR-§n` | Section n of `02-USER-RESEARCH.md` |
| `V-n` | Validation question n from `UR-§16` |

### Priority

| Level | Definition |
|---|---|
| **P0** | AWA cannot fulfil its core purpose without this |
| **P1** | Important to experience or business outcome; the core product can function without it |
| **P2** | Desirable; not required for initial scope |

### Product boundary — governs every requirement below

```
User
  ↓
AWA  ├── helps identify the appropriate creation workflow
     ├── helps structure the user's requirements
     ├── provides a suitable prompt
     ├── recommends relevant external AI tools
     └── provides usage guidance
        ↓
External AI platform          ← not AWA
        ↓
Final generated output        ← not AWA
```

**FACT** (`P-§1`, `P-§15`, `UR-§7`). No requirement in this document may imply that AWA produces the final image, video, website, presentation or other output, nor that AWA controls an external platform.

### Responsibility split

| AWA is responsible for | The external AI tool is responsible for | The user is responsible for |
|---|---|---|
| The prompt text | Producing the output | Choosing whether to follow the recommendation |
| Tool and model recommendations, with reasoning | Its own availability, pricing and interface | Having or obtaining access to the tool |
| Usage guidance | Its own settings and behaviour | Operating the tool |
| Keeping the above current | Changing without notice | Judging whether the result meets their need |

---

# Part 1 — Functional Requirements

## A. Discovery and Navigation

### FR-001 — Browse creation categories
- **Type:** Functional
- **Description:** The system must allow any visitor to browse the available creation categories without an account or payment.
- **User/Stakeholder:** All user groups; non-subscribed visitor
- **Priority:** P0
- **Source:** `P-§1` (journey), `P-§16` (free access confirmed), `UR-§1.2`
- **Rationale:** Category selection is the entry point of the confirmed journey, and free browsing is a confirmed product decision.
- **Acceptance Criteria:**
  - Given a visitor with no account, when they open the product, then the available categories are listed.
  - Given a category has been made unavailable by an administrator, when a visitor browses, then it does not appear.
  - Given a visitor selects a category, then they can proceed to its contents.
- **Dependencies:** FR-041
- **Open Questions:** Whether category browsing is how users actually prefer to find things (`V-1`, `UR-§7.1`).

### FR-002 — Navigate nested subcategories to any depth
- **Type:** Functional
- **Description:** The system must allow a category to contain subcategories, and a subcategory to contain further subcategories, without a fixed limit on depth, and must allow users to navigate that structure and know their position within it.
- **User/Stakeholder:** All user groups; content administrator
- **Priority:** P0
- **Source:** `P-§1`, `P-§16` (unlimited nesting confirmed), `UR-§7`
- **Rationale:** Confirmed product decision. Navigation position matters because a user several levels deep must be able to retreat without losing their place.
- **Acceptance Criteria:**
  - Given a subcategory containing further subcategories, when a user opens it, then those are presented.
  - Given a user is at any depth, then their full path from the top-level category is visible and each level can be returned to.
  - Given a subcategory at any depth, then it behaves consistently with subcategories at every other depth.
  - Given a category is made unavailable, then everything contained within it also becomes unavailable to users.
- **Dependencies:** FR-041
- **Open Questions:** Whether deep nesting aids or hinders users (`UR-§13`). A practical depth beyond which navigation degrades is **UNKNOWN**.

### FR-003 — Search for templates and categories
- **Type:** Functional
- **Description:** The system must allow users to find templates and categories by searching, across the whole catalog rather than only within the current location.
- **User/Stakeholder:** All user groups
- **Priority:** P1
- **Source:** `P-§16`, `UR-§4.6`
- **Rationale:** Users who know what they want should not be required to navigate a hierarchy to reach it.
- **Priority reasoning:** P1 rather than P0 — navigation alone satisfies the core journey. Search becomes P0 as the catalog grows.
- **Acceptance Criteria:**
  - Given a search term, when results are returned, then each result indicates where in the catalog it sits.
  - Given a search returns nothing, then the user is told so and offered a way to continue.
  - Given content unavailable to users, then it does not appear in results.
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** That users search rather than browse is untested (`V-1`).

### FR-004 — Filter templates by attributes
- **Type:** Functional
- **Description:** The system must allow users to narrow a list of templates by the attributes recorded against them.
- **User/Stakeholder:** All user groups
- **Priority:** P1
- **Source:** `P-§16`, `UR-§4.6`
- **Rationale:** Reduces the difficulty of choosing between visually similar templates (`UR-§13`).
- **Acceptance Criteria:**
  - Given filters are applied, then only templates matching all of them are shown.
  - Given filters are applied, then which filters are active is visible and each can be removed individually.
  - Given filters exclude everything, then the user is told so and can clear them.
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** That users will use filters at all.

### FR-005 — Filter templates by AI model
- **Type:** Functional
- **Description:** The system must allow users to restrict templates to those intended for a specific external AI model.
- **User/Stakeholder:** Users who already have access to a particular tool — most likely creators and developers (`UR-§2.2`, `UR-§2.4`)
- **Priority:** P1
- **Source:** `P-§16` (confirmed capability), `UR-§5.3`, `UR-§9 UC-2`
- **Rationale:** Prompt wording is not portable between models. A user who owns one tool needs prompts written for it.
- **Priority reasoning:** P1 despite being a confirmed decision, because `UR-§5.3` records it is **UNKNOWN** whether users choose a tool per task or use one tool for everything. If the latter, this becomes P0 and the primary navigation.
- **Acceptance Criteria:**
  - Given a user filters by a model, then only templates associated with that model are shown.
  - Given a template inherits its model association from a parent category, then it appears under that filter without a separate association.
  - Given a model has been made unavailable, then it no longer appears as a filter option.
- **Dependencies:** FR-045, FR-046
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** That users know which model they have, and that model-specific wording differences are large enough to matter to them (`V-14`, `UR-§12`).
- **Open Questions:** Whether the term "model" is understood by low-familiarity users (`UR-§12`).

### FR-006 — Communicate the product boundary
- **Type:** Functional
- **Description:** The system must make clear to users, before they pay and before they act on a prompt, that AWA provides prompts and guidance and does not itself produce the final output.
- **User/Stakeholder:** All user groups; the business
- **Priority:** P0
- **Source:** `P-§1`, `P-§15` (confirmed constraint), `UR-§14.3`
- **Rationale:** `UR-§14.3` identifies misunderstanding the boundary as possibly the most common misconception the product faces. A user who believes AWA generates images will consider the product broken on arrival.
- **Acceptance Criteria:**
  - Given a first-time visitor, when they view the entry point, then the role of the external tool is stated.
  - Given a user views a prompt, then it is evident that the output is produced elsewhere.
  - Given a user is asked to pay, then what they receive is stated in terms that do not imply generation.
- **Open Questions:** Whether users understand the boundary after exposure (`V-7`).

### FR-007 — Handle the absence of a suitable template
- **Type:** Functional
- **Description:** When no template matches the user's need, the system must offer a way to proceed rather than ending the journey.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `UR-§11.2` (identified as most likely at launch, when the catalog is small)
- **Rationale:** A small launch catalog makes this a common path, not an edge case. Ending the journey here loses a user who had a valid need.
- **Acceptance Criteria:**
  - Given no template matches, then the user is offered an alternative route — a broader starting point, adjacent templates, or a way to express the need.
  - Given the user takes that route, then they still receive tool recommendations and guidance appropriate to their category.
  - Given this occurs, then it is recorded as a catalog gap (see FR-049).
- **Dependencies:** FR-009, FR-049

---

## B. Templates

### FR-008 — Present template information sufficient for selection
- **Type:** Functional
- **Description:** The system must present enough information about a template, before payment, for a user to judge whether it fits their need.
- **User/Stakeholder:** Non-subscribed visitor; all user groups
- **Priority:** P0
- **Source:** `UR-§13` (the template decision is identified as under-supported), `UR-§2.5`
- **Rationale:** `UR-§13` records that users must currently choose a template from a name, tags and a preview, with the prompt itself behind the paywall — choosing blind at the point that most determines their outcome. This requirement does not resolve the tension; it obliges the product to minimise it.
- **Acceptance Criteria:**
  - Given a template, then its intended outcome is described in terms a user can evaluate without reading the prompt.
  - Given a template, then the external tools and models it is intended for are shown.
  - Given a user has selected a template that turns out not to fit, then they can return and choose another without losing their progress.
- **Open Questions:** Whether the information shown is sufficient (`V-4`, `V-10`). See **Conflict C-4**.

### FR-009 — Allow a general starting point without a template
- **Type:** Functional
- **Description:** The system must allow a user to proceed within a category without selecting a specific template.
- **User/Stakeholder:** Users whose need is not covered by the catalog
- **Priority:** P1
- **Source:** `P-§1` ("or starts from a blank context"), `UR-§7`
- **Rationale:** Confirmed part of the journey, and the fallback for FR-007.
- **Acceptance Criteria:**
  - Given no template is selected, then the user can still proceed and receive tool recommendations and guidance from their category.
  - Given this route is taken, then the user is aware the result will be more general than a template-based one.
- **Dependencies:** FR-007

### FR-010 — Allow users to retain templates for reuse
- **Type:** Functional
- **Description:** The system must allow an identified user to mark templates so they can return to them.
- **User/Stakeholder:** Returning users
- **Priority:** P2
- **Source:** `P-§16`, `UR-§4.6`
- **Rationale:** `UR-§4.6` identifies difficulty returning to something useful as a pain point.
- **Priority reasoning:** P2 — it serves repeat use, and whether use repeats at all is **UNKNOWN** (`V-3`). If validation shows the need recurs, this rises to P1.
- **Acceptance Criteria:**
  - Given a user marks a template, then it appears in their retained set.
  - Given a template is marked more than once by the same user, then it appears once.
  - Given a retained template is later made unavailable, then the user is informed rather than finding it silently absent.
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** That users return at all.

---

## C. Prompt Provision

### FR-011 — Provide a prompt for the selected template
- **Type:** Functional
- **Description:** For a selected template, the system must provide the prompt associated with it, in a form the user can read and use.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `P-§1`, `P-§16`, `UR-§7`
- **Rationale:** This is the product. Everything else exists to deliver it.
- **Acceptance Criteria:**
  - Given a user with access has selected a template, then the prompt associated with that template's current published version is provided.
  - Given a template has no published prompt, then it is not offered to users.
  - Given the prompt has been revised by an administrator, then subsequent users receive the revised version.
- **Dependencies:** FR-029, FR-043

### FR-012 — Allow the prompt to be taken to the external tool
- **Type:** Functional
- **Description:** The system must allow a user with access to take the prompt text out of AWA in order to use it elsewhere.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `P-§1` (step 10 of the journey), `P-§16`
- **Rationale:** The journey requires the prompt to leave AWA. This is the point at which the paid transaction is fulfilled.
- **Acceptance Criteria:**
  - Given a user with access, then the full current prompt text can be taken in one action.
  - Given the user has modified the prompt, then what they take is the modified text.
  - Given the action succeeds, then the user receives confirmation.

### FR-013 — Allow the user to modify the prompt directly
- **Type:** Functional
- **Description:** The system must allow a user with access to edit the prompt text themselves before using it.
- **User/Stakeholder:** Users who want control — particularly creators and developers (`UR-§11.5`)
- **Priority:** P1
- **Source:** `P-§16`, `UR-§11.3`
- **Rationale:** `UR-§3.3` identifies being in control as an experience goal. Direct editing is also the zero-cost alternative to customization.
- **Acceptance Criteria:**
  - Given a user with access, then the prompt text can be modified.
  - Given the user has modified it, then they can return to the version originally provided.
  - Given the user modifies the text, then no charge or credit consumption occurs.

### FR-014 — Preserve the original prompt
- **Type:** Functional
- **Description:** The system must retain the originally provided prompt so a user can return to it after modifying or customizing.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `UR-§11.3`
- **Rationale:** Without this, a customization that makes the prompt worse is unrecoverable, and the user has paid a credit to lose something.
- **Acceptance Criteria:**
  - Given any number of modifications or customizations, then the originally provided prompt remains available.
  - Given the user returns to the original, then no charge occurs.

---

## D. Customization

### FR-015 — Accept a change request in the user's own words
- **Type:** Functional
- **Description:** The system must allow a user with access to describe, in plain language, how they want the prompt changed, and must produce a revised prompt reflecting that description.
- **User/Stakeholder:** All user groups; principally those whose need is close to but not matched by a template
- **Priority:** P0
- **Source:** `P-§16` (confirmed capability), `UR-§9 UC-6`
- **Rationale:** `UR-§4.3` separates *not knowing what to write* from *not being able to express what you know*. Templates address the first; this addresses the second.
- **Acceptance Criteria:**
  - Given a user describes a change, then a revised prompt is provided.
  - Given a revision has been produced, then the user can request a further change building on it.
  - Given a revision has been produced, then the preceding version remains available.
  - Given the user's description cannot be acted on, then FR-019 applies.
- **Dependencies:** FR-033, FR-034, FR-054
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** `UR-§9 UC-6` identifies this as possibly the shakiest assumption in the product: a user who can clearly express the change might have been able to write the prompt (`V-6`).

### FR-016 — Accept a spoken change request
- **Type:** Functional
- **Description:** The system must allow a user to describe a change by speaking instead of typing.
- **User/Stakeholder:** Mobile users; users who find typing difficult (`UR-§12`)
- **Priority:** P1
- **Source:** `P-§16`, `UR-§10 Scenario C`, `UR-§12`
- **Rationale:** `UR-§12` identifies voice as potentially serving an accessibility need beyond the mobile convenience it was introduced for.
- **Priority reasoning:** P1 rather than P0 — it is a second route to a capability already delivered by FR-015, and it introduces a second external dependency and a second failure mode.
- **Acceptance Criteria:**
  - Given a user speaks a change request, then it is interpreted and FR-015 proceeds.
  - Given speech cannot be interpreted, then the user is told and offered the typed route, and no charge occurs.
  - Given a spoken request is used, then it consumes no more than a typed request would.
- **Dependencies:** FR-015, NFR-004
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** That users will speak requests, and that interpretation is accurate for the accents of the intended user base (`V-21`, `UR-§12`).

### FR-017 — Handle a request that cannot be acted on
- **Type:** Functional
- **Description:** When a change request is too unclear, too contradictory or too sparse to act on, the system must say so, leave the existing prompt unchanged, and not consume the user's allowance.
- **User/Stakeholder:** All users of customization
- **Priority:** P0
- **Source:** `UR-§11.1` (ambiguous and conflicting input identified, and flagged as unfair to charge for)
- **Rationale:** Charging for a guess at an unclear request converts a moment of user confusion into a grievance about money.
- **Acceptance Criteria:**
  - Given an unusable request, then the existing prompt is unchanged.
  - Given an unusable request, then no allowance is consumed.
  - Given an unusable request, then the user is told what would help.

### FR-018 — Handle customization failure without cost to the user
- **Type:** Functional
- **Description:** When a customization cannot be completed for any reason, the system must preserve the user's existing prompt, consume no allowance, and state that no charge occurred.
- **User/Stakeholder:** All users of customization
- **Priority:** P0
- **Source:** `P-§15` (external dependency is a confirmed constraint), `UR-§11.6`
- **Rationale:** Customization depends on an external service. Failure is not an edge case; it is a predictable operating condition. The user must never bear its cost.
- **Acceptance Criteria:**
  - Given a failure, then the prompt shown before the attempt remains.
  - Given a failure, then no allowance is consumed.
  - Given a failure, then the user is told that no charge occurred and can retry.
- **Dependencies:** NFR-001, NFR-006

---

## E. AI Tool Recommendation

### FR-019 — Recommend external AI tools with reasoning
- **Type:** Functional
- **Description:** The system must present a small set of external AI tools appropriate to the user's selected template or category, each with a stated reason for its inclusion.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `P-§1`, `P-§16`, `UR-§7`
- **Rationale:** Tool selection is one of the four difficulties the product exists to address (`P-§2.2`). `UR-§13` notes the reasoning is what allows a user to make the choice rather than defer to it blindly.
- **Acceptance Criteria:**
  - Given a template or category with associated tools, then those tools are presented with their reasons.
  - Given a tool has been made unavailable, then it is not presented.
  - Given a template has no directly associated tools, then tools associated with a parent category are presented.
  - Given the number of tools presented, then it remains small enough to constitute a choice rather than a list.
- **Dependencies:** FR-045, FR-046
- **Open Questions:** The precise number is a product decision, not derivable from the sources. The sources establish "a small number with reasoning", not a specific count.

### FR-020 — Enable the user to reach the recommended tool
- **Type:** Functional
- **Description:** The system must provide a means for the user to reach each recommended external tool.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `P-§1` (journey step 11), `P-§16`
- **Rationale:** The journey requires the user to leave for the external tool.
- **Acceptance Criteria:**
  - Given a recommended tool with a known destination, then the user can reach it.
  - Given a tool whose destination is unknown or unavailable, then the recommendation remains readable and no broken route is presented.
  - Given the user leaves, then their work within AWA is not lost.

### FR-021 — Handle the absence of any recommendation
- **Type:** Functional
- **Description:** When no tool can be recommended, the system must still provide the prompt and must record the absence for correction.
- **User/Stakeholder:** All user groups; content administrator
- **Priority:** P0
- **Source:** `P-§16`, `UR-§11.4`
- **Rationale:** A missing recommendation is a content gap, not a reason to withhold the thing the user paid for.
- **Acceptance Criteria:**
  - Given no recommendation exists, then the prompt is still provided in full.
  - Given no recommendation exists, then the user is told plainly rather than shown an empty area.
  - Given this occurs, then it is recorded as a catalog gap.
- **Dependencies:** FR-049

### FR-022 — Reflect changes in external tool availability
- **Type:** Functional
- **Description:** The system must allow recommendations to be withdrawn or amended when an external tool changes or ceases to be available, and must provide a means of detecting that this has occurred.
- **User/Stakeholder:** Content administrator; all user groups
- **Priority:** P1
- **Source:** `P-§15` (tool capabilities change over time — confirmed constraint), `UR-§11.4`
- **Rationale:** `UR-§11.4` identifies external tool change as the product's largest structural risk: it happens outside AWA, is invisible to AWA, and is attributed to AWA by the user.
- **Acceptance Criteria:**
  - Given a tool is withdrawn by an administrator, then it ceases to appear in recommendations and filters.
  - Given a tool's destination becomes unreachable, then this is detectable without waiting for a user to report it.
  - Given a tool is withdrawn, then templates that relied solely on it are identified as gaps.
- **Dependencies:** FR-045, FR-049
- **Open Questions:** How frequently detection should run is **UNKNOWN**.

---

## F. Usage Guidance

### FR-023 — Provide guidance for using the prompt with the recommended tool
- **Type:** Functional
- **Description:** The system must provide short, task-specific guidance on using the prompt with the recommended external tool.
- **User/Stakeholder:** Beginners and business users principally (`UR-§2.1`, `UR-§2.3`)
- **Priority:** P1
- **Source:** `P-§1`, `P-§16`, `UR-§7`
- **Rationale:** Not knowing how to operate the chosen tool is one of the four difficulties (`P-§2.2`).
- **Priority reasoning:** P1 rather than P0 — `UR-§4.4` records it is **UNKNOWN** how much of this the external tools now solve themselves, and `UR-§13` notes some users skip guidance entirely.
- **Acceptance Criteria:**
  - Given a template or category with guidance, then it is presented alongside the prompt.
  - Given guidance is defined at a parent level only, then it is presented for templates beneath it.
  - Given no guidance exists at any level, then no empty guidance area is shown.
  - Given guidance is presented, then it is brief enough to act on rather than read as an article.
- **Dependencies:** FR-047
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** That users want guidance and will use it (`V-16`).

### FR-024 — Support more than one form of guidance
- **Type:** Functional
- **Description:** The system must support guidance presented as written steps, as recorded demonstration, or both, as determined by the content administrator per category or template.
- **User/Stakeholder:** Content administrator; users with differing preferences (`UR-§11.5`)
- **Priority:** P2
- **Source:** `P-§16`
- **Rationale:** Confirmed capability. P2 because written guidance alone satisfies FR-023, and recorded demonstration carries a production cost per template that has not been assessed.
- **Acceptance Criteria:**
  - Given an administrator selects a form of guidance, then users receive it in that form.
  - Given both forms exist, then both are available to the user.

---

## G. Access and Subscription

### FR-025 — Provide free access to everything except the prompt
- **Type:** Functional
- **Description:** The system must allow visitors without a subscription to browse, search, filter, view template information, view tool recommendations and view guidance.
- **User/Stakeholder:** Non-subscribed visitor
- **Priority:** P0
- **Source:** `P-§11.1` (confirmed product decision), `UR-§2.5`
- **Rationale:** Confirmed decision. `UR-§2.5` records that this visitor carries the entire conversion burden — they must be able to assess the product before paying.
- **Acceptance Criteria:**
  - Given no account or subscription, then all capabilities other than prompt text are available.
  - Given no subscription, then it is evident what a subscription would add.

### FR-026 — Restrict prompt text to subscribers
- **Type:** Functional
- **Description:** The system must make prompt text available only to users with an active subscription, and must not disclose prompt text to anyone else by any route.
- **User/Stakeholder:** The business
- **Priority:** P0
- **Source:** `P-§11.1`, `P-§11.2` (confirmed product decision)
- **Rationale:** The prompt is the paid product. If it can be obtained without paying, there is no business.
- **Acceptance Criteria:**
  - Given no active subscription, then prompt text is not obtainable through any interface, export, or search-engine-visible page.
  - Given an active subscription, then prompt text is provided.
  - Given a subscription ceases to be active, then prompt text ceases to be provided, subject to FR-028.
- **Dependencies:** NFR-002
- **Note:** `P-§11.2` records that prompt text is trivially copyable once disclosed. This requirement governs disclosure, not what happens afterwards.

### FR-027 — State what a subscription provides before purchase
- **Type:** Functional
- **Description:** Before a user commits to a subscription, the system must state what it includes, what it excludes, and for how long it applies.
- **User/Stakeholder:** Prospective subscriber
- **Priority:** P0
- **Source:** `UR-§3.3` (fairness as an experience goal), `UR-§14.2`
- **Rationale:** `UR-§10 Scenario D` identifies the risk that a user who has already subscribed and is then asked to buy credits perceives being charged twice for one product. Clear statement before purchase is the only mitigation available at this stage.
- **Acceptance Criteria:**
  - Given a purchase decision, then what is included and excluded is stated before it.
  - Given customization is limited separately from the subscription, then that distinction is stated before purchase, not on encountering the limit.
- **Dependencies:** FR-033
- **Open Questions:** Whether users understand the distinction (`V-8`). See **Conflict C-6**.

### FR-028 — Define and apply behaviour when a subscription ends
- **Type:** Functional
- **Description:** The system must apply a defined and stated behaviour when a time-limited subscription ends, including what happens to prompts the user obtained while subscribed.
- **User/Stakeholder:** Lapsed subscriber
- **Priority:** P0
- **Source:** `UR-§1.2`, `UR-§11.6` (recorded as an unresolved decision with real consequences)
- **Rationale:** `UR-§14.2` records an assumed user expectation that prompts already obtained remain theirs. If the product does otherwise without saying so, the resulting dispute is foreseeable.
- **Acceptance Criteria:**
  - Given a subscription ends, then the behaviour applied matches what was stated at purchase.
  - Given a subscription ends, then the user is informed before rather than at the moment of loss.
- **Open Questions:** **The behaviour itself is UNDECIDED** (`UR-§11.6`, `V-20`). This requirement obliges a decision and its consistent application; it does not make the decision.

### FR-029 — Limit an account to one active session
- **Type:** Functional
- **Description:** The system must permit only one active session per account, ending any previous session when a new one begins, and must tell the affected user why.
- **User/Stakeholder:** The business
- **Priority:** P1
- **Source:** `P-§11.1` (confirmed product decision), `UR-§10 Scenario F`
- **Rationale:** Prevents a subscription being used by several people simultaneously.
- **Priority reasoning:** P1 rather than P0 — it protects revenue rather than delivering value, and `UR-§10 Scenario F` records that it treats a legitimate user with two devices as a suspected sharer.
- **Acceptance Criteria:**
  - Given a new session begins, then any previous session ends.
  - Given a session is ended this way, then the user is told the reason rather than silently returned to sign-in.
  - Given a session ends while the user is part-way through, then their work is not lost.
- **Open Questions:** Whether one device is the right limit (`V-15`). See **Conflict C-7**.

---

## H. Customization Allowance

### FR-030 — Provide an initial customization allowance
- **Type:** Functional
- **Description:** The system must provide subscribers with an initial allowance of customizations at no additional cost.
- **User/Stakeholder:** New subscriber
- **Priority:** P0
- **Source:** `P-§11.1` (confirmed product decision)
- **Rationale:** Allows a subscriber to experience customization before being asked to pay again.
- **Acceptance Criteria:**
  - Given a new subscriber, then an allowance is available without further purchase.
  - Given the allowance, then its size is visible to the user before they use it.
- **Open Questions:** The size of the allowance is a product decision not fixed by the sources.

### FR-031 — Consume allowance only on a successful customization
- **Type:** Functional
- **Description:** The system must consume a unit of allowance only when a customization is successfully produced.
- **User/Stakeholder:** All users of customization
- **Priority:** P0
- **Source:** `UR-§11.1`, `UR-§11.6`
- **Rationale:** Consuming allowance for a failure or an unusable request converts a technical problem into a billing grievance.
- **Acceptance Criteria:**
  - Given a successful customization, then exactly one unit is consumed.
  - Given a failed or unusable customization, then no unit is consumed.
  - Given two requests are made at the same moment, then no more units are consumed than customizations produced.
- **Dependencies:** FR-017, FR-018, NFR-006

### FR-032 — Make cost and balance visible before use
- **Type:** Functional
- **Description:** The system must show a user their remaining allowance and what an action will consume, before they take it.
- **User/Stakeholder:** All users of customization
- **Priority:** P0
- **Source:** `UR-§3.3` (fairness), `UR-§13`
- **Rationale:** `UR-§13` records that deciding whether to customize requires knowing what it costs and what remains.
- **Acceptance Criteria:**
  - Given a user can customize, then their remaining allowance is visible.
  - Given a user initiates a customization, then its cost is stated before it proceeds.
  - Given the allowance is exhausted, then this is evident before the attempt rather than after.

### FR-033 — Allow additional allowance to be obtained
- **Type:** Functional
- **Description:** The system must allow a subscriber to obtain further customization allowance once the initial allowance is exhausted.
- **User/Stakeholder:** Subscriber who customizes frequently
- **Priority:** P1
- **Source:** `P-§11.1` (confirmed product decision)
- **Rationale:** Confirmed decision. P1 rather than P0 because the product functions without it — customization simply stops at the allowance.
- **Acceptance Criteria:**
  - Given an exhausted allowance, then a route to obtain more is offered.
  - Given further allowance is obtained, then it is available immediately.
- **Open Questions:** Whether allowance may be obtained by non-subscribers is **UNDECIDED**. `UR-§2.5` implies it would be unusable to them.

### FR-034 — Never allow allowance to block prompt access
- **Type:** Functional
- **Description:** Exhaustion of customization allowance must not prevent a subscriber from viewing, modifying or using prompts.
- **User/Stakeholder:** Subscriber
- **Priority:** P0
- **Source:** `P-§11.1` (the subscription buys prompt access; the allowance governs customization), `UR-§11.6`
- **Rationale:** These are two separate entitlements. Conflating them would withhold what the subscription paid for.
- **Acceptance Criteria:**
  - Given no remaining allowance, then prompts remain fully available.
  - Given no remaining allowance, then only the customization capability is affected.

---

## I. Feedback

### FR-035 — Allow users to report whether a prompt worked
- **Type:** Functional
- **Description:** The system must allow a user to report the outcome of using a prompt.
- **User/Stakeholder:** Content administrator; indirectly all users
- **Priority:** P1
- **Source:** `P-§1` (journey step 12), `P-§16`
- **Rationale:** `P-§15` establishes that AWA cannot observe the output. Self-reported feedback is the only quality signal available.
- **Priority reasoning:** P1 — the user journey completes without it. It is essential to the *content* loop, not to the user's outcome.
- **Acceptance Criteria:**
  - Given a user has received a prompt, then they can report the outcome.
  - Given feedback is submitted, then the journey is not interrupted.
  - Given feedback is submitted, then it is associated with the specific prompt version used.
- **Dependencies:** FR-044
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** `UR-§7.2` records that feedback benefits AWA, not the user, and that the proportion who return to give it is **UNKNOWN** (`V-18`). See **Conflict C-8**.

### FR-036 — Capture customization requests as a content signal
- **Type:** Functional
- **Description:** The system must make the substance of users' customization requests available to content administrators in aggregate.
- **User/Stakeholder:** Content administrator
- **Priority:** P1
- **Source:** `UR-§9 UC-6`, `P-§20` (identified as the most useful content signal available)
- **Rationale:** A change requested repeatedly against the same template indicates a template that should exist and does not. This is the only signal in the product that reveals catalog gaps from actual demand rather than from absence.
- **Acceptance Criteria:**
  - Given customization requests, then recurring patterns against a template are identifiable.
  - Given this capability, then it operates without exposing individual users' content in a manner inconsistent with NFR-003.
- **Dependencies:** NFR-003, FR-049

---

## J. Content Management

### FR-037 — Manage categories and subcategories at any depth
- **Type:** Functional
- **Description:** Content administrators must be able to create, amend, reorder, hide and remove categories and subcategories at any level, using a consistent process regardless of depth.
- **User/Stakeholder:** Content administrator
- **Priority:** P0
- **Source:** `P-§16` (confirmed admin capability), `UR-§1.3`
- **Rationale:** The catalog must grow without engineering involvement.
- **Acceptance Criteria:**
  - Given any level, then a subcategory can be created beneath it by the same means as at any other level.
  - Given a category containing other content, then the administrator is shown what it contains before removal and offered an alternative to removal.
  - Given a category is hidden, then its entire contents become unavailable to users.
  - Given a category is relocated, then its contents move with it and no circular arrangement can result.
- **Dependencies:** FR-048

### FR-038 — Manage templates
- **Type:** Functional
- **Description:** Content administrators must be able to create, amend, duplicate, hide and remove templates under any category, and to control whether each is available to users.
- **User/Stakeholder:** Content administrator
- **Priority:** P0
- **Source:** `P-§16`, `UR-§2.6`
- **Rationale:** Templates are the catalog.
- **Acceptance Criteria:**
  - Given a template without a published prompt, then it cannot be made available to users.
  - Given a template is hidden, then it is unavailable to users but retained for the administrator.
  - Given a template is removed, then records that reference it remain readable.
- **Dependencies:** FR-043

### FR-039 — Author and revise prompts, with preview before publication
- **Type:** Functional
- **Description:** Content administrators must be able to write and revise the prompt for a template, and must be able to see exactly what a user would receive before making it available.
- **User/Stakeholder:** Content administrator
- **Priority:** P0
- **Source:** `P-§16`, `P-§15` (prompt quality depends on curated content — confirmed constraint), `UR-§2.6`
- **Rationale:** `UR-§2.6` identifies the content administrator's output as the product itself. `UR-§8` notes that AWA moves quality risk from the user to the content team. Preview is the only quality control available before a prompt reaches a paying user.
- **Acceptance Criteria:**
  - Given a prompt is being written, then the administrator can see the result as a user would receive it, before publishing.
  - Given a prompt is published, then subsequent users receive it without a software release.
  - Given a prompt is incomplete, then it cannot be published.

### FR-040 — Retain prompt history and allow reversion
- **Type:** Functional
- **Description:** The system must retain previous versions of a prompt, associate each delivered prompt with the version that produced it, and allow an administrator to revert to a previous version.
- **User/Stakeholder:** Content administrator; the business
- **Priority:** P0
- **Source:** `P-§16` (confirmed capability), `P-§20`
- **Rationale:** `P-§15` establishes that prompt guidance decays as models change, so prompts will be revised repeatedly. Without version association, whether a revision helped or harmed is unanswerable — and `P-§20` identifies this as a success measure.
- **Acceptance Criteria:**
  - Given a prompt is revised, then the previous version is retained.
  - Given a delivered prompt, then the version that produced it is identifiable.
  - Given a reversion, then no previous version is destroyed.
  - Given feedback, then it can be attributed to a specific version.
- **Dependencies:** FR-035

### FR-041 — Manage external AI tools and models
- **Type:** Functional
- **Description:** Content administrators must be able to maintain the set of external AI tools and their models, including the reason shown to users, and to withdraw any of them.
- **User/Stakeholder:** Content administrator
- **Priority:** P0
- **Source:** `P-§16`, `P-§15` (tools change over time)
- **Rationale:** Required by FR-019 and FR-005; both depend on this information being current.
- **Acceptance Criteria:**
  - Given a new tool or model, then it can be added and made available for association.
  - Given a tool is withdrawn, then it ceases to appear to users in recommendations and filters.
  - Given a tool is withdrawn, then existing records referencing it remain readable.

### FR-042 — Associate tools and models with categories and templates, with inheritance
- **Type:** Functional
- **Description:** Content administrators must be able to associate tools and models at category, subcategory or template level, and associations made at a higher level must apply to everything beneath unless overridden.
- **User/Stakeholder:** Content administrator
- **Priority:** P0
- **Source:** `P-§16`, `UR-§10 Scenario B`
- **Rationale:** Without inheritance, the same association must be repeated across every template, which does not scale and guarantees drift. `UR-§10 Scenario B` records that the model filter's usefulness depends entirely on associations being accurate and current.
- **Acceptance Criteria:**
  - Given an association at a category, then templates beneath it inherit it.
  - Given an association at a template, then it takes precedence over an inherited one.
  - Given an association is made once, then it serves both recommendation and filtering.
- **Dependencies:** FR-005, FR-019, FR-041

### FR-043 — Manage usage guidance
- **Type:** Functional
- **Description:** Content administrators must be able to create and amend guidance at category, subcategory or template level, with the same inheritance behaviour as tool associations.
- **User/Stakeholder:** Content administrator
- **Priority:** P1
- **Source:** `P-§16`
- **Rationale:** Supports FR-023. P1 for the same reason as FR-023.
- **Acceptance Criteria:**
  - Given guidance at a category, then templates beneath it present it unless they define their own.
  - Given guidance is amended, then users receive the amendment without a software release.

### FR-044 — Publish content changes without a software release
- **Type:** Functional
- **Description:** All content changes made by administrators — categories, templates, prompts, tool associations, guidance and translations — must reach users without requiring a software release.
- **User/Stakeholder:** Content administrator; the business
- **Priority:** P0
- **Source:** `P-§16` (confirmed product decision), `P-§15`
- **Rationale:** `P-§15` establishes that content must be maintained continuously as tools change. If each correction required engineering, the maintenance burden would exceed the team's capacity and the catalog would decay.
- **Acceptance Criteria:**
  - Given any content change, then users receive it without a release.
  - Given a change is published, then the delay before users receive it is short enough that an administrator can verify their own change.

### FR-045 — Surface catalog gaps to administrators
- **Type:** Functional
- **Description:** The system must identify to administrators where content is missing or inconsistent — including templates without recommendations, templates without prompts, categories without guidance, withdrawn tools still associated, and searches or journeys that found nothing.
- **User/Stakeholder:** Content administrator
- **Priority:** P1
- **Source:** `P-§16`, `P-§20`, `UR-§2.6`
- **Rationale:** `UR-§2.6` identifies authoring capacity as the practical ceiling on the product. Gap detection directs limited capacity to where it matters rather than requiring the administrator to audit manually.
- **Acceptance Criteria:**
  - Given a gap of any identified kind, then it is visible to the administrator without manual inspection.
  - Given a gap is corrected, then it ceases to be reported.
- **Dependencies:** FR-007, FR-021, FR-022, FR-036

### FR-046 — Support multiple interface and content languages
- **Type:** Functional
- **Description:** The system must support presentation in more than one language, with administrators able to add languages and translations, and must present a defined fallback where a translation is absent.
- **User/Stakeholder:** Non-English-speaking users; content administrator
- **Priority:** P2
- **Source:** `P-§16` (confirmed capability), `UR-§12`
- **Rationale:** Confirmed capability.
- **Priority reasoning:** P2. `UR-§12` records that it is **UNKNOWN** whether prompts themselves work well in languages other than English on the external tools — translating the interface does not make the prompt effective. Until that is known, the value of this capability is unproven. `UR-§16 V-22` addresses it.
- **Acceptance Criteria:**
  - Given a language is added and enabled, then users can select it without a software release.
  - Given a translation is absent, then defined fallback content is shown and no untranslated placeholder is visible to a user.
- **Assumptions:** **ASSUMPTION — REQUIRES VALIDATION.** That demand exists for languages beyond the default (`V-22`).

---

## K. Platform Administration

### FR-047 — Manage user access
- **Type:** Functional
- **Description:** Platform administrators must be able to view accounts, and to suspend, restore or amend access where required.
- **User/Stakeholder:** Platform administrator
- **Priority:** P1
- **Source:** `P-§16`, `UR-§1.3`
- **Rationale:** Required for support and for responding to misuse.
- **Acceptance Criteria:**
  - Given an account, then an administrator can view its access state.
  - Given an administrator changes access, then the change is recorded with who made it.
  - Given administrative access, then it cannot be removed such that no administrator remains.

### FR-048 — Adjust a user's access or allowance for support purposes
- **Type:** Functional
- **Description:** Platform administrators must be able to extend a user's access or grant additional customization allowance.
- **User/Stakeholder:** Platform administrator; affected users
- **Priority:** P1
- **Source:** `P-§16`, `UR-§10 Scenario D`, `UR-§10 Scenario E`
- **Rationale:** `UR-§10` describes foreseeable situations — a failed customization, a poor result, a session ended unexpectedly — where the only reasonable remedy is a manual adjustment. Without this, every such case becomes a refund or a lost customer.
- **Acceptance Criteria:**
  - Given a support case, then an administrator can extend access or grant allowance.
  - Given such an adjustment, then it is recorded with who made it and why.

### FR-049 — Configure payment arrangements
- **Type:** Functional
- **Description:** Platform administrators must be able to configure the means by which payments are taken, and to add further means over time, without a software release.
- **User/Stakeholder:** Platform administrator; the business
- **Priority:** P1
- **Source:** `P-§11.1`, `P-§16` (confirmed product decision)
- **Rationale:** Confirmed decision. Specific providers, prices, plans and billing arrangements are recorded in the source documents but are **business parameters, not requirements** — they are properly configured, not specified here.
- **Acceptance Criteria:**
  - Given a payment arrangement, then it can be configured and verified before being used for real payments.
  - Given credentials are stored, then they are not retrievable through any interface after being set.
  - Given a payment arrangement is added, then no software release is required to use it.
- **Dependencies:** NFR-005

### FR-050 — Constrain expenditure on the external customization service
- **Type:** Functional
- **Description:** The system must allow a limit to be placed on expenditure with the external service used for customization, must apply that limit, and must notify administrators when it is approached or reached.
- **User/Stakeholder:** The business
- **Priority:** P0
- **Source:** `P-§15` (per-use cost is a confirmed constraint), `P-§18` (cost per customization is UNKNOWN), `UR-§11.6`
- **Rationale:** `P-§18` records that the cost of a customization is unknown. An unbounded cost against a fixed subscription price is an unbounded loss. This requirement exists because the economics are unvalidated, not merely as prudence.
- **Acceptance Criteria:**
  - Given a limit is set, then expenditure does not exceed it.
  - Given the limit is approached, then administrators are notified before it is reached.
  - Given the limit is reached, then the effect on users is defined, stated, and does not withhold prompt access.
  - Given the limit is reached, then affected users are told why in terms that do not imply a fault on their part.
- **Dependencies:** FR-034
- **Open Questions:** **See Conflict C-5.** Applying this limit may block subscribers who hold unused allowance — a paying customer prevented from using what they bought, for reasons invisible to them.

### FR-051 — Report usage, outcomes and cost
- **Type:** Functional
- **Description:** The system must report to administrators on catalog usage, feedback outcomes, and expenditure on the external customization service.
- **User/Stakeholder:** Content administrator; platform administrator; the business
- **Priority:** P1
- **Source:** `P-§16`, `P-§20`, `UR-§2.6`
- **Rationale:** `P-§20` sets out the measures by which the product's success is to be judged. None can be assessed without reporting. Cost reporting is separately necessary to make FR-050's limit meaningful rather than nominal.
- **Acceptance Criteria:**
  - Given a period, then usage by category and template is reportable.
  - Given feedback, then outcomes are reportable by template and by prompt version.
  - Given customization activity, then its cost is reportable against the configured limit.
- **Dependencies:** FR-035, FR-040, FR-050
- **Open Questions:** `P-§20` records that the central claim — fewer attempts to a usable result — cannot be measured without a baseline that does not exist. Reporting cannot create that baseline; it must be gathered separately.

---

# Part 2 — Non-Functional Requirements

### NFR-001 — Core journey independent of the customization service
- **Type:** Non-Functional
- **Category:** Reliability
- **Description:** Browsing, template selection, prompt access, tool recommendations and guidance must remain fully available when the external customization service is unavailable, degraded, or has reached its expenditure limit.
- **User/Stakeholder:** All user groups; the business
- **Priority:** P0
- **Source:** `P-§15` (external dependency confirmed), `UR-§11.4`, `FR-018`, `FR-050`
- **Rationale:** The paid entitlement is prompt access, which requires no external service. Allowing an optional capability's dependency to affect the paid capability would mean an outside company's outage withholds what customers have paid for.
- **Acceptance Criteria:**
  - Given the customization service is unavailable, then all other capabilities function normally.
  - Given the expenditure limit is reached, then all other capabilities function normally.
  - Given either condition, then the user is told what is unavailable and what remains.
- **Target:** Full availability of non-customization capabilities under both conditions.

### NFR-002 — Prompt text disclosed only to entitled users
- **Type:** Non-Functional
- **Category:** Security
- **Description:** Prompt text must not be obtainable by a user without an active subscription through any route, including interfaces intended for other purposes, content made visible to search engines, or means of inspecting what is transmitted.
- **User/Stakeholder:** The business
- **Priority:** P0
- **Source:** `P-§11.1`, `P-§11.2`, `FR-026`
- **Rationale:** `P-§11.2` records that prompt text is trivially copyable once obtained. A restriction that merely conceals the text while still transmitting it provides no protection.
- **Acceptance Criteria:**
  - Given no entitlement, then prompt text is not present in anything transmitted to the user.
  - Given no entitlement, then prompt text is not present in anything made available to search engines.
  - Given a new means of delivering prompt text is introduced, then it is subject to the same restriction.
- **Target:** No route discloses prompt text without entitlement.

### NFR-003 — Protection of user-provided content
- **Type:** Non-Functional
- **Category:** Privacy
- **Description:** Content provided by users — typed requirement descriptions, spoken requests, and their derived text — must be handled and retained in a manner appropriate to its sensitivity, and its retention must be stated to users.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `P-§15`, `UR-§12`, `FR-036`
- **Rationale:** Users describe intentions that may be commercially sensitive. FR-036 additionally proposes analysing this content in aggregate, which requires a defined basis.
- **Acceptance Criteria:**
  - Given user-provided content, then its retention period is defined and stated.
  - Given aggregate analysis under FR-036, then it does not expose individual users' content beyond the stated basis.
- **Target:** `TBD` — retention period is an undecided product and legal question.
- **Open Questions:** Retention period; whether content is transmitted to the external customization service and on what terms; what that service retains. All **UNKNOWN**.

### NFR-004 — Disposal of voice recordings
- **Type:** Non-Functional
- **Category:** Privacy
- **Description:** Audio recordings captured for spoken change requests must not be retained beyond the point at which they have been converted to text.
- **User/Stakeholder:** Users of voice input
- **Priority:** P1
- **Source:** `UR-§12`, `FR-016`
- **Rationale:** Recordings of a person's voice carry materially greater privacy weight than the text derived from them, and serve no purpose once converted.
- **Acceptance Criteria:**
  - Given a recording has been converted, then the audio is not retained.
  - Given conversion fails, then the audio is not retained either.
- **Target:** No retention beyond conversion.

### NFR-005 — Protection of payment configuration
- **Type:** Non-Functional
- **Category:** Security
- **Description:** Credentials for payment arrangements must not be retrievable after being set, and must not appear in any record accessible to operators.
- **User/Stakeholder:** The business
- **Priority:** P0
- **Source:** `P-§16`, `FR-049`
- **Acceptance Criteria:**
  - Given credentials are set, then they cannot be read back through any interface.
  - Given operational records, then credentials do not appear in them.
- **Target:** No retrievability after being set.

### NFR-006 — Integrity of allowance accounting
- **Type:** Non-Functional
- **Category:** Data integrity
- **Description:** The record of a user's customization allowance must be internally consistent, must account for every change, and must be sufficient to resolve a dispute about what was consumed.
- **User/Stakeholder:** All users of customization; support; the business
- **Priority:** P0
- **Source:** `FR-031`, `UR-§10 Scenario D`
- **Rationale:** Allowance is purchased with money. A user who believes they were charged for a customization they did not receive must be answerable precisely, not approximately.
- **Acceptance Criteria:**
  - Given any change to a user's allowance, then its cause is recorded.
  - Given a dispute, then the history of a user's allowance can be reconstructed.
  - Given concurrent activity, then the accounting remains consistent.
- **Target:** Every change accounted for; no unexplained discrepancy.

### NFR-007 — Usability for users with low AI familiarity
- **Type:** Non-Functional
- **Category:** Usability
- **Description:** A user with little prior exposure to AI tools must be able to complete the journey from category selection to obtaining a prompt without external assistance.
- **User/Stakeholder:** AI beginner (`UR-§2.1`)
- **Priority:** P0
- **Source:** `UR-§2.1`, `UR-§12`
- **Rationale:** `UR-§12` records a specific risk: the stated target includes users with low AI familiarity, yet the journey requires understanding categories, templates, models and prompts — four terms that are all jargon. Whether a genuine beginner can complete the journey unaided is **UNKNOWN** and directly testable.
- **Acceptance Criteria:**
  - Given a participant with little AI exposure, when observed attempting the journey unaided, then they reach a prompt without assistance.
  - Given terminology is used, then its meaning is available to a user who does not already know it.
- **Target:** `TBD` — the acceptable proportion of participants completing unaided is an undecided product standard.
- **Open Questions:** `V-10`. This requirement is verifiable only by observation, not by inspection.

### NFR-008 — Usability on mobile devices
- **Type:** Non-Functional
- **Category:** Usability
- **Description:** The complete user journey must be usable on a mobile device.
- **User/Stakeholder:** All user groups
- **Priority:** P1
- **Source:** `UR-§10 Scenario C`, `UR-§12`
- **Rationale:** `UR-§15` records that it is **UNKNOWN** whether users are on mobile or desktop when the need arises. Voice input was introduced on the premise that mobile typing is slow, which implies mobile use is expected.
- **Priority reasoning:** P1 rather than P0 only because the primary device is unconfirmed. If validation shows mobile predominance, this becomes P0.
- **Acceptance Criteria:**
  - Given a mobile device, then every step of the journey can be completed.
  - Given a mobile device, then obtaining and taking away the prompt does not require actions impractical on a small screen.
- **Target:** `TBD` — the range of devices to support is undecided.

### NFR-009 — Accessibility
- **Type:** Non-Functional
- **Category:** Accessibility
- **Description:** The product must be usable by people with accessibility needs.
- **User/Stakeholder:** Users with accessibility needs
- **Priority:** P1
- **Source:** `UR-§12`
- **Rationale:** `UR-§12` records that no accessibility research exists and classifies the needs of this group as **UNKNOWN**. This requirement records the obligation; the standard to be met is not derivable from the sources and must be set as a product decision.
- **Acceptance Criteria:**
  - Given a defined accessibility standard, then the product is assessed against it.
  - Given the assessment, then deficiencies are recorded and addressed or accepted explicitly.
- **Target:** `TBD` — no standard is specified in the sources. Selecting one is a required product decision.
- **Open Questions:** Which standard applies; whether any legal obligation exists in the intended markets. Both **UNKNOWN**.

### NFR-010 — Responsiveness of prompt delivery
- **Type:** Non-Functional
- **Category:** Performance
- **Description:** Browsing, template selection and prompt delivery must respond quickly enough that the user does not perceive delay as failure.
- **User/Stakeholder:** All user groups
- **Priority:** P1
- **Source:** `UR-§3.3` (speed as an experience goal)
- **Rationale:** These operations involve no external dependency and no per-use cost, so there is no inherent reason for them to be slow.
- **Acceptance Criteria:**
  - Given these operations, then the user receives a response without an indeterminate wait.
- **Target:** `TBD` — `P-§20` records that no performance target is established. Inventing one here would create a false standard.

### NFR-011 — Behaviour of customization under delay
- **Type:** Non-Functional
- **Category:** Performance
- **Description:** Because customization depends on an external service, the system must bound how long a user waits, and must inform them while they wait.
- **User/Stakeholder:** Users of customization
- **Priority:** P1
- **Source:** `P-§15`, `FR-018`
- **Rationale:** An unbounded wait is experienced as failure, and a user who abandons mid-request must not be charged for something they did not receive.
- **Acceptance Criteria:**
  - Given a customization is in progress, then the user is aware it is proceeding.
  - Given a bound is exceeded, then FR-018 applies.
- **Target:** `TBD` — the acceptable wait is undecided.

### NFR-012 — Preservation of user input through interruption
- **Type:** Non-Functional
- **Category:** Reliability
- **Description:** Work a user has entered must not be lost when an operation fails, when they are asked to subscribe, when their session is ended under FR-029, or when they leave to reach an external tool.
- **User/Stakeholder:** All user groups
- **Priority:** P0
- **Source:** `UR-§10 Scenario F`, `FR-018`, `FR-020`, `FR-029`
- **Rationale:** Every one of these interruptions is a normal occurrence in the designed journey, not an exception. Losing a user's work at any of them converts an expected event into an abandonment.
- **Acceptance Criteria:**
  - Given any of these interruptions, then the user's entered work remains when they continue.
- **Target:** No loss of entered work at any identified interruption point.

### NFR-013 — Content maintainability without engineering
- **Type:** Non-Functional
- **Category:** Maintainability
- **Description:** The ongoing effort required of content administrators to keep the catalog current must not depend on engineering involvement.
- **User/Stakeholder:** Content administrator; the business
- **Priority:** P0
- **Source:** `P-§15` (content must be maintained; tools change over time), `FR-044`, `UR-§2.6`
- **Rationale:** `UR-§2.6` identifies content authoring capacity as the practical ceiling on the product. Any engineering dependency in routine maintenance lowers that ceiling further.
- **Acceptance Criteria:**
  - Given routine content maintenance, then it requires no engineering involvement.
  - Given a new category, template, tool, model or language, then it can be introduced by an administrator alone.
- **Target:** No routine content task requires a software release.

### NFR-014 — Catalog growth
- **Type:** Non-Functional
- **Category:** Scalability
- **Description:** The product must continue to function usably as the number of categories, subcategories, templates and tools grows.
- **User/Stakeholder:** All user groups; content administrator
- **Priority:** P1
- **Source:** `P-§15`, `UR-§4.6`
- **Rationale:** The catalog is expected to grow continuously. Discovery difficulty grows with it, which is what FR-003, FR-004 and FR-005 address.
- **Acceptance Criteria:**
  - Given a substantially larger catalog, then users can still locate relevant content.
  - Given a substantially larger catalog, then administrators can still locate and maintain content.
- **Target:** `TBD` — expected catalog size is **UNKNOWN**.

### NFR-015 — Detectability of external tool change
- **Type:** Non-Functional
- **Category:** Compatibility
- **Description:** The product must be able to detect that a recommended external tool has become unreachable or has changed, without relying on a user to report it.
- **User/Stakeholder:** Content administrator; all user groups
- **Priority:** P1
- **Source:** `P-§15`, `UR-§11.4`, `FR-022`
- **Rationale:** `UR-§11.4` identifies external tool change as the product's largest structural risk, precisely because it is invisible to AWA and attributed to AWA by users.
- **Acceptance Criteria:**
  - Given a tool becomes unreachable, then this is detected and reported to administrators.
- **Target:** `TBD` — detection frequency is undecided.
- **Open Questions:** Only unreachability is mechanically detectable. A tool that still works but has changed its behaviour is **not** detectable this way, and will surface only through feedback — which `UR-§4.5` notes is noisy by construction.

### NFR-016 — Accountability of administrative action
- **Type:** Non-Functional
- **Category:** Data integrity
- **Description:** Administrative actions affecting content, access, allowance or payment configuration must be recorded with who performed them.
- **User/Stakeholder:** The business
- **Priority:** P1
- **Source:** `FR-047`, `FR-048`, `FR-049`
- **Rationale:** FR-048 permits administrators to grant access and allowance — things with monetary value. Such actions must be attributable.
- **Acceptance Criteria:**
  - Given any such action, then it is recorded with who performed it and when.
  - Given a record, then it is not alterable by the person who created it.
- **Target:** All identified action types recorded.

---

# Part 3 — Traceability

| ID | Requirement | Source | Problem / user need | Priority | Basis |
|---|---|---|---|---|---|
| FR-001 | Browse categories | `P-§1`, `P-§16` | Entry to the journey | P0 | Decision |
| FR-002 | Nested subcategories to any depth | `P-§16` | Organising creation types | P0 | Decision |
| FR-003 | Search | `P-§16`, `UR-§4.6` | Difficulty finding relevant content | P1 | Assumption |
| FR-004 | Filter by attributes | `P-§16`, `UR-§4.6` | Choosing between similar templates | P1 | Assumption |
| FR-005 | Filter by AI model | `P-§16`, `UR-§5.3` | Prompts are not portable between models | P1 | Decision + assumption |
| FR-006 | Communicate the boundary | `P-§1`, `UR-§14.3` | Misunderstanding what AWA does | P0 | Constraint |
| FR-007 | No suitable template | `UR-§11.2` | Small launch catalog | P0 | Constraint |
| FR-008 | Template information for selection | `UR-§13` | Choosing blind behind the paywall | P0 | Research-identified |
| FR-009 | General starting point | `P-§1` | Need not covered by catalog | P1 | Decision |
| FR-010 | Retain templates | `P-§16`, `UR-§4.6` | Returning to useful content | P2 | Assumption |
| FR-011 | Provide the prompt | `P-§1`, `P-§16` | The core need | P0 | Decision |
| FR-012 | Take the prompt away | `P-§1` | The journey requires it to leave | P0 | Decision |
| FR-013 | Modify the prompt | `P-§16`, `UR-§11.3` | Desire for control | P1 | Decision |
| FR-014 | Preserve the original | `UR-§11.3` | Recovery from a poor change | P0 | Research-identified |
| FR-015 | Change request in own words | `P-§16`, `UR-§9` | Cannot express a known intent | P0 | Decision + assumption |
| FR-016 | Spoken change request | `P-§16`, `UR-§12` | Typing is slow; accessibility | P1 | Decision + assumption |
| FR-017 | Unusable request | `UR-§11.1` | Charging for a guess is unfair | P0 | Research-identified |
| FR-018 | Failure at no cost | `P-§15`, `UR-§11.6` | External dependency will fail | P0 | Constraint |
| FR-019 | Recommend tools with reasoning | `P-§1`, `P-§16` | Tool selection difficulty | P0 | Decision |
| FR-020 | Reach the tool | `P-§1` | The journey continues elsewhere | P0 | Decision |
| FR-021 | No recommendation available | `UR-§11.4` | Content gap must not withhold the prompt | P0 | Decision |
| FR-022 | Reflect tool change | `P-§15`, `UR-§11.4` | Tools change without notice | P1 | Constraint |
| FR-023 | Usage guidance | `P-§1`, `P-§16` | Not knowing how to operate the tool | P1 | Decision + assumption |
| FR-024 | More than one form of guidance | `P-§16` | Differing user preferences | P2 | Decision |
| FR-025 | Free access except the prompt | `P-§11.1` | Conversion requires assessment | P0 | Decision |
| FR-026 | Restrict prompt to subscribers | `P-§11.1` | The business model | P0 | Decision |
| FR-027 | State what a subscription provides | `UR-§3.3`, `UR-§14.2` | Two charges perceived as one product | P0 | Research-identified |
| FR-028 | Behaviour at subscription end | `UR-§11.6` | Unresolved expectation | P0 | Research-identified |
| FR-029 | One active session | `P-§11.1` | Prevent shared subscriptions | P1 | Decision |
| FR-030 | Initial allowance | `P-§11.1` | Experience before paying again | P0 | Decision |
| FR-031 | Consume only on success | `UR-§11.1` | Fairness | P0 | Research-identified |
| FR-032 | Cost and balance visible | `UR-§13` | Informed decision to customize | P0 | Research-identified |
| FR-033 | Obtain further allowance | `P-§11.1` | Continued use | P1 | Decision |
| FR-034 | Allowance never blocks prompts | `P-§11.1` | Two separate entitlements | P0 | Decision |
| FR-035 | Report whether a prompt worked | `P-§1`, `P-§16` | Only available quality signal | P1 | Decision + assumption |
| FR-036 | Capture customization requests | `P-§20`, `UR-§9` | Reveals catalog gaps from demand | P1 | Research-identified |
| FR-037 | Manage categories at any depth | `P-§16` | Catalog must grow without engineering | P0 | Decision |
| FR-038 | Manage templates | `P-§16` | Catalog maintenance | P0 | Decision |
| FR-039 | Author and preview prompts | `P-§15`, `P-§16` | Quality risk sits with content | P0 | Constraint |
| FR-040 | Prompt history and reversion | `P-§16`, `P-§20` | Measuring whether a change helped | P0 | Decision |
| FR-041 | Manage tools and models | `P-§16` | Tools change over time | P0 | Decision |
| FR-042 | Associate with inheritance | `P-§16`, `UR-§10` | Scale of association | P0 | Decision |
| FR-043 | Manage guidance | `P-§16` | Guidance maintenance | P1 | Decision |
| FR-044 | Publish without a release | `P-§15`, `P-§16` | Maintenance burden | P0 | Decision |
| FR-045 | Surface catalog gaps | `P-§16`, `UR-§2.6` | Limited authoring capacity | P1 | Research-identified |
| FR-046 | Multiple languages | `P-§16`, `UR-§12` | Reach; unproven value | P2 | Decision + assumption |
| FR-047 | Manage user access | `P-§16` | Support and misuse | P1 | Decision |
| FR-048 | Support adjustments | `UR-§10` | Foreseeable remedies | P1 | Research-identified |
| FR-049 | Configure payment arrangements | `P-§11.1`, `P-§16` | Confirmed decision | P1 | Decision |
| FR-050 | Constrain external expenditure | `P-§15`, `P-§18` | Cost per use is unknown | P0 | Constraint |
| FR-051 | Report usage, outcomes, cost | `P-§16`, `P-§20` | Success measurement | P1 | Decision |
| NFR-001 | Core journey independent of AI service | `P-§15`, `UR-§11.4` | Outage must not withhold paid value | P0 | Constraint |
| NFR-002 | Prompt disclosed only to entitled users | `P-§11.1` | The business model | P0 | Decision |
| NFR-003 | Protect user content | `P-§15`, `UR-§12` | Sensitive intent; aggregate analysis | P0 | Constraint |
| NFR-004 | Dispose of recordings | `UR-§12` | Voice carries greater weight | P1 | Research-identified |
| NFR-005 | Protect payment configuration | `P-§16` | Financial security | P0 | Decision |
| NFR-006 | Allowance accounting integrity | `UR-§10` | Disputes about money | P0 | Research-identified |
| NFR-007 | Usable with low AI familiarity | `UR-§2.1`, `UR-§12` | Stated target group vs jargon | P0 | Research-identified |
| NFR-008 | Mobile usability | `UR-§10`, `UR-§12` | Likely usage context | P1 | Assumption |
| NFR-009 | Accessibility | `UR-§12` | Obligation; standard undecided | P1 | Research-identified |
| NFR-010 | Prompt delivery responsiveness | `UR-§3.3` | Speed as an experience goal | P1 | Assumption |
| NFR-011 | Customization under delay | `P-§15` | External dependency | P1 | Constraint |
| NFR-012 | Preserve input through interruption | `UR-§10` | Interruptions are designed-in | P0 | Research-identified |
| NFR-013 | Maintainable without engineering | `P-§15`, `UR-§2.6` | Authoring capacity is the ceiling | P0 | Constraint |
| NFR-014 | Catalog growth | `P-§15` | Continuous growth expected | P1 | Constraint |
| NFR-015 | Detect external tool change | `UR-§11.4` | Largest structural risk | P1 | Constraint |
| NFR-016 | Administrative accountability | `FR-047`–`FR-049` | Actions with monetary value | P1 | Derived |

---

# Part 4 — Candidate Requirements — Requires Validation

These are not requirements. They are ideas that arose from the source documents but are not sufficiently supported to enter scope. Each records what would have to be true for it to become a requirement.

### CR-001 — Allow a user to retain prompts they have obtained
- **Proposed:** Allow a subscriber to keep and return to prompts they have previously obtained or customized.
- **Why it may be useful:** `UR-§4.6` records difficulty returning to something useful as a pain point, and `UR-§8` notes AWA currently has template favourites but no saved prompt history.
- **Supporting assumption:** That users want to return to specific prompts rather than regenerate from the template.
- **To validate:** `V-23`. Also interacts directly with FR-028 — if prompts are retained, what happens to them at subscription end becomes a sharper question.

### CR-002 — Provide a limited free sample of complete prompts
- **Proposed:** Make a small number of complete prompts available without a subscription.
- **Why it may be useful:** `UR-§2.5` records that the non-subscribed visitor carries the entire conversion burden while being unable to assess the product's core value; `UR-§13` records that the subscription decision is made with the least possible information.
- **Supporting assumption:** That experiencing one complete prompt increases willingness to pay more than it reduces it.
- **To validate:** `V-4`. This is testable directly with a prototype and is the cheapest available mitigation for Conflict C-4.

### CR-003 — Support collaborative or team use
- **Proposed:** Allow several people to share access and a common set of prompts.
- **Why it may be useful:** `UR-§2.3` identifies the business/marketing user's core problem as *team consistency*, which the product currently cannot address at all.
- **Supporting assumption:** That this group is a primary paying user.
- **To validate:** `V-1`. **This is Conflict C-2 and should not be built before the primary user is determined.** If the business user is primary, this is not a candidate but a gap.

### CR-004 — Offer prompt variations
- **Proposed:** Allow a user to obtain several alternative prompts for the same need.
- **Why it may be useful:** `UR-§11.3` records that a user may want variations, and that it is **UNKNOWN** whether they expect these to be free.
- **Supporting assumption:** That variation is desired and that users accept paying per variation.
- **To validate:** Interviews; observation of whether users customize repeatedly toward a target.

### CR-005 — Help a user who does not know what they want
- **Proposed:** Provide a route for users with an unformed intention, rather than requiring category selection.
- **Why it may be useful:** `UR-§11.1` identifies this user and notes that category navigation is not exploration — nothing in the current journey helps them discover intent.
- **Supporting assumption:** That this user exists in meaningful volume.
- **To validate:** `V-1`, `V-3`. Currently **UNKNOWN** whether this is a real segment or an edge case.

### CR-006 — Establish a pre-launch baseline of user effort
- **Proposed:** Measure, before or independently of AWA, how many attempts users currently make and how long they take.
- **Why it may be useful:** `P-§20` and `UR-§8` both record that the product's central claim — fewer attempts to a usable result — cannot be evaluated without a baseline that does not exist and cannot be created after launch.
- **Supporting assumption:** None. This is a measurement gap, not a product idea.
- **To validate:** Not applicable. **This is time-limited: the opportunity to gather it disappears once the product launches.**

---

# Part 5 — Requirement Conflicts and Clarifications Needed

### C-1 — No primary user has been determined
- **What conflicts:** `UR-§1.1` names four candidate primary user groups and records that it is **UNKNOWN** which is primary. `UR-§3` records that they want opposite things: a beginner needs the full chain of guidance; an experienced user wants it out of the way.
- **Where:** Affects FR-005, FR-008, FR-023, NFR-007 directly, and the priority of most others.
- **Why it matters:** Requirements serving a beginner (extensive guidance, plain terminology) and requirements serving an expert (model filtering, minimal friction) pull the product in different directions. Building for all four risks serving none.
- **To clarify:** Who is the primary paying user (`V-1`). **This should be resolved before detailed product design, not during it.**

### C-2 — The business user's core need is out of scope
- **What conflicts:** `UR-§2.3` identifies the business/marketing user's core problem as team consistency. The product has no team capability, and sharing was deliberately removed (`P-§16`).
- **Where:** `UR-§2.3` versus the confirmed scope decisions.
- **Why it matters:** `UR-§2.3` also notes this group plausibly has the clearest willingness to pay. If they are the primary user, the product is missing the thing they need most.
- **To clarify:** Resolve C-1 first. If the business user is primary, CR-003 is not a candidate but a gap in scope.

### C-3 — The catalog is smallest exactly when it is judged
- **What conflicts:** FR-007 exists because `UR-§11.2` records that "no suitable template" is most likely at launch. FR-026 requires payment before the prompt can be read.
- **Where:** FR-007 against FR-025/FR-026.
- **Why it matters:** At launch the product must convert visitors using the smallest catalog it will ever have, and those visitors cannot read a prompt before deciding.
- **To clarify:** What minimum catalog size makes a subscription worth offering. Recorded as **UNKNOWN** in `P-§18`.

### C-4 — The subscription decision is made on the least information
- **What conflicts:** `UR-§13` records that the subscription decision is the highest-stakes in the journey and is made by judging the product from a concealed prompt. FR-008 requires enough information to select a template — but the prompt itself is the information that would most inform the choice.
- **Where:** FR-008 against FR-026.
- **Why it matters:** `UR-§10 Scenario A` records this as the single most important untested moment in the product, with two plausible outcomes: subscribe, or leave.
- **To clarify:** Whether anyone will subscribe having seen only a concealed prompt (`V-4`). CR-002 is the cheapest available mitigation and is directly testable.

### C-5 — The expenditure limit blocks paying customers
- **What conflicts:** FR-050 requires expenditure on the customization service to be limited. FR-030 and FR-033 give subscribers an allowance they have effectively paid for.
- **Where:** FR-050 against FR-030/FR-033/FR-034.
- **Why it matters:** `UR-§11.6` records this precisely: a subscriber holding unused allowance, blocked by an internal budget limit they cannot see, has been sold something they cannot use. FR-050 protects the business from an unbounded cost; FR-034 protects the customer from losing what they paid for. Both are P0, and they collide.
- **To clarify:** What happens when the limit is reached and a paying subscriber holds allowance. The options — pause and notify, honour the allowance and exceed the limit, or set the limit high enough that it should never bind in normal operation — are business decisions, not technical ones. **Requires an explicit decision, not an implementation default.**

### C-6 — Two payment mechanisms may be understood as one
- **What conflicts:** FR-026 (subscription buys prompt access) and FR-030/FR-033 (allowance governs customization) are separate entitlements. `UR-§10 Scenario D` records the risk that a subscriber asked to buy allowance perceives being charged twice for one product.
- **Where:** FR-027 attempts to mitigate this through clear statement before purchase.
- **Why it matters:** The risk is not lost revenue but resentment, which affects renewal more than it affects the individual purchase.
- **To clarify:** Whether users understand the distinction (`V-8`). Testable through usability work on the wording before it is built.

### C-7 — Session restriction penalises legitimate users
- **What conflicts:** FR-029 limits an account to one active session. `UR-§10 Scenario F` records that a user moving between their own phone and laptop is treated as a suspected sharer.
- **Where:** FR-029 against NFR-012 and the experience goals in `UR-§3.3`.
- **Why it matters:** `UR-§16 V-15` raises whether the restriction affects willingness to subscribe at all. The measure protects revenue and may also cost it.
- **To clarify:** Whether the restriction should permit more than one concurrent session. A business decision informed by `V-15`.

### C-8 — The feedback loop depends on an act that benefits only AWA
- **What conflicts:** FR-035 and FR-040 make feedback the mechanism by which content quality improves. `UR-§7.2` records that feedback creates value for AWA and none for the user, and that the proportion who return to provide it is **UNKNOWN**.
- **Where:** FR-035, FR-036, FR-045, FR-051 all depend on feedback volume.
- **Why it matters:** `P-§15` establishes that AWA cannot observe the output. If few users return, the only quality signal the product has is both scarce and, per `UR-§4.5`, noisy by construction.
- **To clarify:** The realistic feedback rate (`V-18`), and whether any content-improvement mechanism exists that does not depend on it. FR-036 is a partial answer — it derives signal from customization requests, which users make for their own benefit.

### C-9 — Success cannot be measured without a baseline that does not exist
- **What conflicts:** `P-§20` defines success partly as reduced attempts and reduced effort. `UR-§8` records that both sides of that comparison are currently **UNKNOWN**.
- **Where:** FR-051 against `P-§20`.
- **Why it matters:** Without a baseline gathered before or independently of AWA, the product's central claim becomes permanently unprovable, and reporting will measure activity rather than benefit.
- **To clarify:** Whether to gather a baseline now (CR-006). **This is time-limited — the opportunity closes at launch.**

---

# Part 6 — Out of Scope

Confirmed by `P-§21` and `P-§1`. These must not become requirements.

| Out of scope | Why |
|---|---|
| Producing the final image, video, website, presentation or other output | The defining product boundary (`P-§1`, `P-§15`) |
| Hosting or running generation models | Confirmed constraint (`P-§15`) |
| Executing prompts on external tools on the user's behalf | Confirmed out of scope (`P-§21`) |
| Controlling, configuring or guaranteeing any external tool | AWA has no relationship with these providers (`UR-§1.4`) |
| Guaranteeing the quality of what an external tool produces | AWA controls the prompt, not the model (`P-§15`) |
| Storing or organising the outputs users create | Confirmed out of scope (`P-§21`) |
| Teaching AI or design as a discipline | Confirmed out of scope (`P-§21`) |
| Team collaboration on prompts | Confirmed out of scope (`P-§21`). **See Conflict C-2** |
| Comparing outputs across tools | Confirmed out of scope (`P-§21`) |
| Sharing prompts by link | Removed by explicit decision (`P-§16`) |
| Specifying prices, plans, billing cycles, trials or discounts | Business parameters, configured under FR-049, not requirements |
| Specifying which external AI or speech service is used | **UNKNOWN** (`P-§18`); a procurement decision, not a requirement |

---

# Part 7 — Requirements Summary

### Functional requirements

| | Count |
|---|---|
| **Total** | **51** |
| P0 | 30 |
| P1 | 17 |
| P2 | 4 |

### Non-functional requirements

| | Count |
|---|---|
| **Total** | **16** |
| P0 | 9 |
| P1 | 7 |
| P2 | 0 |

**Total requirements: 67.** Of these, **18 carry an ASSUMPTION — REQUIRES VALIDATION marker or an explicit assumption note**, reflecting that no user research has been conducted.

### Candidate requirements

Six, in Part 4. **CR-002** (free sample prompts) and **CR-006** (pre-launch baseline) are the two most consequential. CR-006 is time-limited and the opportunity closes at launch.

### Critical open questions

These must be answered before detailed product design.

1. **Who is the primary paying user?** (C-1, `V-1`) — determines the priority of most requirements in this document.
2. **What does one customization cost?** (`P-§18`, FR-050) — unknown, and the basis of FR-050's limit. Until known, the economics of FR-030 and FR-033 are unknown.
3. **Will anyone subscribe having seen only a concealed prompt?** (C-4, `V-4`) — the entire revenue model rests on one untested moment.
4. **What happens when a subscription ends?** (FR-028, `V-20`) — currently undecided; FR-028 obliges a decision it cannot make.
5. **What happens when the expenditure limit blocks a paying subscriber?** (C-5) — two P0 requirements collide and the resolution is a business decision.
6. **Does the need recur often enough for a subscription?** (`P-§11.3`, `V-3`) — affects FR-010's priority and the viability of the model.
7. **Why would a user choose AWA over asking a general AI assistant for a prompt?** (`P-§12.6`, `V-2`) — carried forward unanswered from both preceding documents.
8. **What accessibility standard applies?** (NFR-009) — the obligation is recorded; the standard is not derivable from the sources.

### Major dependencies

| Dependency | Affects | Status |
|---|---|---|
| An external service capable of revising prompts | FR-015, FR-016, FR-050, NFR-001, NFR-011 | Provider **UNKNOWN** |
| An external service capable of interpreting speech | FR-016, NFR-004 | Provider **UNKNOWN** |
| Availability and stability of recommended external tools | FR-019–FR-022, NFR-015 | Outside AWA's control; no agreement exists |
| A means of taking payment | FR-030, FR-033, FR-049 | Configurable |
| Content authoring capacity | FR-037–FR-046, NFR-013 | **UNMEASURED.** `UR-§2.6` identifies this as the practical ceiling on the product |

### Major risks to fulfilling these requirements

| Risk | Affected requirements | Note |
|---|---|---|
| Content authoring capacity is lower than the catalog requires | FR-037–FR-046, C-3 | Never measured. The most under-examined dependency in the project |
| The cost of customization exceeds what the pricing supports | FR-030, FR-033, FR-050, C-5 | Unknown cost against a fixed price |
| External tools change invisibly and are blamed on AWA | FR-019–FR-022, NFR-015 | `UR-§11.4` identifies this as the largest structural risk |
| Users do not subscribe from a concealed prompt | FR-026, C-4 | Untested; the revenue model depends on it |
| Feedback volume is too low to improve content | FR-035, FR-045, C-8 | Feedback benefits AWA, not the user |
| The primary user is never determined and the product serves none of the four well | All, C-1 | The highest-order risk in this document |

---

## Note on readiness

This baseline is complete and internally consistent, and it is suitable for the next stage of work.

It rests, however, on a foundation that both preceding documents record as untested. Thirty of the sixty-seven requirements are P0, and a substantial number of those trace to beliefs about users rather than to observed behaviour.

`UR-§17` recommends approximately two weeks of validation — interviews, a blind prompt comparison, a paywall prototype test, and a beginner usability test. Running that work now would confirm, re-prioritise or remove a meaningful portion of this document at a fraction of the cost of discovering the same things after the product is built.

That recommendation is repeated here rather than assumed to have been read.
