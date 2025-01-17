export const convertUTCToIST = (utcDate: Date): Date => {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    return new Date(utcDate.getTime() + IST_OFFSET);
}
  