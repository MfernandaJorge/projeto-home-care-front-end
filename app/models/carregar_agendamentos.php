<?php
include "../config/db.php";

$id_profissional = $_GET['id_profissional'];

$query = "
  SELECT 
    p.nome AS paciente,
    a.data_atendimento,
    a.hora_atendimento
  FROM atendimento a
  JOIN paciente p ON a.id_paciente = p.id_paciente
  WHERE a.id_profissional = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_profissional);
$stmt->execute();
$result = $stmt->get_result();

$eventos = [];

while ($row = $result->fetch_assoc()) {
  $eventos[] = [
    'title' => $row['paciente'],
    'start' => $row['data_atendimento'] . 'T' . $row['hora_atendimento']
  ];
}

echo json_encode($eventos);
