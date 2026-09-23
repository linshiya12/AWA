# 09 — AI Design

**Product:** AWA — AI Creation Guide Platform
**Sources:** `docs/01-PROBLEM.md` … `docs/08-API.md`
**Status:** Revised — AI is in the launch scope

---

# AI Decision

**AI: REQUIRED — for three features only.**

| Feature | Needs AI |
|---|---|
| FEAT-013 Prompt Customization by Description | Text transformation |
| FEAT-014 Voice Input for Customization | Speech to text |
| FEAT-015 Customization Safeguards | None of its own — governs failure around FEAT-013 |

**Nothing else in the 40-feature scope uses AI.** In particular:

| Looks like AI | Actually |
|---|---|
| Recommending an AI tool | Content written by a person (FEAT-016) |
| Resolving which tool applies | A lookup of assignments with inheritance (FEAT-035) |
| The prompt catalog | Hand-authored, served unchanged (FEAT-032) |
| The user producing an image | Happens on an external tool, outside AWA |

---

# 1. Ladder Placement

```
No AI → Traditional ML → ▶ AI MODEL ◀ → AI Assistant → AI Agent → Multi-Agent
```

**Chosen: AI Model.** A single-shot instruction-following text transformation.

**The transformation, in one sentence:** take an existing prompt and a plain-language description of a desired change, and return a revised prompt that incorporates the change while preserving everything else.

| Question | Answer |
|---|---|
| One step or several? | **One.** A further change is the user initiating a new request, with the previous prompt passed in as input |
| Anything plan or choose between actions? | **No.** One fixed action |
| Anything call a tool? | **No.** None available, none needed |
| Could rules do it? | **Partially.** Enumerated changes yes; arbitrary natural language no — and that is the case FEAT-013 exists for |
| Learn from data? | **No.** A fixed capability applied. No labelled data, no prediction task, free-text output |

## Why not adjacent levels

| Level | Why not |
|---|---|
| No AI | Rules cannot interpret unbounded natural language |
| Traditional ML | No labelled data, no prediction task, free-text output. A category error, not a conservative choice |
| AI Assistant | Implies conversational state. Each request is self-contained; the previous prompt is **input**, not held context |
| AI Agent | Requires planning, tool use, multi-step execution or re-planning. None present |
| Multi-Agent | One transformation. Nothing to decompose |

---

# 2. Agentic or Not

**Not agentic. It does not even reach "automation," which implies a sequence.**

| Test | FEAT-013 |
|---|---|
| Pursues a goal independently | No — performs one instruction and returns |
| Plans | No |
| Chooses between actions | No alternatives exist |
| Uses tools | No |
| Observes results and re-plans | No — **the user** observes and decides |

Three things invite the label and each dissolves: *"it uses AI tools"* — the user does, manually. *"It decides which tool to recommend"* — a lookup of what a person wrote. *"Users iterate"* — the user iterates; each iteration is a fresh single-shot request.

No agent definitions are provided because none is required.

---

# 3. Speech to Text — A Separate Capability

FEAT-014 is transcription, not generation. Once transcribed, the text enters FEAT-013 unchanged.

| Aspect | Detail |
|---|---|
| Ladder level | AI Model, for different reasons — a fixed capability, single-shot |
| Cost | Separate and additional. Both are priced as **one credit** (`05-MVP`), so transcription cost must be included when pricing credits |
| Failure | Independent. Falls back to typing; no allowance consumed (FEAT-015) |
| Accuracy | **UNKNOWN** for the intended user base's accents (`UR-§12`) |
| Privacy | **NFR-004 — audio not retained after conversion, nor if conversion fails.** `07 §11` holds no audio |
| Sequencing | `05-MVP §18` places it last, after typed customization works |

**One risk worth designing around:** transcription errors are silent. A misheard request becomes a confidently wrong revision, charged as a success. Whether to show the transcribed text for confirmation before the paid call is an open question (§6).

---

# 4. Design Constraints

## 4.1 Cost — the binding constraint

`P-§18` records the cost per customization as **UNKNOWN**, and credits cannot be priced without it.

**Measure, do not estimate:**

| Measurement | Why |
|---|---|
| Cost per request using **AWA's real prompts and real user phrasings** | Published rates say nothing until you know your own lengths. AWA's prompts are detailed by design |
| The distribution, not the mean | A few very long requests can dominate spend |
| Cost per *successful* request | Failures cost money and earn nothing (§4.3) |
| Whether a lower capability tier suffices | Rewriting a prompt to include a stated change is narrow. Measurable by comparison |

## 4.2 The spend cap

FEAT-043 requires a ceiling. **Checked before the call is made** (`08 §2` API-004, step 4) — a call already made has already cost money.

When the cap is reached: customization pauses, **prompt access is unaffected** (FEAT-045), and the user is told why without implying fault. Cap behaviour when a subscriber holds allowance is a decision listed in `05-MVP §18`.

## 4.3 Charging — and the asymmetry

FEAT-015 requires a failed or unusable request to cost the user nothing.

| Condition | Detectable before the call? | Cost incurred? |
|---|---|---|
| Empty or too-short request | Yes | None |
| No allowance, cap reached, rate limited | Yes | None |
| Contradictory request | **No** | **Yes** |
| Request unrelated to the prompt | **No** | **Yes** |
| Output fails validation | **No** | **Yes** |
| Timeout or service error | **No** | **Possibly** |

> **"No charge" protects the user's allowance. It does not protect the business from the cost.** Failure rate is therefore a cost line, not just a quality metric. `07 §6.2` records `service_cost` on every attempt, successful or not.

The guidance FEAT-015 requires — telling the user what would help — must come from the pre-call checks or the validation outcome, **not a second model call**, which would double the cost of a request already earning nothing.

## 4.4 Injection separation

| Element | Handling |
|---|---|
| The standing instruction | Fixed, authored by AWA, never derived from user input |
| The current prompt | Data, bounded and delimited |
| **The user's described change** | **Data, delimited, never interpreted as instruction** |
| The output | Validated before display (§4.5) — the last line of defence |

**Requirements gap:** `03-REQUIREMENTS.md` contains NFR-001 to NFR-016 and **none covers prompt injection**. `08 §10` records the same. The handling above stands regardless; the requirement should be added before FEAT-013 is built.

## 4.5 Output validation

Nothing reaches the user unchecked.

| Check | Basis |
|---|---|
| Not empty | A blank response is a failure |
| Not truncated mid-sentence | Incomplete response |
| Contains no part of the standing instruction | Detects separation failure |
| Recognisably derived from the input prompt | An unrelated response is a failure regardless of quality |
| Within the length ceiling | FR-033 — value `TBD` |
| Technical detail preserved | **Open decision**, not a requirement. `decisions.md` P-2 recommends instructing the model not to shorten; it has not been settled |

A failed validation is treated as a failed request: previous prompt intact, no allowance consumed, user told plainly.

## 4.6 Determinism and attribution

Reintroducing AI gives up reproducibility and frozen-output testing. The third loss — attribution — is already handled in the data model:

| Concern | Where it is addressed |
|---|---|
| Which prompt did the user actually use? | `delivered_prompt.prompt_text` (`07 §6.1`) |
| Was it the base or a derivative? | `delivered_prompt.is_customized` — keeps base-prompt quality separable |
| Which base version did it come from? | `delivered_prompt.base_version_id` |
| Which model produced the derivative? | `customization_attempt.service_reference` (`07 §6.2`) |

**Without `service_reference`, quality comparison across a silent model change produces numbers that lie.** It was discarded when AI left the scope and returns with it.

## 4.7 Degradation

NFR-001 and FEAT-045 require the core journey to survive the AI capability being down, degraded or over budget.

```
Customization unavailable
   ↓
The base prompt remains, unchanged and fully usable
   ↓
The user can copy it, reach the tool, follow the guidance
   ↓
Only the Customize action is unavailable, with the reason stated
```

**No degraded AI path, no queued retry, no alternative provider.** The paid entitlement is prompt access, which needs no AI. The correct behaviour when the capability is unavailable is to fall back to the product that existed before customization.

## 4.8 A cost lever worth deciding on

Common adjustments — aspect ratio, a listed style, a named format — could be offered as pre-enumerated choices resolved by rules: free, instant, deterministic. Only free-text requests would reach the model.

Per-request cost would fall in proportion to how concentrated real demand is. Whether it is concentrated is unknown; FEAT-029 (Customization Demand Signal) exists to reveal exactly that pattern.

**A product decision, not a recommendation.** Recorded because it would materially change the cost model and the data to evaluate it is already being collected.

---

# 5. Where AI Sits in the Flow

```
User describes a change (typed or spoken)
   ↓
[if spoken] → speech to text                    ── external, costs money
   ↓
checks: subscription · allowance · cap · rate · ownership     ── no cost
   ↓
HOLD one allowance unit
   ↓
standing instruction + current prompt + user's change (as data)
   ↓
→ AI text transformation                        ── external, costs money
   ↓
validate output
   ├─ ok   → consume unit · create delivered_prompt · return
   └─ else → release unit · previous prompt intact · no charge
```

Both external calls sit inside `POST /prompts/{id}/customize` (`08 §2`). Neither has a separate endpoint of ours.

---

# 6. Unknowns

| # | Unknown | Source | Bears on |
|---|---|---|---|
| U1 | **Cost per request with AWA's real prompts** | `P-§18` | Credit pricing, the cap value, whether the product makes money |
| U2 | Transcription cost per request | — | Credit pricing (§3) |
| U3 | Which capability tier is adequate | — | Cost, latency, output quality |
| U4 | **Customization latency** | `06 §19` | Whether the call stays inside the request or becomes accepted-then-poll (`08 §10`) |
| U5 | Failure and unusable-request rate | — | A direct cost line (§4.3) |
| U6 | Whether the AI may shorten a prompt | `decisions.md` P-2 — open | §4.5 validation |
| U7 | Prompt length ceiling | FR-033 — TBD | §4.5 validation |
| U8 | **Whether users can articulate a change clearly enough** | `UR-§9 UC-6`, `V-6` | The premise of FEAT-013 |
| U9 | Transcription accuracy for the intended user base | `UR-§12`, `V-21` | Whether FEAT-014 is viable |
| U10 | Whether demand for changes is concentrated | FEAT-029 | Whether §4.8 is worth building |
| U11 | What the external service retains | `NFR-003` | User text leaves AWA on every customization |
| U12 | Whether to confirm transcribed text before the paid call | §3 | Cost, and silent transcription errors |

**U1 and U8 gate the rest.** U1 determines whether the economics work. U8 is the premise: `UR-§9 UC-6` records that a user who can clearly describe the change might have been able to write the prompt themselves.

---

# Summary

| Question | Answer |
|---|---|
| AI required? | **Yes** — FEAT-013, 014, 015 only |
| Ladder level | **AI Model** — single-shot text transformation |
| Agentic? | **No.** No planning, tool use, multi-step execution or re-planning |
| Traditional ML? | No — no labelled data, no prediction task |
| Second capability | Speech to text, distinct cost and failure mode |
| Binding constraint | **Cost per request, currently unknown** |
| Never charged for | Failures and unusable requests — though the business still pays |
| Attribution | `delivered_prompt.is_customized` + `customization_attempt.service_reference` |
| Degradation | Base prompt remains fully usable; only Customize is unavailable |
| Requirements gap | No NFR covers prompt injection — should be added |

**The simplest thing on the ladder that solves the problem is one model call: a prompt and a described change in, a revised prompt out.** No conversation, no tools, no planning, no memory, no agents. Every rung above adds orchestration and state to a capability whose per-request cost is still unknown — complexity paid for on every single request.
