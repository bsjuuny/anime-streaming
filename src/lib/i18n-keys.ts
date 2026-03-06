/**
 * i18n 메시지 키에서 하드코딩을 제거하기 위한 상수 모음
 * 서버 컴포넌트에서는 getTranslations('Detail') 등을 사용하고,
 * 클라이언트 컴포넌트에서는 useTranslations('Card') 등을 사용합니다.
 *
 * 이 파일의 KEY 상수들은 messages/ko.json 및 messages/en.json과 동기화해야 합니다.
 */

// anime.status 값 → 메시지 키 (Detail.status_values.{key}, Card.status.{key})
export const STATUS_MSG_KEYS = [
    'FINISHED',
    'RELEASING',
    'NOT_YET_RELEASED',
    'CANCELLED',
    'HIATUS',
] as const;

export type AnimeStatus = typeof STATUS_MSG_KEYS[number];

// 캐릭터 역할 → 메시지 키 (Detail.role.{key})
export const ROLE_MSG_KEYS = ['main', 'supporting', 'background'] as const;
export type CharacterRole = typeof ROLE_MSG_KEYS[number];
