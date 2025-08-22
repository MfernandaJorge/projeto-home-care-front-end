<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "../config/db.php"; // Importa a conexão com o banco

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	if (isset($_POST['id'])) {
		$id_profissional = intval($_POST['id']);

		$validaProfissional = $conn->prepare("SELECT `id_atendimento` FROM `atendimento` WHERE `id_profissional` = ?");
		$validaProfissional->bind_param("i", $id_profissional);
		$validaProfissional->execute();
		$result = $validaProfissional->get_result();
		$atendimentos = $result->fetch_all(MYSQLI_ASSOC);

		if ($atendimentos) {
			echo json_encode(["status" => "error", "message" => "Profissional vinculado a um atendimento! Favor, apagar atendimento primeiro!"]);
			return;

		} else {
			$stmt = $conn->prepare("DELETE FROM `profissional` WHERE `id_profissional` = ?");
			$stmt->bind_param("i", $id_profissional);

			if ($stmt->execute()) {
				echo json_encode(["status" => "success"]);
			} else {
				echo json_encode(["status" => "error", "message" => "Erro ao excluir o profissional."]);
			}

			$stmt->close();
			$conn->close();
		}
	} else {
		echo json_encode(["status" => "error", "message" => "ID do profissional não foi recebido."]);
	}
} else {
	echo json_encode(["status" => "error", "message" => "Método inválido."]);
}