export const formattedDate = (timeStamp) => {
    const date = new Date(timeStamp)
    return !isNaN(date.getDate()) ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` : '-'
}

export const formattedTime = (timeStamp) => {
    const date = new Date(timeStamp)
    const amOrPm = date.getHours() >= 12 ? 'PM' : 'AM';
    return !isNaN(date.getHours()) ? `${parseInt(date.getHours() % 12 || 12)}:${date.getMinutes()} ${amOrPm}` : '-'
}

export const currentTime = () => {
    return new Date().getTime();
}

export const futureTime = (days) => {
    var futureDate = new Date(new Date().getTime() + (days * 24 * 60 * 60 * 1000));
    var timestamp = futureDate.getTime();
    return timestamp;
}

export const monthStarting = (diff) => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() - diff, 1).getTime();
}

export const pastTime = (days) => {
    var futureDate = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000));
    var timestamp = futureDate.getTime();
    return timestamp;
}

export const getYearTimestampsPast = (upto) => {
    const currentYear = new Date().getFullYear();
    const yearTimestamps = [];

    for (let i = currentYear; i >= currentYear - upto; i--) {
        const startDate = new Date(`${i}-01-01T00:00:00`);
        const endDate = new Date(`${i}-12-31T23:59:59`);

        yearTimestamps.push({
            year: i,
            startTimestamp: startDate.getTime(),
            endTimestamp: endDate.getTime()
        });
    }

    return yearTimestamps;
}

export const getYearTimestampsFuture = (upto) => {
    const currentYear = new Date().getFullYear();
    const yearTimestamps = [];

    for (let i = currentYear; i <= currentYear + upto; i++) {
        const startDate = new Date(`${i}-01-01T00:00:00`);
        const endDate = new Date(`${i}-12-31T23:59:59`);

        yearTimestamps.push({
            year: i,
            startTimestamp: startDate.getTime(), // Convert milliseconds to seconds
            endTimestamp: endDate.getTime()  // Convert milliseconds to seconds
        });
    }

    return yearTimestamps;
}