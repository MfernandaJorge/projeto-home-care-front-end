<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Importa a conexão com o banco

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	if (isset($_POST['id'])) {
		$id_atendimento = intval($_POST['id']);

		$stmt = $conn->prepare("DELETE FROM `atendimento` WHERE `id_atendimento` = ?");
		$stmt->bind_param("i", $id_atendimento);

		if ($stmt->execute()) {
			echo json_encode(["status" => "success"]);
		} else {
			echo json_encode(["status" => "error", "message" => "Erro ao excluir o atendimento."]);
		}

		$stmt->close();
		$conn->close();
	} else {
		echo json_encode(["status" => "error", "message" => "ID do atendimento não foi recebido."]);
	}
} else {
	echo json_encode(["status" => "error", "message" => "Método inválido."]);
}