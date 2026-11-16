# GameVault TDD

Plataforma de catalogo de jogos digitais criada para o trabalho de Testes de Software com foco em TDD.

## Funcionalidade Principal

Gerenciamento de jogos favoritos e avaliacoes:

- adicionar, remover e listar favoritos;
- registrar e atualizar avaliacoes;
- calcular media de avaliacoes;
- listar jogos mais bem avaliados.

## Tecnologias

- Node.js
- Express
- Vitest
- V8 Coverage

## Como instalar e rodar

Requisito: Node.js 18 ou superior.

```bash
git clone https://github.com/Eduardo-Macedo07/gamevault-tdd.git
cd gamevault-tdd
npm install
cp .env.example .env     # opcional: ajusta a PORT (padrão 3000)
npm start                # sobe a aplicação em http://localhost:3000
```

Para desenvolvimento com recarga automática: `npm run dev`.
Para conferir que a aplicação está de pé, abra `http://localhost:3000/health`
(resposta esperada: `{"status":"ok"}`).

## Como rodar os testes

```bash
npm test                 # roda toda a suíte (Vitest)
npm run test:coverage    # testes com cobertura (mínimo de 80% na camada Service)
```

## Scripts

```bash
npm test
npm run test:run
npm run test:coverage
```

## Gestão de configuração

- Plano de GCS: [docs/gcs/Plano_Gerenciamento_Configuracao_GameVault.pdf](docs/gcs/Plano_Gerenciamento_Configuracao_GameVault.pdf)
  (índice em [docs/README.md](docs/README.md)).
- A `main` é protegida: só recebe alterações por Pull Request, com 1 aprovação do par de
  revisão (`@Felipe-Schwabe`), histórico linear e sem exceções.
- Merge somente por **squash**; o título do PR (Conventional Commits) vira a mensagem do commit.
- Ambientes (GitHub Environments): `staging` e `production`; o `production` exige a
  aprovação do dono do repositório.
- Nenhum segredo no código: use `.env` (ignorado pelo Git); veja `.env.example`.

## Estrutura Principal

```text
src/modules/game/game.service.js
src/modules/game/game.model.js
src/modules/game/__tests__/game.service.test.js
vitest.config.js
test/setup.js
RELATORIO.md
```

## Requisitos Da Nota 7

- 15 ou mais testes unitarios na camada Service: entregue com 18 testes.
- TDD Red-Green-Refactor: documentado em `RELATORIO.md`.
- Mocks com `vi.fn()`, `vi.mock()` e `vi.spyOn()`: usados nos testes do service.
- Vitest com cobertura: configurado em `vitest.config.js`.
- Cobertura minima de 80% no Service: thresholds configurados.
- Relatorio e conteudo para apresentacao: disponiveis em `RELATORIO.md`.

## Complemento N3 - Nota 6

Nova funcionalidade adicionada: recomendacoes de jogos por perfil de preferencia.

Arquivos principais:

```text
src/modules/recommendation/recommendation.model.js
src/modules/recommendation/recommendation.service.js
src/modules/recommendation/recommendation.controller.js
src/modules/recommendation/recommendation.routes.js
src/modules/recommendation/__tests__/
RELATORIO_N3.md
```

Foram adicionados testes unitarios e testes de integracao HTTP com Supertest para a nova funcionalidade.

Resultado validado:

```text
npm test
7 arquivos passaram
47 testes passaram
```
