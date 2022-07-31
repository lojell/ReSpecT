export function getUniqueString(value: string, assignedValues: string[], prefixIndex: number = null) {
    const actualValue = prefixIndex ? value + prefixIndex : value;
    if (assignedValues.includes(actualValue)) {
        return getUniqueString(value, assignedValues, prefixIndex + 1);
    }

    return actualValue;
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toCamelCase(str: string) {
    return str.toLowerCase()
        .split(/[^a-zA-Z\d\s:]/g)
        .map((x, i) => i === 0 ? x : capitalize(x))
        .join('');
}


export function trimEnd(str: string, trim: string) {
    let temp = str;
    while (temp.endsWith(trim))
        temp = temp.slice(0, temp.lastIndexOf(trim));

    return temp;
}


