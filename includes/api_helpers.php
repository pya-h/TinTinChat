<?php

function apiJsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function apiSuccess(array $data = [], int $statusCode = 200): void
{
    apiJsonResponse([
        'status' => 'ok',
        'data' => $data,
    ], $statusCode);
}

function apiError(string $code, string $message, int $statusCode = 400): void
{
    apiJsonResponse([
        'status' => 'error',
        'error' => [
            'code' => $code,
            'message' => $message,
        ],
    ], $statusCode);
}

function apiRequireMethod(string $expectedMethod): void
{
    if (!isset($_SERVER['REQUEST_METHOD']) || strtoupper($_SERVER['REQUEST_METHOD']) !== strtoupper($expectedMethod)) {
        apiError('INVALID_METHOD', 'Invalid request method', 405);
    }
}

function apiRequireAuth(): int
{
    if (!isset($_SESSION['user_id'])) {
        apiError('UNAUTHORIZED', 'Not logged in', 401);
    }

    return (int) $_SESSION['user_id'];
}

function apiGetJsonBody(): array
{
    $rawBody = file_get_contents('php://input');
    if (!$rawBody) {
        return [];
    }

    $decoded = json_decode($rawBody, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        apiError('INVALID_JSON', 'Invalid JSON payload', 400);
    }

    return $decoded;
}
