Turn anything you want to understand, plan, or share into an interactive visual.

Official channels： archify.si · GitHub
Archify is free and open source. Third-party online services and paid plans are operated by their respective providers and do not represent Archify. Service details →

Start with an idea, a question, or a plan. Describe it to your AI agent, and Archify turns it into an interactive HTML you can explore, customize, and share. From travel itineraries and learning maps to complex systems—make it your own.

See what the community is creating—and imagine what you could make next.

Live demos  ·  Get started  ·  Scenario guide  ·  Community  ·  简体中文  ·  日本語  ·  한국어

    

    

❤️ Partners & sponsors: Kimi Work · Supercode · OpenLux

See Archify in action
 archify-launch-en-v4.mp4 

One sentence. Your repo, mapped. Watch the 35-second demo: explore the diagram, follow source links, and trace a path. Try the interactive examples ↗

Install, then describe your idea

Works with Cursor, Claude Code, Codex CLI, and OpenCode. See installation options below for additional integrations.

Install Archify for me by reading https://raw.githubusercontent.com/tt-a1i/archify/main/llms.txt


Send this to your agent:

Use Archify to diagram a web request: Browser calls the API,
the API checks Redis, and a cache miss queries PostgreSQL and fills the cache.


Then continue: “Add authentication”, “Highlight the cache-miss path”, or “Switch to the light theme”.

No repository is required: start with a description, or ask your agent to read a repository for a source-backed architecture diagram.

Choose your agent · Installation details and update checks · Create and check diagrams with your agent

Ask a question, get a one-page answer

Not every answer is one diagram. Ask your agent to answer as a page and Archify builds an explainer: the conclusion first, then one panel per question, with tables, steps, charts, code and validated diagrams.

Conclusion first. The answer and its reasons lead; every panel takes one question.
Diagrams that explain. Steps sit beside the diagram they walk through and light its parts as you read. Click any node to open the full interactive view.
Easy to check. Claims cite numbered sources; repository excerpts are pinned to a commit and open in a source card.
Easy to share. One HTML file with four styles and light or dark themes. Export a PNG, WebP or JPG long image, or print to PDF. Ask about any panel to get a follow-up your agent can use to revise just that panel.
Use Archify to answer as one page: our API's P99 went from 80 ms to 600 ms
while the mean barely moved. What is the likely cause, and how should we investigate?


Live examples: First HTTPS visit · P99 latency (Chinese) · How Archify finalize keeps the last good file, read from this repository (Chinese) · First rental checklist (Chinese)

❤️ Sponsors

Archify × Kimi Work. Find Archify in the Kimi Work plugin store as Interactive Architecture Diagram. Describe your system in one sentence to create an interactive diagram. Try it in Kimi Work →


supercode.sh	Supercode sponsors Archify and enhances Codex and Cursor with token optimization, curated Skills, and spec-driven development. Archify is featured as a Supercode Editor’s Choice skill.



OpenLux	Thank you to OpenLux for sponsoring this project! OpenLux is an all-in-one AI platform for businesses, bringing together leading AI models from major providers worldwide. With fast, reliable service and responsive technical support, OpenLux offers base pricing for Claude, OpenAI, and Gemini models as low as 8.82%, 4%, and 8% of official rates, respectively.

Exclusive offer for Archify users: Sign up through our referral link and enjoy up to 7.5% off credit top-ups!

Get started with OpenLux →

PackyCode	Access leading AI models through PackyCode with one API endpoint and one API key. Enjoy automatic failover and dedicated high-speed routes for Codex and Claude Code.

Get started with $1 in free credits, a discount on your first top-up, and savings of up to 80% on eligible routes. Pay in RMB with no currency conversion markups or extra top-up fees.

Get started with PackyCode →

AICodeMirror	Thank you to AICodeMirror for sponsoring Archify! AICodeMirror provides API relay services for Claude, Codex, and Gemini, with enterprise-grade concurrency, invoice issuance, and 24/7 technical support. Codex pricing starts at 7% of standard rates, with additional top-up discounts.

Exclusive offer for Archify users: Register through our referral link to receive 20% off your first top-up.

Try AICodeMirror →

Infistar.cc	Thank you to Infistar.cc for sponsoring Archify! One API key covers text, image, and video creation with GPT, Claude, Gemini, DeepSeek, Qwen, Kling, and other models, without switching groups. Model API pricing starts at 1% of official rates, and AI images start at ¥0.06 each.

Exclusive offer for Archify users: Sign up through our referral link for $5 in trial credits and a special offer on your first top-up.

Try Infistar →

Want to sponsor Archify? Contact us by email.

Show what matters
Explain an agent workflow	Follow a cache miss	Explore service relationships
		
Trace everything downstream of one step.	Highlight the path from web app to database.	Focus on authored backend and database connections.

The Proof Lab contains all 11 checked-in scenarios, their JSON sources, and validation receipts.

Understand a real repository

CODE → DIAGRAM · A source-backed system map

Archify traced mco-org/mco at 9f1a1cf and produced this checked map. Open it ↗ · trace reach ↗ · typed source

Easy to extend. More ways to make it yours.

COMMUNITY STORIES · Selected examples shared by users

Keep building after the diagram is generated. Archify is open source and its output is standalone HTML. Ask your agent to adapt it, connect useful links, or add interactions for your own workflow. Community creations already span team collaboration, travel planning, legal citation checks, contract review, and incident retrospectives. These are just a few examples.

One user started with a hand-drawn multi-agent architecture, turned it into an interactive diagram, then added a Kimi execution pool through conversation. Others asked their agent to read a project and brought the resulting architecture into Feishu or DingTalk for team discussion.

Another user turned a Shanghai CityWalk guide into a four-day itinerary: switch between days, inspect a stop, and jump to Amap, Xiaohongshu, or Dianping. The author also added arrival check-ins and stop notes, turning the itinerary into a small tool to use during the trip. These extensions were added by the community author for this particular artifact.

▶ Explore the interactive Shanghai CityWalk

▶ Try the interactive version · Switch between D1–D4 and click a place to explore.

Community artifact · Shanghai CityWalk · Four days of routes and place links

Download it. Open it. Explore it.

The output is a self-contained HTML file. Download it and open it in your browser to use the node details and path exploration included in that artifact. No Archify installation is needed to view it. Send the HTML to someone else and the interactions go with it; external websites and map links need a network connection.

Explore the Shanghai CityWalk ↗ · Download HTML ↓

Try switching between D1–D4, opening a place card, or following a map link. Times and place information reflect the author's original itinerary.

Community and recognition
#1 on GitHub Trending's weekly, all-language repository list. Ranking screenshot published by the creator on September 1, 2026, with all languages and “This week” selected.
Featured and interviewed by QbitAI. Project feature · The developer's story.
Shared with developer communities. midudev's post.

A selection of public coverage, community shares, and historical milestones. Follow the links for dates and sources.

Preview
Themes, exports, and share cards
Quick start

Current stable version: v3.2.0. See Changelog.

1. Install
Install Archify for me by reading https://raw.githubusercontent.com/tt-a1i/archify/main/llms.txt

More installation options and update-check details
Stay updated
Get release notifications: select Watch → Custom → Releases at the top of this GitHub repository. Starring the project does not subscribe you to release notifications.
See what changed: Release notes.
Use a feed reader: Subscribe to the release feed.

Installations with the update checker also check for newer stable releases during diagram delivery and can show a reminder. Older installations without the checker need a manual update to gain this feature. You choose whether and when to upgrade; Archify never installs updates automatically.

2. Start from a description — no repository required
Use Archify to draw: Browser -> API -> Redis cache -> PostgreSQL fallback.


For source evidence, open a repository and ask:

Analyze this repository, then use archify to create a high-level runtime architecture diagram.
Show 8–12 core components, one primary path, external dependencies, and trust boundaries.
Put supporting detail in cards instead of adding more edges.

3. Refine in chat

Continue with focused requests such as add Redis, move auth to the left, or highlight the rollback path. Archify keeps the typed source available for targeted iteration.

Choose the right diagram
Ten diagram types, architecture comparisons, and examples
Why Archify
Understand the structure	Walk through the story
Map components, workflows, and relationships from code or a description.	Explore nodes, follow paths, and share any view as a link.
Extend it your way	Share the result
Keep an editable source and build on the open-source code or generated HTML with your own interactions and use cases.	Share a self-contained HTML file or export images, video, and share cards.
The engineering behind the experience
How it works
Generation, validation, preview, and delivery details
Explore and share the output
Action	Control
Open the factual Diagram Guide	?
Find and focus a semantic node	/
Trace upstream/downstream authored reach	Focus a node → Upstream / Downstream
Probe a directed route and inspect its journey	R or PATH
Compare one or two semantic roles	L or LENS
Open the live overview radar	M or MAP
Enter Presentation Stage	F
Choose visual style (S cycles) / toggle theme / open Export	S / T / E
Zoom or reset	+ / - / 0

Stable links can restore #focus=<id>, #focus=<id>&reach=upstream|downstream, #relation=<id>, #route=<source>~<target>, and #lens=<kind>~<kind>. Live repeats connection flow until paused; semantic previews remain bounded. Motion respects prefers-reduced-motion and never enters canonical exports.

The complete generation and viewer contract lives in archify/SKILL.md.

Installation options
Surface	Install location or method	Capability
Claude Code	~/.claude/skills/ or .claude/skills/	Full renderer + validation workflow
Codex CLI	~/.agents/skills/ or .agents/skills/	Full renderer + validation workflow
opencode	~/.config/opencode/skills/, .opencode/skills/, or .agents/skills/	Full renderer + validation workflow
Claude.ai	Upload archify.zip under Settings → Capabilities → Skills	Depends on Node.js access in the sandbox
Project Knowledge	Upload archify.zip to the project	Prompt-driven architecture fallback
Hermes Agent	Opt-in: hermes skills install skills-sh/tt-a1i/archify/archify -y	Community Skill-only integration; Node >=18; not a Nous official product. No telemetry. It is not a switcher target. Details.
DeepSeek Harness	Opt-in: dsh plugin --profile web add @tt-a1i/archify-dsh@1.0.0. Invoke: Use the archify skill to map this repository's runtime architecture. Remove: dsh plugin --profile web remove @tt-a1i/archify-dsh.	Community integration for developer-preview @deepseek-ai/dsh@0.1.2-rc.1; Node ^22.19.0 || >=24.0.0; not an official DeepSeek product. No telemetry. Shell files need exact workspace paths, not Web Produced Files. Details.
Reference and scope
Schema reference · Skill · Examples · Agent cookbook
Changelog
Roadmap
Generated Proof Lab

Automatic Mermaid parsing, general-purpose auto-layout, hosted sharing, and WYSIWYG editing are intentionally outside the current scope.

Community

👋 Welcome to the Archify Community!

Connect with other users and developers, share ideas, request features, report bugs, discuss development, and help make Archify better together.

 Discord
 WeChat: scan the QR code below. WeChat group codes expire periodically; if this one has expired, ask for the current code through Discord or QQ.
 QQ group: 1121948602
 WeChat
	 QQ


Official channels and third-party services
Open-source project: Current source and packages built from it are available under the Apache License 2.0; previously published releases retain their original licenses.
Official website: archify.si currently provides project information, examples, and installation guidance.
Third-party services: Pricing, data handling, and support are determined by the respective provider. A similar name or domain does not establish an official affiliation.
License

Apache-2.0 — free to use, modify, and distribute.

Historical MIT grants remain in effect; see NOTICE and LICENSE-MIT. Third-party components retain their own licenses. The software license does not change ownership of your authored content or grant general permission to use Archify trademarks.

Contributing

Building a standalone package on Archify? Submit it to the community catalog; the guide includes a collapsible example and complete Chinese steps.

Issues, pull requests, and real-world diagrams are welcome. Start with the contribution guide, use the reproducible bug form for failures, or submit a validated diagram through the community showcase form. · LINUX DO

Support Archify

If Archify has been useful to you, you can support its continued development. Thank you for helping keep the project going ❤️

Support via WeChat Pay
Support via Alipay

Using Archify, sharing it, reporting bugs, and contributing improvements are also ways to help.

Contributors

Thanks to everyone who helped build Archify. Go follow them. ❤️

Star History