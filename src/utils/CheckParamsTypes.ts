export function checkParamsTypes(paramatersNamesValuesTypes: [string, any, string]) {
    let namesOfWrongParameters: string[] = []
    
    paramatersNamesValuesTypes.forEach(function (value) {
        if (typeof(value[1]) !== value[2]) {
            namesOfWrongParameters.push(value[0])
        }
    })
    return namesOfWrongParameters
}