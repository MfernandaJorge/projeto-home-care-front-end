<?php
require_once '../conexao.php'; // Ajuste conforme sua estrutura

// Lê os dados JSON recebidos
$dadosJson = file_get_contents('php://input');
$dados = json_decode($dadosJson, true);

// Verificações básicas
if (!$dados || empty($dados['nome'])) {
	echo json_encode(['erro' => true, 'mensagem' => 'Dados inválidos']);
	exit;
}

// Extrai dados
$id = isset($dados['id']) && !empty($dados['id']) ? intval($dados['id']) : null;
$nome = $dados['nome'];
$data_nascimento = $dados['data_nascimento'];
$documento = $dados['documento'];
$logradouro = $dados['logradouro'];
$numero = $dados['numero'];
$bairro = $dados['bairro'];
$cidade = $dados['cidade'];
$estado = $dados['estado'];

try {
	if ($id) {
			// Atualização
			$stmt = $conn->prepare("UPDATE paciente SET nome = ?, data_nascimento = ?, documento = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ? WHERE id_paciente = ?");
			$stmt->bind_param("ssssssssi", $nome, $data_nascimento, $documento, $logradouro, $numero, $bairro, $cidade, $estado, $id);
			$stmt->execute();
			echo json_encode(['erro' => false, 'mensagem' => 'Paciente atualizado com sucesso!']);
	} else {
			// Inserção
			$stmt = $conn->prepare("INSERT INTO paciente (nome, data_nascimento, documento, logradouro, numero, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
			$stmt->bind_param("ssssssss", $nome, $data_nascimento, $documento, $logradouro, $numero, $bairro, $cidade, $estado);
			$stmt->execute();
			echo json_encode(['erro' => false, 'mensagem' => 'Paciente cadastrado com sucesso!']);
	}
} catch (Exception $e) {
	echo json_encode(['erro' => true, 'mensagem' => 'Erro: ' . $e->getMessage()]);
}
