let isDisabled = false;

export const wrapWithDisable = async (fn) => {
    if (isDisabled) return;
    isDisabled = true;
    try {
        await fn();
    } finally {
        isDisabled = false;
    }
};
