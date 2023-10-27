export const formatDate = (date: Date) => {
    date.setUTCFullYear(date.getFullYear());
    date.setUTCMonth(date.getMonth());
    date.setUTCDate(date.getDate());
    date.setUTCHours(date.getHours());
    date.setUTCMinutes(date.getMinutes());
    date.setUTCSeconds(date.getSeconds());
    date.setUTCMilliseconds(date.getMilliseconds());

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.getMonth().toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");

    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return dateString;
};
