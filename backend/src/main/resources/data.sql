-- Usuário de demonstração para login (username: admin / senha: admin123)
INSERT INTO usuarios (username, senha, nome) VALUES
('admin', '$2a$10$UL.T2dO3y7Cv2XauBnZTdO.gaBdO.b/er9xYrGYmjzUOsAsmG/hze', 'Administrador');

-- Inserindo Veículos
INSERT INTO veiculos (placa, modelo, tipo, ano) VALUES
('ABC-1234', 'Fiorino', 'LEVE', 2022),
('XYZ-9876', 'Volvo FH', 'PESADO', 2021),
('KJG-1122', 'Mercedes Sprinter', 'LEVE', 2020),
('LMN-4455', 'Scania R500', 'PESADO', 2023);

-- Inserindo Viagens (Para testar o Dashboard)
INSERT INTO viagens (veiculo_id, data_saida, data_chegada, origem, destino, km_percorrida) VALUES
(1, '2024-05-01 08:00:00', '2024-05-01 18:00:00', 'São Paulo', 'Rio de Janeiro', 435.00),
(1, '2024-05-05 09:00:00', '2024-05-05 12:00:00', 'Rio de Janeiro', 'Niterói', 20.50),
(2, '2024-05-02 05:00:00', '2024-05-03 20:00:00', 'Curitiba', 'Belo Horizonte', 1000.00);

-- Inserindo Manutenções (Para testar o Cronograma e Custos)
INSERT INTO manutencoes (veiculo_id, data_inicio, data_finalizacao, tipo_servico, custo_estimado, status) VALUES
(1, '2024-06-10', '2024-06-11', 'Troca de Óleo', 350.00, 'PENDENTE'),
(2, '2024-06-15', '2024-06-17', 'Revisão de Freios', 1500.00, 'PENDENTE'),
(3, '2024-05-20', '2024-05-20', 'Troca de Pneus', 2200.00, 'CONCLUIDA');

-- Duas manutenções extras com data_inicio calculada em cima do mês atual (CURRENT_DATE),
-- para a métrica "Projeção Financeira" do dashboard nunca ficar zerada, independente
-- de quando o projeto for rodado/avaliado já que o seed original é de 2024.
INSERT INTO manutencoes (veiculo_id, data_inicio, data_finalizacao, tipo_servico, custo_estimado, status) VALUES
(2, (date_trunc('month', CURRENT_DATE) + INTERVAL '5 days')::date, NULL, 'Troca de Correia Dentada', 980.00, 'PENDENTE'),
(4, (date_trunc('month', CURRENT_DATE) + INTERVAL '12 days')::date, (date_trunc('month', CURRENT_DATE) + INTERVAL '14 days')::date, 'Revisão Geral', 3200.00, 'EM_REALIZACAO');
