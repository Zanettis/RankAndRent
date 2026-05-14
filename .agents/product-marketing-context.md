# Product Marketing Context — Murrieta Ecosystem

> This file is the shared source of truth for all marketing agents working across the three Murrieta local-service sites.

## 1. Overview

Three local home-service websites targeting Murrieta, CA homeowners, operated as a rank-and-rent PBN (Private Blog Network). Each site captures leads via an embedded form and rents or sells those leads to local contractors.

| Site | Domain | Niche |
|------|--------|-------|
| Murrieta Tree Service | murrietatreeexperts.com | Tree removal, trimming, stump grinding, emergency |
| Murrieta Landscaping | landscapingmurrieta.com | Landscape design, lawn care, irrigation, cleanup |
| Murrieta Concrete Works | murrietaconcreteworks.com | Driveways, patios, walkways, decorative concrete |

## 2. Target Audience

**Primary:** Homeowners in Murrieta, CA and surrounding Southwest Riverside County cities (Temecula, Wildomar, Menifee, Lake Elsinore, Canyon Lake, Winchester).

**Psychographics:**
- Suburban homeowners aged 35–65, own their home, value curb appeal and property value
- Motivated by safety (storm damage, tree hazards), aesthetics, and HOA compliance
- Price-conscious but willing to pay for reliability and licensed/insured contractors
- Prefer local, responsive businesses over large national chains
- Often searching after a triggering event: storm damage, preparing to sell, HOA notice

## 3. Customer Personas

**Persona A — "Safe Sam"** (Tree Service)
- Homeowner with a large pine or eucalyptus showing signs of disease or storm damage
- Primary fear: tree falls on house, car, or neighbor's property
- Search intent: "emergency tree removal Murrieta" / "tree service near me"
- Decision trigger: visible hazard or insurance requirement

**Persona B — "Curb Appeal Carol"** (Landscaping)
- Homeowner preparing to sell or refinance, or received HOA letter
- Primary goal: fast visual improvement, drought-tolerant low-maintenance yard
- Search intent: "landscaping company Murrieta" / "drought tolerant landscaping Murrieta"
- Decision trigger: listing date, HOA deadline, or neighbor's beautiful yard

**Persona C — "Upgrade Dave"** (Concrete)
- Homeowner with cracked driveway or bare dirt patio who wants to add outdoor living space
- Primary motivation: property value, aesthetics, functionality for entertaining
- Search intent: "concrete driveway cost Murrieta" / "patio concrete Murrieta"
- Decision trigger: tax return, bonus, or upcoming summer entertaining season

## 4. Pain Points

- Difficulty finding reliable, licensed, local contractors (fear of scams)
- Uncertainty about fair pricing in the Murrieta market
- HOA restrictions and permit requirements (especially concrete and landscaping)
- Inland SoCal water restrictions complicating lawn and irrigation choices
- Seasonal hazards: Santa Ana winds (tree damage), summer heat stress on lawns

## 5. Differentiation

- **Local specificity:** Deep knowledge of Murrieta micro-climate, soil (expansive clay), water utilities (EVMWD/RCWD), and HOA norms
- **Lead response:** Form on every page; promise of fast local response
- **Content depth:** Long-form educational content that answers real homeowner questions
- **Cross-referral:** Each site recommends the sister sites (e.g., tree removal leads to stump grinding leads to landscaping leads to patio concrete — a natural customer journey)

## 6. Brand Voice

- **Tone:** Professional, helpful, direct. Not corporate. Feels like advice from a knowledgeable neighbor.
- **Language level:** 8th grade reading level. Avoid jargon without explanation.
- **Urgency:** Appropriate urgency for safety-related services (emergency tree, storm damage). Not pushy on aesthetic services.
- **Trust signals:** License, insurance, free estimates, local Murrieta focus emphasized in every context.

## 7. Key Proof Points & Trust Signals

- Licensed and insured (all three sites)
- Free on-site estimates / free consultations
- Local Murrieta-based operation (not a national lead aggregator)
- Inland SoCal / Southwest Riverside County expertise
- Fast response time emphasized

## 8. Competitive Landscape

- National lead aggregators (HomeAdvisor, Angi, Thumbtack) — compete on SEO; we beat them with hyper-local content
- Large regional contractors (Inland Valley Tree, etc.) — compete on brand; we beat them with specific long-tail content and GEO presence
- Other rank-and-rent sites — compete on content quality and schema markup depth

## 9. Customer Language (verbatim search phrases)

Tree: "tree removal Murrieta", "emergency tree service near me", "stump grinding cost Murrieta", "tree trimming Murrieta CA"
Landscaping: "landscaping Murrieta CA", "drought tolerant landscaping Murrieta", "lawn care Murrieta", "landscape design Murrieta"
Concrete: "concrete driveway Murrieta", "patio concrete cost Murrieta", "concrete repair Murrieta", "stamped concrete Murrieta"

## 10. Business Goals

- Rank top-3 in Google for primary service + location keywords in each niche
- Appear in AI Overviews, ChatGPT, and Perplexity responses for local service queries
- Generate 10+ qualified leads/month per site via the embedded LeadForm
- Cross-link all three sites to build topical authority across the home-services cluster

## 11. Technical Context

- Framework: Astro v4 (static output), deployed on Vercel
- All sites share identical component structure (Nav, Footer, Hero, ServiceCard, LeadForm, BlogPostCard, CrossLinkWidget)
- Blog posts use Astro Content Collections (Markdown/MDX)
- GA4 active on tree-service site (G-KTE41LFEW3); landscaping and concrete need GA4 IDs
- Sitemap integration active on all three sites via @astrojs/sitemap
- llms.txt present at /llms.txt on all three sites for AI crawler discoverability
