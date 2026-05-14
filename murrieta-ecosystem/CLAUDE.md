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
  "framework": "astro"
}
```

O `cd ../.. && npm install` é essencial — instala do root do monorepo para que o workspace hoisting funcione corretamente (deps transitivas como `zod` ficam disponíveis).

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
