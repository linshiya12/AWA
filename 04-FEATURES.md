# Features — AI Creation Guide Platform

**Written in plain English. No technical terms without an explanation.**
Companion files: `visualization.md` (pictures), `architect.md` (how it's built), `decisions.md` (questions still to answer).

---

# 1. What this product is

Someone wants to make a poster, a logo, a short video or a website using AI. They know AI tools exist. They don't know **which tool to use** or **what to type into it**.

This platform solves exactly that. The person picks a category, picks a ready-made template, and gets back:

1. **A finished prompt** they can copy
2. **1 to 3 AI tools** to run it on, with a one-line reason for each
3. **A few short steps** telling them what to click once they get there

If the prompt isn't quite what they want, they can **customize it** — type or speak what they'd like changed, and the system rewrites the prompt for them.

Then they leave, make their thing on that tool, and come back to say whether it worked.

### The one-line version
> Pick a category → get an expert prompt → adjust it in your own words → get the right AI tool and the steps to use it.

---

# 2. What this product does NOT do

| We do not | Meaning |
|---|---|
| Make images, videos, websites or slides | The user makes those, on someone else's tool |
| Host our own AI model | We use an outside AI service, only for rewriting prompts |
| Teach a course | Guidance is 4 or 5 steps, never a lesson |
| Depend on one AI company | We recommend whichever tool fits, and you control that list |
| Depend on one payment company | Razorpay now; others added later from the admin panel |

**Where the AI is, and where it isn't.** You write every prompt by hand in the admin panel. That written prompt is what most people will copy and use, and it involves no AI at all. The AI only appears when a user asks to **change** the prompt — then an outside AI service rewrites it based on what they asked for. That rewrite costs real money each time, which is why it's limited (see section 4B).

---

# 3. Categories at launch

| Category | Example uses |
|---|---|
| Website Making | Landing pages, portfolios, business sites |
| Image Generation | Product photos, illustrations, logos, social posts |
| Video Generation | Short ads, intros, explainers, reels |
| Slides / Presentations | Pitch decks, business and teaching slides |
| Poster / Design | Event posters, flyers, banners |

More can be added any time from the admin panel. No developer needed.

---

# 4. What the user can do

## 4.1 Browse and find things

**Categories in a grid.** The home page shows all categories as cards with a picture and one line of description.

**Go as deep as needed.** A category holds subcategories, which hold more subcategories, with no limit. For example: Image Generation → Product Photography → E-commerce Shots → Amazon Listing Photos. A trail across the top always shows where they are, and every part of it is clickable.

**Search.** Type two letters and results appear. Partial words work, capital letters don't matter. Searching from the Explore page looks across every category at once, and each result shows which category it came from.

## 4.2 Filter — including by AI model

Templates can be narrowed by tag, style, mood, difficulty **and by which AI model they're written for**.

This last one matters. A video prompt written for Sora is worded differently from one written for Runway or Pika. So a user can say *"show me only prompts that work with Runway"* and see exactly those.

```
Video Generation
   Filter by model:  [ Sora ]  [ Runway ]  [ Pika ]  [ Veo ]
   → picking "Runway" shows only templates you've marked as Runway prompts
```

**How this works behind the scenes:** you already assign AI tools and their models to each template in the admin panel. That same information powers the filter. Assign it once, and it does two jobs — telling users where to run the prompt, and letting them filter by it.

Active filters show as removable chips, and they end up in the web address so a filtered list can be bookmarked.

## 4.3 Pick a template

Each card shows a preview picture, name, tags, difficulty, and which models it's written for. Opening it shows the full detail.

**Start from blank.** If nothing fits, start with no template. Tool suggestions and steps still come from the category.

Each card also shows its **like count** (see 4.4) and a **Save** button (see 4.5).

## 4.4 Like a template

Any logged-in user can like a template. Liking again removes the like — it's a toggle, not a counter they can push up.

**Likes are public.** Every template shows a total like count, visible to everyone including people who aren't logged in. It's the same number for all viewers.

| Rule | Detail |
|---|---|
| What gets liked | **The template.** Not the prompt a user received, and not a customized version |
| Who can like | Any logged-in user. **A subscription is not required** — you can like a template you haven't paid to read |
| Who sees the count | Everyone, including signed-out visitors |
| One like per person per template | Liking twice leaves one like. Liking then unliking leaves none |
| What it does not do | **Likes don't change what anyone is shown.** They aren't used to rank, sort or recommend templates. They're a signal, visible to users and to you |

**Why likes exist:** they tell you which templates people value before anyone gives written feedback, and they tell a new visitor which templates other people found worth using.

**A liked template is not a saved one.** Liking is a one-tap public signal; saving is private organisation (4.5). A user can do either, both, or neither.

## 4.5 Collections — saving templates

A logged-in user can save any template into a **collection** — a named list they create themselves.

| Rule | Detail |
|---|---|
| Who can save | Any logged-in user. **A subscription is not required** |
| Collections are created by the user | They name them. *"Product shots"*, *"Diwali campaign"*, whatever they like |
| **One template can be in several collections** | The same template can sit in *"Product shots"* and *"Client work"* at once |
| Collections are **private** | Only the person who made them can see them. There is no sharing — that would give paid prompts to non-payers |
| A template can be removed from one collection without affecting the others | |
| Renaming or deleting a collection | Allowed. Deleting a collection removes the list, not the templates |
| Saving the same template to the same collection twice | Impossible — it appears once |

**What happens if a saved template is hidden or removed by an admin:** it stays in the collection, shown as unavailable with a short explanation. It is not deleted silently — a user who saved something should be told it has gone, not left wondering.

**Collections hold templates, not prompts.** Opening a saved template gives the current prompt, including any revisions made since it was saved. That is deliberate: prompts get updated as models change, and a saved collection should give the user today's version, not a stale copy.

## 4.6 Get the prompt

The prompt appears in a large box, ready to copy. **This is the prompt exactly as you wrote it in the admin panel** — no AI involved, instant, and the same for everyone.

Subscribers can copy it. Non-subscribers see it blurred with a Subscribe button.

## 4.7 Customize it — the new part

If the prompt is close but not right, the user clicks **Customize** and says what they want changed. Two ways:

**By typing:**
> "Make it a vertical video for Instagram, more cinematic, and change the product to a leather wallet"

**By speaking:**
They tap the microphone and say it out loud. The system turns the speech into text and treats it the same way.

The system then sends the original prompt plus their request to an AI service, which rewrites the prompt. A few seconds later the new version appears.

**What happens around it:**

- The **original prompt is always kept.** A "Back to original" button is always there
- Each customization is saved, so they can step back through earlier versions in that session
- They can customize again, building on the last result
- **Each customization uses one credit** (see 4B)
- If it fails or times out, **the credit is not taken** and the previous prompt stays on screen untouched

**Why speaking matters:** describing a change out loud is much faster than typing it on a phone, and most of your users will be on a phone.

## 4.8 See which AI tool to use

Below the prompt: **1 to 3 tool cards**. Each shows the name, whether it's free or paid, a quality label, one line explaining why, and a button that opens it in a new tab.

Never more than three. Three options is a choice; ten is a problem.

You control which tools and models appear where — per category, per subcategory, or per individual template.

## 4.9 Follow the steps

A short numbered list: paste the prompt here, set this option, change this setting. Around 4 to 7 steps. Never an article.

Steps can be written for a whole category or one specific template. A template uses its own if it has them, otherwise it borrows from the category above. If nothing is set anywhere, the section doesn't appear. A **short video** can be used instead, or as well.

## 4.10 Say whether it worked

Thumbs up or down, an optional comment, and optionally which tool they used.

Feedback is tied to the exact version of the prompt they used — so if you reword a prompt and ratings drop, you can see that and undo it. Customized prompts record what the user asked for, which tells you what your written prompts are missing.

## 4.11 Account, language, phone

Sign up, log in, reset password. Saved settings include preferred language.

The whole site runs in any language you've enabled. Untranslated content falls back to the default language rather than showing blank or broken text.

Every step works on a small screen with no sideways scrolling or zooming.

---

# 4A. Subscription

## The two plans

| Plan | Price | Length |
|---|---|---|
| Yearly | ₹199 | 12 months, then it ends |
| Lifetime | ₹999 | Never expires |

## What the subscription buys

**Reading and copying the prompt.** Everything around it is free so people can see what they'd be buying.

| Free for everyone | Subscribers only |
|---|---|
| Browse all categories and subcategories | **See and copy the prompt** |
| Search and filter, including by AI model | Use customizations |
| Open a template and read its description | |
| See the preview picture, tags and **like count** | |
| **Like a template** *(logged in)* | |
| **Save templates into collections** *(logged in)* | |
| See which AI tools are suggested | |
| Read the steps | |

A non-subscriber who opens a template sees the prompt **blurred**, with a Subscribe button. They can see it exists and roughly how long it is, but not read it.

**Likes and collections need an account, not a subscription.** Someone can sign up free, like templates and build collections, and still not be able to read a prompt. That's deliberate — it gives people a reason to make an account before they're ready to pay, and it gives you a signal about what they want.

**There is no share feature.** A subscriber copies their prompt and uses it. There's no link they can send that would show the prompt to someone who hasn't paid.

## One device at a time

An account can be signed in on **one device at a time**. Signing in on a phone signs the same account out on a laptop within seconds, with a message explaining why.

This stops one subscription being shared around a group. It will also annoy honest users who move between phone and laptop — **allowing two devices** gives nearly the same protection with far fewer complaints, and is worth considering.

## Payment companies

Razorpay at launch. Others — Stripe, PayPal, anything — added later **from the admin panel** by entering the account details and switching them on. A new payment company is a form to fill in, not a rebuild.

---

# 4B. Credits — paying for customizations

Subscription and credits are two different things, and users must never be confused about which is which.

> **Subscription** = you can read the prompts.
> **Credits** = you can ask the AI to change them.

## Why credits exist

Every customization sends a request to an outside AI service, and that request costs real money. A ₹199 yearly subscriber who customizes 500 times would cost more than they paid. Credits keep usage and cost connected.

## How it works

| | |
|---|---|
| **Free to start** | Every subscriber gets **10 free customizations** ❓ (5 or 10 — to decide) |
| **After that** | They buy a credit pack |
| **One customization** | Uses one credit, whether typed or spoken |
| **Failed customization** | Costs nothing — the credit is returned automatically |
| **Do credits expire?** | ❓ Not decided. Recommendation: no expiry. Expiring credits generate complaints out of proportion to the money involved |

## Credit packs

❓ **Prices not decided.** A sensible starting shape:

| Pack | Credits | Price |
|---|---|---|
| Small | 25 | ₹99 |
| Medium | 100 | ₹299 |
| Large | 500 | ₹999 |

**Before setting these, work out what one customization actually costs you** in AI fees. Every pack must sell for comfortably more than that. This is the one number in the whole product that can quietly lose you money.

## What the user sees

- Their credit balance is visible on the result screen, near the Customize button
- Before a customization runs: "This will use 1 credit. You have 8 left."
- At zero: the Customize button becomes "Buy credits", and the prompt itself still works normally
- Running out of credits **never** blocks copying the prompt — that's what the subscription paid for

## Open questions

❓ Can a non-subscriber buy credits? **Recommended: no.** Credits customize prompts, and a non-subscriber can't read prompts. Selling them would be selling something unusable.
❓ Do free trial credits go to everyone, or only subscribers? **Recommended: subscribers only**, or they become a target for fake accounts.

---

# 5. What the admin can do

Everything below is done by you, in the admin panel, with no developer and no software update.

## 5.1 Categories and subcategories

- Create a category
- Create a subcategory inside it
- Create another subcategory inside that one — **as deep as you want, forever**
- Same form at every level; there's no separate "subcategory screen"
- Set name, web address, description, icon, preview picture
- Reorder by dragging
- Hide a category, which hides everything inside it
- Drag a whole branch under a different parent

**One field worth knowing about:** each category can hold **extra prompt words** that get quietly added to every prompt beneath it. Type "high resolution, professional quality" once under Image Generation and it applies to every template under it.

**Deleting is deliberately careful.** If a category contains anything, you're told exactly how much — "3 subcategories and 24 templates" — and offered: cancel, hide it instead (recommended, nothing lost), or move the contents elsewhere first.

## 5.2 Templates

Create, edit, duplicate, hide or delete templates under any category at any depth.

| Part | What it is |
|---|---|
| Name and description | Shown on the card |
| Preview picture | Shown on the card |
| **The prompt** | The text you write — this is the product |
| **Which AI models it's for** | Powers both the tool suggestions and the model filter |
| Suggested tools | Which tools to recommend, in what order |
| Steps | The short walkthrough |
| Video | Optional |
| Tags, style, mood, difficulty | Used for filtering |
| Status | Draft, live, hidden or archived |

A template is invisible to users until you make it live, and can't be made live without a prompt written.

## 5.3 Writing prompts

You write the prompt as finished text, exactly as you want users to see it. No special symbols, no blanks to fill in — just a well-crafted prompt for that specific job.

> A minimalist product photograph on a seamless white background, professional studio lighting, soft shadows, shot on an 85mm lens, high resolution, commercial quality.

This is what every user of that template sees. It's instant, costs nothing, and is identical for everyone.

If a user wants it different, they use Customize and the AI adjusts it for them. **You don't have to anticipate every variation** — that's the point of the change.

**Before publishing, you see a preview** of exactly what users will get.

## 5.4 Prompt history

Every save keeps the old version. You can see every version with its date, author and note, compare any two side by side, and go back to an older one with one click.

Going back doesn't erase anything — it creates a new version with the old wording. Prompts users already made stay linked to the version that produced them, which is what lets you tell whether a change helped or hurt.

## 5.5 AI tools and models

Keep a master list of AI tools — Midjourney, Runway, Gamma, v0, anything. For each: name, link, logo, free or paid, quality level, difficulty, and the one-line reason shown to users.

Under each tool, list its **models** — Runway Gen-3, Sora, Pika 1.5, and so on.

Assign tools and models to a category, subcategory or single template, and set the order they appear in.

**This does double duty.** The same assignment tells users where to run the prompt *and* feeds the model filter (4.2). Assign once, get both.

Turn a tool off and it disappears from suggestions and filters immediately, without breaking anything that referenced it before.

**Inheritance saves work:** assign Midjourney to "Image Generation" once and every subcategory beneath inherits it — including ones you create next year.

## 5.6 The customization engine

You control how prompt rewriting behaves:

| Setting | What it does |
|---|---|
| On or off | Globally, or per category |
| Free customizations | How many each new subscriber gets |
| Credit packs | Names, credit amounts, prices |
| Rewriting instructions | The standing instruction given to the AI about how to rewrite prompts — for example, "keep the technical camera terms, never make the prompt shorter than the original" |
| Monthly spending cap | A hard ceiling on AI costs. Once hit, customization pauses and you're alerted |
| Voice input | On or off |

**The spending cap is the important one.** Without it, one person with a script could run up a large bill overnight.

## 5.7 Steps, videos, languages

For any category, subcategory or template: steps only, video only, both, or nothing. Write and reorder steps. Upload or link a video.

Add a language, translate the interface and content, switch it on. It appears in everyone's language menu immediately. A percentage shows how much of each language is done.

## 5.8 Payments, plans and credits

Set up Razorpay now, others later. Enter the details, test the connection, then switch it on — so a typo can never reach a real customer. Payment keys are write-only: once saved, never shown again.

**Two plans:** ₹199 yearly and ₹999 lifetime. Edit names, prices and descriptions freely.

**Credit packs:** create, price and retire them at any time.

You can see who's subscribed, when their plan ends, and each person's credit balance — and manually add credits or extend access when support asks.

## 5.9 Users

See everyone, search, change roles, suspend accounts, trigger password resets. You can't remove your own admin access — there must always be at least one admin.

## 5.10 Feedback and reports

**Feedback** — filter by template, category, tool, rating or date.

**Usage** — which categories and templates get used, how many prompts, which tools people click, how much feedback is positive.

**Likes and saves** — which templates are liked most, and which are saved into collections most. These arrive far earlier and in far greater numbers than written feedback, because they cost the user one tap. Treat them as a demand signal, not a quality one: a template can be liked because the idea is appealing and still produce a poor result.

**Customization reports** — how many customizations, how many credits sold, **what people are asking for**. This last one is the most valuable report in the system: if forty people all ask the same template to be "more vertical for Instagram", you should write that as its own template.

**AI spending** — what customizations are costing you this month against the cap.

**Content gaps** — templates with no tool assigned, categories with no steps, templates with an empty prompt, tools turned off but still assigned.

---

# 6. What you can change without a developer

Categories · subcategories at any depth · names · descriptions · icons · preview pictures · templates · prompts · prompt history and rollback · tags · AI tools · AI models · which tools and models are assigned where · their order · steps · videos · languages · translations · payment companies · plan names and prices · credit pack names, amounts and prices · how many free customizations · the AI's rewriting instructions · the monthly spending cap · manually adding credits or extending access

**What still needs a developer:** the pages themselves, the login system, and adding a brand-new type of payment company.

---

# 7. Not in version 1

| Feature | Why it's waiting |
|---|---|
| Users submitting their own templates | Needs a review and approval process |
| One-click "run this on the AI tool for me" | Needs a paid connection to each tool |
| Whole-project mode | Bigger idea; build after the basics work |
| Team accounts, coupons, more plans | Two plans first; add complexity once money is coming in |
| Comparing results from different tools | Would mean storing what users made, which we deliberately don't do |
| Prompt sharing by link | Would hand the paid product to non-payers |

---

# 8. Word list

| Word | Means |
|---|---|
| **Category** | A top-level group like "Image Generation" |
| **Subcategory** | A group inside a category. Can hold more subcategories, forever |
| **Template** | A ready-made prompt for one specific job |
| **Prompt** | The text a user copies and pastes into an AI tool |
| **Base prompt** | The prompt exactly as you wrote it, before any customization |
| **Customization** | A user asking the AI to change the prompt, by typing or speaking. Costs one credit |
| **Credit** | One customization. Bought in packs; the first few are free |
| **AI model** | A specific model like Sora or Runway Gen-3. Used for suggestions and for filtering |
| **Version** | A saved copy of a prompt from before you edited it |
| **Subscriber** | Someone who has paid for a plan and can therefore read prompts |
| **Paywall** | The blur and Subscribe button shown to non-subscribers |
| **Like** | A public one-tap signal on a template. Toggle on, toggle off. Needs an account, not a subscription |
| **Collection** | A private named list of saved templates. A template can be in several |
| **Spending cap** | Your monthly limit on AI costs. Customization pauses when it's reached |