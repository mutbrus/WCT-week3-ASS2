<?php
session_start();

if (!isset($_SESSION['students'])) {
    $_SESSION['students'] = [];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    echo json_encode($_SESSION['students']);
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $_SESSION['students'][] = $data;
    echo json_encode(["message" => "Student added"]);
} elseif ($method == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $_SESSION['students'] = array_values(array_filter($_SESSION['students'], function ($student) use ($data) {
        return $student['name'] !== $data['name'];
    }));
    echo json_encode(["message" => "Student deleted"]);
} elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    foreach ($_SESSION['students'] as &$student) {
        if ($student['name'] === $data['oldName']) {
            $student['name'] = $data['newName'];
            $student['age'] = $data['newAge'];
            $student['grade'] = $data['newGrade'];
        }
    }
    echo json_encode(["message" => "Student updated"]);
}
?>
