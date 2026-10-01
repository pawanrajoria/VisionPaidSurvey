/** Emoji offered by the chat composer. Kept small on purpose: one tap, no search needed. */
export interface IEmojiGroup {
    label: string;
    icon: string;
    emojis: string[];
}

export const QUICK_EMOJIS = ['😀', '😂', '😍', '👍', '🙏', '🎉', '🔥', '💰'];

export const EMOJI_GROUPS: IEmojiGroup[] = [
    {
        label: 'Smileys', icon: '😀',
        emojis: ['😀', '😁', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😎', '🤩', '🥳', '😏', '🤔',
            '😴', '😅', '😬', '😢', '😭', '😤', '😡', '🤯', '😱', '🤗', '🤫', '🙄', '😌', '🤑']
    },
    {
        label: 'Gestures', icon: '👍',
        emojis: ['👍', '👎', '👏', '🙌', '🙏', '🤝', '💪', '👌', '✌️', '🤞', '👋', '🤙', '👀', '🫶', '❤️', '💚',
            '💙', '💛', '🧡', '💜', '💔', '💯', '✅', '❌']
    },
    {
        label: 'Rewards', icon: '💰',
        emojis: ['💰', '💵', '💸', '🤑', '🪙', '💳', '🎁', '🏆', '🥇', '🎯', '🎉', '🎊', '🔥', '⭐', '🌟', '✨',
            '🚀', '📈', '🎮', '🕹️', '📱', '📝', '⏰', '🍀']
    }
];

const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Emoji_Component}|‍|️|\s)+$/u;

/** True for a message made of one to three emoji and nothing else - shown large, without a bubble. */
export function isEmojiOnly(text: string): boolean {
    const value = (text ?? '').trim();
    if (!value || value.length > 40 || /[0-9#*]/.test(value) || !EMOJI_ONLY.test(value)) return false;
    try {
        const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
        const count = [...segmenter.segment(value.replace(/\s/g, ''))].length;
        return count >= 1 && count <= 3;
    } catch {
        return value.length <= 8;
    }
}
