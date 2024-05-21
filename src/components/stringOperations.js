export const stringReduce = (string, length) => {
    return string?.length < length ? string : string?.substring(0, length) + '...'
}

export const formattedString = (number) => {
    return !isNaN(Number(number)) ? Number(number).toLocaleString('en-IN') : '-'

}