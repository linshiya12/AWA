# 01 — Problem Definition

**Product:** AWA — AI Creation Guide Platform
**Document stage:** Problem space only. No requirements, features, UX, architecture or technology decisions.
**Status:** Draft for validation

---

## How to read this document

Every substantive statement carries one of three labels:

| Label | Meaning |
|---|---|
| **FACT** | Explicitly established by the supplied project material |
| **ASSUMPTION** | A reasonable interpretation that has not been confirmed |
| **UNKNOWN** | Information that is not available |

**A warning that shapes this entire document.** The supplied material describes a product concept, a set of product decisions, and a monetization model in considerable detail. It contains **no user research, no interviews, no survey data, no competitor analysis and no market evidence**.

That means almost everything in the *problem space* is currently an assumption, while much of the *solution space* has already been decided. This is the inverse of the usual order, and it is the single most important finding in this document. It is not a criticism of the work done so far — it is a statement of where the risk currently sits.

---

# 1. Core Product Concept

**FACT.** AWA is a platform that helps people use existing external AI tools to produce creative output. It provides a guided path:

```
Choose a category
  → navigate subcategories (unlimited depth)
    → choose a template, or start blank
      → receive a structured prompt
        → receive recommended AI tools and models
          → follow short usage guidance
            → copy the prompt and use it on an external tool
              → optionally report whether it worked
```

**FACT.** AWA does not generate the final image, video, website, presentation or other output. Generation happens on a third-party tool selected by the user.

**FACT.** AWA does not host or run generation models.

**FACT.** Prompts are authored by hand by administrators and stored in the platform. They are not produced by an AI model.

**FACT.** An AI service is used for one purpose only: rewriting an existing prompt when a user asks for a change, by typing or speaking. This is called *customization*.

**Distinction that must survive every later document:** AWA produces **instructions for making things**. It does not make things. A reader who loses this distinction will design the wrong product.

---

# 2. Problem Analysis

## 2.1 What users are trying to accomplish

**ASSUMPTION.** Users have a concrete creative outcome in mind — a product photo, a short advertisement, a landing page, a pitch deck, a poster — and want to produce it using AI tools rather than by hiring someone or learning design software.

The supplied material names these output types as launch categories, which implies belief that demand exists for them. It does not contain evidence of that demand.

## 2.2 What appears to make the task difficult

The material identifies four distinct difficulties. They are worth separating, because they have different causes and would need different solutions.

| Difficulty | Nature |
|---|---|
| **Not knowing which tool fits the task** | A discovery and selection problem |
| **Not knowing what to write** | A knowledge and articulation problem |
| **Not knowing what information a prompt should contain** | A structural problem — the user may know their intent but not the vocabulary that a model responds to |
| **Not knowing how to operate the chosen tool** | An execution problem — settings, formats, iteration |

**ASSUMPTION.** These are four separate problems that happen to co-occur, not four faces of one problem. A user could plausibly have any one of them without the others: an experienced designer may know exactly what to write but not which of six video tools to use; a beginner may have picked a tool but have no idea what to type.

**This distinction matters commercially.** If most users have only one of the four problems, a product solving all four may be over-built. **UNKNOWN** which of the four is the dominant pain, or whether it varies by user group.

## 2.3 Why knowing a tool exists is not enough

**ASSUMPTION.** Awareness and capability are different things. Knowing Midjourney exists does not tell someone what phrasing it responds to, which parameters matter, or how its output differs from Leonardo's for the same request.

**ASSUMPTION.** Prompt conventions differ meaningfully between tools and between models within a tool. The project material supports this indirectly: it treats "which model is this prompt written for" as important enough to be a user-facing filter, which only makes sense if prompts are not portable between models.

## 2.4 Symptoms versus root causes

The material describes several difficulties. Not all are root causes.

| Stated difficulty | Assessment |
|---|---|
| Poor AI output | **Symptom.** The cause is upstream — wrong tool, weak prompt, or wrong settings |
| Repeated trial and error | **Symptom.** A consequence of no reliable starting point |
| Not knowing which tool to use | **Plausible root cause.** The tool landscape is fragmented and changes frequently |
| Not knowing prompt structure | **Plausible root cause.** Effective prompting is a learned skill with no obvious entry point |
| Scattered learning resources | **Plausible root cause.** Prompts, tool documentation and tutorials live in unconnected places |
| Prompt guidance ages quickly | **Plausible root cause.** Model behaviour changes, so any static advice decays |

That last one deserves emphasis. It is a root cause that most competing resources — blog posts, prompt lists, YouTube tutorials — structurally cannot solve, because they are published once and never revised. The project material treats admin-updatable prompts as a core capability, which suggests the team has identified this. **ASSUMPTION** that users experience prompt decay as a felt problem rather than an invisible one.

## 2.5 Does the problem differ between beginners and experienced users?

**ASSUMPTION.** Yes, and possibly enough to represent two different products.

- A beginner likely needs the whole chain: what to make, which tool, what to write, how to run it.
- An experienced user likely needs only the parts that change — which new model is best for this task, and what phrasing that model prefers.

**UNKNOWN** which group AWA is primarily for. The project material describes features serving both (curated templates for beginners; model-level filtering for people who already own specific tools) without stating a priority.

**This is a critical unknown.** It affects catalog design, pricing, tone, and what "success" looks like. It is question C-1 in section 19.

## 2.6 Is this a discovery, prompt, tool-selection or guidance problem?

**ASSUMPTION.** It is a combination, but the combination is not evenly weighted, and the weighting is unknown.

Section 10 argues that the most defensible value is probably in prompt quality and currency rather than in discovery. That is an argument from product logic, not evidence.

---

# 3. Core User Problem Statement

> **A person who wants to create something using AI tools wants to produce a usable result on their first or second attempt, but struggles because they do not know which tool suits their task, what a good prompt for that tool looks like, or how to operate it once they get there — resulting in wasted time, disappointing output, and in some cases abandoning the attempt entirely.**

**Classification: ASSUMPTION.** Every clause is a reasonable interpretation of the project material. None is confirmed by evidence from actual users.

**Missing from this statement, marked UNKNOWN:**

- Who specifically the *target user* is. "A person who wants to create something" is too broad to design against
- How often this happens to them — once, or weekly
- What they currently do instead, and how badly that fails
- Whether they consider it a problem worth paying to solve

---

# 4. Root Cause Analysis

## 4.1 AI tool discovery

| Possible cause | Classification |
|---|---|
| There are many AI tools for each task | **ASSUMPTION** — widely believed, not evidenced here |
| The differences between tools are hard to understand | **ASSUMPTION** |
| It is hard to tell which tool fits a specific task | **ASSUMPTION** |
| New tools and models appear frequently, so any list ages | **ASSUMPTION** — supported indirectly by the product's design, which makes the tool list admin-editable and includes a periodic dead-link check |

## 4.2 Prompt creation

| Possible cause | Classification |
|---|---|
| Users do not know prompt-writing techniques | **ASSUMPTION** |
| Users supply incomplete requirements | **ASSUMPTION** |
| Users do not know which parameters matter | **ASSUMPTION** |
| Users copy generic prompts that do not match their need | **ASSUMPTION** — this is the specific gap AWA's customization feature addresses, which implies the team believes it |

**Worth noting:** the introduction of AI-powered customization is an implicit admission that curated templates alone will not cover real needs. That is a sound instinct, but it means the product now depends on two things being good — the written prompt *and* the rewriting — instead of one.

## 4.3 Workflow knowledge

| Possible cause | Classification |
|---|---|
| Users know what they want but not the steps | **ASSUMPTION** |
| Users do not know where to paste a prompt | **ASSUMPTION** |
| Users do not know which settings to change | **ASSUMPTION** |
| Users do not know how to iterate toward a better result | **ASSUMPTION** |

**UNKNOWN** how much of this the AI tools themselves already solve. Several have improved their onboarding considerably. If a tool's own interface makes the steps obvious, AWA's guidance adds little for that tool.

## 4.4 Information organisation

| Possible cause | Classification |
|---|---|
| Use cases are scattered across tools and resources | **ASSUMPTION** |
| Users must search several sources | **ASSUMPTION** |
| Prompts, tools and tutorials are not connected to each other | **ASSUMPTION** — this is the clearest structural gap AWA addresses. Free prompt libraries exist; tool directories exist; tutorials exist. The material asserts, plausibly, that nothing joins the three |

**This may be AWA's strongest root cause.** Not that any single piece is missing, but that the pieces are unconnected, so the user has to assemble the workflow themselves each time. It remains an assumption until validated.

---

# 5. Why the Problem Matters

## 5.1 Consequences, if the problem is real

| Consequence | Classification |
|---|---|
| Time lost searching for the right tool | **ASSUMPTION** |
| Time lost experimenting with prompt wording | **ASSUMPTION** |
| Output quality below what the tool could produce | **ASSUMPTION** |
| Repeated trial and error, sometimes with per-generation costs on the external tool | **ASSUMPTION** |
| Beginners abandoning the attempt | **ASSUMPTION** |
| Low confidence — uncertainty whether a poor result is the tool's fault or their own | **ASSUMPTION** |
| Difficulty translating an idea into an instruction | **ASSUMPTION** |
| Business users producing inconsistent output across a team | **ASSUMPTION** |

## 5.2 Metrics that should eventually be measured

No numerical claims are made here because none are supported. These are the measurements that would establish whether the problem is real and whether AWA reduces it.

| What to measure | Why | Current value |
|---|---|---|
| Attempts a user makes on an external tool before an acceptable result, with and without AWA | The most direct measure of the core claim | **UNKNOWN** |
| Time from "I want X" to "I have a usable prompt" | Measures the discovery and articulation cost | **UNKNOWN** |
| Money spent on external tool credits during trial and error | Users pay per generation on many tools; wasted attempts have a real cost | **UNKNOWN** |
| Proportion of attempts abandoned | Measures the severity of the problem | **UNKNOWN** |
| Self-reported confidence before and after | Captures the non-time cost | **UNKNOWN** |

**None of these can be measured after launch alone.** The comparison requires a baseline gathered before or without AWA. If that is not gathered now, the question "did AWA help?" becomes permanently unanswerable.

---

# 6. Target Users

The project material names several user groups. None is confirmed as a target by evidence. All are listed as assumptions, with the specific uncertainty for each.

## 6.1 AI beginner

| | |
|---|---|
| Who | Someone who knows AI tools exist but has produced little or nothing with them |
| Wants | One usable result, without learning a discipline |
| AI familiarity | Low |
| Primary problem | The whole chain — tool, prompt, and operation |
| Expected outcome | A result good enough to use |
| Pain points | Does not know where to start; cannot tell a good prompt from a bad one; cannot diagnose a poor result |
| Classification | **ASSUMPTION** |
| Key uncertainty | Whether a beginner will pay before experiencing success, and whether one success is enough to make them return |

## 6.2 Creator or designer

| | |
|---|---|
| Who | Someone producing visual work, possibly professionally |
| Wants | Controllable, repeatable, high-fidelity output |
| AI familiarity | Medium to high |
| Primary problem | Tool-specific phrasing; keeping up as models change |
| Expected outcome | Faster iteration; consistency across a series |
| Pain points | Prompt conventions differ per model; existing prompt libraries are generic |
| Classification | **ASSUMPTION** |
| Key uncertainty | Whether this group would use someone else's prompts at all, or considers prompt-writing part of their craft |

## 6.3 Business or marketing user

| | |
|---|---|
| Who | Someone producing marketing assets, alone or in a small team |
| Wants | On-brand output quickly, repeatably |
| AI familiarity | Low to medium |
| Primary problem | Inconsistency; no standard approach |
| Expected outcome | Reliable assets without a designer |
| Pain points | Output varies by whoever made it; no shared method |
| Classification | **ASSUMPTION** |
| Key uncertainty | This group has the clearest willingness to pay, but the product currently has **no team or sharing capability** — sharing was deliberately removed. Whether an individual-only product serves a team need is unresolved |

## 6.4 Developer or technical user

| | |
|---|---|
| Who | Someone building sites or interfaces with AI assistance |
| Wants | Structured, predictable prompts for site-generation tools |
| AI familiarity | High |
| Primary problem | Each generation tool expects a different structure |
| Expected outcome | Predictable scaffolding |
| Pain points | Tool-specific structure; generic prompts produce generic output |
| Classification | **ASSUMPTION** |
| Key uncertainty | This group is the most likely to write their own prompts and the least likely to pay for curated ones |

## 6.5 Student

Named in the analysis brief but **not present in the supplied project material**. Classified **UNKNOWN** rather than assumed. Including a group nobody has mentioned would be inventing a user.

## 6.6 The unresolved question underneath all of this

**UNKNOWN: who is the primary paying user?**

The four groups above have materially different needs. A beginner needs the whole chain and may pay once. A designer needs currency and may pay repeatedly. A business user may pay most but needs collaboration features that do not exist. A developer may not pay at all.

A product built for all four will likely serve none of them well. **This is the most important open question in this document.**

---

# 7. Stakeholders

| Stakeholder | Role | Classification |
|---|---|---|
| End user | Browses, receives prompts, uses external tools | **FACT** — central to the concept |
| Subscriber | A paying end user; sees prompt text | **FACT** — subscription is a stated product decision |
| Product owner | Sets direction and pricing | **FACT** — implied by the existence of these decisions |
| Content administrator | Writes and maintains prompts, categories, tools, guidance | **FACT** — extensively specified in the material |
| Platform administrator | Manages users, payments, languages, settings | **FACT** |
| Payment provider | Razorpay at launch; others addable later | **FACT** |
| External AI tool providers | Their tools are recommended and linked to | **FACT**, with the qualification below |
| AI service provider (for customization) | Rewrites prompts; charges per use | **FACT** that one is needed; **UNKNOWN** which |
| Speech-to-text provider | Transcribes spoken customization requests | **FACT** that one is needed; **UNKNOWN** which |
| Business/operations | Cost control, support, finance | **ASSUMPTION** — implied by the spending cap and credit ledger |

**A stakeholder relationship worth naming.** External AI tool providers are stakeholders who have not agreed to anything. AWA sends them traffic and depends on their behaviour, but has no relationship with them, no notice of changes, and no recourse when a tool changes its interface, its pricing, or disappears. **UNKNOWN** whether any of them would object to, or alternatively welcome, being recommended.

---

# 8. Current User Journey — Before AWA

**No current journey is documented in the supplied material.** The following is a hypothesis to be validated, not a finding.

**HYPOTHESIS (to validate):**

1. User has an idea for something they want to create
2. User searches — a search engine, YouTube, or social media
3. User encounters several AI tools and tries to work out which is appropriate
4. User picks one, possibly based on a recommendation of unknown quality
5. User searches for prompt examples, or writes something from scratch
6. User pastes and generates
7. Result is disappointing
8. User adjusts wording and repeats, without a clear model of what to change
9. User either eventually succeeds, settles for a poor result, or abandons the attempt

**Every step of this is UNKNOWN.** In particular:

- **UNKNOWN** whether users actually compare tools, or simply use whichever one they have heard of
- **UNKNOWN** whether they search for prompts at all, or just describe what they want in plain language
- **UNKNOWN** how many attempts they typically make before giving up or accepting
- **UNKNOWN** whether they perceive this as a problem or as normal
- **UNKNOWN** whether they ever return to the same task type, which determines whether AWA is a one-off utility or a recurring habit

**The last point has direct commercial consequences.** A subscription business needs recurring use. If people create one poster a year, an annual subscription is a difficult sell regardless of how good the product is.

---

# 9. AWA's Intended Journey and Where Value Is Created

**FACT** — this journey is specified in the project material.

| Step | Value created | Classification |
|---|---|---|
| 1. User arrives with a creation need | None yet | — |
| 2. Selects a category | Reduces an unbounded problem to a bounded one | **ASSUMPTION** |
| 3. Navigates subcategories | Narrows to a specific job; establishes context for what follows | **ASSUMPTION** |
| 4. Selects a template, or starts blank | Replaces a blank page with an expert starting point. **Likely the largest single value step** | **ASSUMPTION** |
| 5. Receives a structured prompt | Delivers wording the user could not have produced alone | **ASSUMPTION** |
| 6. Optionally customizes it, by typing or speaking | Bridges the gap between a generic template and a specific need — the step curated libraries cannot offer | **ASSUMPTION** |
| 7. Receives 1–3 tool recommendations with reasoning | Removes the selection problem and explains the choice | **ASSUMPTION** |
| 8. Filters by AI model | Serves users who already own a specific tool | **ASSUMPTION** |
| 9. Receives short usage guidance | Closes the execution gap | **ASSUMPTION** |
| 10. Copies the prompt | The moment of delivery; the paid transaction is fulfilled here | **FACT** that this is the paid boundary |
| 11. Uses it on the external tool | **Outside AWA entirely.** No value is created or observed here | **FACT** |
| 12. Returns to give feedback | Value flows *back* to AWA, not to the user | **ASSUMPTION** |

**Two observations.**

**Value is concentrated in steps 4 to 6.** Steps 2 and 3 are navigation; steps 7 to 9 are supporting information. If the templates and the rewriting are not excellent, nothing else compensates.

**Step 12 is asymmetric.** Feedback helps AWA improve its catalog. It does nothing for the user who provides it. **UNKNOWN** what proportion of users will return to give it, and the entire content-improvement loop depends on that proportion being non-trivial.

---

# 10. Value Proposition

## 10.1 Separating problem, value and outcome

| User problem | AWA's intended value | Desired user outcome |
|---|---|---|
| Does not know which tool fits | Curated, reasoned recommendations, maintained as tools change | Chooses a tool with confidence, without research |
| Does not know what to write | An expert-authored prompt for that specific job | Starts from a strong prompt rather than a blank box |
| The template is close but not exact | AI rewriting from a plain-language or spoken request | Gets a prompt matching their actual need without learning to write one |
| Does not know what details matter | The template already contains them | Produces a complete instruction without knowing what "complete" means |
| Does not know how to operate the tool | Short, specific steps | Runs the prompt correctly first time |
| Advice found online is outdated | Admin-updated prompts and tool assignments | Uses current guidance rather than last year's |
| Owns one specific tool | Filtering by AI model | Sees only prompts that will work for them |

## 10.2 Where the value most plausibly concentrates

**ASSUMPTION,** argued from the material rather than from evidence:

1. **Prompt quality and currency.** The hardest thing to copy, and the thing most alternatives cannot maintain.
2. **Connection between prompt, tool and steps.** Each piece exists free elsewhere; the joining is what is scarce.
3. **Customization.** Turns a fixed library into something that fits an individual need. This is the newest capability and also the least proven.

**Weakest claim: tool discovery alone.** Free tool directories and comparison articles exist. Discovery is unlikely to be the thing someone pays for.

## 10.3 Features that are not value

For discipline, these are capabilities, not value in themselves:

- Unlimited category nesting — an organisational capability
- Multi-language support — market reach, not a solution to the core problem
- One-device sign-in — revenue protection, and a mild negative for the user
- Prompt version history — an operational capability that indirectly supports quality
- Credits — a cost-control mechanism, and a friction cost for the user

None of these should be described as user value in later documents.

---

# 11. Business Problem

## 11.1 Confirmed product decisions

**FACT.** The following are established by the supplied material:

- Two subscription plans: ₹199 for one year, ₹999 for lifetime access
- **The finished prompt is the paid product.** Browsing, searching, filtering, tool recommendations and guidance are free; reading the prompt requires a subscription
- Customization is limited by credits — a small number free, then purchased
- Prompt sharing was deliberately removed, because a share link would give the paid product to non-payers
- One active session per account, to prevent subscription sharing
- Razorpay at launch, with further providers addable by an administrator

These are confirmed **decisions**. Whether they are correct is a separate question, and is **UNKNOWN**.

## 11.2 What is being monetized

**FACT:** access to prompt text, and the ability to have prompts rewritten.

**ASSUMPTION:** the user is really paying for *curation and currency* — someone else has worked out the right wording and keeps it current. The prompt text is the visible artifact of that work, not the work itself.

**A risk implied by this.** Text is trivially copyable. Once a subscriber has copied a prompt, they own it forever. The subscription must therefore be sold on *continuing* value — new templates, updated prompts, unfamiliar categories — rather than on the prompts a user has already collected. **UNKNOWN** whether the catalog will refresh fast enough to justify renewal.

## 11.3 Why users might return

**ASSUMPTION:** they have a new creation task, or the tools have changed and their old prompts stopped working well.

**UNKNOWN,** and it is the central business unknown. Section 8 raises the same point from the user side. Both reduce to: *is AI creation a recurring activity for these people, or an occasional one?*

## 11.4 Differentiation

| Compared to | Claimed difference | Classification |
|---|---|---|
| Searching for prompts online | Curated, current, connected to a tool and to steps | **ASSUMPTION** |
| Free prompt libraries | Maintained rather than published once; customizable to a specific need | **ASSUMPTION** |
| AI generation platforms | Different category entirely — AWA prepares, they produce | **FACT** |
| Asking a general-purpose AI assistant for a prompt | **This is the alternative the material never addresses** — see section 12.6 | **UNKNOWN** |

## 11.5 An observation about sequencing

Pricing, plan structure, the paywall boundary, credit mechanics and anti-sharing measures have all been decided. The problem itself has not been validated with a single user.

This is not necessarily wrong — many products are built this way — but it should be named plainly: **the monetization model has been designed for a problem whose existence, severity and frequency are all currently assumptions.** If validation reveals that the dominant user problem is something else, or that it recurs rarely, the pricing model may need to change rather than the features.

---

# 12. Current Alternatives

All alternatives below are **ASSUMPTIONS** unless stated. No competitive research is present in the material.

| Alternative | What the user gains | Likely limitations | Why they might still choose AWA |
|---|---|---|---|
| Search engines | Free, immediate, unlimited | Generic results; unknown quality; nothing connects prompt to tool | Curation and connection |
| Free prompt libraries | Many prompts at no cost | Rarely maintained; not tool-specific; not adaptable | Currency and customization |
| YouTube tutorials | Visual, thorough | Slow; ages quickly; not task-specific | Speed and specificity |
| Social media | Current; real examples | Unstructured; unverifiable; hard to find again | Organisation |
| AI tool documentation | Authoritative for that tool | Only helps once the tool is chosen | Tool selection |
| Individual AI platforms | Increasingly have built-in prompt help | Locked to that vendor | Vendor neutrality |
| Online courses | Deep understanding | Expensive; slow; the user wants an output, not an education | Immediacy |
| Community forums | Human help; real answers | Slow; inconsistent | Reliability |
| Trial and error | No cost to start | Slow; may never converge; consumes paid generations | A working starting point |
| Asking someone who knows | Tailored, trustworthy | Not everyone has that person | Availability |

## 12.6 The alternative that must be examined

**UNKNOWN, and unaddressed in the supplied material.**

A person can open a general-purpose AI assistant and type: *"Write me a Midjourney prompt for a minimalist product photo of a leather wallet on a white background, and tell me what settings to use."* They will get a prompt, a tool suggestion and steps — free, instantly, in one place.

This is not a hypothetical competitor. It is the most likely thing a technically comfortable user already does today, and it addresses all four of the difficulties in section 2.2 simultaneously.

Possible answers exist — curated prompts may be better than generated ones; a browsable catalog offers discovery that a blank chat box does not; a general assistant does not know which model is currently best for a given task, and will confidently invent an answer. But **none of these has been tested**, and this document should not assert them.

**This is the single most important competitive question for AWA, and it is currently unexamined.** It is question C-2 in section 19.

---

# 13. Pain Points

| Pain point | Classification | Note |
|---|---|---|
| **Discovery** | | |
| Too many AI tools to choose between | **ASSUMPTION** | Widely believed; unverified here |
| Hard to tell which tool suits a task | **ASSUMPTION** | The product's core premise |
| Tool landscape changes constantly | **ASSUMPTION** | Supported indirectly by the product's design |
| **Prompt creation** | | |
| Users do not know what to write | **ASSUMPTION** | The product's second core premise |
| Users do not know prompt techniques | **ASSUMPTION** | |
| Generic prompts do not fit specific needs | **ASSUMPTION** | The customization feature exists because the team believes this |
| **Requirement definition** | | |
| Users do not know what details matter | **ASSUMPTION** | |
| Users under-specify their request | **ASSUMPTION** | |
| **Tool usage** | | |
| Users do not know where to paste a prompt | **ASSUMPTION** | May be less true than assumed; tools have improved |
| Users do not know which settings to change | **ASSUMPTION** | |
| **Experimentation** | | |
| Repeated trial and error | **ASSUMPTION** | A symptom, not a cause |
| Wasted paid generations on external tools | **ASSUMPTION** | Potentially the most quantifiable cost, and unmeasured |
| **Organisation** | | |
| Prompts, tools and tutorials are unconnected | **ASSUMPTION** | Possibly the strongest structural gap |
| Hard to find a relevant workflow again later | **ASSUMPTION** | |
| **Confidence** | | |
| Cannot tell whether their prompt is any good before running it | **ASSUMPTION** | |
| Cannot tell whether a poor result is the tool's fault or theirs | **ASSUMPTION** | An under-discussed pain worth investigating |
| **Accessibility** | | |
| Prompt writing favours the already-skilled | **ASSUMPTION** | |
| Typing detailed requests on a phone is slow | **ASSUMPTION** | The voice input feature implies the team believes this |
| Language barriers | **ASSUMPTION** | Multi-language support implies belief; no evidence of demand supplied |

**No pain point in this document is classified as FACT.** That is not an oversight. Nothing in the supplied material establishes a user pain as observed rather than presumed.

---

# 14. Desired Outcomes

Outcomes, not features. No numerical targets are invented.

| Desired outcome | How it would be measured | Target |
|---|---|---|
| Users identify a suitable AI tool without independent research | Proportion who click through to a recommended tool | **TBD** |
| Users start from a strong prompt rather than a blank box | Prompt copy rate per template view | **TBD** |
| Users adapt a prompt to their need without learning prompt-writing | Customization use and satisfaction | **TBD** |
| Users spend less time experimenting with wording | Requires a baseline that does not yet exist | **TBD** |
| Users produce an acceptable result in fewer attempts | Self-reported; needs a baseline | **TBD** |
| Users understand how to operate the recommended tool | Guidance engagement; qualitative feedback | **TBD** |
| Users find a relevant workflow quickly | Time from landing to prompt view | **TBD** |
| Users return for their next creation task | Repeat usage over time | **TBD** |
| Users feel confident their prompt is appropriate | Qualitative only | **TBD** |

**The fourth and fifth outcomes cannot be measured without a pre-AWA baseline.** If nothing is gathered before launch, the central claim of the product becomes permanently unprovable.

---

# 15. Constraints

## 15.1 Confirmed constraints — FACT

| Constraint | Consequence for the problem space |
|---|---|
| AWA does not generate the final output | The user must leave to complete their task. AWA cannot observe or guarantee the outcome |
| AWA does not run its own generation models | Output quality depends on third parties |
| Generation happens on external platforms | AWA has no visibility past the click, so success can only ever be self-reported |
| Prompt quality depends on hand-authored admin content | Quality is bounded by the team's prompt-writing ability and available time |
| Content must be maintained as tools change | An ongoing operational cost that never ends |
| Tool capabilities change over time | Recommendations decay; the catalog needs continuous review |
| Subscription controls visibility of prompt text | The paywall boundary is the product boundary |
| Prompt sharing is deliberately absent | A word-of-mouth channel has been traded away for revenue protection |
| One active session per account | Protects revenue; costs convenience |
| Customization depends on an external AI service | Introduces a per-use cost, a latency, and a failure mode |
| Categories and templates are administrator-configurable | Deliberate: the catalog must grow without engineering |

## 15.2 Constraints that are implied rather than stated

| Constraint | Classification |
|---|---|
| Content creation capacity — someone must write every prompt, for every template, in every category | **ASSUMPTION.** The catalog cannot outgrow the team's authoring capacity, and this may be the practical limit on growth |
| Per-customization cost must stay below what credits sell for | **FACT** that a cost exists; **UNKNOWN** what it is. Until it is known, the unit economics are unknown |
| Translation maintenance grows with both catalog size and language count | **ASSUMPTION** |
| No relationship with the external tools being recommended | **FACT** — no agreement is described |

---

# 16. Confirmed Facts

Only statements explicitly established by the supplied project material.

**What AWA does**
- Provides categories, unlimited-depth subcategories and templates
- Provides prompts written by administrators
- Recommends 1–3 external AI tools per prompt, with reasoning and links
- Provides short usage guidance as steps, video, or both
- Allows filtering of templates by AI model
- Allows prompt customization via AI rewriting, from typed or spoken input
- Collects user feedback on prompts and recommendations
- Supports multiple languages, configurable by an administrator

**What AWA does not do**
- Generate images, video, websites, presentations or any final output
- Host or run generation models
- Execute prompts on external tools on the user's behalf
- Provide courses or long-form tutorials
- Provide prompt sharing by link

**Product decisions already taken**
- Subscription: ₹199 yearly, ₹999 lifetime
- Prompt text is the paid entitlement; everything else is free
- Customization is metered by credits — a small number free, then purchased
- One active session per account
- Razorpay at launch; further providers addable from the admin panel
- All user-facing content is administrator-editable without a software release
- Prompt version history is retained, with rollback

**Known categories at launch**
- Website Making, Image Generation, Video Generation, Slides/Presentations, Poster/Design — extensible by an administrator

**Known administrator capabilities**
- Create categories and subcategories to any depth
- Write and revise prompts, with version history
- Maintain the AI tool and model list, and assign them at any level
- Author guidance and upload videos
- Manage languages and translations
- Configure payment providers, plans and credit packs
- Set free-customization allowance, AI rewriting instructions and a spending cap
- Review feedback, usage and content gaps

---

# 17. Assumptions

| Assumption | Why it is being assumed | How to validate |
|---|---|---|
| Users find it hard to choose between AI tools | The product's central premise | Interview 15–20 people who have tried AI creation. Ask what they used and how they chose it |
| Users find it hard to write effective prompts | The product's second premise | Ask the same people to show their last prompt and describe how they arrived at it |
| Users would rather start from a template than a blank box | Templates are the core catalog unit | Prototype test: offer both, observe which is used |
| Users will actually leave and use the prompt externally | The whole journey depends on it | Track click-through; follow up with a sample |
| Users will return to give feedback | The content-improvement loop depends on it | Measure feedback rate in an early release |
| Users will pay for prompt access | The business model depends on it | Pre-sell to a small group before building the paywall |
| ₹199/year is acceptable pricing | Chosen without stated reasoning | Price-sensitivity conversations with target users |
| ₹999 lifetime is sensible alongside ₹199/year | Chosen without stated reasoning | Model what happens if most buyers choose lifetime — at 5× the annual price, most probably will |
| Users will pay for customizations via credits | Newest and least-tested decision | Test whether people understand two currencies at once |
| Users understand the difference between subscription and credits | Two payment mechanisms coexist | Usability test the wording before building it |
| AI creation is a recurring need for these users | A subscription requires recurrence | Ask how often they have wanted to create something in the last six months |
| Curated prompts beat prompts from a general AI assistant | Never stated, but the product depends on it | Blind comparison: AWA prompt vs assistant-generated prompt, judged on output |
| Model-specific prompts matter enough to filter by | The model filter assumes it | Test the same prompt across two models; see whether the difference is visible to a non-expert |
| Voice input is meaningfully faster on mobile | Voice was added deliberately | Time users typing versus speaking the same request |
| Beginners and experts can be served by one product | No prioritisation has been made | Interview both; compare what they ask for |
| Losing prompt sharing does not materially hurt growth | Sharing was removed for revenue reasons | Consider a limited test — a teaser link that shows the template but not the prompt |

---

# 18. Unknowns

## Users
- **UNKNOWN** — Who is the primary paying user among the four candidate groups?
- **UNKNOWN** — What is their level of AI experience?
- **UNKNOWN** — What job are they actually hiring AWA to do?
- **UNKNOWN** — How often do they have a creation task?
- **UNKNOWN** — Do they currently perceive this as a problem, or as normal?
- **UNKNOWN** — Are they on mobile or desktop when they need this?

## Market
- **UNKNOWN** — What existing products solve part or all of this?
- **UNKNOWN** — What are users doing today instead?
- **UNKNOWN** — How does AWA compare to simply asking a general-purpose AI assistant? *(See 12.6 — the most important gap.)*
- **UNKNOWN** — Are there existing paid prompt products, and do people buy them?

## Business
- **UNKNOWN** — What does one customization cost in AI fees? *Everything about credit pricing depends on this.*
- **UNKNOWN** — What does speech-to-text cost per use?
- **UNKNOWN** — What proportion of buyers will choose lifetime over yearly, and what that does to revenue?
- **UNKNOWN** — What is the expected renewal rate?
- **UNKNOWN** — How will users be acquired?
- **UNKNOWN** — What does it cost to acquire one subscriber, relative to ₹199?

## Product
- **UNKNOWN** — Which categories matter most to real users?
- **UNKNOWN** — Which templates would be most valuable?
- **UNKNOWN** — How much guidance do users actually need, versus how much is being planned?
- **UNKNOWN** — Do users want to customize, or is a good template enough?
- **UNKNOWN** — Will users understand two payment mechanisms at once?

## Content
- **UNKNOWN** — Who writes the prompts, and how many can they produce per week?
- **UNKNOWN** — How is a prompt judged good before it is published?
- **UNKNOWN** — How often must the catalog be reviewed as models change?
- **UNKNOWN** — How are outdated tool recommendations detected in practice?
- **UNKNOWN** — What is the minimum catalog size for launch to feel worth paying for?

## Feedback and success
- **UNKNOWN** — What defines a successful prompt?
- **UNKNOWN** — How will feedback be interpreted, given that AWA cannot see the actual output?
- **UNKNOWN** — What happens when a user gets a poor result — do they blame AWA, the tool, or themselves?
- **UNKNOWN** — What proportion of users will give feedback at all?

---

# 19. Questions That Need Answers

## Critical — answers could materially change the product definition

**C-1. Who is the primary paying user?**
Beginner, designer, business user or developer. They need different products. *(Section 6.6)*

**C-2. Why would someone use AWA instead of asking a general-purpose AI assistant for a prompt?**
The assistant is free, instant, and answers all four difficulties at once. This must have a real answer. *(Section 12.6)*

**C-3. Is AI creation a recurring need, or occasional?**
A subscription requires recurrence. If people create one poster a year, the model does not work regardless of product quality. *(Sections 8, 11.3)*

**C-4. Would the target user pay ₹199 before experiencing the product?**
The paywall sits in front of the core value. Whether that converts is untested.

**C-5. What does one customization cost in AI fees?**
Until this is known, credits cannot be priced, and the unit economics of the whole product are unknown.

**C-6. Is the prompt genuinely the valuable thing, or is it the tool recommendation and guidance?**
The paywall is placed on the prompt. If the real value is elsewhere, the paywall is in the wrong place.

**C-7. Can the team produce and maintain enough prompts?**
Every prompt is hand-written. Catalog growth is bounded by authoring capacity, and that capacity is unmeasured.

## Important — significantly improve product decisions

**I-1.** How do users currently choose an AI tool?
**I-2.** Do users prefer a curated template or a blank box with help?
**I-3.** How many attempts do they currently make before an acceptable result?
**I-4.** Do they notice a difference between a good prompt and a mediocre one?
**I-5.** Would they understand the subscription/credits distinction without explanation?
**I-6.** Does model-specific filtering matter to them, or is it an expert concern?
**I-7.** Which of the five launch categories has the strongest demand?
**I-8.** What does a "good result" mean to them?
**I-9.** Does the one-device restriction affect their willingness to subscribe?
**I-10.** What would make them return next month?

## Nice to know

**N-1.** Would they use voice input, or does it feel awkward?
**N-2.** Which languages beyond English matter?
**N-3.** Would they want to save or organise their prompts?
**N-4.** Would they recommend it to someone else, given there is no share feature?
**N-5.** Do they care which AI company provides the customization?

---

# 20. Success Criteria

All targets are **TBD**. Inventing numbers here would create false confidence.

## User success

| Measure | Target |
|---|---|
| Time from landing to viewing a relevant prompt | TBD |
| Proportion of template views that result in a copy | TBD |
| Proportion that result in a click to an external tool | TBD |
| Self-reported task completion | TBD |
| Positive feedback rate | TBD |
| Repeat usage within 30 and 90 days | TBD |
| Attempts required to reach an acceptable result, versus baseline | TBD — **and the baseline does not yet exist** |

## Content success

| Measure | Target |
|---|---|
| Templates used at least once per month | TBD |
| Feedback score by template and by version | TBD |
| Tool recommendation click-through by tool | TBD |
| Content gaps outstanding | TBD |
| Whether a prompt revision improved its feedback score | TBD |
| Proportion of customization requests that reveal a missing template | TBD — *this is the most useful content signal available, because it shows what the catalog lacks* |

## Business success

| Measure | Target |
|---|---|
| Registrations | TBD |
| Registration → subscription conversion | TBD |
| Split between yearly and lifetime purchases | TBD |
| Renewal rate on the yearly plan | TBD |
| Credit pack purchase rate among subscribers | TBD |
| Gross margin per subscriber after AI costs | TBD — **the number that determines whether the model works** |
| Cost to acquire one subscriber | TBD |

---

# 21. Scope Boundaries

## In scope — problems AWA intends to solve

- Not knowing which AI tool suits a task
- Not knowing what to write as a prompt
- Not knowing what details a prompt should contain
- Not knowing how to operate the chosen tool
- Guidance being scattered across unconnected sources
- Prompt advice going out of date as models change
- Adapting a general template to a specific need without learning prompt-writing
- Finding prompts written for a specific AI model

## Out of scope — problems AWA does not intend to solve

- **Producing the final output.** AWA prepares an instruction; the user's chosen tool produces the image, video, site or deck. This is the defining boundary of the product
- Running or hosting generation models
- Executing prompts on external tools for the user
- Teaching AI or design as a discipline
- Guaranteeing the quality of what an external tool produces
- Managing the user's accounts or billing with external tools
- Storing or organising the outputs users create
- Team collaboration on prompts
- Comparing outputs across tools

## Potential future scope — not confirmed, not requirements

- User-submitted templates, with review
- Direct execution on external tools via their APIs
- Multi-step projects producing coordinated prompts
- Team accounts
- Output comparison across tools
- Additional plans, coupons, promotional pricing

---

# 22. Core Problem Summary

### Problem
People who want to create something with AI tools do not know which tool suits their task, what to write as a prompt, what details that prompt needs, or how to operate the tool once they choose it — and the advice available to them is scattered and goes out of date. **ASSUMPTION.**

### Target user
Not yet determined. Four candidate groups — beginners, creators/designers, business and marketing users, developers — with materially different needs. **UNKNOWN which is primary.**

### Current behaviour
Undocumented. Hypothesis: search, guess at a tool, copy or improvise a prompt, iterate through disappointing results, sometimes give up. **UNKNOWN.**

### Root cause
Most plausibly: prompt effectiveness is a learned skill with no entry point; the tool landscape is fragmented and changes fast; and the three things a user needs — a prompt, a tool, and instructions — exist separately and are never joined. **ASSUMPTION.**

### Impact
Time lost, money spent on wasted generations at external tools, poor output, low confidence, and abandoned attempts. **ASSUMPTION — none measured.**

### AWA's intended value
An expert-written prompt for the specific job, adaptable in the user's own words, paired with the right tool and short instructions for using it — all kept current by administrators as the tools change.

### Desired outcome
A user goes from an idea to a usable result with fewer attempts, less searching, and more confidence that their prompt and their tool choice are appropriate.

### Confirmed facts
What AWA does and does not do; the user journey; the launch categories; administrator capabilities; and the monetization decisions — subscription with the prompt as the paid product, credits for customization, no sharing, one device per account.

### Key assumptions
That the problem exists as described; that users will pay for prompt access; that AI creation recurs often enough for a subscription; that curated prompts beat what a general AI assistant produces on demand; and that one product can serve beginners and experts at once.

### Critical unknowns
Who the paying user is. What one customization costs. Whether the need recurs. Why someone would choose AWA over asking an AI assistant directly. Whether the team can author and maintain enough prompts.

### Critical questions
C-1 to C-7 in section 19. Two of them stand out:

**C-2 — why AWA rather than asking an AI assistant directly?** This is the most likely thing a capable user already does, and it addresses all four difficulties at once. The product needs a real answer, and does not currently have one on paper.

**C-5 — what does one customization cost?** Every credit price, every margin calculation, and the viability of ₹199/year all depend on a number nobody has yet.

---

## Recommended next step

Before writing requirements, hold 15 to 20 conversations with people who have tried to create something with an AI tool in the last three months. Do not describe AWA. Ask what they made, what they used, how they chose it, what they typed, how many attempts it took, and what they would have paid to skip that.

That is roughly two weeks of work, and it converts most of section 17 from assumption into either fact or a reason to change direction — before the more expensive documents are written on top of it.
