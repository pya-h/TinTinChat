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
