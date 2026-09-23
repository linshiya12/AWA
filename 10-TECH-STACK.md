# 10 — Technology Stack

**Product:** AWA — AI Creation Guide Platform
**Sources:** `docs/01-PROBLEM.md` … `docs/09-AI-DESIGN.md`
**Status:** Revised for the 44-feature launch scope, including the technology decision for the public/private database split that `06 §5` deferred to this document

> Free-tier terms and pricing change. Everything in the Cost sections needs verifying at the point of use.

---

# Final Stack

| Component (`06 §14`) | Choice |
|---|---|
| Public surface + admin surface + API | **Next.js** (App Router) |
| Application logic | **Next.js server code** — route handlers and server actions |
| **Public database** | **Supabase Postgres — a dedicated project** |
| **Private database** | **Supabase Postgres — a second, separate project** |
| Data access | **Prisma — two schemas, two generated clients, one per database** |
| Authentication | **Supabase Auth, in the private project** |
| Object storage | **Cloudflare R2** |
| AI text transformation | **Anthropic Claude** (Haiku-class) |
| Payment | **Razorpay** |
| Transactional email | **Resend** |
| Hosting | **Vercel** |
| Error monitoring | **Sentry** |

**Nine vendor relationships, one deployable — Supabase appears twice as two separate projects, not as a second vendor.** `06 §14` lists ten components; Next.js covers four of them, Supabase covers three (public database, private database, authentication), and the remaining three each need one external service. **OpenAI Whisper no longer appears.** FEAT-014 (voice input) is excluded from the 44-feature launch scope (`05-MVP §3.2`), and with it goes the only reason speech-to-text was in this stack.

---

# 1. Why Next.js Now

The previous scope had no backend, no API and no authentication, and a server framework would have been weight with nothing to carry. **That is no longer true.**

| What the scope now requires | `06 §` |
|---|---|
| Per-request authorization on prompt delivery | §4 |
| An API boundary with two clients | §6 |
| Application logic — allowance, spend cap, customization orchestration, search and filter resolution, language fallback | §4.1 |
| Content that changes at runtime, across two databases | §5 |
| Inbound payment webhooks | §9 |

Next.js provides all of it in one deployable: server-rendered public pages for the catalog, a separate admin surface, route handlers for the API, and server-side session checks before anything renders.

**One property matters more than the rest.** `NFR-002` requires prompt text to be *absent* from an unentitled response, not concealed in it. Server components let the entitlement check run before the markup is built, so the text is never in the payload. **The public/private database split now enforces the same property one level down** — the public project's connection does not even have a route to the table containing prompt text, so there is no query, however mistaken, that could return it from that side. A client-fetch architecture makes the first guarantee harder to keep and does nothing for the second.

## Alternatives

| Alternative | Why not |
|---|---|
| **Remix** | Equally capable and a fair choice. Next.js wins on hiring, ecosystem and Vercel integration — thin reasons, but nothing here favours Remix specifically |
| **Separate SPA + standalone API** | Two deployables, two auth paths, CORS, and a client that must be trusted not to request prompt text it cannot have. More moving parts for no gain at this scale |
| **Astro** | Correct for the previous static scope, wrong now. Its strength is shipping no server; this product is mostly server |

**Complexity:** setup Low · development Medium · deployment Very Low
**Cost:** free (open source)

---

# 2. Supabase — Two Projects, One Vendor

`07 §0` defines 29 entities split by sensitivity — 11 public, 18 private — and `06 §5` requires that split to hold at the level of the database itself, not just in application logic. **This section makes the technology decision `06 §5` explicitly deferred: how two databases are actually implemented.**

## 2.1 The decision: two separate Supabase projects

**Chosen: two independent Supabase projects — one for the public database, one for the private database — each with its own connection string, its own API keys, and its own credentials.**

| Alternative considered | Why rejected |
|---|---|
| **One Postgres instance, two schemas, separated by database role** | The weaker isolation of the two. A single instance still has one superuser credential capable of reaching both schemas — required for migrations and backups — and a role-based boundary can fail through a missing `REVOKE`, a search-path misconfiguration, or a role granted more than intended. `06 §5.0`'s stated reason for the split is blast radius: a leaked public credential should expose nothing more than catalog content. A shared instance keeps that promise only as strongly as its role configuration, checked continuously; two projects keep it by the credentials simply not existing in the same place |
| **Two different providers entirely** | Would isolate further — different vendor, different outage domain, different attack surface — but `06 §17.5` A4 and A5 already assume a small team and one deployable unit, and this stack is already at nine vendor relationships. Two providers doing the same job adds a second dashboard, a second migration tool, and a second set of operational knowledge to maintain, for a security gain that two same-vendor projects already deliver. This is exactly the "architecture theatre" `06 §1` warns against — added complexity beyond what the stated reason requires |
| **One project, one schema, row-level security only** | This is the model the previous (pre-split) revision of this document used. `06 §5` replaced it specifically because RLS is enforced by the same instance the data lives in, and `13-SECURITY.md §6.1`'s governing rule — the paywall is application code, not database security — argues for the credential boundary living outside the database's own policy engine, not inside it |

**Two full Supabase projects is the one option that makes `06 §5.0`'s blast-radius reasoning literally true**, not just procedurally enforced: a leaked public-project key cannot reach the private project, because there is no network path, no shared credential, and no shared instance between them.

## 2.2 Public project — Postgres only

Holds the 11 public entities (`07 §18.1`): `category`, `template`, `template_attribute`, `ai_tool`, `ai_model`, `tool_assignment`, `guidance`, `guidance_step`, `media_asset`, `language`, `translation`.

**No Supabase Auth here.** Nothing in the public database requires knowing who is asking (`06 §5.1`), so there is no identity to authenticate.

| Need | Why Postgres |
|---|---|
| A self-referencing category tree of unlimited depth | Recursive CTEs, or a materialised path column |
| Template attribute filtering (FEAT-004) and search (FEAT-003) | Indexed queries — `06 §13` is explicit that a 20–30 template catalog needs no dedicated search engine |
| Content translations with fallback (FEAT-039) | A straightforward indexed lookup on `(language_id, entity_type, entity_id, field_name)` |
| Tool and guidance inheritance | Ordinary relational queries up an ancestor chain |

## 2.3 Private project — Postgres and Auth together

Holds the 18 private entities: the prompt itself (`template_version`), `user`, `session`, `plan`, `credit_pack`, `subscription`, `payment_transaction`, `payment_configuration`, `delivered_prompt`, `customization_attempt`, `allowance_ledger`, `spend_period`, `feedback`, `unmet_need`, `interaction_event`, `audit_log`, `collection`, `collection_template`.

| Need | Why Postgres |
|---|---|
| Append-only prompt versions with exactly one current | Partial unique index — `template_version.is_current` |
| **Allowance hold → consume or release** | **Transactions.** `07 §17` V7 — two concurrent requests must not spend one unit |
| Payment idempotency | Unique constraint on the provider reference |
| One active session, one active subscription per user | Partial unique indexes |

**Auth belongs here, not split out or duplicated, because identity is a private-database concept.** FEAT-025 (one active session) is built on top of it — the account record holds the current session reference and the application rejects any other (`07 §5.3`).

## 2.4 What crosses between the two projects, and how

`07 §8.1` names six soft references that cross the database boundary — one public-to-private (`template.current_version_id`), five private-to-public. **None of them is a database-level foreign key, because Postgres cannot enforce a constraint across two separate instances.** Every one is resolved by the application layer making a second query to the other project.

**The one operation that writes to both** is publishing or reverting a prompt (`06 §5.4`, `07` V17): insert into the private project first, then update the public project's pointer. This is two separate Prisma calls against two separate clients, in that order, inside the same route handler — not a single database transaction, because no single transaction can span two Postgres instances. If the second call fails after the first succeeds, the public template is left pointing at its previous, still-valid version, which is the fail-safe outcome `07` V17 requires.

**The recommended mitigation for `07 §22` item 10 (identifier drift with no engine-level safeguard):** a scheduled check — a Vercel Cron job invoking a route handler on a low-frequency schedule — that walks the six cross-project references and confirms every one still resolves. `06 §12` leaves background processing **OPTIONAL** rather than excluding it; this is the first concrete candidate for that slot, and the only one this document recommends building before launch rather than waiting for volume to justify it.

## 2.5 Alternatives to Supabase itself

| Alternative | Why not |
|---|---|
| **Neon / RDS + separate auth** | Two vendors instead of one, twice over — the public/private split already introduces two projects; adding a second vendor on top compounds the operational surface for no stated benefit |
| **Firebase** | Document model fights `07`'s relational needs — versions, trees, ledger integrity — independent of the split |
| **PlanetScale** | No foreign keys by default, which removes half of `07 §17`'s enforcement within each database, even before the cross-database question arises |

**Complexity:** setup Low-Medium — two projects to provision instead of one, each following the same well-worn Supabase setup · development Low · deployment None
**Cost:** two free tiers likely sufficient at launch, verified independently. **Verify:** row limits, storage limits, and the inactivity/pause policy for *both* projects — a paused project mid-launch, public or private, stops the product.

**Risk:** row-level security must be correct **within each project**, and the two are now smaller, more homogeneous stores than a single combined one — arguably easier to audit, not harder. Users read only their own subscription, allowance and delivered prompts (`07 §9.1`), entirely within the private project. Test a cross-user read before launch rather than assuming defaults.

---
# 3. Cloudflare R2 — Object Storage

Covers `06 §14` item 7 — administrator-uploaded media.

## Why

| Reason | Detail |
|---|---|
| **No egress charges** | The deciding factor. FEAT-036 supports recorded guidance, and video is the one asset class where bandwidth cost grows with success rather than with storage |
| S3-compatible | Standard tooling; presigned uploads and time-limited read URLs work as expected |
| Private by default, made public deliberately | `07 §4.7` holds only a reference in `media_asset` (public database); the file itself is reached through a signed URL issued by server code |
| Separates media from the databases | Both Supabase projects are sized for rows, not video. Media growth stops competing with data growth in either one |

## What it holds

**Everything here is public-readable content, and nothing here is sensitive.** The previous revision of this document held private, transcription-bound audio in this bucket; **that content no longer exists at all**, since FEAT-014 is excluded (`05-MVP §3.2`) and nothing in the current scope ever records audio (`07 §11`).

| Content | Visibility |
|---|---|
| Template preview images (FEAT-031) | Public-readable via a CDN domain, content-hashed keys |
| Recorded guidance (FEAT-036) | Public-readable |
| Tool logos | Public-readable |

## Upload flow

```
Administrator requests an upload
   → server validates purpose, type and size, issues a presigned URL
   → browser uploads directly to R2          (bytes never pass through Vercel)
   → server confirms, verifies the actual type, records media_asset (public database)
```

Direct upload matters because recorded guidance can be large, and serverless functions have request-size and duration limits that a video upload would breach.

## Alternatives

| Alternative | Why not |
|---|---|
| **Supabase Storage** | Would live inside the public project regardless, since everything stored is public content — genuinely competitive here, since there is no longer a private-audio case forcing a separate vendor. Rejected on egress: bandwidth is billed, and recorded guidance is the asset most likely to grow. For an image-only launch it would be the better choice |
| **AWS S3** | Functionally equivalent; egress charges are the thing R2 removes |
| **Serving media from the app** | Breaks on video, and puts bandwidth through the hosting bill |

**Complexity:** setup Low · development Low — presigned uploads are a well-worn pattern · deployment None
**Cost:** storage per GB, **no egress charges**. Free tier likely sufficient at launch; verify current limits.

**Risks**

| Risk | Handling |
|---|---|
| An additional vendor beyond the two Supabase projects | Accepted. The egress saving is the reason; if recorded guidance is dropped from launch, revisit and fold storage into the public Supabase project |
| Orphaned objects after a template is deleted | Content is hidden rather than deleted (`07 §9`), so objects persist deliberately. A periodic reconciliation is a later concern, not a launch one |

---

# 4. Prisma

Typed queries and migrations over Postgres — **now two schemas and two generated clients, one per database.**

| Why | Detail |
|---|---|
| 29 entities across two databases with real relationships within each | Typed access reduces the class of error that silently returns the wrong user's row |
| Migrations under version control | Content and commerce schema will change, independently, in two projects |
| Transactions | The allowance hold-and-resolve sequence (`07 §17` V7) — within the private client only, since that transaction never touches the public database |

**The split's concrete cost here:** two `schema.prisma` files, two generated clients (`@prisma/client/public`, `@prisma/client/private`, or an equivalent naming convention), and two migration histories to keep in step with which entities `07 §18.1` assigns to which side. **No cross-client relation exists in either schema** — the six references named in `07 §8.1` are plain scalar fields (an id stored as text or uuid), resolved with a second query against the other client, never a Prisma `relation`.

**Alternative: Drizzle** — lighter, closer to SQL, genuinely good, and its lack of an opinionated relation layer arguably fits a two-database setup more naturally, since there is no temptation to declare a relation Prisma cannot actually enforce. Prisma is still chosen for documentation and hiring, which matter more than query ergonomics here. This settles `decisions.md` T-1.

**Complexity:** Low-Medium — the two-client pattern is unfamiliar the first time, mechanical after · **Cost:** free

**Note:** use a connection pooler for both projects. Serverless functions open connections per invocation, and Postgres will run out — now twice over, once per project.

---

# 5. Anthropic Claude — Text Transformation

Powers FEAT-013. `09 §1` places this at **AI Model** level: one call, text in, text out. **The only AI capability in the launch scope** — FEAT-014 (speech to text) is excluded (`05-MVP §3.2`), so there is no second model in this stack.

## Why

| Criterion | Fit |
|---|---|
| Instruction-following on a constrained rewrite | The task is "apply this change, preserve everything else" — narrow, and the main failure mode is over-editing |
| Not shortening the prompt | `decisions.md` P-2 recommends preserving technical detail. Long-form instruction adherence matters more than creativity. **Still a recommendation, not a settled requirement** (`09 §4.5`) |
| A small, fast tier is likely enough | Haiku-class. `09 §4.1` says measure rather than assume |

## Alternatives

**OpenAI GPT-mini-class** is equally viable for this task, and so are several others. **The measurement decides, not the brand.** Run the same twenty real prompts and real user phrasings through the candidates, compare outputs and cost, and switch if the numbers say so.

**This is why the AI call must sit behind a thin internal interface.** Swapping providers should be a day's work, not a rewrite. That matters because `P-§18` records the cost per request as unknown and it is the binding constraint on the whole business model — **credit prices and the expenditure cap value both wait on this measurement and are REQUIRES PRODUCT DECISION until it exists** (`05-MVP §3.4`).

**Complexity:** integration Low · **Cost:** usage-based, **unknown until measured** (`09` U1)

**Risks**

| Risk | Handling |
|---|---|
| Cost higher than credit pricing supports | Measure before pricing. Spend cap enforced before every call (`08` API-004) |
| Latency exceeds what a user will wait | `06 §17.5` A2. If so, API-004 becomes accepted-then-poll |
| Prompt injection | User text passed as data, delimited; output validated (`09 §4.4`, `§4.5`) |
| Silent model change breaks quality comparison | `customization_attempt.service_reference` records provider and version — private database (`07 §6.2`) |

---
# 6. Speech to Text — Not in This Stack

**No vendor is chosen here.** FEAT-014 is excluded from the 44-feature launch scope (`05-MVP §3.2`), and the previous revision of this document chose OpenAI Whisper for it. `09 §3` retains the fuller analysis — cost, accuracy risk, privacy handling — framed as what would apply if the feature returns; this section does not repeat it.

**If FEAT-014 is reintroduced, this is where a provider decision would be made again**, most likely between OpenAI Whisper and Deepgram, decided by the same kind of accent-accuracy test on real users that `09 §3` describes, not by a datasheet comparison.

---

# 7. Razorpay — Payment

Plans and credit packs, INR, Indian market. **Specific prices remain REQUIRES PRODUCT DECISION** (`05-MVP §3.4`) pending the cost-per-customization measurement (§5 above) — nothing in this stack sets them, and none should be configured into Razorpay before that figure exists.

**Why:** UPI, cards and netbanking in one integration; the default choice for INR collection.

**Alternatives:** Stripe — better developer experience, weaker UPI support, and INR collection is more involved. Worth adding later if AWA sells outside India.

**What matters in the integration**

| Requirement | Handling |
|---|---|
| Entitlement granted by the webhook, not the browser | `08` API-010 |
| Idempotency | Unique constraint on the provider reference — private database (`07 §5.6`) |
| Signature verification on every webhook | Non-negotiable |
| Credentials write-only | NFR-005; stored encrypted, never returned — private database (`07 §5.7`) |
| No card data touches AWA | Provider-hosted checkout |

**Complexity:** setup Medium — KYC and account activation take time. **Start this early; it is the longest lead item in the stack.**
**Cost:** per-transaction percentage. Verify current rates.

---

# 8. Resend — Transactional Email

Two uses: password reset (FEAT-040) and the end-of-term notice (FEAT-024).

**Why:** simple API, good deliverability, minimal setup.

**Note:** Supabase Auth (in the private project) sends its own auth emails, so Resend is strictly needed only for the term-end notice. **It is the one technology here that could be deferred** — if the term-end notice ships in-app first, Resend arrives shortly after rather than before it. FEAT-024 requires the user be informed *before* loss, and in-app alone does not reach someone who is not visiting, so it should not be deferred far.

**Complexity:** Very Low · **Cost:** free tier likely sufficient

---

# 9. Vercel — Hosting

**Why:** native Next.js support, preview deployments per branch, environment management, zero-configuration serverless functions for the API routes, and **Vercel Cron** for the cross-database consistency check recommended in §2.4 — no additional scheduling vendor needed for that.

**Alternatives:** Cloudflare Pages + Workers (more configuration for a Next.js server app) · Railway or Fly.io (a long-running server, which removes the connection-pooling concern but adds ops, now doubled across two database connections). Vercel is chosen for speed of setup, which is the scarce resource here.

**Complexity:** Very Low · **Cost:** free tier likely sufficient at launch. Verify function execution limits against customization latency, and against a route handler that must query both Supabase projects in sequence (API-003, `08`).

**Risk:** serverless function timeouts. An AI call could approach the limit on its own; a request that also resolves a cross-database reference adds a second round-trip before it. Check the ceiling against measured latency (`09` U4) before committing.

---

# 10. Sentry — Error Monitoring

`06 §13` marks monitoring REQUIRED because money is live and an external paid capability sits in the request path.

**The specific thing it must catch:** a customization failing repeatedly while still consuming budget. `09 §4.3` records that failures cost money and earn nothing — without monitoring, that appears as a quiet invoice rather than an alert. **A second thing worth alerting on now:** a failure in the two-step publish write (§2.4) — the case where the private version is written but the public pointer update fails. It is not data loss (`07` V17 makes it fail safe), but it is a publish that silently did not take effect, and an administrator should be told.

**Complexity:** Very Low · **Cost:** free tier likely sufficient

---
# 11. Coherence Check

| Boundary | Status |
|---|---|
| Next.js ↔ Supabase (public project) | First-class support, server-side client, no session required |
| Next.js ↔ Supabase (private project) | First-class support, server-side session helpers |
| Next.js ↔ Cloudflare R2 | S3-compatible client from route handlers. **Presigned uploads — bytes never pass through Vercel** |
| Prisma ↔ each Supabase Postgres | Standard. **Use the pooled connection string, for both projects** |
| Next.js ↔ Anthropic | Plain HTTPS from route handlers, behind one internal interface — **the only external AI call in this stack** |
| Next.js ↔ Razorpay | Checkout from the client; **webhook to a route handler with raw-body signature verification** — Next.js needs body parsing disabled on that route |
| Auth ↔ single session | Supabase Auth (private project) issues the session; the application enforces one-active (`07 §5.3`) |
| Public project ↔ private project | **No direct connection between them.** Every cross-reference (`07 §8.1`) is resolved by the application layer issuing a second query, never by one database reaching into the other |
| Vercel ↔ Next.js | Native |
| Vercel Cron ↔ cross-database consistency check | New this revision — §2.4 |
| Local development | Two local Supabase stacks, or two hosted dev projects. Both workable, doubling local setup time versus the single-project era |

**No technology was added to solve a minor inconvenience.** Where a chosen tool could cover a responsibility, it does — Next.js covers four components, Supabase covers three. **Two Supabase projects is a deliberate exception to "fewer moving parts,"** made because `06 §5`'s blast-radius requirement cannot be met any more simply than this without weakening it.

---

# 12. Boundary Check

| Excluded | Confirmed absent |
|---|---|
| Calling Midjourney, Runway or any creative AI tool | `06 §9.3` — a link, not an integration |
| Agent framework, orchestration, planning | `09 §2` — one transformation |
| Vector database, embeddings | Nothing requires retrieval |
| Message queue, background worker, scheduler beyond one Cron check | `06 §12` — background processing is OPTIONAL, and §2.4's consistency check is the one candidate this document recommends taking up |
| **A dedicated search engine or index** | **FEAT-003–005 are included in the 44-feature scope, but they run as indexed queries against the public database — `06 §13` is explicit that no dedicated engine is required at this catalog size.** The previous revision of this table incorrectly listed search as excluded by scope; it is included by scope and excluded only as infrastructure |
| Speech-to-text vendor | FEAT-014 excluded (`05-MVP §3.2`) — §6 |
| Separate CMS | The admin surface is the CMS (FEAT-030–037) |
| Caching layer | `06 §13` — small volume, and it works against live publishing |
| Analytics platform | Events go to the private database via `POST /events` (`08` API-007) |
| A localisation/translation-management platform | `07 §4.9` — content translations are rows in the public database with a fallback rule, not a separate service |

---

# 13. Four Things That Must Demonstrably Work

**Prompt text never reaches an unentitled response.** Check the entitlement in server code before rendering, and verify by inspecting the network payload as a signed-out visitor. NFR-002 is about the payload, not the pixels. **Now reinforced structurally** — the public project's own connection has no path to the table containing prompt text, so this is not solely an application-logic guarantee any more.

**The webhook grants entitlement, and only once.** Signature verified, raw body preserved, unique constraint on the provider reference. Test a replayed webhook before launch.

**Allowance holds and releases correctly under concurrency.** Two simultaneous customize requests must not consume two units for one result. This is a transaction plus the idempotency key (`08` API-004), entirely within the private project, and it is the one place a race costs a customer money.

**A publish or reversion that fails between its two steps leaves the catalog in a valid state.** Write the private version, then update the public pointer (§2.4, `06 §5.4`). Test an interrupted publish before launch — kill the process between the two writes and confirm the public template still resolves to its previous, working version rather than a broken reference.

---

# 14. Fact · Assumption · Unknown

**Fact** — traceable to `01–09`
Next.js is justified by the API, authorization and server-logic requirements in `06 §4`, `§6`. Postgres is justified by `07`'s relational and transactional needs, within each of the two databases `06 §5` requires. The AI sits at AI Model level (`09 §1`), and it is the only AI capability in scope — FEAT-014 is excluded. Payment entitlement comes from the webhook (`08` API-010).

**Assumption**
Two Supabase projects deliver the blast-radius isolation `06 §5.0` asks for more reliably than one instance with role-separated schemas · R2's egress saving outweighs an additional vendor, which holds only if recorded guidance ships · Prisma over Drizzle is a hiring and documentation call, not a technical one · a Haiku-class tier is sufficient · serverless function limits accommodate customization latency, including the added round-trip for any cross-database reference · Resend can be deferred briefly behind an in-app term-end notice · a Vercel Cron job is sufficient for the cross-database consistency check, rather than a dedicated verification service.

**Unknown — verify before or during build**

| Unknown | Impact |
|---|---|
| **Cost per customization** (`09` U1) | Credit pricing, cap value, whether the model works — **REQUIRES PRODUCT DECISION once measured** (`05-MVP §3.4`) |
| **Customization latency** (`09` U4) | Whether API-004 stays synchronous; whether function limits hold, now across a possible cross-project read |
| **The `template_attribute` taxonomy** (`07 §4.3`) | Affects nothing about this stack's technology choice, but the admin write path for `PATCH /admin/templates/{id}/attributes` cannot be finalised until it exists |
| Free-tier limits on **both** Supabase projects, Vercel and R2 | A paused project mid-launch, on either side of the split, stops the product |
| Razorpay activation timeline | The longest lead item |
| Retention period for user content | **Decided: 12 months** (`05-MVP §3.3`) — no longer an unknown, listed here only as a reminder to configure it, not to determine it |

---

# 15. Traceability

| Technology | Component (`06 §14`) | Key requirements |
|---|---|---|
| Next.js | 1, 2, 3, 4 — surfaces, API, application logic | FR-001–023, FR-026, NFR-002 |
| **Supabase Postgres — public project** | **5 — public database** | `07`'s 11 public entities; FR-003, 004, 005, 046 |
| **Supabase Postgres — private project** | **6 — private database** | `07`'s 18 private entities; NFR-006 |
| Prisma | 5, 6 — data access for both | `07 §17` validation rules |
| Supabase Auth | 8 — authentication | FR-029, FR-047 / FEAT-022, 025, 040 |
| Cloudflare R2 | 7 — object storage | FEAT-031, 036 |
| Anthropic Claude | 9 — external | FR-015 / FEAT-013 |
| Razorpay | 9 — external | FR-049 / FEAT-042 |
| Resend | 9 — external | FR-047, FEAT-024 |
| Vercel | 10 — remote accessibility | `05-MVP §13` |
| Sentry | monitoring | `06 §13`, FEAT-043 |

---

# Summary

**Next.js · Supabase (two projects: public Postgres, private Postgres + Auth) · Cloudflare R2 · Prisma · Anthropic Claude · Razorpay · Resend · Vercel · Sentry**

**Start these three early, in this order:**

1. **Razorpay activation** — KYC takes real time and is the longest lead item in this stack
2. **Cost measurement** — twenty real prompts through candidate models. Credit pricing depends on it, and so does whether the business works (`05-MVP §3.4`)
3. **Provision both Supabase projects and prove the cross-database write** — publish a test version, kill the process between the private insert and the public pointer update, confirm the catalog is left pointing at a valid version. This is the one failure mode unique to this revision's architecture, and it is cheap to test before real content depends on it

**Keep the AI call behind one internal interface.** The provider choice is the least certain decision in this document, and it should stay cheap to reverse. **Keep the two databases behind two named clients, never one.** The moment application code cannot immediately tell which project a query is about to hit is the moment the split stops doing its job.
