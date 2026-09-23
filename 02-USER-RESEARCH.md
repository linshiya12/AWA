# 02 — User Research and Journey Analysis

**Product:** AWA — AI Creation Guide Platform
**Source of truth:** `docs/01-PROBLEM.md`
**Document stage:** User understanding only. No features, requirements, UX design, architecture or technology.
**Status:** Draft — foundation for validation, not a record of findings

---

## How to read this document

| Label | Meaning |
|---|---|
| **FACT** | Explicitly supported by `01-PROBLEM.md` or by information provided directly |
| **ASSUMPTION** | A reasonable hypothesis that has not been confirmed |
| **UNKNOWN** | Information that is not available |

**The condition this document is written under.** No user interviews, surveys, usability tests, analytics or market research exist for AWA. Nothing in this document reports observed user behaviour, because none has been observed.

What this document *is*: a disciplined, testable set of hypotheses about who the users are and what their journey looks like, organised so that two weeks of interviews could confirm or overturn each one.

What it is **not**: research findings. Every statement about what a user does, wants, feels or prefers is an assumption, and is labelled as such. Any later document that treats these as findings will be building on sand.

**Product boundary, restated because it governs everything below:**

```
User's idea
   ↓
AWA helps structure the requirement
   ↓
AWA provides a prompt, tool recommendations and guidance
   ↓
External AI tool          ← not AWA
   ↓
Final generated output    ← not AWA
```

---

# 1. User Classification

## 1.1 Primary users

Four candidate groups. **FACT** that all four are named in the project material. **UNKNOWN** which is primary — this remains the most consequential open question in the product.

| Group | Basis |
|---|---|
| AI beginner | **ASSUMPTION** — named in the material; relevance unconfirmed |
| Creator / designer | **ASSUMPTION** — named; relevance unconfirmed |
| Business / marketing user | **ASSUMPTION** — named; relevance unconfirmed |
| Developer / technical user | **ASSUMPTION** — named; relevance unconfirmed |

**A note on why all four cannot simply be "primary."** They differ in AI experience, in what they would pay for, in how often they would return, and in whether they want guidance or want it out of the way. A catalog, a price and a tone that suit a beginner will not suit a developer. Declaring all four primary is equivalent to declaring none.

## 1.2 Secondary users

| Group | Basis |
|---|---|
| Non-subscribed visitor | **FACT** — the material establishes that browsing, searching, filtering, tool recommendations and guidance are free; only prompt text requires payment. This person is a real user of the product who receives real value and pays nothing |
| Lapsed subscriber (yearly plan ended) | **FACT** that yearly plans expire. **UNKNOWN** what they retain — this is an unresolved product decision |

**Note on who is absent.** Earlier product thinking included recipients of a shared prompt link. **FACT:** sharing was deliberately removed. That group no longer exists, which also removes a word-of-mouth acquisition path.

## 1.3 Administrative and operational users

**FACT.** Administrator capabilities are the most thoroughly specified part of the project material — more so than any end-user behaviour. This asymmetry is itself worth noticing.

| Role | Basis |
|---|---|
| Content administrator — writes and maintains prompts, categories, tools, guidance, translations | **FACT** |
| Platform administrator — manages users, payments, plans, credits, settings | **FACT** |
| Product owner — sets direction, pricing, spending caps | **FACT** |

**UNKNOWN** whether these are three people, one person, or one person who is also the product owner. This matters more than it appears: section 5 of `01-PROBLEM.md` identifies content-authoring capacity as a likely practical ceiling on the product's growth.

## 1.4 External participants

| Participant | Role | Basis |
|---|---|---|
| External AI tools (Midjourney, Runway, Gamma, v0 and others) | Where the user's actual work happens | **FACT** |
| AI service used for prompt rewriting | Powers customization; charges per use | **FACT** that one is required; **UNKNOWN** which |
| Speech-to-text service | Transcribes spoken customization requests | **FACT** that one is required; **UNKNOWN** which |
| Payment provider (Razorpay at launch) | Processes subscriptions and credit purchases | **FACT** |

**An asymmetry worth recording.** External AI tools are essential to every user journey and have agreed to nothing. AWA sends them traffic, depends on their interfaces staying stable, and has no notice when they change. **UNKNOWN** whether any of them would object to being recommended.

---

# 2. User Profiles

Demographics are omitted throughout. None were supplied, and inventing them would give these profiles a false solidity.

## 2.1 AI beginner — **ASSUMPTION**

| | |
|---|---|
| **User type** | Occasional, non-specialist |
| **Role** | Someone with a one-off creative need and no production skills |
| **Primary objective** | Produce one usable thing |
| **Secondary objectives** | Avoid looking foolish; avoid spending money on a failed attempt |
| **Problems** | Does not know which tool, what to write, or how to operate it — the entire chain |
| **Motivations** | Speed; avoiding the cost of hiring someone |
| **Frustrations** | Cannot tell why a result was poor; cannot distinguish a good prompt from a bad one |
| **Expected outcome** | Something good enough to use |
| **AI experience** | Low. **ASSUMPTION** |
| **Relationship with AWA** | Receives the whole value chain |
| **Frequency** | **UNKNOWN.** Possibly once. This is the group most likely to churn after a single success |

**The commercial tension in this profile:** the group that needs AWA most is also the group least able to judge whether AWA is worth ₹199 *before* using it, and least likely to return afterwards.

## 2.2 Creator / designer — **ASSUMPTION**

| | |
|---|---|
| **User type** | Repeat, skilled |
| **Role** | Produces visual work, possibly for clients |
| **Primary objective** | Controllable, repeatable, high-fidelity output |
| **Secondary objectives** | Consistency across a series; keeping current as models change |
| **Problems** | Prompt conventions differ by model; existing libraries are generic |
| **Motivations** | Speed of iteration; competitive edge |
| **Frustrations** | Generic prompts; advice that is out of date |
| **Expected outcome** | Faster route to a result they would have reached anyway |
| **AI experience** | Medium to high. **ASSUMPTION** |
| **Relevant behaviour** | **ASSUMPTION** — likely to customize heavily and use model filtering |
| **Relationship with AWA** | Values currency and specificity more than hand-holding |
| **Frequency** | **UNKNOWN.** Potentially the most frequent group |

**Tension:** this group may consider prompt-writing part of their craft. Whether they would use someone else's prompts at all is **UNKNOWN** and directly determines whether they are a market.

## 2.3 Business / marketing user — **ASSUMPTION**

| | |
|---|---|
| **User type** | Repeat, outcome-driven |
| **Role** | Produces marketing assets, often for a team |
| **Primary objective** | On-brand output quickly and repeatably |
| **Secondary objectives** | Consistency across whoever produces it |
| **Problems** | Output varies by person; no shared standard |
| **Motivations** | Cost avoidance; speed; not depending on a designer |
| **Frustrations** | Inconsistency; time lost |
| **Expected outcome** | Reliable assets on demand |
| **AI experience** | Low to medium. **ASSUMPTION** |
| **Relationship with AWA** | Plausibly the clearest willingness to pay |
| **Frequency** | **UNKNOWN.** Plausibly the most regular |

**A structural mismatch.** This group's core problem is *team consistency*, and AWA is an individual product with no team accounts and no sharing. **FACT** that sharing was removed and team features are out of scope. If this group is the primary user, the product is missing the thing they need most. Marked as a critical contradiction for validation.

## 2.4 Developer / technical user — **ASSUMPTION**

| | |
|---|---|
| **User type** | Repeat, self-sufficient |
| **Role** | Builds sites or interfaces with AI assistance |
| **Primary objective** | Predictable, structured prompts for generation tools |
| **Secondary objectives** | Avoid re-deriving structure for each tool |
| **Problems** | Each tool expects different structure |
| **Motivations** | Speed; predictability |
| **Frustrations** | Vague guidance; generic prompts |
| **Expected outcome** | Reliable scaffolding |
| **AI experience** | High. **ASSUMPTION** |
| **Relationship with AWA** | Likely to want the prompt and nothing else |
| **Frequency** | **UNKNOWN** |

**Tension:** the group most capable of writing their own prompts, and most likely to reach for a general AI assistant instead. **UNKNOWN** whether they would pay.

## 2.5 Non-subscribed visitor — **FACT that this user exists**

| | |
|---|---|
| **Role** | Evaluating whether AWA is worth paying for |
| **Primary objective** | Decide, at low cost |
| **What they can do** | Everything except read prompt text |
| **Frustration** | Can see the machine working but not the output of it |
| **Expected outcome** | Enough confidence to subscribe, or a clear no |
| **Frequency** | **UNKNOWN.** Possibly one visit |

**This user carries the entire conversion burden and has not been designed for.** They see tool recommendations and guidance in full, and the one thing they came for blurred. **UNKNOWN** whether that produces curiosity or resentment.

## 2.6 Content administrator — **FACT**

| | |
|---|---|
| **Role** | Writes every prompt; maintains the catalog |
| **Primary objective** | A catalog that is broad enough to be worth subscribing to and current enough to keep working |
| **Secondary objectives** | Spot gaps; revise prompts that perform poorly |
| **Problems** | Prompt quality is bounded by their own skill and time; model behaviour changes constantly |
| **Motivations** | Product quality; subscriber retention |
| **Frustrations** | The maintenance burden never ends |
| **Expected outcome** | Publish and revise without engineering help |
| **Relationship with AWA** | Their output *is* the product |
| **Frequency** | **ASSUMPTION** — ongoing, likely daily at launch |

**The most under-examined user in the project.** Every prompt users pay for is written by this person. Their capacity is the practical ceiling on catalog growth, and it has never been measured. **UNKNOWN** how many quality prompts they can produce per week, or how much of their time revision consumes once the catalog is large.

---

# 3. User Goals

Goals are separated from features throughout. "Wants a template" is not a goal — it is a solution someone has already chosen on the user's behalf.

## 3.1 Functional goals — what they want to do

**All ASSUMPTION.**

| Goal | Which users |
|---|---|
| Find out which AI tool suits this task | All |
| Obtain a prompt likely to work | All |
| Adapt that prompt to their specific need | All, particularly creators |
| Understand what to do once inside the tool | Beginners, business users |
| Find prompts written for a tool they already have | Creators, developers |
| Return to something useful they found before | **UNKNOWN** whether this is a goal at all |

## 3.2 Outcome goals — what they ultimately want

**All ASSUMPTION.**

| Outcome | Note |
|---|---|
| A finished thing they can use — a poster, a video, a page | The real objective. Everything else is instrumental |
| Reached without becoming a prompt expert | They want the result, not the discipline |
| Reached in fewer attempts than they would manage alone | The core value claim, currently unmeasured |
| Without wasting money on failed generations | Many external tools charge per attempt. **ASSUMPTION** that users feel this cost |
| Confidence that the approach was right | The non-time cost, easily overlooked |

**The distinction that matters most for later design:**

> A user does not want to find an image-generation prompt.
> A user wants the image — with as little of the finding, writing and figuring-out as possible.

Every stage of AWA's journey is a cost to the user, paid in the hope of a better result. Stages that do not visibly improve the result are pure friction.

## 3.3 Experience goals — how it should feel

**All ASSUMPTION.**

| Goal | Implication |
|---|---|
| Fast — minutes, not a study session | Long forms and multi-step wizards work against this |
| Not requiring vocabulary they lack | "Aspect ratio", "style strength", "negative prompt" may exclude beginners |
| Trustworthy — a sense that someone who knows made these choices | This is what a subscription is really buying |
| In control — able to change things, not locked to a template | Customization exists because of this |
| Not embarrassing — no sense of being a beginner | Under-discussed; likely real |
| Fair — clear about what costs money and when | Two payment mechanisms make this harder |

---

# 4. User Frustrations and Pain Points

Classification is inherited from `01-PROBLEM.md`, where no user pain could be classified as FACT because no user has been observed.

## 4.1 AI tool discovery

| Pain point | Class |
|---|---|
| Hard to find a tool appropriate to the task | **ASSUMPTION** |
| Hard to compare tools meaningfully | **ASSUMPTION** |
| Unclear which tool supports a specific task | **ASSUMPTION** |
| The landscape changes faster than the user can track | **ASSUMPTION** — supported indirectly: the product includes admin-editable tool lists and a periodic dead-link check, which implies the team expects decay |

## 4.2 Prompt creation

| Pain point | Class |
|---|---|
| Not knowing what to write | **ASSUMPTION** — a central premise |
| Not knowing how much detail is enough | **ASSUMPTION** |
| Difficulty structuring a requirement | **ASSUMPTION** |
| Repeated experimentation with wording | **ASSUMPTION** — a symptom, not a cause |
| Copied prompts do not fit the actual need | **ASSUMPTION** — the customization feature exists because the team believes this |

## 4.3 Requirement definition

| Pain point | Class |
|---|---|
| Knowing what they want but not how to express it | **ASSUMPTION** — plausibly the deepest pain, and the hardest to solve |
| Not knowing which details matter to a model | **ASSUMPTION** |
| Difficulty converting an idea into an instruction | **ASSUMPTION** |

**Worth separating.** *Not knowing what to write* and *not being able to express what you know* are different problems. The first is solved by a template. The second is only solved by something that interprets vague input — which is what customization attempts. **UNKNOWN** which of the two is more common.

## 4.4 AI tool usage

| Pain point | Class |
|---|---|
| Not knowing how to operate the chosen tool | **ASSUMPTION** |
| Not knowing where the prompt goes | **ASSUMPTION** — possibly weaker than assumed; tool onboarding has improved |
| Not understanding tool-specific requirements | **ASSUMPTION** |

**UNKNOWN** how much of this the tools now solve themselves. If a tool's own interface makes this obvious, AWA's guidance adds little for that tool — and guidance is currently written per template, at real cost.

## 4.5 Result quality

| Pain point | Class |
|---|---|
| Poor or inconsistent results | **ASSUMPTION** — a symptom |
| Not knowing how to improve a prompt | **ASSUMPTION** |
| Not knowing what went wrong | **ASSUMPTION** — the diagnostic problem |

**The diagnostic problem deserves attention.** When output disappoints, the user cannot tell whether the cause was the prompt, the tool, the model, the settings, or their own expectations. AWA reduces two of those variables. **UNKNOWN** whether users experience this uncertainty as a distinct frustration or simply as "AI is unreliable."

**A consequence for AWA specifically:** because generation happens elsewhere, AWA can never see the output. Feedback will always be self-reported, filtered through a user who may not know which variable failed. Every quality signal the product receives is therefore noisy by construction.

## 4.6 Discovery and organisation

| Pain point | Class |
|---|---|
| Hard to find a relevant template or workflow | **ASSUMPTION** |
| Information spread across unconnected sources | **ASSUMPTION** — possibly the strongest structural gap |
| Hard to return to something useful found earlier | **ASSUMPTION** — and notable, since AWA has favourites but no saved prompt history |

---

# 5. Current Workflow — Before AWA

## 5.1 Confirmed current workflow

**None.** `01-PROBLEM.md` records no documented current workflow. Nothing in this section is confirmed.

## 5.2 Likely / assumed workflow — **ASSUMPTION throughout**

| # | Step | Confidence |
|---|---|---|
| 1 | Identifies something to create | High — implied by the existence of the need |
| 2 | Searches for a tool, or uses one already known | **UNKNOWN** which. This distinction matters — see below |
| 3 | Evaluates options | **Low confidence.** Many people likely skip this |
| 4 | Searches for prompts or examples | **Low confidence.** May instead describe the need in plain language |
| 5 | Writes or adapts a prompt | Moderate |
| 6 | Enters it into the tool | High |
| 7 | Evaluates the result | High |
| 8 | Adjusts and retries | Moderate |
| 9 | Repeats, or settles, or abandons | **UNKNOWN** in what proportions |

## 5.3 The distinction that changes the product

**UNKNOWN, and critical:** does a user *choose* a tool per task, or do they have one tool and use it for everything?

- If they **choose per task**, tool recommendation is core value and the model filter matters.
- If they **already have one tool**, recommendation is nearly worthless to them, and the model filter becomes the primary navigation — they only ever want prompts for their tool.

These lead to different products. One interview question settles it, and it has not been asked.

## 5.4 Unknown areas

- **UNKNOWN** — whether users search for prompts at all
- **UNKNOWN** — typical number of attempts before success or abandonment
- **UNKNOWN** — whether the process is perceived as a problem or as normal
- **UNKNOWN** — whether they return to the same task type, which determines whether AWA is a utility or a habit
- **UNKNOWN** — whether they already use a general AI assistant to write prompts *(the alternative identified in `01-PROBLEM.md` §12.6)*

---

# 6. Current Workflow Pain Points

**Workflow step → user problem → impact.** All assumption.

| Step | Objective | Action | Difficulty | Friction | Information needed | Decision | Failure point | Result of failure |
|---|---|---|---|---|---|---|---|---|
| 1. Identify the need | Know what to make | Forms an intention | Low | None | — | — | — | — |
| 2. Find a tool | Locate something capable | Searches, or defaults to a known tool | Many options, unclear differences | Reading marketing pages | Which tools handle this task | Which tool | Picks a tool poorly suited to the task | Everything downstream is compromised, and they will not know why |
| 3. Evaluate options | Choose well | Compares, or doesn't | Comparisons are marketing, not evidence | Time | Real capability differences | Free or paid; quality | Chooses on price or familiarity | A worse result than the task allowed |
| 4. Find a prompt | Get a starting point | Searches libraries, forums, video | Generic results; unclear quality | Time; open tabs | What a good prompt looks like | Adopt or write | Copies something generic | Generic output |
| 5. Write or adapt | Express the need | Edits wording | No feedback until after generating | Guesswork | Which details matter for this model | What to include | Under-specifies | Output misses the intent |
| 6. Enter and generate | Get a result | Pastes, sets options | Settings are unfamiliar | Unclear controls | Which settings matter | Which settings | Wrong format, wrong ratio | Unusable output despite a good prompt |
| 7. Evaluate | Judge the result | Looks at it | No reference point | Uncertainty | What "good" looks like here | Accept or retry | Accepts a poor result | Ships something weak |
| 8. Adjust | Improve | Changes wording | No model of cause and effect | Repeated cost | What caused the shortfall | What to change | Changes the wrong thing | Wasted attempt; possibly a paid one |
| 9. Repeat | Converge | Loops 5–8 | May never converge | Time, money, morale | — | Continue or stop | Gives up | Task abandoned; belief that AI does not work for them |

**Where the cost concentrates:** steps 2, 5 and 8. Step 2 is a single decision with compounding consequences. Steps 5 and 8 are the loop where time and money are actually consumed. **ASSUMPTION** — untested.

---

# 7. Proposed Workflow — With AWA

**FACT** that this journey is the product's intended design. **ASSUMPTION** that each step delivers the value attributed to it.

| # | Step | Value intended | Class |
|---|---|---|---|
| 1 | User identifies what they want to create | — | — |
| 2 | Enters AWA | — | — |
| 3 | Selects a category | Turns an unbounded problem into a bounded one | **ASSUMPTION** |
| 4 | Explores subcategories and templates | Narrows to a specific job | **ASSUMPTION** |
| 5 | Optionally filters by AI model | Serves users who already own a tool | **ASSUMPTION** |
| 6 | Selects a template, or starts blank | Replaces a blank page with an expert start | **ASSUMPTION.** Plausibly the largest single value step |
| 7 | Receives a structured prompt | Delivers wording they could not produce alone | **ASSUMPTION** |
| 8 | *(Paywall)* Subscribes to read it | — | **FACT** that the paywall sits here |
| 9 | Optionally customizes by typing or speaking | Bridges template and specific need | **ASSUMPTION** |
| 10 | Receives 1–3 tool recommendations with reasoning | Removes the selection problem and explains it | **ASSUMPTION** |
| 11 | Receives short usage guidance | Closes the execution gap | **ASSUMPTION** |
| 12 | Copies the prompt | The delivery moment | **FACT** — the paid transaction completes here |
| 13 | Uses it on the external tool | **Outside AWA.** No value created or observed | **FACT** |
| 14 | Returns to give feedback | Value flows to AWA, not the user | **ASSUMPTION** |

## 7.1 Steps that are still assumptions

- **Step 3–4.** That category navigation is how users want to find things, rather than searching or describing. **UNKNOWN.**
- **Step 5.** That model filtering is understood and wanted. It presumes the user knows which model they have. **ASSUMPTION.**
- **Step 6.** That users prefer a template over a blank box. Never tested.
- **Step 9.** That users will articulate a change in words rather than abandoning and trying another template. **ASSUMPTION** — and the newest, least-tested capability.
- **Step 14.** That any meaningful proportion returns to give feedback. The content-improvement loop depends entirely on this.

## 7.2 Two structural observations

**Value is concentrated in steps 6, 7 and 9.** Steps 3–5 are navigation; 10–11 are supporting information. If the templates and the rewriting are not excellent, nothing else compensates.

**Step 8 interrupts the journey at its most valuable point.** The user has done the work of navigating and describing, has arrived at the thing they came for, and is stopped. **UNKNOWN** whether that placement converts or repels. It is defensible — they have seen the machine work — but it is untested, and it is the highest-stakes moment in the product.

---

# 8. Before vs After Comparison

No measurable improvement is claimed. Every "expected improvement" is a hypothesis requiring a baseline that does not exist.

| Area | Current experience | With AWA | Expected improvement | Class |
|---|---|---|---|---|
| Tool discovery | Search, marketing pages, guesswork | 1–3 recommendations with stated reasoning | Fewer decisions; explained choice | **ASSUMPTION** |
| Prompt creation | Blank box, or a generic copied prompt | Expert-written prompt for that job | Better starting point | **ASSUMPTION** |
| Requirement expression | User must know what to include | Template carries the structure; customization handles the rest | Less need for vocabulary they lack | **ASSUMPTION** |
| AI tool selection | Familiarity or price | Assigned per template, with model filtering | Better fit to the task | **ASSUMPTION** |
| Learning | Tutorials and courses, or nothing | 4–7 steps, task-specific | Less time before acting | **ASSUMPTION** |
| Trial and error | Repeated, unguided | Fewer attempts hoped for | Reduced waste | **ASSUMPTION — the central claim, and unmeasurable without a baseline** |
| Time and effort | Unknown, likely significant | Unknown | Reduction expected | **UNKNOWN both sides** |
| Confidence | Unclear whether the approach is right | Someone knowledgeable made the choices | Higher confidence | **ASSUMPTION** |
| Result quality | Depends on prompt skill | Depends on catalog quality | Better, if the catalog is good | **ASSUMPTION — and it moves the risk from the user to the content team** |
| Reusability | Prompts scattered or lost | Favourites; template library | Easier return | **ASSUMPTION.** Note: no saved prompt history exists |
| Currency | Advice found online may be a year old | Admin-maintained | Advice matches current models | **ASSUMPTION — plausibly the most defensible difference** |
| Cost | Free, plus wasted generations | ₹199–999 plus credits, plus wasted generations | Net saving only if attempts genuinely fall | **UNKNOWN** |

**The last row is the honest test of the product.** AWA is only a saving if the reduction in wasted attempts exceeds what it costs. Nobody currently knows either number.

---

# 9. Important Use Cases

Categories are drawn from the confirmed launch scope. **FACT** that these five categories are planned; **UNKNOWN** which have real demand.

## UC-1 — Image creation

| | |
|---|---|
| **User** | Any group; most likely beginner or business user |
| **Trigger** | Needs a specific image and has no photo or designer |
| **Goal** | A usable image with minimal iteration |
| **Starting condition** | Knows roughly what they want; may not know which tool |
| **Main journey** | Image Generation → subcategory → template → read prompt → optionally customize → open recommended tool → generate there |
| **Expected outcome** | An image close enough to use |
| **Dependencies** | Template quality; accurate tool recommendation; the tool's own behaviour |
| **Limitations** | AWA cannot see the image, so success is self-reported only |
| **Assumptions** | That image generation is a recurring need for these users; **UNKNOWN** |

## UC-2 — Video creation

| | |
|---|---|
| **User** | Business user or creator |
| **Trigger** | Needs a short ad, intro or reel |
| **Goal** | A usable clip without video production skills |
| **Starting condition** | May already own one video tool |
| **Main journey** | Video Generation → **filter by model** → template → prompt → customize → external tool |
| **Expected outcome** | A clip matching the brief |
| **Dependencies** | Model-specific prompt accuracy; assignments kept current |
| **Limitations** | Video models change fast; prompts may decay quickly. Video generation is expensive per attempt, which raises the cost of a poor prompt |
| **Assumptions** | That model-specific wording differences are large enough for users to notice. **This is the use case where the model filter matters most, and where prompt decay hurts most** |

## UC-3 — Website creation

| | |
|---|---|
| **User** | Developer or business user |
| **Trigger** | Needs a landing page or portfolio |
| **Goal** | A working page without building it by hand |
| **Starting condition** | Likely has a specific generation tool in mind |
| **Main journey** | Website Making → subcategory → template → prompt → external tool |
| **Expected outcome** | A usable structure to refine |
| **Dependencies** | Prompt structure matching that tool's expectations |
| **Limitations** | Developers are the group most able to write their own prompts |
| **Assumptions** | That this group will pay for prompts. **UNKNOWN and doubtful** |

## UC-4 — Presentation creation

| | |
|---|---|
| **User** | Business user or student *(student is **UNKNOWN** — not in the source material)* |
| **Trigger** | Needs a deck under time pressure |
| **Goal** | A structured deck quickly |
| **Starting condition** | Has content or a topic; not a designer |
| **Main journey** | Slides → subcategory → template → prompt → external tool |
| **Expected outcome** | A deck good enough to present |
| **Dependencies** | Template quality; tool recommendation |
| **Limitations** | Presentation tools often have their own prompt guidance built in |
| **Assumptions** | That AWA adds enough over the tool's own help. **UNKNOWN** |

## UC-5 — Poster and design

| | |
|---|---|
| **User** | Beginner or small business |
| **Trigger** | An event, promotion or social post |
| **Goal** | A finished poster |
| **Starting condition** | Low AI experience likely |
| **Main journey** | Poster → subcategory → template → prompt → external tool |
| **Expected outcome** | A usable poster |
| **Dependencies** | Template quality; clear guidance |
| **Limitations** | Competes with free template tools that require no AI at all |
| **Assumptions** | That AI generation beats a conventional design template for this need. **UNKNOWN** |

## 9.1 A cross-cutting use case

## UC-6 — "The template is nearly right"

| | |
|---|---|
| **User** | Any subscriber |
| **Trigger** | Prompt is 80% right; something specific must change |
| **Goal** | Adjust without learning to write prompts |
| **Main journey** | Read prompt → Customize → type or speak the change → receive a revised prompt → copy |
| **Expected outcome** | A prompt fitting their actual need |
| **Dependencies** | The rewriting service; available credits; the spending cap |
| **Limitations** | Costs a credit; can fail; result quality is not guaranteed |
| **Assumptions** | That users can articulate what they want changed. **This may be the shakiest assumption in the product** — if a user could clearly express the change, they might have been able to write the prompt |

**UC-6 deserves scrutiny.** It is the newest capability and it rests on an assumption in tension with the product's own premise. Worth a specific prototype test.

---

# 10. User Scenarios

**All scenarios below are ASSUMPTIONS.** They are illustrative constructions, not accounts of real users. No interviews were conducted.

## Scenario A — First-time visitor meets the paywall — **ASSUMPTION**

**Context:** Someone needs a poster for a shop event and has heard AI can make images.
**Intent:** Get one usable poster today.
**Problem:** Does not know which tool or what to type.
**Action:** Finds AWA, browses Poster, opens a template that looks close.
**AWA interaction:** Sees the template, the preview, the recommended tools and the steps. The prompt is blurred with a Subscribe button.
**Expected result:** **UNKNOWN.** Two plausible outcomes: subscribes because everything else looked credible, or leaves because they cannot judge quality from a blur. **This is the single most important untested moment in the product.**

## Scenario B — Owner of one tool — **ASSUMPTION**

**Context:** Already pays for Runway; wants short product videos.
**Intent:** Prompts that work on Runway specifically.
**Problem:** Most prompts found online are written for other models.
**Action:** Filters Video Generation by Runway.
**AWA interaction:** Sees only Runway-appropriate templates.
**Expected result:** Higher-quality first attempt. **ASSUMPTION.** Depends entirely on assignments being accurate and current — which depends on the content administrator's ongoing effort.

## Scenario C — Customization on a phone — **ASSUMPTION**

**Context:** On a phone, needs a vertical version of a product shot.
**Intent:** Adapt the prompt without typing a paragraph.
**Action:** Taps the microphone and says what should change.
**AWA interaction:** Speech becomes text; the prompt is rewritten; one credit is used.
**Expected result:** A fitting prompt in seconds. **ASSUMPTION.** Depends on transcription accuracy with accents and background noise — **UNKNOWN** for the likely user base.

## Scenario D — Credits run out — **ASSUMPTION**

**Context:** Subscriber has used all free customizations.
**Intent:** One more adjustment.
**Action:** Clicks Customize.
**AWA interaction:** Prompted to buy credits. The prompt itself still works.
**Expected result:** **UNKNOWN.** Buys, or feels they have already paid once and resents a second charge. **The risk is not lost revenue — it is the perception of being charged twice for one product.** Worth testing the wording before building it.

## Scenario E — Poor result on the external tool — **ASSUMPTION**

**Context:** Copies the prompt, runs it, dislikes the output.
**Intent:** Understand what went wrong.
**Action:** Returns to AWA.
**AWA interaction:** Can leave a thumbs-down, customize again, or try a different template.
**Expected result:** **UNKNOWN.** AWA cannot see the output and cannot diagnose the failure. The user may blame AWA, the tool, or themselves — and which one determines whether they renew.

## Scenario F — Signed out mid-task — **ASSUMPTION**

**Context:** Started on a laptop, opened AWA on a phone.
**Action:** Signs in on the phone.
**AWA interaction:** The laptop session ends within seconds.
**Expected result:** Confusion, unless the message is clear. A legitimate user has been treated as a suspected sharer. **UNKNOWN** how common this is; it plausibly affects a large share of honest users.

---

# 11. Edge Cases

## 11.1 User input

| Case | Journey impact | Class |
|---|---|---|
| Very little information provided | Customization has nothing to work with; may return the prompt unchanged | **ASSUMPTION** |
| Extremely detailed information | The rewrite may drop details; a longer prompt is not always better | **ASSUMPTION** |
| Ambiguous requirement | The rewrite guesses; the user pays a credit for a guess | **ASSUMPTION — and unfair if a credit is charged** |
| Conflicting requirements ("minimalist and highly detailed") | The rewrite cannot satisfy both silently | **ASSUMPTION** |
| User does not know what they want | Category navigation is not exploration; nothing helps them discover intent | **UNKNOWN whether this user exists in volume** |

## 11.2 Template

| Case | Journey impact | Class |
|---|---|---|
| No suitable template exists | Blank start, or they leave. **Most likely at launch, when the catalog is small** | **ASSUMPTION** |
| Wrong template chosen | Prompt does not fit; may be blamed on AWA rather than the choice | **ASSUMPTION** |
| Template is close but not right | The reason UC-6 exists | **ASSUMPTION** |

## 11.3 Prompt

| Case | Journey impact | Class |
|---|---|---|
| Prompt does not match intent | User customizes, switches template, or leaves | **ASSUMPTION** |
| User wants to modify it themselves | Direct editing is available | **FACT** |
| User wants several variations | Each costs a credit; **UNKNOWN** whether they expect variations to be free |
| User wants to start over | Returning to the original is available | **FACT** |

## 11.4 External AI tool

| Case | Journey impact | Class |
|---|---|---|
| Recommended tool is unavailable or renamed | Broken journey. Only caught by a periodic link check | **FACT that this can happen** |
| Tool capabilities change | The prompt still copies fine but performs worse. **The user experiences this as AWA being wrong** | **ASSUMPTION** |
| Tool needs information AWA does not supply | Guidance gap | **ASSUMPTION** |
| External tool produces poor output | AWA cannot see it, cannot diagnose it, and may be blamed | **FACT that AWA has no visibility** |
| Tool behaves differently than expected | Same as above | **ASSUMPTION** |

**This group is the product's largest structural risk.** Every one of these failures happens outside AWA, is invisible to AWA, and is attributed to AWA by the user.

## 11.5 User experience level

| Case | Journey impact | Class |
|---|---|---|
| First-time AI user | Needs the full chain; may not understand "prompt", "model", "aspect ratio" | **ASSUMPTION** |
| Experienced user | Wants the prompt, skips everything else | **ASSUMPTION** |
| Wants full control | Edits directly; may find templates limiting | **ASSUMPTION** |
| Wants maximum guidance | Steps and video | **ASSUMPTION** |
| Skips guidance entirely | Then fails on settings and blames the prompt | **ASSUMPTION** |

## 11.6 Subscription and access

| Case | Journey impact | Class |
|---|---|---|
| Non-subscriber reaches the prompt | Blur and Subscribe. The conversion moment | **FACT** |
| Yearly plan expires | **UNKNOWN** whether previously generated prompts remain readable. An unresolved decision with real consequences |
| Credits exhausted | Customization stops; prompts still work | **FACT** |
| Monthly AI spending cap reached | Customization pauses for **everyone**, including paying subscribers who have credits | **FACT — and a serious experience risk.** A subscriber with credits, blocked by an internal budget limit they cannot see, has been sold something they cannot use |
| Signed out by another device | Session ends mid-task | **FACT** |

---

# 12. Accessibility and Inclusivity Considerations

These are considerations for validation, not requirements. No accessibility research exists.

| Consideration | Why it matters | Class |
|---|---|---|
| Limited AI knowledge | Terms like "prompt", "model", "aspect ratio", "negative prompt" may be barriers. The product's premise is serving these users, yet its vocabulary assumes familiarity | **ASSUMPTION** |
| Limited technical knowledge | Moving between two products, copying and pasting, and adjusting settings is more steps than it appears | **ASSUMPTION** |
| Unfamiliar with prompt terminology | Filtering by "model" presumes they know what a model is and which one they have | **ASSUMPTION — likely a real barrier for beginners** |
| Needs simpler explanations | Guidance is written by an expert; expert-written steps often assume the reader's context | **ASSUMPTION** |
| Varying digital literacy | The journey spans two products and a payment | **ASSUMPTION** |
| Language | Multi-language support exists. **UNKNOWN** whether prompts themselves work well in languages other than English on the external tools — translating the interface does not make the *prompt* effective |
| Voice input as accessibility | **Worth naming as a benefit.** Voice may help users who find typing difficult, have low literacy, or are more fluent speaking than writing. It was introduced for mobile speed, but its accessibility value may be larger. **UNKNOWN** how well transcription handles the accents of the likely user base |
| Users with disabilities | No accessibility research exists. **UNKNOWN.** Should be validated rather than assumed |

**A specific inclusivity risk.** The stated target includes people with low AI familiarity, but the journey requires understanding categories, templates, models and prompts — four concepts, all jargon. Whether a genuine beginner can complete the journey unaided is **UNKNOWN** and directly testable with five people.

---

# 13. User Decision Points

| Decision | Information needed | Uncertainty | Consequence of getting it wrong |
|---|---|---|---|
| Which category? | What each covers | Low — categories are broad | Small; easily corrected |
| Which subcategory? | How they differ | Moderate at depth | Wrong branch; may conclude nothing suitable exists |
| Which template? | What each produces | **High.** Judging from a name, tags and one preview | Prompt does not fit; user may blame AWA rather than the choice |
| Should I filter by model? | Which model they have, and whether it matters | **High for beginners** — presumes vocabulary they may lack | Either sees irrelevant prompts, or over-filters and sees almost nothing |
| Should I subscribe? | Whether the prompt is worth ₹199 — which they cannot see | **Highest in the journey.** Judging a product from a blur | Leaves and does not return. **The single highest-stakes decision** |
| Yearly or lifetime? | How often they will use it — which they do not yet know | High | Overpays, or renews annually for something they use rarely |
| Is the prompt good enough? | Cannot know until they run it elsewhere | **High, and irreducible** | Copies a poor prompt; wastes a paid generation on the external tool |
| Should I customize? | Whether the rewrite will improve it, and whether a credit is worth it | High | Spends a credit for no gain |
| Should I buy credits? | Their future customization need | Moderate | Buys unneeded credits, or is blocked mid-task |
| Which recommended tool? | Free vs paid, quality, and their own tool situation | Moderate — reasoning is provided | Signs up for a paid tool unnecessarily |
| Should I follow the guidance? | Whether it adds anything | Low | Skips it, then fails on settings and blames the prompt |
| Should I give feedback? | Nothing — there is no benefit to them | Low | AWA loses the signal it depends on |

**Two observations.**

**The template decision is under-supported.** The user must choose from a name, some tags and one preview image, with no way to see the prompt first (it is behind the paywall). They are choosing blind at the point that most determines their outcome.

**The subscription decision is made with the least possible information.** They are asked to judge the product by the shape of the thing they cannot read. This is defensible, but it is untested and it is where the business either works or does not.

---

# 14. User Expectations

## 14.1 Confirmed expectations — **FACT**

The product material establishes what AWA will provide, so these are expectations the product intends to set:

- Browsing, searching, filtering, tool recommendations and guidance are free
- Reading the prompt requires a subscription
- Customization is limited and costs credits after a free allowance
- The final output is produced elsewhere
- One device at a time

**FACT that these are the intentions.** **UNKNOWN** whether users will *understand* them, which is a different matter and is tested in usability, not in specification.

## 14.2 Assumed expectations — need validation

| Expectation | Risk if wrong |
|---|---|
| The prompt will work well on the recommended tool | Trust collapses on the first poor result |
| Recommendations reflect current reality | Stale recommendations damage credibility fast |
| The prompt is better than one they could write | The core value claim |
| Customization will understand a plain-language request | Wasted credits and frustration |
| Prices are clear and there are no surprises | Two payment mechanisms make this harder |
| Guidance is accurate for the tool as it exists today | Guidance decays silently |
| Copied prompts remain theirs after the subscription lapses | **Directly relevant to the unresolved expiry decision** |

## 14.3 Unknown expectations — require research

- **UNKNOWN** — do they expect AWA to work with the specific tool they already have?
- **UNKNOWN** — do they expect variations, or one prompt?
- **UNKNOWN** — do they expect their prompts to be saved?
- **UNKNOWN** — do they expect support when a result is poor?
- **UNKNOWN** — do they understand that AWA does not generate anything? **This may be the most common misunderstanding the product faces**
- **UNKNOWN** — do they expect a refund if prompts do not work?

**None of these can be assumed.** In particular, do not assume users will trust the recommendations, subscribe, return, or attribute a good outcome to AWA rather than to the tool.

---

# 15. User Research Gaps

## About the users

- **UNKNOWN** — Who is the highest-value user among the four candidates?
- **UNKNOWN** — What is their actual AI experience level?
- **UNKNOWN** — Are they individuals or working within a team?
- **UNKNOWN** — Mobile or desktop when the need arises?
- **UNKNOWN** — Do they already pay for AI tools, and how much?

## About the task

- **UNKNOWN** — Which AI creation tasks are most common?
- **UNKNOWN** — How often does the need arise? *(Determines whether a subscription fits)*
- **UNKNOWN** — Is it work or personal?
- **UNKNOWN** — Is there time pressure?

## About current behaviour

- **UNKNOWN** — How do they currently discover AI tools?
- **UNKNOWN** — Do they search for prompts, or improvise?
- **UNKNOWN** — Do they already ask a general AI assistant to write prompts?
- **UNKNOWN** — How many attempts before success or abandonment?
- **UNKNOWN** — What makes them abandon?

## About value and willingness to pay

- **UNKNOWN** — What makes a prompt worth paying for?
- **UNKNOWN** — Would they pay before seeing a prompt?
- **UNKNOWN** — Is ₹199/year understood as cheap or as a risk?
- **UNKNOWN** — Do they understand subscription and credits as two separate things?
- **UNKNOWN** — Would they pay again after their first success?

## About guidance and control

- **UNKNOWN** — How much guidance do they actually want?
- **UNKNOWN** — Do experienced users want templates, or a blank box?
- **UNKNOWN** — Can they articulate a change clearly enough for customization to work?
- **UNKNOWN** — Do they read the steps, or skip to copying?

## About success

- **UNKNOWN** — What does a successful outcome look like to them?
- **UNKNOWN** — When output is poor, who do they blame?
- **UNKNOWN** — Would they tell AWA it failed, or simply leave?

---

# 16. Validation Questions

Each question carries a suggested method. Together, the Critical set is roughly two weeks of work.

## Critical — could significantly change the product

| # | Question | Method |
|---|---|---|
| V-1 | Who has this problem most acutely, and would pay? | 15–20 interviews across the four candidate groups |
| V-2 | Why would they use AWA instead of asking a general AI assistant for a prompt? | Interviews, plus a blind comparison of an AWA prompt against an assistant-generated one |
| V-3 | How often does the creation need arise? | Interviews: "how many times in the last six months?" |
| V-4 | Would they subscribe having seen only a blurred prompt? | Prototype test of the paywall screen, with the real blur |
| V-5 | Do they choose a tool per task, or use one tool for everything? | Interviews. Determines whether recommendation or model filtering is the primary feature |
| V-6 | Can they articulate a prompt change clearly enough for customization to work? | Prototype: show a prompt, ask them to describe a change, judge whether it is actionable |
| V-7 | Do they understand that AWA does not generate the output? | Show the landing page for 30 seconds, ask what the product does |
| V-8 | Do they understand subscription versus credits? | Usability test of the pricing wording, before it is built |
| V-9 | Is a curated prompt noticeably better than one they would write? | Blind test: their prompt vs an AWA prompt, same tool, compare outputs |
| V-10 | Can a genuine beginner complete the journey unaided? | Five-person usability test with low-AI-familiarity participants |

## Important — improve product decisions

| # | Question | Method |
|---|---|---|
| V-11 | Which of the five categories has the strongest demand? | Interviews; landing-page interest test |
| V-12 | How many attempts do they currently make? | Interviews. **Establishes the baseline the core claim depends on** |
| V-13 | Do they notice the difference between a good and a mediocre prompt? | Blind comparison |
| V-14 | Does model filtering make sense to them? | Usability test |
| V-15 | Would the one-device restriction affect their willingness to subscribe? | Interviews |
| V-16 | Do they read the guidance or skip it? | Usability observation |
| V-17 | What would bring them back next month? | Interviews |
| V-18 | Would they give feedback after using a prompt? | Interviews; measure the real rate in an early release |
| V-19 | How do they react to being told to buy credits after subscribing? | Prototype test of Scenario D |
| V-20 | Would they expect prompts they already copied to stay readable after their plan ends? | Interviews. **Resolves the expiry decision** |

## Nice to know

| # | Question | Method |
|---|---|---|
| V-21 | Would they use voice input, or does it feel awkward in their setting? | Prototype observation |
| V-22 | Which languages beyond English matter, and do prompts work in them? | Interviews; test a non-English prompt on a real tool |
| V-23 | Would they want to save and organise prompts? | Interviews |
| V-24 | Do they care which AI company powers the rewriting? | Interviews |
| V-25 | Would they recommend AWA, given there is no share feature? | Interviews |

---

# 17. User Research Summary

### Primary user
**UNKNOWN.** Four candidate groups — beginner, creator/designer, business/marketing user, developer — all named in the source material, none validated, and each requiring a materially different product. Determining this is the highest-priority research task. *(V-1)*

### Secondary users
The non-subscribed visitor, who receives real value for free and carries the entire conversion burden. The lapsed subscriber, whose retained access is an unresolved decision. Content and platform administrators, whose authoring capacity may be the practical ceiling on the product.

### Core user goal
**ASSUMPTION.** To produce a specific thing — a poster, a video, a page, a deck — using AI tools, without becoming skilled at prompt-writing, and without repeated failed attempts.

### Core user problem
**ASSUMPTION.** They do not know which tool suits the task, what to write, what details matter, or how to operate the tool once chosen — and the guidance available is scattered and goes out of date.

### Current workflow
**UNKNOWN.** The hypothesis is: search, guess at a tool, copy or improvise a prompt, iterate through disappointing results, sometimes abandon. Not a single step of this is confirmed.

### Proposed workflow
Category → subcategory → template → prompt (paywalled) → optional customization → tool recommendation → guidance → external tool → feedback. Value concentrates in the template and the prompt; the paywall interrupts at the highest-value moment.

### Most important use cases
Image creation (broadest appeal), video creation (where model-specific prompts matter most and per-attempt costs are highest), and "the template is nearly right" — the customization case, which is the newest capability and rests on the least tested assumption.

### Major pain points
Choosing a tool; not knowing what to write; not being able to express a known intent; not knowing what went wrong when output disappoints. All assumptions. **None classified as FACT, because no user has been observed.**

### Critical edge cases
No suitable template exists — most likely at launch, when the catalog is small. An external tool changes or disappears, invisibly to AWA, and is blamed on AWA. The monthly AI spending cap blocks paying subscribers who hold credits. A legitimate user is signed out for using two of their own devices. A user cannot judge a template before paying, because the prompt is behind the paywall.

### Key assumptions
That the problem exists as described. That users will pay before seeing a prompt. That the need recurs often enough for a subscription. That curated prompts beat what a general AI assistant produces on request. That users can articulate a change well enough for customization to help. That one product can serve beginners and experts at once.

### Critical research questions
V-1 through V-10 in section 16. Three stand out:

**V-1 — who is the primary paying user?** Four groups, four different products. Everything downstream depends on this.

**V-2 — why AWA rather than asking an AI assistant directly?** The most likely thing a capable user already does, free and instant. Carried forward unanswered from `01-PROBLEM.md` §12.6.

**V-4 — will anyone subscribe having seen only a blurred prompt?** The entire revenue model rests on one screen that has never been shown to anyone.

---

## Recommended next step

Run the ten Critical questions before writing requirements. Roughly two weeks:

1. **15–20 interviews** across the four candidate groups. Do not describe AWA. Ask what they last tried to make, what they used, how they chose it, what they typed, how many attempts, and what they would have paid to skip it. *(V-1, V-3, V-5, V-12)*
2. **One blind prompt comparison.** Their prompt, an AWA-style curated prompt, and a general AI assistant's prompt — same tool, compare outputs. *(V-2, V-9)*
3. **One paywall prototype test.** A real template page with a real blurred prompt. Watch what people do. *(V-4, V-7, V-8)*
4. **One beginner usability test**, five people with low AI familiarity, completing the journey unaided. *(V-10)*

This converts most of sections 4, 5 and 14 from assumption into either evidence or a reason to change course — before requirements and UX are built on top of them.
