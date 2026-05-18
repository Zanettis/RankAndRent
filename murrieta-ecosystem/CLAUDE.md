# RankAndRent — Murrieta Ecosystem

Monorepo com 3 sites Astro de Rank-and-Rent para serviços locais em Murrieta, CA. Cada site é independente (sem código compartilhado), mas segue a mesma arquitetura.

## Language

All content, copy, components, page text, meta descriptions, blog posts, and commit messages must be written in **English**. This is a US market project targeting English-speaking customers in Murrieta, CA.

---

## Inventário dos Sites

| Site | Porta dev | Domínio | Config central |
|---|---|---|---|
| `tree-service` | 3000 | murrietatreeexperts.com | `tree-service/src/config.ts` |
| `landscaping` | 4322 | landscapingmurrieta.com | `landscaping/src/config.ts` |
| `concrete` | 4323 | murrietaconcreteworks.com | `concrete/src/config.ts` |

---

## Regras para Agentes

### Escopo — declare sempre ao iniciar

**Modo single-site:** toque APENAS em `murrieta-ecosystem/{site}/`. Não leia nem modifique os outros sites.

**Modo cross-site:** aplique a mesma mudança nos 3 sites. Use sub-agentes paralelos (um por site) ou aplique sequencialmente. Documente por que é cross-site.

---

### Componentes Estruturais — replicar nos 3 sites obrigatoriamente

Mudança em qualquer um desses arquivos deve ser aplicada nos 3 sites:

- `src/components/Nav.astro`
- `src/components/Footer.astro`
- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`
- `tailwind.config.mjs` — estrutura e plugins (não as cores de brand)
- `astro.config.mjs` — plugins e integrações

Se a mudança for intencional em apenas 1 site, documente o motivo no commit.

---

### Componentes de Conteúdo — podem variar por site

- `src/pages/` — copy SEO específica do nicho
- `src/content/blog/` — posts específicos
- `src/components/ServiceCard.astro` — copy dos serviços
- `src/components/CrossLinkWidget.astro` — links entre sites
- `public/` — imagens e favicon
- `tailwind.config.mjs` — apenas as cores de brand (`primary`, `accent`, `cta`)

---

### Dados de Negócio — nunca hardcode em componentes

Telefone, email, nome, domínio, serviços = sempre via `src/config.ts` (`SITE_CONFIG`).

**Exceção conhecida:** `areaServed` em `BaseLayout.astro` está hardcoded (Murrieta, Temecula, Wildomar, Menifee, Lake Elsinore, Canyon Lake, Winchester) — é igual nos 3 sites e pode permanecer assim até refatoração futura.

---

### BaseLayout.astro — Como Adicionar Props Corretamente

O `BaseLayout.astro` já tem um bloco `interface Props` definido. **Nunca declare um segundo `interface Props`** — isso duplica a interface e não causa erro de build no Astro (TypeScript em modo lenient), mas cria confusão e comportamento inesperado.

**Correto — adicionar ao bloco existente:**
```typescript
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  aggregateRating?: { ratingValue: string; reviewCount: string }; // ← adicione aqui
}
```

**Props opcionais de schema (FAQPage, Organization, etc.):** não adicionar ao BaseLayout. Em vez disso, inserir um `<script type="application/ld+json">` diretamente na página que o usa — é o padrão já estabelecido no projeto.

Props já existentes no BaseLayout (aplicado nos 3 sites):
- `title`, `description`, `canonicalUrl`, `ogImage` — básicos
- `aggregateRating?: { ratingValue, reviewCount }` — injeta no LocalBusiness schema quando fornecido

---

### GA4 / gtag — Regra Obrigatória no Astro

Scripts do GA4 em qualquer `BaseLayout.astro` **devem** ter `is:inline` e atribuir `window.gtag` explicitamente:

```html
<!-- correto -->
<script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);}
  window.gtag('js', new Date());
  window.gtag('config', 'G-XXXXXX');
</script>
```

**Por quê:** Astro processa `<script>` sem `is:inline` como ES module (adiciona `type="module"` implicitamente). Em ES modules, `function gtag(){}` é local ao módulo e nunca vira `window.gtag`. Componentes que tentam chamar `window.gtag` recebem `undefined` e todos os eventos customizados do GA4 são silenciosamente descartados — sem erro no console, sem indício de falha.

**Sintoma:** `page_view` e `form_start` chegam ao GA4 (eventos automáticos do script externo), mas eventos custom como `generate_lead` e `phone_click` nunca aparecem — nem no Realtime, nem no Events.

Em componentes (LeadForm, Nav, etc.) que chamam gtag, sempre usar bracket notation:

```js
if (typeof (window as any).gtag === 'function') {
  (window as any).gtag('event', 'nome_do_evento', { event_category: '...', event_label: '...' });
}
```

IDs GA4 por site: tree-service `G-KTE41LFEW3` | landscaping `G-NJW91608HL` | concrete `G-SP7FPJ0JDT`

---

### OG Images — Convenção

Imagens referenciadas em `<meta property="og:image">` **devem estar em `public/images/`**, não em `src/assets/images/`. Arquivos em `src/assets/` são processados pelo pipeline do Astro e não acessíveis como URLs estáticas nos meta tags.

| Site | OG image padrão |
|---|---|
| tree-service | `public/images/hero.jpg` ✓ |
| landscaping | `public/images/hero.jpg` ✓ |
| concrete | `public/images/hero.jpg` ✓ |

O default no `BaseLayout.astro` de todos os 3 sites é `ogImage = '/images/hero.jpg'`. Páginas com imagem própria passam o prop `ogImage="/images/nome-da-imagem.jpg"`.

---

### ⚠️ Pendências de Segurança (ação manual necessária)

**`.env` commitados com credenciais reais:**
Os arquivos `.env` de todos os 3 sites estão no histórico do git com a chave real do Resend (`RESEND_API_KEY`). Ações necessárias:
1. Revogar e regenerar a API key no dashboard da Resend
2. `git rm --cached murrieta-ecosystem/tree-service/.env murrieta-ecosystem/landscaping/.env murrieta-ecosystem/concrete/.env`
3. Adicionar `.env*` ao `.gitignore` da raiz
4. Configurar as variáveis de ambiente no dashboard do Vercel (não usar `.env` local para produção)

**Números de telefone placeholder:**
Os `config.ts` dos 3 sites usam números fictícios (555-XXXX). Esses números aparecem no schema LocalBusiness e em vários blog posts. Substituir pelos números reais antes de fazer o go-live.

---

### Inventário de Páginas por Site

#### Páginas de Comparação/Alternativas
| Site | Páginas |
|---|---|
| tree-service | `thumbtack-alternatives.astro`, `homeadvisor-alternatives.astro` |
| landscaping | `local-vs-big-box-landscaping.astro`, `homeadvisor-alternatives.astro` |
| concrete | `homeadvisor-alternatives.astro` |

> Antes de criar uma comparison page nova, verificar sempre com `ls src/pages/` — o agente explorador já deixou de detectar páginas existentes nesse projeto.

#### Blog posts (contagem aproximada, maio 2026)
- tree-service: ~13 posts
- landscaping: ~16 posts
- concrete: ~15 posts

#### City landing pages (com FAQPage schema)
7 cidades × 3 sites = 21 páginas: Murrieta, Temecula, Wildomar, Menifee, Perris, San Jacinto, Hemet, Fallbrook

---

### Schema.org — Inventário Completo (pós Phase 2+3)

| Página / Template | Schemas presentes |
|---|---|
| Todas as páginas (BaseLayout) | `LocalBusiness` (+ `AggregateRating` opcional via prop) |
| `index.astro` | `FAQPage` (inline) + `AggregateRating` (via BaseLayout prop) |
| `about.astro` | `Organization` (inline — foundingDate, logo, address) |
| City pages (`/temecula/`, etc.) | `FAQPage` (inline, 3–4 perguntas por cidade) |
| Service pages (`/services/*`) | `Service` + `BreadcrumbList` |
| `blog/[...slug].astro` | `BlogPosting` + `BreadcrumbList` + `HowTo` (condicional via frontmatter `howToSteps`) |
| Comparison pages | `FAQPage` |

**AggregateRating — valores placeholder (atualizar com dados reais):**
- tree-service: 4.9 / 87 reviews
- landscaping: 4.8 / 62 reviews
- concrete: 4.9 / 74 reviews

---

### Convenções de Commit

```
feat(tree-service): adiciona seção FAQ na homepage
feat(all-sites): atualiza Footer com link de privacidade
fix(landscaping): corrige hero em mobile
chore(all-sites): atualiza dependências Astro
content(concrete): novo post sobre driveways estampados
```

**Prefixos:** `feat` | `fix` | `chore` | `content` | `seo` | `style`
**Escopo:** nome do site (`tree-service`, `landscaping`, `concrete`) ou `all-sites`

---

### Build — obrigatório antes de concluir

```bash
# Verificar antes de commitar
cd murrieta-ecosystem/tree-service && npm run build
cd murrieta-ecosystem/landscaping && npm run build
cd murrieta-ecosystem/concrete && npm run build
```

Build falhou = não commitar. Corrija primeiro.

**Sinal de saúde no log do build:** a linha `[build] output: "hybrid"` deve aparecer sempre. Se aparecer `[build] output: "static"`, o Vercel está buildando do diretório errado (ver seção Vercel abaixo).

---

### Vercel — Configuração e Diagnóstico

Cada site tem seu próprio projeto na Vercel. Configurações obrigatórias em cada projeto:

#### Dashboard (Project Settings → Build and Deployment)

| Projeto Vercel | Root Directory |
|---|---|
| rank-and-rent-tree-service | `murrieta-ecosystem/tree-service` |
| rank-and-rent-landscaping | `murrieta-ecosystem/landscaping` |
| rank-and-rent-concrete | `murrieta-ecosystem/concrete` |

"Include files outside the root directory in the Build Step" deve estar **Enabled**.

#### vercel.json (em cada site)

```json
{
  "buildCommand": "npm run build",
  "installCommand": "cd ../.. && npm install",
  "framework": "astro",
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.SEU-DOMINIO.com" }],
      "destination": "https://SEU-DOMINIO.com/:path*",
      "permanent": true
    }
  ]
}
```

O `cd ../.. && npm install` é essencial — instala do root do monorepo para que o workspace hoisting funcione corretamente (deps transitivas como `zod` ficam disponíveis).

O redirect `www → não-www` é obrigatório. Sem ele, o Google rastreia as duas versões e classifica as páginas `www` como "Página alternativa com tag canônica adequada" no Search Console, desperdiçando crawl budget. O `permanent: true` emite um 301, que transfere o valor de SEO para a versão canônica.

#### package.json (em cada site)

Cada site deve ter:
```json
"engines": {
  "node": "20.x"
}
```

**Por quê:** `@astrojs/vercel@7.x` só reconhece Node 18 e 20 no seu mapa interno. Se o Vercel buildar com Node 22 (que é o padrão atual), o adapter não reconhece e faz fallback para `nodejs18.x`. Node 18 foi removido da Vercel em 2025 (EOL). Pinnar Node 20 evita esse ciclo.

#### Diagnóstico rápido de falhas

| Sintoma no log | Causa | Fix |
|---|---|---|
| `[build] output: "static"` | Root Directory errado no dashboard | Configurar `murrieta-ecosystem/{site}` no dashboard |
| `Missing pages directory: src/pages` | Idem (buildando da raiz do repo) | Idem |
| `invalid "runtime": nodejs18.x` | Vercel buildou com Node 22, adapter fez fallback | Garantir `engines.node: "20.x"` no package.json do site |
| `Cannot find module 'zod'` | installCommand rodando só no subdiretório | Garantir `cd ../.. && npm install` no vercel.json |

#### Diagnóstico rápido de SEO (Search Console)

| Sintoma no Search Console | Causa | Fix |
|---|---|---|
| "Página alternativa com tag canônica adequada" em ~N páginas | `www.dominio.com` acessível sem redirect; Google rastreia ambas as versões | Garantir o bloco `redirects` no `vercel.json` redirecionando `www` → não-`www` |

---

### Protocolo Multi-Agente (cross-site simultâneo)

1. **Coordenador** define a spec completa da mudança (o quê, onde, como)
2. Spawnar 3 sub-agentes, cada um com:
   - A spec completa
   - Seu site designado (`tree-service` | `landscaping` | `concrete`)
   - Instrução: tocar APENAS em `murrieta-ecosystem/{site}/`
3. Cada agente commita separadamente com o escopo correto
4. Agente coordenador verifica build nos 3 sites ao final

---

## Comandos Rápidos

```bash
# Dev
cd murrieta-ecosystem/tree-service && npm run dev      # http://localhost:3000
cd murrieta-ecosystem/landscaping && npm run dev       # http://localhost:4322
cd murrieta-ecosystem/concrete && npm run dev          # http://localhost:4323

# Build
cd murrieta-ecosystem/tree-service && npm run build
cd murrieta-ecosystem/landscaping && npm run build
cd murrieta-ecosystem/concrete && npm run build

# Preview pós-build
cd murrieta-ecosystem/tree-service && npm run preview
```

---

## Arquitetura de Componentes

```
{site}/
├── src/
│   ├── config.ts          ← dados do negócio (phone, email, services, etc.)
│   ├── layouts/
│   │   └── BaseLayout.astro  ← layout base com SEO/Schema.org
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── LeadForm.astro
│   │   ├── ServiceCard.astro
│   │   ├── BlogPostCard.astro
│   │   └── CrossLinkWidget.astro  ← links para os outros 2 sites
│   ├── pages/
│   │   ├── index.astro
│   │   ├── contact.astro
│   │   ├── blog/
│   │   └── services/      ← 4 páginas de serviço por site
│   └── content/
│       └── blog/          ← posts em markdown
├── public/                ← imagens, favicon
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Cross-links Entre Sites (Footer/Widget)

Os 3 sites se referenciam mutuamente:
- tree-service → landscapingmurrieta.com | murrietaconcreteworks.com
- landscaping → murrietatreeexperts.com | murrietaconcreteworks.com
- concrete → murrietatreeexperts.com | landscapingmurrieta.com
