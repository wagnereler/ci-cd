# NexaDesk CI/CD

Arquitetura DevOps com foco em automacao, ambientes versionados e rollback seguro.

## Estrutura

- `.github/workflows/ci-cd.yml`: pipeline declarativo no GitHub Actions
- `infra/environments/staging`: manifests e imagem versionada de staging
- `infra/environments/prod`: manifests e imagem versionada de prod
- `environments/staging` e `environments/prod`: espelho dos ambientes para requisito de entrega
- `platform/otel-collector-config.yaml`: configuracao de observabilidade (OpenTelemetry)
- `infra/terraform/ecr.tf`: provisionamento do repositorio de imagens (ECR)
- `RUNBOOK.md`: checklist de deploy e resposta a incidentes

## Pipeline CI/CD

Fluxo principal:

1. PR ou push em `staging` / `main` dispara CI.
2. CI executa lint/testes (quando `api/package.json` existe).
3. Em push para `staging` ou `main`, builda e publica imagem Docker com tag `github.sha`.
4. Pipeline atualiza `infra/environments/<env>/api/image.txt` e abre PR de promocao GitOps.
5. No mesmo PR, o pipeline sincroniza tambem `environments/<env>/api/image.txt`.

Mapeamento de ambiente:

- Push em `staging` -> promocao para `staging`
- Push em `main` -> promocao para `prod`

## Fluxo de Deploy (GitOps)

1. Merge em branch de aplicacao (`staging` ou `main`).
2. Pipeline publica nova imagem.
3. Pipeline abre PR alterando somente `image.txt` do ambiente alvo.
4. Aprovacao e merge do PR de promocao.
5. Ferramenta GitOps (Argo CD/Flux) aplica a mudanca no cluster.

## Rollback Seguro

Rollback e manual e auditavel via `workflow_dispatch` no workflow `CI/CD`:

- `action`: `rollback`
- `environment`: `staging` ou `prod`
- `image`: referencia completa da imagem a restaurar

O workflow abre PR de rollback (sem alteracao direta em branch protegida), permitindo revisao antes do merge.
No rollback, o workflow atualiza os dois caminhos (`infra/environments` e `environments`) para manter consistencia.

## Execucao local (API)

Se houver fonte Node.js em `api/`:

```bash
cd api
npm ci
npm test
```

Build de imagem:

```bash
docker build -t nexadesk-api:local ./api
```
