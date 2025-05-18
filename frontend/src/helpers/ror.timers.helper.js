export const timeLeftUntil12Hours = (date) => {
    const twelveHoursInMs = 12 * 60 * 60 * 1000;

    if (!date || date === 0) {
        return { done: true, countdown: "0h 0m" };
    }

    const now = Date.now();
    const endTime = date + twelveHoursInMs;

    if (now >= endTime) {
        return { done: true, countdown: "0h 0m" };
    }

    const remainingMs = endTime - now;
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return { done: false, countdown: `${hours}h ${minutes}m` };
};


export const checkIsUnderworldActive = (gameSession, mythology, pouch) => {

    const turns = gameSession.dailyQuota >= 3;

    const treasureKey = `${mythology.toLowerCase()}.artifact.treasure01`;
    const commonKey = `${mythology.toLowerCase()}.artifact.common02`;

    const hasDemonCoin = pouch?.includes(treasureKey);
    const hasKey = pouch?.includes(commonKey);

    const itemExists = hasDemonCoin || hasKey;

    if (itemExists && turns) {
        if (hasKey) return 2;
        if (hasDemonCoin) return 1;
    }

    return -1;
};

export const calculateRemainingTime = (ms) => {
    const timeLeftInMs = ms;

    const hoursLeft = Math.floor(timeLeftInMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeftInMs % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hoursLeft.toString().padStart(2, '0');
    const paddedMinutes = minutesLeft.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
};
