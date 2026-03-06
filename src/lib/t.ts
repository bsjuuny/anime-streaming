/**
 * 간단한 번역 유틸 — next-intl Provider 없이 메시지 파일에서 직접 로드
 * 기본 로케일: 'ko'
 */
import koMessages from '../../messages/ko.json';
import enMessages from '../../messages/en.json';

type Messages = typeof koMessages;

const MESSAGES: Record<string, Messages> = {
    ko: koMessages,
    en: enMessages,
};

/**
 * 주어진 네임스페이스에 해당하는 번역 함수 반환
 * @param namespace - 메시지 네임스페이스 (예: 'Detail', 'Card', 'Home')
 * @param locale    - 로케일 (기본값: 'ko')
 */
export function getT(namespace: keyof Messages, locale: string = 'ko') {
    const messages = MESSAGES[locale] ?? MESSAGES.ko;
    const section = messages[namespace] as Record<string, unknown>;

    return function t(key: string, options?: { defaultValue?: string }): string {
        const keys = key.split('.');
        let value: unknown = section;

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = (value as Record<string, unknown>)[k];
            } else {
                value = undefined;
                break;
            }
        }

        if (typeof value === 'string') return value;
        return options?.defaultValue ?? key;
    };
}
