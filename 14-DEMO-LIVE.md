# 14 — Demo Script (Live Product)

**Product:** AWA — AI Creation Guide Platform
**Slot:** 5 minutes · **Format:** live product, driven from a browser
**Companion:** `14-DEMO.md` is the slides-only version. Use this one if you are clicking.

---

## Before you start — setup at T-10 minutes

Live demos fail on setup, not on software. Do all of this before the room fills.

| # | Item | Detail |
|---|---|---|
| 1 | **Two browser windows, side by side or on separate desktops** | **Window A:** AWA, signed out, on the entry page. **Window B:** the external AI tool you will recommend, signed in, on an empty prompt box |
| 2 | **A second AWA account, already subscribed, already signed in** | In a third tab or a private window. **You will switch to it rather than paying live** |
| 3 | **Razorpay in test mode**, if you show checkout at all | See §3 — the recommendation is not to |
| 4 | **The result image already generated**, in a tab in Window B | From this exact prompt, earlier. See §5 for how to be honest about it |
| 5 | **A comparison image already generated** | Same tool, one attempt, from a naive prompt. This is your strongest asset |
| 6 | Browser zoom at 125–150%, bookmarks bar hidden, notifications off | Judges at the back cannot read 100% |
| 7 | **Phone hotspot ready** | Venue wifi is the most common cause of a failed live demo |
| 8 | The customization text on a sticky note | You will forget it under pressure |
| 9 | Run the whole thing twice, timed | Live is slower than you think. Typing eats seconds |

**One decision to make now:** whether to run the AI customization live. It takes a few seconds and it is genuinely impressive. It can also fail. §4 covers both paths — decide beforehand, do not improvise on stage.

---

# 0:00 — Problem

**On screen: Window B — the external AI tool, empty prompt box, cursor blinking.**

> "I want to show you where most people give up on AI.
>
> This is a real AI image tool. It's extraordinary. And this box is where it goes wrong for almost everyone — because between having an idea and getting something usable, there are four questions nobody answers.
>
> Which tool? What do I type? What details matter? Which settings?"

**Type a naive prompt live** — *"product photo of a leather wallet, white background"* — and hit generate.

> "That's what most people type. Let's let it run while I talk."

*(0:40)*

**Speaker note:** Starting the naive generation now means it finishes in the background and you get the comparison for free at 3:40. If the tool is slow, skip generating and show your pre-made version at §5 instead.

---

# 0:40 — Who this affects

**Still on Window B.**

> "And the people this hits hardest aren't designers — they have other options.
>
> It's the shop owner photographing their own products. The one-person marketing team. Anyone who needs one good image today and has nobody to ask."

*(0:20)*

---

# 1:00 — The solution

**Switch to Window A — AWA entry page.**

> "So we built the step that's missing in front of that box.
>
> You pick the job you're doing. You get a prompt written by someone who knows that tool, the tool we recommend and why, and four steps to run it.
>
> One thing up front: **AWA doesn't make your image.** We're not competing with that tool — we're the thing that should exist before you get there."

*(0:20)*

**Speaker note:** Say the boundary line now, pointing at the line on your own landing page. If judges think you built an image generator, everything after is judged against the wrong product.

---

# 1:20 — LIVE: find the job

**Click: Image Generation → Product Photography → E-commerce Listing Shots.**

> "I'm a shop owner. I sell leather goods. I go straight to the job I'm doing."

*(0:15)*

**Speaker note:** Click, don't narrate every click. Judges can see the screen.

---

# 1:35 — LIVE: choose a template

**On the template list. Hover one card, then open it.**

> "Each of these is one specific job. It says what it produces and which tools it's written for — a prompt written for one model doesn't behave the same on another."

**Click into *"Plain product on white."***

*(0:15)*

---

# 1:50 — LIVE: the paywall

**The locked state appears. Do not skip past it — this is your business model.**

> "Now — the prompt is the product, so it's behind a subscription. You can see it exists, you can see how long it is, and everything around it is free: the tool recommendation, the reasoning, the steps.
>
> I've got an account already, so let me switch."

**Switch to the pre-signed-in subscribed window.** *(See §3 — do not run a live payment.)*

*(0:20)*

---

# 2:10 — LIVE: the prompt

**The unlocked template page. Scroll so the full prompt is visible. Stop talking.**

> "And this is what you're paying for."

**Three seconds of silence. Let them read it.**

> "Look at what's in there — the lighting, the lens, the background, the format. That is not what I would have typed. That's what someone who's spent a hundred hours on this tool types."

*(0:25)*

**Speaker note:** The only silence in the demo, and the most valuable. The prompt must be genuinely good — use your best one.

---

# 2:35 — LIVE: make it mine

**Click Customize. Type — don't paste:**

> *Make it a leather wallet, vertical for a phone listing.*

> "But I sell wallets, not mugs. Instead of learning to rewrite this, I just say what I want changed."

**Hit customize. It runs.**

> "That's the only place AI runs inside our product — adapting a prompt, not making an image. And it costs a credit, which is why there's a meter on it."

*(0:25 including the wait)*

**Speaker note:** Talk *through* the wait; do not watch the spinner in silence. If it has not returned by the time you finish that sentence, go to the fallback in §4.

---

# 3:00 — LIVE: the adapted prompt

**The revised prompt appears.**

> "Every technical detail kept. Only what I asked for changed."

**Click Copy. Switch to Window B. Paste. Generate.**

*(0:20)*

---

# 3:20 — Technology

**While the image generates.**

> "Briefly on the build, since it's running: Next.js and Postgres, one AI model doing exactly one job. Everything else is content we write and update live — when a model changes next month and the old wording stops working, we fix it that afternoon without shipping code."

*(0:15)*

**Speaker note:** Two sentences. This slot exists because you have dead air, not because judges want the stack.

---

# 3:35 — The result, side by side

**Put the two images next to each other: the naive one from 0:00, and the one that just generated.**

> "Same tool. Same one attempt each.
>
> Left: what I'd have typed. Right: the AWA prompt.
>
> That gap is the entire product."

**Pause. Let them look.**

*(0:35)*

**If the live generation has not finished:** switch to the pre-made tab and say so plainly — *"this one I ran earlier with this exact prompt, it takes about forty seconds."* Judges respect that far more than a stall.

---

# 4:10 — Impact

> "So: a shop owner with no designer and no photographer has a listing image, in about two minutes, first attempt.
>
> The impact isn't the image. It's that they stopped needing to become good at prompting to get anything out of AI — and stopped burning paid generations on guesses.
>
> And because every prompt is ours and maintained, it doesn't rot. Blog posts and prompt lists get published once and go stale. Ours get fixed."

*(0:25)*

---

# 4:35 — Future

> "Today, one category done properly. The engine doesn't care what the category is — video, slides, posters all work the same way.
>
> Next: filter by the tool you already pay for. Then team accounts, because businesses don't have one person making assets, they have four making inconsistent ones.
>
> But none of that is what makes it work. What makes it work is somebody maintaining the prompts."

*(0:25)*

**Total: 5:00.**

---

# §3 — Do Not Run a Live Payment

| Why | |
|---|---|
| Real money, or test mode that looks fake | Neither is good on stage |
| The webhook can lag the browser by seconds | You would stand watching a "confirming payment" spinner |
| It adds 30 seconds you do not have | |

**Do this instead:** show the locked state for 20 seconds — it is your business model and worth showing — then switch to the pre-signed-in subscribed window. Say *"I've got an account already"* and move. Nobody will ask you to demonstrate a card form.

**If a judge specifically asks to see checkout**, offer it in Q&A with test mode, where a slow webhook costs you nothing.

---

# §4 — Failure Fallbacks

Decide these now. Improvising on stage costs more time than the failure did.

| If this fails | Do this | Say this |
|---|---|---|
| **Customization does not return in ~8 seconds** | Keep talking. At 12 seconds, switch to a browser tab with the adapted prompt already showing | *"It's taking its time — here's the result from when I ran it earlier."* |
| **Customization errors** | Show it. Point at the message | *"And that's the important part — it says no credit was used. You don't pay for our failures."* **This is a genuinely good save. The error handling is a feature.** |
| **The external tool is slow or down** | Pre-made tab | *"I ran this earlier with this exact prompt."* |
| **Venue wifi drops** | Phone hotspot, already paired | Keep talking while it reconnects |
| **AWA itself errors** | Pre-made screenshots, in order, in a folder | *"Let me show you what that looks like."* Do not debug on stage |
| **You are at 4:00 and only at the prompt** | Skip customization entirely. Copy the base prompt and go straight to the comparison | The comparison is the demo; customization is a feature |

**The one thing not to do:** refresh and retry. It reads as broken even when it works the second time.

---

# §5 — Honesty Rules

Judges are good at spotting a rigged demo, and one caught exaggeration costs more than the whole demo gained.

| Rule | |
|---|---|
| **If an image was made earlier, say so** | *"I ran this earlier with this exact prompt."* Nobody minds |
| **The comparison must be fair** | Same tool, same settings, one attempt each. Same seed if the tool supports it |
| **Do not cherry-pick** | Have two or three more pairs ready. If the first question probes it, you want a second example, not an explanation |
| **No invented numbers** | "About two minutes" is what you just showed them. A percentage you have not measured will be challenged |
| **If asked what customization costs you** | *"We're measuring it on our own prompts before we set credit prices."* That is the honest answer and a better one than a guess |

---

# §6 — Q&A: The Four You Will Get

## 1. "Why not just ask ChatGPT to write me a prompt?"

**Expect this first.**

> "Fair — you'd get something. Three things you wouldn't get: it doesn't know which of today's tools suits your specific job, and it'll confidently make one up. It doesn't track that model's current quirks, which change monthly. And there's no catalogue to browse when you don't yet know what you want to make.
>
> We tested it — here's the same brief through an assistant and through ours."

**Have that third image pair ready.** If you cannot produce it, do not claim it.

## 2. "What stops people sharing a login, or just copying all your prompts?"

> "One device at a time — signing in somewhere new signs you out. And prompts are copyable by nature, so we're not selling a text file. We're selling the catalogue staying current. What you copied today stops working when the model updates. Ours doesn't."

## 3. "What does the AI cost you per customization?"

> "Which is exactly why it's metered rather than unlimited — credits, a rate limit, and a monthly ceiling on our own spend. We're measuring the real cost on our own prompts before setting prices. That number decides whether the model works, and we're not guessing it."

## 4. "Who writes the prompts? Can you keep up?"

> "We do, and that's the real constraint — not the software. It's why we built the admin side first: the catalogue grows without touching code. We're tracking how long a template takes to write, because that sets how fast we can grow."

---

# §7 — Final Checklist

| # | | |
|---|---|---|
| 1 | Both windows open, correct pages, zoomed | |
| 2 | Subscribed account signed in, in its own window | |
| 3 | Pre-made result and comparison images in tabs | |
| 4 | Two spare comparison pairs for Q&A | |
| 5 | Hotspot paired and tested | |
| 6 | Notifications off, bookmarks hidden | |
| 7 | Customization text written down | |
| 8 | **Timed twice, out loud, clicking** | |
| 9 | Fallback screenshots in a folder, in order | |
| 10 | Boundary line memorised — *"AWA doesn't make your image"* | |

**Three moments carry the demo:** the prompt at 2:10, the comparison at 3:35, and the impact line at 4:10. If you are running long, cut customization before you cut any of those.