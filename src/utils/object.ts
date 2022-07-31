const primitiveTypes = ['undefined', 'string', 'number', 'boolean', 'bigint'];

const typeExampleMap = {
    'undefined': undefined,
    'string': 'string',
    'number': 1,
    'boolean': true,
    'bigint': 1.2,
    'object': {}
};

function getType(object: any) {
    return Array.isArray(object) ? 'array' : typeof object;
}

function mergeTwoObjects(target: any, source: any) {

    const targetType = getType(target);
    const sourceType = getType(source);

    if (target === undefined || target === null) return sourceType === 'array' ? [mergeDeep(source)] : source;
    if (source === undefined || source === null) return targetType === 'array' ? [mergeDeep(target)] : target;

    if (targetType === sourceType) {
        if (primitiveTypes.includes(sourceType)) {
            target = source;
        } else if (sourceType === 'array') {
            target = [mergeDeep([...target, ...source])]
        } else if (sourceType === 'object') {
            for (const field in source) {
                target[field] = mergeTwoObjects(target[field], source[field]);
            }
        }
    } else {
        if (primitiveTypes.includes(sourceType) && primitiveTypes.includes(targetType)) {
            target += source;
        } else if (sourceType === 'array' || targetType === 'array') {
            target = [mergeDeep([
                ...(targetType === 'array' ? target : [target]),
                ...(sourceType === 'array' ? source : [source])
            ])];
        } else {
            target = targetType === 'object' ? target : source;
        }
    }

    return target;
}

// function mergeTwoObject(target, source: any) {
//     for (const field in source) {
//         if (target[field] === null || target[field] === undefined) {
//             target[field] = source[field];
//             continue;
//         }

//         const sourceFieldType = getType(source[field]);
//         const targetFieldType = getType(target[field]);

//         if (sourceFieldType === targetFieldType) {
//             if (primitiveTypes.includes(sourceFieldType)) {
//                 target[field] = source[field];
//             } else if (sourceFieldType === 'array') {
//                 target[field] = [mergeDeep([...target[field], ...source[field]])];
//             } else if (sourceFieldType === 'object') {
//                 target[field] = mergeTwoObject(target[field], source[field])
//             }
//         } else {
//             if (primitiveTypes.includes(sourceFieldType) && primitiveTypes.includes(targetFieldType)) {
//                 target[field] += source[field];
//             } else if (sourceFieldType === 'array' || targetFieldType === 'array') {
//                 target[field] = mergeDeep([
//                     ...(targetFieldType === 'array' ? target[field] : [target]),
//                     ...(sourceFieldType === 'array' ? source : [source])
//                 ]);
//             } else {
//                 target = targetFieldType === 'object' ? target : source;
//             }
//         }

//         ///
//         // if (primitiveTypes.includes(sourceFieldType)) {
//         //     target[field] = target[field] !== source[field]
//         //         ? {}
//         //         : source[field];

//         // } else if (Array.isArray(source[field])) {
//         //     // TODO: we should return not a real fields but meta data taht desribes all possible variation at merging
//         //     const mergedArray = Array.isArray(target[field])
//         //         ? [...target[field], ...source[field]]
//         //         : [target[field] || typeExampleMap[typeof target[field]], ...source[field]]


//         //     const mergedTypes = [...new Set(mergedArray.map(element => typeof element))];
//         //     if (mergedTypes.length === 1) {
//         //         target[field] = [mergeDeep(mergedArray)]
//         //     } else {

//         //     }

//         //     target[field] = [mergeDeep(mergedArray)]
//         // } else if (sourceFieldType === 'object') {
//         //     target[field] = mergeDeep([target[field] || {}, source[field]])
//         // }
//     }

//     return target;
// }

export function mergeDeep(objects: Array<any>) {
    if (!objects.length) return undefined;

    let [target, ...rest] = [...new Set(objects)].filter(x => x !== undefined || x !== null);

    for (const source of rest) {
        target = mergeTwoObjects(target, source);
        // const sourceType = getType(source);
        // const targetType = getType(target);

        // if (targetType === sourceType) {
        //     if (primitiveTypes.includes(sourceType)) {
        //         target = source;
        //     } else if (sourceType === 'array') {
        //         target = [mergeDeep([...target, ...source])]
        //     } else if (sourceType === 'object') {
        //         target = mergeTwoObject(target, source);
        //     }
        // } else {
        //     if (primitiveTypes.includes(sourceType) && primitiveTypes.includes(targetType)) {
        //         target += source;
        //     } else if (sourceType === 'array' || targetType === 'array') {
        //         target = mergeDeep([
        //             ...(targetType === 'array' ? target : [target]),
        //             ...(sourceType === 'array' ? source : [source])
        //         ]);
        //     } else {
        //         target = targetType === 'object' ? target : source;
        //     }
        // }
    }

    return target;
}