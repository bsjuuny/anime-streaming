import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'ko'];

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    console.log('getRequestConfig for locale:', locale);
    const messages = (await import(`../../messages/${locale}.json`)).default;
    console.log('Messages loaded successfully');
    return {
        locale: locale as string,
        messages
    };
});
