# Runbook Tecnico - Deploy e Incidentes

## 1. Checklist de Deploy

1. Confirmar branch alvo (`staging` ou `main`) e escopo da release.
2. Validar pipeline verde em `.github/workflows/ci-cd.yml`.
3. Confirmar imagem gerada com tag SHA no registro.
4. Revisar PR de promocao GitOps (`infra/environments/<env>/api/image.txt`).
5. Aprovar e fazer merge do PR.
6. Confirmar sincronizacao no operador GitOps (Argo CD/Flux).
7. Validar probes e health checks (`/health/ready`, `/health/live`).
8. Registrar horario, commit e versao promovida.

## 2. Resposta a Incidentes

Classificacao inicial:

- P1: indisponibilidade total
- P2: degradacao relevante
- P3: falha parcial/contornavel

Acoes imediatas:

1. Identificar impacto (usuarios, servicos e ambiente).
2. Congelar novas promocoes ate estabilizar.
3. Coletar sinais: logs, metricas e traces (OpenTelemetry).
4. Abrir comunicacao de incidente com timestamp inicial.

## 3. Procedimento de Rollback

1. Identificar ultima imagem estavel.
2. Executar `workflow_dispatch` com:
   - `action=rollback`
   - `environment=staging|prod`
   - `image=<registry/repo:tag_estavel>`
3. Revisar e aprovar PR de rollback.
4. Aguardar reconciliacao GitOps.
5. Validar recuperacao (health endpoints e SLOs).
6. Encerrar incidente com causa preliminar.

## 4. Pos-incidente

1. Registrar RCA (causa raiz) em ate 48h.
2. Definir acoes corretivas com responsavel e prazo.
3. Atualizar testes/pipeline/runbook para evitar recorrencia.
