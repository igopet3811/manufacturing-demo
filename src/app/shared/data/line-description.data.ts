/* lines currently available */
export const LineDescription = Object.freeze([
    {
        line: 'LINE1',
        description: 'System 1',
        type: 'NEW',
        active: true,
        resource: 'Resource_1'
    },
    {
        line: 'LINE2',
        description: 'System 2',
        type: 'OLD',
        active: true,
        resource: 'Resource_2'
    },
    {
        line: 'LINE3',
        description: 'Cell 1',
        type: 'NEW',
        active: true,
        resource: 'Resource_3'
    }
])

export const getLineDetails = (line: string) => {
    return LineDescription.filter(item => item.line === line)[0] || null;
}

export const getCells = () => {
    return LineDescription.filter(item => item.resource !== null) || null;
}

export const getLineByResource = (resource: string) => {
    return LineDescription.filter(item => item.resource === resource)[0] || null;
}