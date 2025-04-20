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

    const turns = gameSession.dailyQuota == 3 || gameSession.dailyQuota == 4; // evening time
    const itemExists =
        pouch?.includes(`${mythology.toLowerCase()}.artifact.treasure01`) ||
        pouch?.includes(`${mythology.toLowerCase()}.artifact.common02`)

    if (turns && gameSession.isUnderworldActive && itemExists) {
        return true;
    }

    return false;
};
