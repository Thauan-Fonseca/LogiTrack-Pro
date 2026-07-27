# LogiTrack Pro

MVP desenvolvido para o desafio técnico da **LogAp I.T. Solutions**: um sistema web para a LogiTrack (empresa fictícia de logística) centralizar o controle de sua frota, com um módulo de gestão de viagens e um dashboard de inteligência de dados.

## Demonstração

🔗 **[https://logitrack-pro-1.onrender.com](https://logitrack-pro-1.onrender.com)**

```
usuário: admin
senha:   admin123
```

> Hospedado no plano gratuito do Render — se o link demorar pra responder na primeira tentativa (o serviço "dorme" após 15 min sem uso), é o backend acordando (~30-60s). Na segunda tentativa já responde normal.

## Stack

- **Backend**: Java 21, Spring Boot 4.1 (Web, Data JPA, Validation, Security, Actuator), springdoc-openapi (Swagger), Lombok, Maven
- **Banco de dados**: PostgreSQL 16
- **Autenticação**: Spring Security + JWT ([jjwt](https://github.com/jwtk/jjwt))
- **Frontend**: React 19 + TypeScript, Vite, React Router 6, Axios
- **Infra**: Docker + Docker Compose, Nginx, deploy em nuvem (Render)

## Como rodar

### Opção 1 — Docker Compose (recomendado, um comando só)

Requisito: só o Docker instalado.

```bash
docker compose up --build
```

Acesse **http://localhost:8081**. O Postgres, o backend e o frontend sobem juntos, na ordem certa (o Compose espera cada serviço ficar saudável antes de subir o próximo).

Para derrubar tudo (e recomeçar o banco do zero):

```bash
docker compose down -v
```

### Opção 2 — Rodando local, sem Docker

Pré-requisitos: JDK 21+, Node 20+, e um Postgres rodando em algum lugar (pode ser via Docker, só pra esse banco).

**1. Banco de dados** (container avulso, isolado de qualquer Postgres que você já tenha instalado):

```bash
docker run -d --name logitrack-postgres-dev \
  -e POSTGRES_DB=logitrack_pro \
  -e POSTGRES_USER=logitrack \
  -e POSTGRES_PASSWORD=logitrack123 \
  -p 5433:5432 \
  postgres:16-alpine
```

**2. Backend** (sobe em `http://localhost:8080`; não precisa instalar Maven, o projeto usa o Maven Wrapper):

```bash
cd backend
./mvnw spring-boot:run
```

**3. Frontend** (sobe em `http://localhost:5173`):

```bash
cd frontend
npm install
npm run dev
```

### Credenciais de demonstração

```
usuário: admin
senha:   admin123
```

### Documentação da API

Com o backend no ar, a documentação interativa (Swagger UI) fica em `/swagger-ui.html` (local: `http://localhost:8080/swagger-ui.html`).

## Deploy em nuvem (Render)

A aplicação está publicada no Render como 3 recursos separados, a partir do mesmo repositório:

- **PostgreSQL** — banco gerenciado pelo Render
- **Web Service (backend)** — `Root Directory: backend`, builda o `Dockerfile` do backend
- **Web Service (frontend)** — `Root Directory: frontend`, builda o `Dockerfile` do frontend

Variáveis de ambiente específicas do deploy:

| Serviço | Variável | Valor |
|---|---|---|
| Backend | `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` | Fornecidos pelo Postgres gerenciado do Render |
| Backend | `APP_CORS_ALLOWED_ORIGINS` | URL pública do serviço de frontend |
| Frontend | `VITE_API_URL` | URL pública do serviço de backend (variável de **build**, não de runtime) |

Por que `VITE_API_URL` em vez do proxy do Nginx usado localmente: ver a seção "Comunicação frontend → backend" nas decisões técnicas abaixo.

## Arquitetura

```
Dev local (sem Docker):
  Navegador → Vite :5173 ──(CORS)──→ Spring Boot :8080 ──JDBC──→ PostgreSQL :5433

Docker Compose (local):
  Navegador → Nginx :8081 ──proxy /api/*──→ Spring Boot :8080 ──JDBC──→ PostgreSQL :5433

Render (produção):
  Navegador → Nginx (serve estáticos do React)
      └────────────(CORS, chamada direta)────────→ Spring Boot ──JDBC──→ PostgreSQL (Render)
```

Backend em camadas convencionais:

```
controller/   → recebe HTTP, valida entrada (@Valid), nunca fala com o banco direto
service/      → regra de negócio (interface + Impl)
repository/   → Spring Data JPA; queries do dashboard em SQL nativo (@Query)
model/        → entidades JPA (espelham as tabelas)
dto/          → contrato da API (records), nunca expõe entidade JPA direto
mapper/       → converte Entity ↔ DTO
security/     → JWT (geração, validação, filtro, entry point)
exception/    → tratamento de erro centralizado (@RestControllerAdvice)
config/       → CORS, Security
```

## As 5 métricas do Dashboard

Todas calculadas via SQL nativo (`@Query(nativeQuery = true)`), não em memória no Java — a agregação (`SUM`, `COUNT`, `GROUP BY`) é feita pelo Postgres, que é o lugar certo pra isso:

| Métrica | Onde | Observação |
|---|---|---|
| Total de KM percorrido | `ViagemRepository.calcularTotalKm` | Frota inteira ou filtrado por veículo (`?veiculoId=`) |
| Volume por Categoria | `VeiculoRepository.volumePorCategoria` | `LEFT JOIN` a partir de `veiculos` — categoria aparece mesmo com 0 viagens |
| Cronograma de Manutenção | `ManutencaoRepository.proximasManutencoes` | 5 mais recentes, excluindo `CONCLUIDA` |
| Ranking de Utilização | `VeiculoRepository.rankingUtilizacao` | Top 5 por km acumulado |
| Projeção Financeira | `ManutencaoRepository.projecaoFinanceiraMesAtual` | Soma do custo de manutenções com `data_inicio` no mês atual, independente do status |

## Decisões técnicas

**Módulo de CRUD**
- Escolhido: **Viagens** (o enunciado pedia a implementação de apenas um dos dois módulos)
- As tabelas e queries de Manutenção continuam existindo e alimentando o dashboard, só sem tela de CRUD própria

**Inicialização do banco: `schema.sql` + `data.sql`, em vez de Flyway ou `ddl-auto=update`**
- Reaproveita quase literalmente o script fornecido pela empresa, sem introduzir uma ferramenta de migração nova para um MVP
- `ddl-auto=update` foi descartado por ser antipadrão fora de prototipagem (não reproduz `CHECK` constraints, não é rastreável)
- O banco é recriado do zero a cada subida do backend — garante um dataset sempre consistente durante a avaliação; dados criados via CRUD não persistem entre reinícios

**`BIGSERIAL`/`BIGINT` em vez de `SERIAL`/`INTEGER` nos IDs**
- `Long` é o tipo idiomático para chaves primárias em Java/JPA
- O Hibernate valida o schema no boot e rejeita a inicialização se a coluna for `SERIAL` (32 bits) contra um campo `Long` (64 bits)
- PK e FKs foram ajustadas de forma consistente

**Índices adicionados**: `viagens.veiculo_id`, `manutencoes.veiculo_id`, `manutencoes.data_inicio`, `manutencoes.status`
- Postgres não cria índice automático em coluna de foreign key (só na PK referenciada)
- São exatamente essas colunas que o dashboard agrega e filtra

**Constraints reforçadas no banco**
- `NOT NULL` em `veiculo_id` (viagens e manutenções)
- `CHECK` em `manutencoes.status`, replicando o padrão que o próprio script original já usa em `veiculos.tipo`

**Seed de manutenções com data relativa ao mês atual**
- Duas manutenções extras no `data.sql`, com `data_inicio` calculada em cima de `CURRENT_DATE`
- O seed original é de 2024; sem essa mudança, a métrica de Projeção Financeira ("mês atual") sempre mostraria R$ 0,00, não importa quando o projeto for avaliado

**Projeção Financeira soma manutenções de qualquer status no mês atual** (não só `PENDENTE`)
- Interpretação adotada: é uma projeção do que está programado gastar no mês, então uma manutenção já `CONCLUIDA` dentro do mês ainda representa um gasto real daquele mês

**DTOs e entidades**
- Records (Java 17+) para os DTOs
- Entidades JPA com Lombok `@Getter`/`@Setter`, nunca `@Data` — evita `equals`/`hashCode`/`toString` percorrendo relacionamentos e caindo em `LazyInitializationException`

**Tabela `usuarios` (não existe no script original da empresa)**
- Adicionada exclusivamente para suportar o login: `id`, `username` (único), `senha` (hash bcrypt), `nome`
- O script fornecido no desafio cobria apenas veículos/viagens/manutenções — a autenticação foi incorporada depois, como diferencial, e exigiu essa tabela nova

**Autenticação**
- Usuário único via seed (sem tela de cadastro) — suficiente para demonstrar o diferencial de segurança sem expandir o escopo do desafio
- Senha armazenada com hash `BCrypt`, nunca em texto puro
- Token JWT stateless guardado no `localStorage` do navegador
- Alternativa de cookie `httpOnly` foi considerada, mas descartada por exigir CSRF token e configuração extra de `SameSite` sem ganho de segurança proporcional ao escopo deste projeto

**CORS configurável por variável de ambiente** (`APP_CORS_ALLOWED_ORIGINS`)
- Permite trocar a origem permitida sem rebuild: `localhost:5173` no dev local, `localhost:8081` no Docker Compose, a URL pública do frontend no deploy em nuvem

**Comunicação frontend → backend: dois mecanismos, um por ambiente**
- **Docker Compose (local)**: o Nginx faz proxy reverso de `/api/*` pro backend, via `BACKEND_URL=http://backend:8080` — o navegador só fala com uma origem, então não precisa de CORS
- **Deploy em nuvem (Render)**: o navegador chama a URL pública do backend **diretamente**, via `VITE_API_URL` (assada no bundle JS em tempo de build) + CORS
- Motivo da divergência: no Render, os dois serviços ficam atrás da mesma borda pública (Cloudflare). Um proxy servidor-a-servidor entre dois serviços atrás da mesma borda é interpretado como loop e bloqueado com `508 Loop Detected` — chamar o backend direto contorna esse problema
- `proxy_ssl_server_name on;` no Nginx: necessário sempre que o upstream de um proxy é HTTPS — sem essa diretiva, o Nginx não envia o SNI no handshake TLS, e um upstream que roteia por SNI (como o do Render) rejeita a conexão

**Porta `5433` para o Postgres local** (tanto no `docker-compose.yml` quanto no container avulso de desenvolvimento)
- Evita conflito com qualquer instalação local de Postgres na porta padrão `5432`

**`react-router-dom` fixado na major 6**
- A v7 carrega uma lista extensa de CVEs concentradas em recursos de SSR/React Server Components/server actions (modo "framework") que esta aplicação não usa (SPA 100% client-side); a v6 não tem essa superfície de ataque

## Alterações no script SQL fornecido

O script original (`Desafio LogAp TRE - Carga Inicial.sql`) foi mantido quase integralmente para as tabelas de veículos/viagens/manutenções — os ajustes nelas estão listados na seção de decisões acima. A tabela `usuarios` é a única adição completa, sem equivalente no script original (motivo também explicado acima). O script final em uso é [`backend/src/main/resources/schema.sql`](backend/src/main/resources/schema.sql) (schema) + [`backend/src/main/resources/data.sql`](backend/src/main/resources/data.sql) (seed), reproduzido aqui:

```sql
-- schema.sql
DROP TABLE IF EXISTS viagens, manutencoes, veiculos, usuarios CASCADE;

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    nome VARCHAR(100)
);

CREATE TABLE veiculos (
    id BIGSERIAL PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('LEVE', 'PESADO')),
    ano INTEGER
);

CREATE TABLE viagens (
    id BIGSERIAL PRIMARY KEY,
    veiculo_id BIGINT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    data_saida TIMESTAMP NOT NULL,
    data_chegada TIMESTAMP,
    origem VARCHAR(100),
    destino VARCHAR(100),
    km_percorrida DECIMAL(10,2)
);

CREATE TABLE manutencoes (
    id BIGSERIAL PRIMARY KEY,
    veiculo_id BIGINT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_finalizacao DATE,
    tipo_servico VARCHAR(100),
    custo_estimado DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_REALIZACAO', 'CONCLUIDA'))
);

CREATE INDEX idx_viagens_veiculo_id ON viagens(veiculo_id);
CREATE INDEX idx_manutencoes_veiculo_id ON manutencoes(veiculo_id);
CREATE INDEX idx_manutencoes_data_inicio ON manutencoes(data_inicio);
CREATE INDEX idx_manutencoes_status ON manutencoes(status);
```

## Endpoints da API

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | Não | Login, retorna o JWT |
| GET | `/api/veiculos` | Sim | Lista veículos (popula os selects) |
| GET | `/api/viagens` | Sim | Lista viagens |
| GET | `/api/viagens/{id}` | Sim | Busca uma viagem |
| POST | `/api/viagens` | Sim | Cria viagem |
| PUT | `/api/viagens/{id}` | Sim | Atualiza viagem |
| DELETE | `/api/viagens/{id}` | Sim | Exclui viagem |
| GET | `/api/dashboard?veiculoId=` | Sim | As 5 métricas do dashboard |
| GET | `/actuator/health` | Não | Healthcheck (usado pelo Docker Compose) |

Detalhes de request/response de cada rota estão no Swagger UI (seção "Documentação da API" acima).

## Diferenciais implementados

- ✅ **Frontend moderno**: React + TypeScript
- ✅ **Segurança**: tela de login com autenticação JWT, rotas protegidas
- ✅ **DevOps**: Docker Compose local (um comando sobe banco + backend + frontend) **e** deploy em nuvem no Render
- ✅ Tema claro/escuro
- ✅ Layout responsivo (sidebar no desktop, navegação inferior fixa no mobile)
