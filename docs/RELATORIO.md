# Relatorio TDD - GameVault

## Objetivo

Implementar a funcionalidade principal de gerenciamento de jogos favoritos e avaliacoes, aplicando TDD com Vitest, mocks e cobertura minima de 80% na camada Service.

## Funcionalidade Entregue

- Adicionar jogo aos favoritos.
- Remover jogo favorito.
- Listar favoritos por usuario.
- Registrar avaliacao de jogo.
- Atualizar avaliacao existente.
- Calcular media de avaliacoes por jogo.
- Listar jogos mais bem avaliados.
- Validar ids, titulo, plataforma, nota e limite de ranking.

## Ciclo Red-Green-Refactor

1. Red: foram escritos testes unitarios para cenarios de sucesso, falhas e validacoes antes da consolidacao da regra no service.
2. Green: o `game.service.js` foi implementado para passar nos testes usando um model mockavel.
3. Refactor: as validacoes comuns foram extraidas para funcoes auxiliares, mantendo a camada Service isolada da persistencia.

## Testes Unitarios

Arquivo principal: `src/modules/game/__tests__/game.service.test.js`.

Foram criados 18 testes unitarios na camada Service, cobrindo:

- Sucesso ao favoritar jogo.
- Bloqueio de favorito duplicado.
- Validacao de titulo obrigatorio.
- Validacao de plataforma obrigatoria.
- Validacao de `userId`.
- Sucesso ao remover favorito.
- Erro ao remover favorito inexistente.
- Listagem de favoritos.
- Sucesso ao avaliar jogo.
- Bloqueio de avaliacao duplicada.
- Nota menor que o minimo.
- Nota maior que o maximo.
- Atualizacao de avaliacao com `vi.spyOn()`.
- Erro ao atualizar avaliacao inexistente.
- Calculo de media.
- Media zero sem avaliacoes.
- Ranking de jogos mais bem avaliados.
- Validacao de limite do ranking.

## Mocks

O projeto usa:

- `vi.fn()` para simular metodos do model.
- `vi.mock()` para substituir `game.model.js` nos testes do service.
- `vi.spyOn()` para verificar a chamada de atualizacao da avaliacao.

## Cobertura

O Vitest foi configurado com cobertura V8 em `vitest.config.js`.

Comando:

```bash
npm run test:coverage
```

Meta configurada:

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Conteudo Para Apresentacao

Slide 1 - Tema e objetivo:

- GameVault: catalogo de jogos digitais.
- Funcionalidade principal: favoritos e avaliacoes.
- Meta: aplicar TDD e atingir cobertura minima na camada Service.

Slide 2 - Arquitetura:

- `game.service.js` contem regras de negocio.
- `game.model.js` representa persistencia/mock model.
- Testes isolam o service usando mocks.

Slide 3 - TDD aplicado:

- Red: teste falhando para cada regra.
- Green: implementacao minima para passar.
- Refactor: validacoes centralizadas e codigo mais legivel.

Slide 4 - Testes e mocks:

- 18 testes unitarios na camada Service.
- Cenarios de sucesso, falhas e validacoes.
- Uso de `vi.fn()`, `vi.mock()` e `vi.spyOn()`.

Slide 5 - Cobertura e resultado:

- Vitest configurado com provider V8.
- Threshold de 80% no Service.
- Funcionalidade pronta para demonstracao com `npm run test:coverage`.

## Conclusao

A entrega atende aos requisitos da nota 7: inclui a base da nota 6, adiciona a camada Service de jogos com mais de 15 testes unitarios, aplica TDD, usa mocks do Vitest, configura cobertura e documenta o processo para apresentacao.
