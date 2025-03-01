import telegramAnalytics from '@telegram-apps/analytics';

export const initalizeTgAnalytics = async () => {
    try {
        await telegramAnalytics.init({
            token: import.meta.env.VITE_TGA_TOKEN,
            appName: import.meta.env.VITE_TGA_ID,
        });
    } catch (error) {
        console.log(error);

    }
}