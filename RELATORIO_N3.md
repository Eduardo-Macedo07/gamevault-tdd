# Relatorio Tecnico N3 - GameVault

**Aluno:** Eduardo Gabriel Macedo  
**Projeto:** GameVault  
**Entrega alvo:** Nota 6  
**Nova funcionalidade:** Recomendacoes de jogos por perfil de preferencia

## 1. Nova Funcionalidade

A N3 evolui o GameVault a partir da entrega N2. A nova funcionalidade implementada foi o modulo `recommendation`, diferente da funcionalidade N2 de favoritos e avaliacoes.

O modulo permite:

- Criar perfil de recomendacao por usuario.
- Atualizar generos favoritos, plataformas e nota minima.
- Gerar recomendacoes com base no catalogo.
- Salvar recomendacoes interessantes.
- Listar e remover recomendacoes salvas.

## 2. Regras De Negocio

- `userId` e `gameId` devem ser inteiros positivos.
- Um usuario nao pode ter dois perfis de recomendacao.
- O perfil precisa ter ao menos um genero favorito e uma plataforma.
- A nota minima deve ficar entre 0 e 5.
- Recomendacoes sao filtradas por genero, plataforma e nota minima.
- Uma recomendacao nao pode ser salva duas vezes pelo mesmo usuario.
- Remover recomendacao inexistente retorna erro.

## 3. TDD Red-Green-Refactor

**Red:** os testes unitarios foram escritos para validar criacao de perfil, filtros de recomendacao, duplicidade e validacoes antes da regra estar pronta.

**Green:** o `recommendation.service.js` foi implementado com o minimo necessario para fazer os testes passarem.

**Refactor:** a validacao de ids, listas e nota minima foi extraida para funcoes auxiliares, mantendo o Service isolado do Model.

## 4. Testes Unitarios

Arquivos:

```text
src/modules/recommendation/__tests__/recommendation.service.test.js
src/modules/recommendation/__tests__/recommendation.model.test.js
src/modules/recommendation/__tests__/recommendation.controller.test.js
```

Foram adicionados 15 testes unitarios para a nova funcionalidade, cobrindo Service, Model e Controller.

Exemplos:

- `T1 - cria perfil de recomendacao com sucesso`: verifica retorno do service, uso do model mockado com `vi.fn()` e assercao `toHaveProperty`.
- `T6 - recomenda jogos filtrando genero, plataforma e nota`: valida a regra principal de recomendacao e a ordenacao dos resultados.
- `T8 - salva recomendacao com sucesso usando spyOn`: usa `vi.spyOn()` para confirmar a chamada ao metodo de persistencia.

## 5. Testes De Integracao

Arquivo:

```text
src/modules/recommendation/__tests__/recommendation.routes.test.js
```

Foram adicionados 11 testes de integracao HTTP com Supertest.

Exemplos:

- `I1 - POST /profiles cria perfil com 201`: verifica status code 201 e corpo JSON.
- `I5 - GET /profiles/:userId/recommendations lista recomendacoes`: verifica query string, status 200 e chamada ao Service mockado.
- `I11 - DELETE /users/:userId/saved/:gameId retorna 404`: valida tratamento de erro HTTP.

## 6. Mocks

O projeto usa:

- `vi.fn()` para simular metodos de Model e Service.
- `vi.mock()` para substituir dependencias nas suites de teste.
- `vi.spyOn()` para espionar chamada de persistencia.

## 7. Como Rodar

```bash
npm install
npm test
npm run test:coverage
```

Para a nota 6, o comando principal de avaliacao e:

```bash
npm test
```

Todos os testes unitarios e de integracao devem passar.

Resultado validado:

```text
npm test
7 arquivos passaram
47 testes passaram
```
