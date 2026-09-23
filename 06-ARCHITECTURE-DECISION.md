# 06 — MVP Architecture Decision

**Product:** AWA — AI Creation Guide Platform
**Sources of truth:** `docs/01-PROBLEM.md` … `docs/05-MVP.md`
**Question this document answers:** What *kinds* of components does the AWA MVP actually need, and why?
**Question it does not answer:** Which technologies should implement them. That belongs to a later stage.
**Status:** Revised against the 44-feature launch scope

---

## The starting point

This document reasons about the MVP defined in `05-MVP.md`.

| Property | Value | Source |
|---|---|---|
| Features | 44 of 47 | `05-MVP §4` |
| Categories at launch | 1, expandable from day one | `05-MVP §5.4` |
| Templates at launch | 20–30, authored through the admin panel | `05-MVP §7.3` |
| Content changes during operation | Self-serve, live, no release | `05-MVP §4` FEAT-037 |
| Prompt access | Subscription-gated | `05-MVP §4` FEAT-022 |
| Payment | Live from launch | `05-MVP §4` FEAT-042 |
| Customization | AI-assisted, typed only, metered by allowance | `05-MVP §4` FEAT-013, 026 |
| Accounts | Required — access is a per-user decision | Follows from FEAT-022 |
| Typed user input | Change requests, feedback, unmet needs | `05-MVP §7` |
| Discovery | Navigation, search, attribute filtering and AI model filtering, all at launch | `05-MVP §4` FEAT-003, 004, 005 |
| Personal organisation | Saved templates in user-created collections | `05-MVP §4` FEAT-009 |
| Language | English at launch; further languages added by an administrator and selectable on the frontend | `05-MVP §4` FEAT-039 |

Read those rows together and the shape is a conventional multi-user application: content that changes at runtime, per-request authorization, money, an external paid capability, and two distinct user surfaces.

**The architecture follows from that, and the discipline in this document is not minimalism for its own sake — it is refusing components the 44 features do not require.** Several conventional pieces are still marked NOT REQUIRED, each with a reason.

---

# 1. Decision Principles Applied

| Principle | How it is applied |
|---|---|
| **MVP first** | Every decision is made against `05-MVP`'s 44 features, not the 47 |
| **Minimum necessary complexity** | A component is REQUIRED only if a feature or the MVP's purpose fails without it |
| **Traceability** | Every REQUIRED component names the feature demanding it (§18) |
| **No technology decisions** | Component types and responsibilities only |
| **No premature scalability** | Launch serves one category and an unknown but small user base. Nothing is sized for growth |
| **No architecture theatre** | Components are excluded where the feature set does not require them, even where they would be conventional |

**One principle specific to this MVP.** `05-MVP §1` states the launch must prove both that the product helps and that it can be sold profitably. A component the user journey does not need, but without which that cannot be established, is still REQUIRED — which is why §13 marks event capture and cost tracking required.

---

# 2. Component Decision Matrix

| Component | Decision | Reason | Supporting requirement / feature |
|---|---|---|---|
| **User interface — public** | **REQUIRED** | The journey is a person browsing, choosing, reading, purchasing and describing changes | FEAT-001, 008, 010, 011, 013, 022 |
| **User interface — administrative** | **REQUIRED** | A separate surface with different users, different permissions and write access to content | FEAT-030–038, 040, 041 |
| **Application logic** | **REQUIRED** | Per-request access decisions, allowance accounting, customization orchestration, content publishing | FEAT-022, 026, 013, 037 |
| **API boundary** | **REQUIRED** | Two clients, authorization on every content request, and state-changing operations | §6 |
| **Public database** | **REQUIRED** | Catalog content — free, unauthenticated, already shown to every visitor | §5.1 |
| **Private database** | **REQUIRED** | The prompt text (the paid product), identity, commerce and evidence. Separated from public content by sensitivity, not by scale | §5.2 |
| **Object storage** | **REQUIRED** | Administrators upload media at runtime; it cannot live in the codebase | §13 |
| **Authentication** | **REQUIRED** | Access is a per-user decision; accounts exist | FEAT-022, 040 |
| **Authorization** | **REQUIRED** | Three distinct access states: visitor, subscriber, administrator | FEAT-021, 022, 040 |
| **AI capability — text transformation** | **REQUIRED** | Customization rewrites a prompt from a described change | FEAT-013 |
| **AI capability — speech to text** | **NOT REQUIRED** | FEAT-014 excluded from launch (`05-MVP §11`). Typed input only | §7.2 |
| **Agents / multi-step tool-using AI** | **NOT REQUIRED** | A single transformation. No planning, no tool use, no re-planning | §8 |
| **External integration — payment** | **REQUIRED** | Money is taken and confirmations must be received | FEAT-042 |
| **External integration — creative AI tools** | **NOT REQUIRED** | A link is not an integration. The user departs manually | §9 |
| **Transactional message delivery** | **REQUIRED** | Account recovery, and informing a user before their term ends | FEAT-040, FEAT-024 |
| **Remote accessibility** | **REQUIRED** | A public product taking payment | §11 |
| **Event and cost capture** | **REQUIRED** | The launch must establish both product and commercial outcomes | §13 |
| **Background processing** | **OPTIONAL** | Nothing in the 44 features requires deferred work at launch volume | §12 |
| **Caching** | **NOT REQUIRED** | One category, unknown but small volume. Adds staleness against content that must publish live | §13 |
| **Search, filter, model filter** | **REQUIRED as a capability; NOT REQUIRED as a distinct component** | FEAT-003–005 are included at launch, but a 20–30 template catalog in one category is served by indexed queries within the application logic and database already required. No dedicated search engine | §13 |
| **Notification system** *(beyond transactional messages)* | **NOT REQUIRED** | No feature notifies anyone outside account and term events | §13 |
| **Language content variation** | **REQUIRED as data, not as a component** | FEAT-039 — administrators add languages and translations; content varies by language in the existing database. No separate localisation service | §5.1 |
| **Saved templates / collections** | **REQUIRED as data, not as a component** | FEAT-009 — a user-to-template relation with a user-named grouping. No separate component | §5.2 |
| **Message queue** | **NOT REQUIRED** | No deferred work exists to place on one | §12 |
| **Monitoring and logging** | **REQUIRED** | Money and an external paid capability are both live | §13 |

---

# 3. User Interface

**Decision: REQUIRED — two surfaces.**

## 3.1 The public surface

Every step of `05-MVP §6` is a person looking and choosing:

| MVP step | Needs an interface because |
|---|---|
| Browse and navigate (FEAT-001, 002) | Seeing options and picking one |
| Judge a template (FEAT-008) | Chosen from a description and a preview, behind the paywall |
| Search or filter by attribute or AI model (FEAT-003, 004, 005) | Narrowing a list before or instead of navigating |
| Meet the concealed prompt and subscribe (FEAT-022, 023) | The purchase decision |
| Read the prompt (FEAT-010) | Text to read and evaluate |
| Describe a change, typed (FEAT-013) | The first place the user provides input |
| Take the prompt (FEAT-011) | A deliberate action on specific text |
| Save a template to a collection (FEAT-009) | A personal organisation action |
| See tools and reasoning, depart (FEAT-016, 017) | A comparison, then a departure |
| Report the outcome (FEAT-028) | A response given back |
| Select a language (FEAT-039) | Content re-renders in the chosen language, with fallback where a translation is missing |

**New responsibilities versus a content-only interface:** capturing typed input, showing allowance state before an action, presenting a concealed prompt convincingly, handling a purchase, resolving search and filter queries, managing personal collections, and rendering content in a selected language with a defined fallback.

## 3.2 The administrative surface

A separate surface, not a section of the public one:

| Reason | Detail |
|---|---|
| Different users | Administrators, not visitors |
| Different permissions | Write access to everything users read |
| Different work | Authoring long text, managing a tree, reviewing versions, reading reports |
| Different device assumption | `NFR-008` requires the public journey on a phone. Administrative work is desk work |

**One system, two surfaces, one authorization layer.** They are not separate applications, and treating them as such would duplicate the domain rules that both depend on.

---

# 4. Application Logic

**Decision: REQUIRED — including for content serving.**

Server-side logic exists to decide something at request time. Under the launch scope, nearly every request has a decision in it:

| Decision | Present? |
|---|---|
| Process user input | **Yes.** Change requests, feedback, unmet needs, account and payment data |
| Apply access rules | **Yes.** Whether this caller may receive prompt text (FEAT-022) — the defining decision of the product |
| Meter a paid capability | **Yes.** Allowance check, hold, consume or release (FEAT-026) |
| Enforce a spending limit | **Yes.** Before every paid call (FEAT-043) |
| Orchestrate an external capability | **Yes.** Customization only — transcription is not required (FEAT-014 excluded) |
| Retrieve changing content | **Yes.** Administrators publish continuously (FEAT-037) |
| Protect privileged operations | **Yes.** Everything in the administrative surface |

**The content path is no longer static.** Two features change it: FEAT-022 makes prompt delivery a per-user decision, and FEAT-037 makes content change without a release. Either alone would require application logic; both together make it unavoidable.

## 4.1 What the application layer owns

| Responsibility | Feature |
|---|---|
| Access decisions on every request that could return prompt text | FEAT-022, NFR-002 |
| Subscription state and end-of-term behaviour | FEAT-024 |
| Session limitation to one active session | FEAT-025 |
| Allowance accounting — hold, consume on success, release on failure | FEAT-026, NFR-006 |
| Expenditure limit enforcement, checked before every paid call | FEAT-043 |
| Customization orchestration, output validation, failure handling | FEAT-013, 015 |
| Content publishing and its propagation to readers | FEAT-037 |
| Tool and guidance resolution with inheritance | FEAT-035, 036 |
| Search and filter resolution over the catalog | FEAT-003, 004, 005 |
| Language resolution with fallback to the default language | FEAT-039, FR-046 |
| Collection management — add, remove, list a user's saved templates | FEAT-009 |
| Version pinning of delivered prompts | FEAT-033 |
| Rate limiting on paid operations | Follows from FEAT-043. **20 customizations per user per hour**, decided in `05-MVP §3.3` |
| Audit recording of administrative actions | FEAT-041, NFR-016 |

## 4.2 One rule worth stating at architecture level

**The access decision must live in one place**, called by every path that could return prompt text — the public interface, any export, and anything rendered for search engines. Scattering it guarantees one route eventually forgets, and NFR-002 requires that prompt text is not transmitted at all to an unentitled caller, not merely hidden.

---

# 5. Persistent Data

**Decision: REQUIRED — as two separate databases, split by sensitivity.**

## 5.0 Why two databases

Two data sets have opposite risk profiles, and the previous single-store model treated them identically:

| | Public catalog content | Everything else |
|---|---|---|
| Who can read it today | Anyone, unauthenticated, already | Only its owner, or an administrator |
| Contains money, identity or the paid product | No | **Yes** |
| Consequence of a leaked credential | Category names and template descriptions | Accounts, payments, allowance, and the prompt text itself |

**The public database holds nothing that would matter if it were less protected than the rest of the system, because it is already shown to every visitor for free.** The private database holds everything a leaked credential, a misconfigured connection, or a future direct-access shortcut must never expose.

This is a blast-radius decision, not a performance one. Launch volume (§17.5 A1) gives no scale reason to split; the reason is that the two data sets should never be able to leak through the same door.

**Access rule, unconditional:** both databases are reached only through the application server. Neither is ever queried directly by a client. `13-SECURITY.md §6.1` states the principle this follows: *the paywall is application code, not database security* — a direct-access path to either store, however harmless it looks today, is a second route the entitlement check never sees.

## 5.1 Public database — catalog content

Holds only what every visitor already sees for free, today, with no entitlement check.

| Content | Why it belongs here |
|---|---|
| Category tree | Free to browse (FEAT-001, 002) |
| Template — name, description, preview, status, position | FEAT-008: the information a visitor judges a template by, without reading the prompt |
| AI tool and model registry, with reasoning | FEAT-016: shown to every visitor, subscriber or not |
| Tool assignments, with inheritance | Resolves the same way regardless of who is asking |
| Guidance and its steps | Free to read (FEAT-020) |
| Media references | Previews and recorded guidance, public by nature |
| Language and translation content | FEAT-039: interface and catalog content in the selected language |

| Property | Under launch scope |
|---|---|
| Who writes it | Administrators, continuously, through FEAT-030–037 |
| Writes during operation | **Constant** |
| Varies over time | **Yes** — and must reach readers without a release |
| Needs relational integrity | **Yes** — a template belongs to a node, assignments inherit down a tree |
| Varies by language | **Yes**, resolved per language with a defined fallback |

**What is deliberately absent: the prompt text.** A template's public row carries `current_version_id` as a **reference into the private database**, not the prompt itself. §5.3 explains why, and how that reference is treated.

## 5.2 Private database — identity, commerce, the prompt, and evidence

Holds everything gated by who is asking, and everything involving money.

| Content | Why it belongs here |
|---|---|
| **Prompt versions — the prompt text itself** | **The paid product** (`P-§11.1`). The single most protected thing in the system, and the reason this split exists |
| Accounts, sessions | Access is a per-user decision |
| Subscriptions, plans, credit packs, payment transactions, payment configuration | Money and commerce, administered and written together (FEAT-042) |
| Allowance ledger | NFR-006 — a dispute must be answerable precisely |
| Delivered prompts, customization attempts | The user's specific copy of the paid product, and its cost |
| Feedback, unmet needs, interaction events | Evidence tied to a person or a visit |
| Audit records | FEAT-041, NFR-016 |

| Property | Under launch scope |
|---|---|
| Who writes it | The system, on a user's action; administrators, for commerce configuration and support adjustments |
| Writes during operation | Constant — the most frequent writes in the product |
| Needs history | **Yes** — FEAT-033 requires prompt version retention and reversion; the ledger is append-only |
| Needs strict integrity | **Yes** — allowance hold/consume/release, payment idempotency, one active session, one active subscription |

**Plans and credit packs sit here, not in the public database, even though `GET /plans` is unauthenticated.** Being privately stored does not stop the application server from answering a public request — it only means the credential guarding that data is never the same one that guards the catalog. They are grouped with payment configuration because they are administered and written together, and separating them would gain nothing while adding a needless cross-database reference.

## 5.3 The one reference that crosses the boundary

`template.current_version_id` (public) points at a `template_version` row (private). This is **exactly the pattern `07-DATABASE.md §6.1` already established** for evidence entities referencing content: a recorded value, not an enforced foreign key, because the two sides cannot share a constraint across separate stores.

**The reverse also occurs**, in the other direction: `delivered_prompt.template_id`, `unmet_need.category_id`, and `interaction_event.template_id / category_id / tool_id` are private-database rows referencing public-database content. Same treatment — recorded values, not enforced relationships.

**The discipline this requires**, extending `07 §22`'s existing rule on content identifier stability: **identifiers must be stable across both databases**, and nothing enforces that except care. A tool for verifying referential consistency between the two stores is worth having before launch, not after.

## 5.4 The one operation that now touches both databases

**Publishing or reverting a prompt** is the sole place a single administrative action must write to both stores in the correct order.

```
Publish a new prompt version
   1. Insert the template_version row — PRIVATE database — including the prompt text
   2. Update template.current_version_id — PUBLIC database — to point at it
```

**Order matters, and it fails safe.** If step 2 never happens, the public template still points at the previous version — old, but valid and complete. If the order were reversed, a template could briefly point at a version that does not yet exist.

**Reversion (FEAT-033) follows the identical sequence:** the restored content is inserted as a new private-database row first, and the public pointer is updated only after it exists.

**This is the one place a cross-database transaction concern exists in the whole architecture.** Every other write — allowance hold/consume/release, payment confirmation, session eviction — stays within a single database and can use an ordinary transaction. This one cannot, and the two-step, fail-safe order above is the mitigation, not a database-level transaction.

## 5.5 Why one store, not two, would have been simpler — and why the split is still correct

`06 §5.3` in the previous revision argued that entitlement checks and content reads happen in the same request, so separating them would put a boundary in the middle of the product's most common operation. That argument is still true, and it is answered here, not overridden: **the application server sits on both sides of the boundary already**, on every request. Reading a template's metadata from the public database and checking whether to also return its prompt text from the private database are two calls the same request already has to make in sequence — the entitlement check was always a distinct step, whether the data lived in one store or two.

The cost accepted is §5.3 and §5.4: a small number of cross-database references, and one two-step publish operation. Both are named, bounded, and the second one degrades safely if interrupted.

# 6. API

**Decision: REQUIRED.**

| Justification for an API boundary | Present? |
|---|---|
| More than one client | **Yes.** Public and administrative surfaces |
| Authorization on requests | **Yes.** Every request that could return prompt text |
| State-changing operations | **Yes.** Purchase, customization, allowance consumption, content publishing |
| Inbound calls from an external system | **Yes.** Payment confirmations |

**Three distinct groups, and conflating them is the common mistake:**

| Group | Nature |
|---|---|
| Public surface → application | Read with authorization; submit feedback, unmet needs, change requests; purchase |
| Administrative surface → application | Content read and write, version management, reporting |
| **External system → application** | Payment confirmations, received and verified. **Not initiated by a user, and must not be trusted on the basis of a browser round-trip** |

**Still NOT REQUIRED:** an integration API for external creative AI tools. See §9.

---

# 7. AI Capability

**Decision: REQUIRED — one capability, at the simplest level. A second capability is excluded from launch.**

`09-AI-DESIGN.md` §1 places the requirement on the complexity ladder and its analysis stands under this scope.

## 7.1 Text transformation — FEAT-013

| Property | Value |
|---|---|
| **Ladder level** | **AI Model** — a single-shot instruction-following text transformation |
| What it does | Takes an existing prompt and a described change; returns a revised prompt |
| Steps | One. Nothing depends on a previous result within a request |
| Planning | None. One fixed action |
| Tool use | None |
| Learning | None. A fixed capability applied, not a model trained |

**Why not lower:** rules can handle enumerated changes but cannot interpret unbounded natural language, which is the case FEAT-013 exists for.

**Why not higher:** no conversational state, no autonomy, nothing to decompose. Each request is self-contained, with the previous prompt passed in as input.

## 7.2 Speech to text — FEAT-014 — excluded from launch

**Decision: NOT REQUIRED.**

`05-MVP §3.2` excludes FEAT-014: "a second external capability, a second cost line and a second failure mode, for a route typed customization already covers." Typed input is the only route at launch.

**Consequence for this architecture:** no speech-to-text integration, no audio upload path, no audio storage or deletion logic, and NFR-004 (audio not retained after conversion) does not apply at launch because no audio is ever collected.

**When this reverses:** if FEAT-014 is added post-launch (`05-MVP §11` names it as deferred, not rejected), this section is re-opened and a transcription capability, an upload path, and NFR-004's deletion requirement all become REQUIRED again.

## 7.3 What the architecture must provide around the one capability that exists

| Requirement | Feature |
|---|---|
| A limit checked before every paid call | FEAT-043 |
| Allowance held before the call, consumed only on success | FEAT-026, FEAT-015 |
| Output validated before display | FEAT-015 |
| User input passed as data, never as instruction | Security; see §17.4 |
| Cost recorded per call | FEAT-044 |
| The core journey unaffected when the capability is unavailable | FEAT-045, NFR-001 |

## 7.4 The architectural rule this produces

**The AI is an extra, never a dependency.** The paid entitlement is prompt access, which requires no AI. If the capability is unavailable, degraded or over budget, browsing, prompt delivery, recommendations and guidance must all continue working (FEAT-045).

Getting this wrong means an outage at an outside company withholds what customers have paid for.

# 8. Agents

**Decision: NOT REQUIRED.**

| Criterion | Present? |
|---|---|
| Autonomous multi-step reasoning | No. One transformation |
| AI calling external tools | No. **The user** goes to the tool, manually, having copied the prompt |
| AI deciding which tools to use | No. Recommendations are written by a person and resolved by inheritance (FEAT-035) |
| AI acting on the user's behalf | No. Direct execution is out of scope (`P-§21`) |
| Observing results and re-planning | No. The user observes and decides |

Iteration in FEAT-013 is **the user initiating a second discrete request**, with the previous prompt passed in as input — not the system chaining steps of its own accord.

Introducing an agent would add orchestration, planning and state to a capability whose per-request cost is already the launch's central unresolved question.

---

# 9. External Integrations

**Decision: REQUIRED — three, and two exclusions.**

## 9.1 Required

| Integration | Why | Nature |
|---|---|---|
| **Payment provider** | Money is taken (FEAT-042) | Outbound to initiate; **inbound, verified, for confirmation**. Confirmation must arrive from the provider, not via a browser round-trip, and must be idempotent |
| **AI text transformation service** | FEAT-013 | Outbound, per request, with a cost |
| **Transactional message delivery** | Account recovery (FEAT-040); informing a user before their term ends (FEAT-024) | Outbound. May be provided by the authentication component rather than separately |

## 9.2 Not required — speech-to-text service

FEAT-014 is excluded from launch (`05-MVP §11`). No transcription integration exists at launch. See §7.2.

## 9.3 Not required — external creative AI tools

> Providing information *about* an external tool is not integration *with* it.

A person wrote which tool suits a template and why; the interface offers a route to it. AWA sends no request, holds no credential, and learns nothing about what happened.

**This is unchanged by the scope expansion**, and it remains the product's defining boundary. Direct execution is out of scope (`P-§21`).

## 9.4 A consequence that persists

Because there is no integration, AWA cannot observe whether the external tool produced anything good. Every quality signal is self-reported. `P-§15` establishes this as a confirmed constraint, and it is why FEAT-028 exists.

---

# 10. Authentication and Authorization

**Decision: both REQUIRED.**

## 10.1 Authentication

| Reason | Present? |
|---|---|
| An account is required for the paid capability | **Yes.** FEAT-022 |
| User-specific data is stored | **Yes.** Subscription, allowance, prompt history |
| Access restrictions apply | **Yes.** The paywall |
| The core journey works anonymously | **Only the free part.** Everything past the concealed prompt requires identity |

**Required capabilities:** account creation, sign-in, sign-out, credential recovery, and **session limitation to one active session** (FEAT-025).

FEAT-025 is worth calling out: it requires the current session to be identifiable and revocable, which is a stronger requirement than sign-in alone.

## 10.2 Authorization

Three access states, and they are not a hierarchy:

| State | May |
|---|---|
| **Visitor** | Browse, search within navigation, view templates, tools and guidance |
| **Subscriber** | The above, plus receive prompt text and consume allowance |
| **Administrator** | Read and write content, manage users, adjust access and allowance, read reports |

Two orthogonal questions on every protected request: **does this role permit the action**, and **is this the actor's own record**. The second applies to allowance, subscription and prompt history.

---

# 11. Remote Accessibility

**Decision: REQUIRED.**

A public product taking payment must be publicly reachable. `05-MVP §10.4` additionally requires observing unprompted return and renewal, which is only possible if users reach it in their own context.

**What is not implied:** no scaling architecture, redundancy, geographic distribution or capacity planning. Launch serves one category and an unknown but small user base (§19).

---

# 12. Background Processing

**Decision: OPTIONAL.**

Each candidate assessed rather than assumed:

| Candidate | Required? | Why |
|---|---|---|
| Subscription expiry | **No** | Entitlement is a comparison against a stored end date, evaluated on read. No job needs to run |
| Cost aggregation for the limit | **No** | A running total updated in the same transaction as the call it records |
| Reporting rollups | **No** at launch volume | Computed on read. Becomes worthwhile as data grows |
| Content gap detection | **No** | Derived on read from existing records |
| Tool availability monitoring | **No** | FEAT-019 excluded from launch |
| Payment confirmations | **No** | Received and processed inbound, synchronously |
| Customization | **No** | A single call within the user's request. Introducing asynchrony would add complexity to the one path where the user is waiting |

**Nothing in the 44 features requires deferred work at launch volume.** Marked OPTIONAL rather than NOT REQUIRED because reporting and cost aggregation are the first things that will justify it as data accumulates.

---

# 13. Additional Components

| Component | Decision | Why |
|---|---|---|
| **Object storage** | **REQUIRED** | Administrators upload template previews and any recorded guidance at runtime (FEAT-031, 036). Runtime-uploaded media cannot live in the codebase |
| **Event and cost capture** | **REQUIRED** | `05-MVP §10` requires both product and commercial outcomes to be established. Feedback captures only volunteers; conversion, departure and cost are observable only through recorded events. Shares the application and database components |
| **Monitoring and logging** | **REQUIRED** | Money is live and an external paid capability is in the request path. A failing customization that silently consumes budget must be visible |
| **Audit record** | **REQUIRED** | FEAT-041 grants access and allowance — things with monetary value. NFR-016 requires attribution. Part of the private database, not a separate component |
| **Rate limiting** | **REQUIRED** | Paid operations without a per-user rate limit are an unbounded cost. Part of the application layer |
| Caching | **NOT REQUIRED** | One category, small volume, and content must publish live (FEAT-037). Would add a staleness problem against a feature whose point is immediacy |
| Search (dedicated engine) | **NOT REQUIRED** | FEAT-003–005 are included, but a 20–30 template catalog is served by indexed database queries within application logic. No dedicated search engine at launch volume |
| Message queue | **NOT REQUIRED** | §12 |
| Notification system beyond transactional messages | **NOT REQUIRED** | No feature notifies anyone outside account and term events |
| Content delivery for media | **OPTIONAL** | Useful for previews; not required at launch volume |
| Separate reporting store | **NOT REQUIRED** | Launch volume is readable from the primary store |
| Localisation service | **NOT REQUIRED** | FEAT-039 is content variation in the existing database, resolved with fallback in application logic. No separate translation-management platform |
| Speech-to-text integration | **NOT REQUIRED** | FEAT-014 excluded from launch. See §7.2, §9.2 |

---

# 14. Minimum Required Architecture

Ten components — the database split in two by sensitivity, everything else as before.

```
   ┌──────────────────┐              ┌──────────────────────┐
   │  PUBLIC SURFACE  │              │ ADMINISTRATIVE       │
   │  browse · select │              │ SURFACE              │
   │  purchase · read │              │ catalog · prompts    │
   │  customize       │              │ versions · tools     │
   │  copy · report   │              │ users · reports      │
   └────────┬─────────┘              └──────────┬───────────┘
            │                                   │
            └──────────────┬────────────────────┘
                           ▼
              ┌────────────────────────────┐
              │      API BOUNDARY          │
              │  authorization on every    │
              │  request · validation      │
              │  search & filter queries   │
              └────────────┬───────────────┘
                           ▼
        ┌──────────────────────────────────────────┐
        │          APPLICATION LOGIC               │
        │  access decisions · allowance accounting │
        │  expenditure limit · customization       │
        │  orchestration · content publishing      │
        │  search/filter resolution · language     │
        │  fallback · collections · audit          │
        │  rate limiting                           │
        └───┬──────────┬──────────┬────────────┬───┘
            │          │          │            │
    ┌───────▼──┐ ┌───▼────┐ ┌──▼─────┐ ┌─▼────────┐ │
    │AUTH &    │ │PUBLIC  │ │PRIVATE │ │  OBJECT  │ │
    │AUTHZ     │ │DB      │ │DB      │ │  STORAGE │ │
    │identity ·│ │catalog·│ │prompt  │ │  media   │ │
    │session · │ │tools · │ │text ·  │ └──────────┘ │
    │roles     │ │guidance│ │users · │              │
    └──────────┘ └────────┘ │money · │              │
                             │evidence│              │
                             └────────┘              │
       template.current_version_id ──▶ (soft ref)   │
                                                      │
        ┌─────────────────────────────────────┴──────────┐
        │            EXTERNAL SERVICES                   │
        │  AI text transformation                        │
        │  payment provider  ·  message delivery         │
        │  each with a cost, a failure mode, and a       │
        │  fallback that keeps the core journey working  │
        └────────────────────────────────────────────────┘

   ── all of the above reachable by users and administrators ──

        user copies the prompt, departs
                    ▼
   ┌────────────────────────────────────────────┐
   │  EXTERNAL AI TOOL — outside AWA entirely   │
   │  no request · no response · no credential  │
   └────────────────────────────────────────────┘
```

| # | Component | Responsibility | Why REQUIRED |
|---|---|---|---|
| 1 | **Public surface** | Browse, select, purchase, read, customize, copy, depart, report | Every journey step is a person looking and choosing (§3.1) |
| 2 | **Administrative surface** | Author and publish content, manage users, read reports | Different users, permissions, work and device assumption (§3.2) |
| 3 | **API boundary** | Authorization on every request; validation; inbound payment confirmation | Two clients, per-request authorization, inbound external calls (§6) |
| 4 | **Application logic** | Access decisions, allowance accounting, expenditure control, customization orchestration, publishing, audit | Nearly every request has a decision in it (§4) |
| 5 | **Public database** | Category tree, template metadata, tool and model registry, guidance, language content | Free catalog content, already shown to every visitor (§5.1) |
| 6 | **Private database** | **The prompt text**, users, sessions, commerce, allowance, delivered prompts, evidence, audit | Sensitivity-gated content and everything involving money or identity (§5.2) |
| 7 | **Object storage** | Administrator-uploaded media | Uploaded at runtime; cannot live in the codebase (§13) |
| 8 | **Authentication and authorization** | Identity, session limitation, three access states | Access is a per-user decision (§10) |
| 9 | **External services** | AI transformation, payment, message delivery | Three capabilities AWA does not provide itself (§9) |
| 10 | **Remote accessibility** | Reachable by users and administrators | A public product taking payment (§11) |

## 14.1 What the diagram deliberately omits

No agents, no orchestration framework, no integration with external creative AI tools, no message queue, no background worker, no cache, no search index, no separate reporting store, no notification platform.

Each is absent for a stated reason in §15 or §16.

---

# 15. Optional Components

| Component | Why it could be useful | Why launch works without it | What would justify adding it |
|---|---|---|---|
| **Background processing** | Reporting rollups and cost aggregation become cheaper to run out of band | Both are computed on read at launch volume (§12) | Data volume making on-read computation slow, or the arrival of scheduled work such as FEAT-019 |
| **Content delivery for media** | Faster preview images, particularly on mobile | Launch volume does not require it | Media volume or geographic spread |
| **Caching** | Would relieve repeated content reads | One category, small volume, and content must publish live | Read volume high enough to matter, with an invalidation path that preserves FEAT-037's immediacy |
| **A separate reporting store** | Keeps analytical queries away from the operational one | Launch volume is readable from the primary store | Reporting queries affecting user-facing responses |
| **A dedicated event pipeline** | More capable analysis of behavioural data | Events share the application and database components adequately at this volume | Event volume, or analysis beyond what direct reading supports |

---

# 16. Not Required

| Component | Considered because | Rejected because |
|---|---|---|
| **Agents** | The product is AI-adjacent and customization sounds agentic | One transformation. No planning, no tool use, no re-planning. The user, not the system, uses the external tool (§8) |
| **Integration with external creative AI tools** | AWA sends users to them | A link is not an integration. No system-to-system communication occurs; direct execution is out of scope (§9.2) |
| **Vector storage or embeddings** | Common alongside AI features | Nothing in the 44 features requires retrieval or similarity. Customization operates on one prompt supplied in the request |
| **Message queue** | Conventional for external service calls | Customization happens within the user's request, where they are waiting. Deferring it would add complexity to the one path that must feel immediate (§12) |
| **Background worker or scheduler** | Conventional in production systems | Every candidate was assessed in §12; none is required at launch volume |
| **Caching layer** | Standard for content-heavy products | Small volume, and it would work against FEAT-037's requirement that changes publish immediately |
| **Search index (dedicated engine)** | FEAT-003–005 are included; the catalog will grow | A 20–30 template catalog in one category is comfortably served by indexed queries on the existing database. A dedicated search engine is a scale response, not a launch requirement |
| **Microservices** | Conventional at this component count | Ten components, one team, one deployable. Distribution would add coordination cost against no benefit. **The two databases are a sensitivity split, not a service split** — one application still owns both |
| **Separate content management system** | Content is central | FEAT-030–037 build the administrative surface directly. A second system would duplicate the domain model |
| **Notification platform** | Users are informed of term end | Transactional message delivery covers it. A platform implies campaigns and preferences nothing requires |
| **Speech-to-text integration** | The product name suggests voice fits naturally | FEAT-014 excluded from launch (`05-MVP §11`). Typed input is the only route |
| **Separate localisation platform** | The product now supports multiple languages | FEAT-039 is content variation in the existing database with fallback logic. A dedicated translation-management platform is not required for admin-added languages at launch scale |

**On restraint.** The launch scope is large, and that makes it easier for components to arrive unexamined. Each item above would be defensible in a mature product; none is required by the 44 features.

---

# 17. Architecture Rationale

## 17.1 The simplest architecture that delivers the MVP

**A conventional two-surface application with per-request authorization, backed by two stores split by sensitivity, calling three external services, none of which the core journey depends on.**

Ten components (§14).

## 17.2 What drives each requirement

| Requirement | Driven by |
|---|---|
| Application logic on the content path | FEAT-022 makes prompt delivery a per-user decision; FEAT-037 makes content change without a release. Either alone would suffice |
| Public database | FEAT-030–037 write catalog content at runtime, read by every visitor unauthenticated |
| Private database, separated from it | The prompt text is the paid product (`P-§11.1`); identity and money must never share a credential with public catalog content (§5.0) |
| An API boundary | Two clients, plus inbound payment confirmation |
| Authentication | The paywall is an identity-dependent decision |
| AI capability | FEAT-013 cannot be met by rules over unbounded natural language |
| Object storage | Runtime media uploads |
| Event and cost capture | `05-MVP §10` requires both product and commercial outcomes |
| Search/filter query support | FR-003–005; satisfied by indexed queries in the existing database and application logic, not a new component |
| Language content resolution with fallback | FR-046; a content variation in the existing database, resolved by application logic |

## 17.3 What was excluded and why it was possible

| Because `05-MVP` excluded… | These stayed out |
|---|---|
| Voice input for customization (FEAT-014) | A speech-to-text integration, an audio upload path, and audio deletion logic (§7.2, §9.2) |
| Manual prompt editing (FEAT-012) | Additional editable state on delivered prompts |
| Tool availability monitoring (FEAT-019) | Scheduled background processing |

**Search, filtering, model filtering, saved templates and language management are included at launch, and none of them required a new component.** Each is satisfied by capability already present in one of the two databases and application logic: search and filtering are indexed queries on the public database, saved templates are a user-to-template relation in the private database, and language content is a variation on existing public-database rows with a fallback rule. This is the same "no architecture theatre" principle working in the opposite direction — a feature being in scope does not by itself justify new infrastructure.

And independent of scope: **agents, integration with creative AI tools, and vector storage were never required**, because the product recommends tools rather than calling them, and customization operates on a prompt supplied in the request.

## 17.4 Security consequences of this scope

Four things the previous scope did not have, each now load-bearing:

| Concern | Requirement |
|---|---|
| **Prompt text disclosure** | The access decision in one place, called by every path that could return prompt text — including anything rendered for search engines. NFR-002 requires the text not be transmitted at all, not merely hidden |
| **Allowance integrity** | Money. Every change accounted for; concurrent requests must not consume more units than customizations produced (NFR-006) |
| **Payment confirmation** | Received from the provider, verified, and idempotent. Never granted on the basis of a browser round-trip |
| **User text reaching an external model** | Passed as data, clearly separated from instruction, with output validated before display. **No requirement in `03-REQUIREMENTS.md` covers this** — it should be added |
| **Cross-database publish ordering** | Insert into the private database before updating the public pointer (§5.4). Reversed order can leave a public template pointing at a version that does not exist |

## 17.5 Assumptions influencing these decisions

| # | Assumption | If wrong |
|---|---|---|
| A1 | Launch serves one category and a small user base | Caching, a reporting store and background processing move from optional to required |
| A2 | Customization latency is acceptable within the user's request | Asynchronous handling and a queue become necessary |
| A3 | Reporting is readable from the operational store | A separate store or rollups become necessary |
| A4 | Administrators are few and trusted | Finer-grained administrative roles become necessary |
| A5 | One deployable unit is sufficient | Nothing in the 44 features contradicts this |
| A6 | A 20–30 template catalog needs no dedicated search engine — indexed database queries are sufficient | A dedicated search engine becomes necessary as the catalog grows well beyond launch size |
| A7 | The number of languages added at launch is small enough that per-language content variation fits the existing model without redesign | A large number of languages, or scripts requiring right-to-left layout, may need a more structured localisation approach |

## 17.6 What would change these decisions

1. **Catalog and traffic growth** → a dedicated search engine, caching, a reporting store, read scaling
2. **Tool availability monitoring** (FEAT-019) → the first genuine scheduled work
3. **Voice input** (FEAT-014) → a speech-to-text integration, an audio upload path, and audio deletion logic
4. **Team accounts** → a second dimension in authorization
5. **Direct execution on external tools** → real integration, and the product boundary changes

---

# 18. Requirement-to-Architecture Traceability

| Requirement | Feature | MVP capability | Required component |
|---|---|---|---|
| FR-001, FR-002 | FEAT-001, 002 | Browse and navigate | Public surface; public database |
| FR-006 | FEAT-006 | Understand what AWA does | Public surface |
| FR-007, FR-009 | FEAT-007 | Proceed when nothing fits; record the need | Public surface; API; public database (read); private database (unmet-need record) |
| FR-008 | FEAT-008 | Judge and select a template | Public surface; public database; object storage |
| FR-011 | FEAT-010 | Receive the prompt | Application logic; public database (metadata); **private database (prompt text)**; authorization |
| FR-012 | FEAT-011 | Take the prompt away | Public surface |
| FR-003, FR-004, FR-005 | FEAT-003, 004, 005 | Search, filter, filter by AI model | Public surface; application logic; public database |
| FR-010 | FEAT-009 | Save a template to a collection | Public surface; application logic; private database; authentication |
| FR-015 | FEAT-013 | Adapt the prompt in your own words | Application logic; private database; external AI service |
| FR-017, FR-018 | FEAT-015 | Failure costs nothing | Application logic; private database |
| FR-019, FR-020 | FEAT-016, 017 | Tool recommendations and departure | Application logic; public database |
| FR-023 | FEAT-020 | Usage guidance | Application logic; public database |
| FR-025, FR-026 | FEAT-021, 022 | Free tier; paywall | Authorization; application logic; **the public/private split is the structural expression of this requirement** |
| FR-027, FR-028 | FEAT-023, 024 | Terms stated; end-of-term behaviour | Application logic; private database; message delivery |
| FR-029 | FEAT-025 | One active session | Authentication; private database |
| FR-030–034 | FEAT-026, 027 | Allowance and purchase | Application logic; private database; payment provider |
| FR-035, FR-036 | FEAT-028, 029 | Feedback and demand signal | API; private database |
| FR-037–044 | FEAT-030–037 | Content management and live publishing | Administrative surface; application logic; **both databases (§5.4's two-step publish)**; object storage |
| FR-045 | FEAT-038 | Content gaps | Application logic; public database (content) and private database (unmet needs, feedback) |
| FR-047, FR-048 | FEAT-040, 041 | User management and support adjustments | Administrative surface; authorization; private database |
| FR-049 | FEAT-042 | Payment configuration | Payment provider; application logic; private database |
| FR-046 | FEAT-039 | Add a language; select it on the frontend; fall back when untranslated | Administrative surface; public surface; application logic; public database |
| FR-050, FR-051 | FEAT-043, 044 | Expenditure control and reporting | Application logic; private database; monitoring |
| NFR-001 | FEAT-045 | Core journey survives AI unavailability | Application logic |
| NFR-002 | FEAT-022 | Prompt text reaches only entitled users | Authorization; application logic; **enforced structurally by keeping prompt text out of the public database entirely** |
| NFR-003, NFR-004 | FEAT-047 | User content handling | Application logic; private database |
| NFR-006 | FEAT-026 | Allowance integrity | Private database; application logic |
| NFR-012 | FEAT-046 | Input preserved through interruption | Public surface |
| — | `05-MVP §10` | Establish product and commercial outcomes | Event and cost capture; private database; monitoring |

---

# 19. Architecture Risks and Unknowns

| # | Item | Classification | Effect on architecture |
|---|---|---|---|
| 1 | **Cost per customization** | **Unknown** (`P-§18`) | Sets the credit pack prices and the expenditure cap value — both **REQUIRES PRODUCT DECISION** per `05-MVP §3.4`. The rate limit is already decided at 20 per user per hour (`05-MVP §3.3`) and does not wait on this |
| 2 | User volume at launch | **Unknown** | Assumed small. A1 in §17.5. Caching, a reporting store and background processing all depend on it |
| 3 | Customization latency | **Unknown** | If it exceeds what a user will wait for, asynchronous handling and a queue become required (A2) |
| 4 | Failure and unusable-request rate | **Unknown** | A direct cost line, not just a quality metric. Determines how much monitoring matters |
| 5 | Cap behaviour when a subscriber holds allowance | **Decided** (`05-MVP §3.3`) | Customization pauses for everyone; prompt access is unaffected; administrators are notified before the limit binds |
| 6 | End-of-term behaviour | **Decided** (`05-MVP §3.3`) | Prompts already delivered remain readable; no new deliveries or customizations after the term ends |
| 7 | Number of administrators | **Assumption** | Assumed few and trusted. Finer-grained roles would extend authorization |
| 8 | Retention period for user content | **Decided: 12 months** (`05-MVP §3.3`, `NFR-003`) | Determines whether a deletion capability is needed once 12 months has elapsed for any given record |
| 9 | External tools remain reachable and behave as documented | **Known risk** (`UR-§11.4`) | No architecture addresses it. FEAT-019 excluded; checked by hand at launch |
| 10 | AWA cannot observe the external output | **Known** | An architectural fact, not a gap. Why feedback is self-reported |
| 11 | Content authoring capacity | **Unknown** (`UR-§2.6`) | Not an architecture problem, but it determines how fast the catalog grows and therefore when A1 and A6 fail |
| 12 | No requirement covers prompt injection | **Known gap** | Should be added to `03-REQUIREMENTS.md`. The handling is defined in §17.4 regardless |
| 13 | **Whether the AI model filter (FEAT-005) is used**, given `UR-§5.3` is unanswered | **Unknown** | Built ahead of the usage data that would justify it (`05-MVP` R16). If unused, the architecture cost was front-loaded rather than wasted — the query pattern is a filter clause, not separate infrastructure |
| 14 | Number and script complexity of languages added post-launch | **Unknown** | Determines whether A7 holds. A large number of languages, or right-to-left scripts, may require restructuring the content model beyond simple per-field variation |
| 15 | **The public/private database split introduces cross-database references with no enforced constraint** | **Known, accepted risk** | `§5.3` — identifiers must be kept consistent by discipline, the same way `07 §22` already requires for content references. A verification check between the two stores is worth having before launch |
| 16 | **A publish or reversion interrupted between its two steps** | **Known, mitigated** | `§5.4` — the order is chosen so an interruption always leaves the public template pointing at a valid, if outdated, version. Never at a version that does not exist |

**No unknown above is resolved by adding architecture.** Each is recorded so the decision to proceed is visible.

# 20. Future Considerations

Not part of the launch architecture.

| Trigger | Components that become relevant |
|---|---|
| **Catalog and traffic growth** | A dedicated search engine, caching, a reporting store, read scaling |
| **Voice input** (FEAT-014) | A speech-to-text integration, an audio upload path, and audio deletion logic (NFR-004) |
| **Tool availability monitoring** (FEAT-019) | Scheduled background processing — the first real justification |
| **Team accounts** | A second dimension in authorization, and shared ownership of content |
| **Direct execution on external tools** | Real integration, credential handling per tool, and a changed product boundary |
| **Automatic feedback-driven re-ranking** (`OD-38`) | A derived data path, and possibly the first genuine use of accumulated data |
| **Additional payment providers or regions** | A provider abstraction, and currency handling |
| **A large number of languages, or right-to-left scripts** | A more structured localisation model than simple per-field content variation |

---

# 21. Architecture Decision Summary

| Component | MVP decision |
|---|---|
| UI — public | **REQUIRED** |
| UI — administrative | **REQUIRED** |
| Application logic | **REQUIRED** |
| API boundary | **REQUIRED** |
| Public database | **REQUIRED** |
| Private database | **REQUIRED** |
| Object storage | **REQUIRED** |
| Authentication | **REQUIRED** |
| Authorization | **REQUIRED** |
| AI — text transformation | **REQUIRED** |
| AI — speech to text | **NOT REQUIRED** — FEAT-014 excluded from launch |
| Agents | **NOT REQUIRED** |
| External integration — payment | **REQUIRED** |
| External integration — creative AI tools | **NOT REQUIRED** |
| Transactional message delivery | **REQUIRED** |
| Event and cost capture | **REQUIRED** |
| Monitoring and logging | **REQUIRED** |
| Remote accessibility | **REQUIRED** |
| Background processing | **OPTIONAL** |
| Caching | **NOT REQUIRED** |
| Search, filter, model filter — **as a capability** | **REQUIRED** — met by the public database and application logic, not a new component |
| Search — **as a dedicated engine** | **NOT REQUIRED** at launch volume |
| Language content variation | **REQUIRED as data** — no separate localisation component |
| Saved templates / collections | **REQUIRED as data** — no separate component |
| Message queue | **NOT REQUIRED** |
| Vector storage | **NOT REQUIRED** |
| Microservices | **NOT REQUIRED** |
| Separate reporting store | **NOT REQUIRED** |

### Minimum architecture

1. **Public surface** — browse, select, purchase, read, customize, copy, depart, report
2. **Administrative surface** — author and publish content, manage users, read reports
3. **API boundary** — authorization on every request, validation, inbound payment confirmation
4. **Application logic** — access decisions, allowance accounting, expenditure control, customization orchestration, publishing, audit
5. **Public database** — category tree, template metadata, tool and model registry, guidance, language content
6. **Private database** — **the prompt text**, users, sessions, commerce, allowance, delivered prompts, evidence, audit
7. **Object storage** — administrator-uploaded media
8. **Authentication and authorization** — identity, session limitation, three access states
9. **External services** — AI transformation, payment, message delivery
10. **Remote accessibility**

### Deliberately excluded

Agents · integration with external creative AI tools · speech-to-text integration · vector storage · message queue · scheduled background work · caching · a dedicated search engine · microservices · a separate content management system · a notification platform · a separate reporting store · a separate localisation platform · **direct client access to either database.**

### Key assumptions

1. Launch serves one category and a small user base
2. Customization latency is acceptable within the user's request
3. Reporting is readable from the operational store
4. Administrators are few and trusted
5. One deployable unit is sufficient
6. A 20–30 template catalog needs no dedicated search engine
7. The number of languages added at launch fits the existing content model without redesign
8. The database split is a sensitivity boundary, not a scale boundary — one application server, two credentials
9. Publishing and reverting a prompt tolerates the two-step order in §5.4 without needing a cross-database transaction

### Critical unknowns

1. **Cost per customization** — sets the credit prices and the expenditure cap value (both **REQUIRES PRODUCT DECISION**, `05-MVP §3.4`)
2. **Customization latency** — determines whether the call can stay synchronous
3. **User volume at launch** — determines when caching, a reporting store and background work arrive
4. **Failure and unusable-request rate** — a cost line as much as a quality metric
5. **Whether identifiers stay consistent across the two databases with no enforced constraint** — a discipline risk, not a technology one (§5.3)

### Future considerations

§20. In likely order: catalog and traffic growth · voice input · tool availability monitoring · team accounts · direct execution on external tools.

---

## Closing note

Ten components for a forty-four-feature launch scope. The database split in two; everything else unchanged.

Four decisions carry the most weight.

**Prompt text lives in the private database, and nowhere else.** Not cached, not concealed in a response, not sitting in the public store behind a client-side blur. NFR-002 requires the text be absent from an unentitled response entirely, and the split now enforces that structurally: the public database cannot leak what it never contains, regardless of what the application layer does or fails to do.

**Neither database is ever reached directly by a client.** The split is a blast-radius decision, not a new access pattern. `13-SECURITY.md`'s governing rule — the paywall is application code, not database security — applies identically to both stores, and a direct-access shortcut to either would undo the reason the split exists.

**The AI is an extra, never a dependency.** The paid entitlement is prompt access, which requires no AI. When the capability is unavailable or over budget, browsing, prompt delivery, recommendations and guidance all continue. An outage at an outside company must not withhold what customers have paid for.

**One operation touches both databases, and it is ordered to fail safe.** Publishing or reverting a prompt writes to the private database first and the public pointer second. Interrupted between the two steps, a template is left pointing at an old but valid version — never at one that does not exist. This is the sole cross-database transaction concern in the entire architecture; everything else, including allowance hold/consume/release, stays within a single store.