export const isMobile = (): boolean => {
    if (navigator) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|CriOS|Opera Mini/i.test(
            navigator.userAgent
        );
    }
    return false;
};
