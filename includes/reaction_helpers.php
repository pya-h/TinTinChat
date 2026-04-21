<?php

function ttcReactionCodeToEmojiMap(): array
{
    return [
        'like' => "\u{1F44D}",
        'love' => "\u{2764}\u{FE0F}",
        'laugh' => "\u{1F602}",
        'wow' => "\u{1F62E}",
        'sad' => "\u{1F622}",
        'fire' => "\u{1F525}",
        'fish' => "\u{1F420}",
    ];
}

function ttcReactionEmojiToCodeMap(): array
{
    return [
        "\u{1F44D}" => 'like',
        "\u{2764}\u{FE0F}" => 'love',
        "\u{2764}" => 'love',
        "\u{1F602}" => 'laugh',
        "\u{1F62E}" => 'wow',
        "\u{1F622}" => 'sad',
        "\u{1F525}" => 'fire',
        "\u{1F420}" => 'fish',
    ];
}

function ttcReactionCodeFromInput(string $reactionInput): string
{
    $normalized = trim($reactionInput);
    if ($normalized === '') {
        return '';
    }

    $codeToEmoji = ttcReactionCodeToEmojiMap();
    if (isset($codeToEmoji[$normalized])) {
        return $normalized;
    }

    $emojiToCode = ttcReactionEmojiToCodeMap();
    return $emojiToCode[$normalized] ?? '';
}

function ttcReactionEmojiFromStorage(string $storedReaction): string
{
    $normalized = trim($storedReaction);
    if ($normalized === '') {
        return '';
    }

    $codeToEmoji = ttcReactionCodeToEmojiMap();
    if (isset($codeToEmoji[$normalized])) {
        return $codeToEmoji[$normalized];
    }

    $emojiToCode = ttcReactionEmojiToCodeMap();
    if (isset($emojiToCode[$normalized])) {
        $code = $emojiToCode[$normalized];
        return $codeToEmoji[$code] ?? '';
    }

    return '';
}

/**
 * Fetch and attach per-message reaction counts to a message array in place.
 * Each message row gains a 'reactions' key: [{emoji, count, reacted_by_me}, ...]
 */
function ttcAttachReactionsToMessages(PDO $pdo, array &$messages, int $viewerUserId): void
{
    if (empty($messages)) {
        return;
    }

    $messageIds = array_values(array_filter(array_map(static function ($row) {
        return isset($row['id']) ? (int) $row['id'] : 0;
    }, $messages), static function ($id) {
        return $id > 0;
    }));

    if (empty($messageIds)) {
        return;
    }

    $placeholders = implode(',', array_fill(0, count($messageIds), '?'));
    $stmt = $pdo->prepare(
        "SELECT message_id, reaction, user_id
         FROM message_reactions
         WHERE message_id IN ($placeholders)"
    );
    $stmt->execute($messageIds);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $byMessage = [];
    foreach ($rows as $row) {
        $messageId = (int) ($row['message_id'] ?? 0);
        $emoji = ttcReactionEmojiFromStorage((string) ($row['reaction'] ?? ''));
        if ($messageId <= 0 || $emoji === '') {
            continue;
        }
        if (!isset($byMessage[$messageId][$emoji])) {
            $byMessage[$messageId][$emoji] = ['emoji' => $emoji, 'count' => 0, 'reacted_by_me' => false];
        }
        $byMessage[$messageId][$emoji]['count']++;
        if ((int) ($row['user_id'] ?? 0) === $viewerUserId) {
            $byMessage[$messageId][$emoji]['reacted_by_me'] = true;
        }
    }

    foreach ($messages as &$messageRow) {
        $mid = (int) ($messageRow['id'] ?? 0);
        $messageRow['reactions'] = $mid > 0 && isset($byMessage[$mid])
            ? array_values($byMessage[$mid])
            : [];
    }
    unset($messageRow);
}
