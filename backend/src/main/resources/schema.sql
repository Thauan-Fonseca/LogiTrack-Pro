-- Reset a cada subida do backend: garante um dataset sempre limpo e reprodutível
-- (decisão documentada no README).
DROP TABLE IF EXISTS viagens, manutencoes, veiculos, usuarios CASCADE;

-- Tabela de usuários (autenticação). Não faz parte do script original da
-- empresa — adicionada para o diferencial de segurança (login + JWT).
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    nome VARCHAR(100)
);

-- 1. Criação da Tabela de Veículos
-- BIGSERIAL/BIGINT em vez de SERIAL/INTEGER nos IDs: Long é o tipo idiomático
-- para chaves primárias no Java/JPA (Hibernate valida o schema e exige BIGINT
-- para campos Long), então PK e FKs foram ajustadas de forma consistente.
CREATE TABLE veiculos (
    id BIGSERIAL PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('LEVE', 'PESADO')),
    ano INTEGER
);

-- 2. Criação da Tabela de Viagens
CREATE TABLE viagens (
    id BIGSERIAL PRIMARY KEY,
    veiculo_id BIGINT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    data_saida TIMESTAMP NOT NULL,
    data_chegada TIMESTAMP,
    origem VARCHAR(100),
    destino VARCHAR(100),
    km_percorrida DECIMAL(10,2)
);

-- 3. Criação da Tabela de Manutenções
CREATE TABLE manutencoes (
    id BIGSERIAL PRIMARY KEY,
    veiculo_id BIGINT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_finalizacao DATE,
    tipo_servico VARCHAR(100),
    custo_estimado DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_REALIZACAO', 'CONCLUIDA'))
);

-- Índices em FK: Postgres não cria índice automático em coluna de foreign key
-- (só na PK referenciada). O dashboard agrega/filtra por essas colunas.
CREATE INDEX idx_viagens_veiculo_id ON viagens(veiculo_id);
CREATE INDEX idx_manutencoes_veiculo_id ON manutencoes(veiculo_id);
CREATE INDEX idx_manutencoes_data_inicio ON manutencoes(data_inicio);
CREATE INDEX idx_manutencoes_status ON manutencoes(status);
