export const isIPhone = (): boolean => {
    if (navigator) {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    return false;
};
