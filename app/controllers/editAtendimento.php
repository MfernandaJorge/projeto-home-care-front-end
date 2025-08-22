<?php
require_once '../config/db.php'; // Ajuste para seu arquivo de conexão

// Recebe os dados JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validação básica
if (!$data) {
	echo json_encode(["erro" => true, "mensagem" => "Dados inválidos"]);
	exit;
}

// Extrai e sanitiza os dados
$id_atendimento   = isset($data["id"]) ? intval($data["id"]) : 0;
$id_paciente      = intval($data["paciente"]);
$id_profissional  = intval($data["profissional"]);
$especialidade    = trim($data["especialidade"]);
$medicacao        = trim($data["medicacao"]);
$cid              = trim($data["cid"]);
$data_atendimento = $data["data"];
$hora_atendimento = $data["hora"];
$observacao       = trim($data["observacao"]);

// Se for edição
if ($id_atendimento > 0) {
	$sql = "UPDATE atendimento 
			SET id_paciente = ?, id_profissional = ?, especialidade = ?, medicacao = ?, cid = ?, 
				data_atendimento = ?, hora_atendimento = ?, observacao = ?
			WHERE id_atendimento = ?";

	$stmt = $conn->prepare($sql);
	$stmt->bind_param("iissssssi", $id_paciente, $id_profissional, $especialidade, $medicacao, $cid, $data_atendimento, $hora_atendimento, $observacao, $id_atendimento);
} else {
	// Inserção
	$sql = "INSERT INTO atendimento (id_paciente, id_profissional, especialidade, medicacao, cid, data_atendimento, hora_atendimento, observacao)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

	$stmt = $conn->prepare($sql);
	$stmt->bind_param("iissssss", $id_paciente, $id_profissional, $especialidade, $medicacao, $cid, $data_atendimento, $hora_atendimento, $observacao);
}

if ($stmt->execute()) {
	echo json_encode(["erro" => false, "mensagem" => $id_atendimento > 0 ? "Atualizado com sucesso!" : "Cadastrado com sucesso!"]);
} else {
	echo json_encode(["erro" => true, "mensagem" => "Erro ao salvar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
