const PrintStates = {
    QUEUED: 0,
    PRINTING: 1,
    FAILED: 2,
    COMPLETED: 3,
    CANCELED: 4
};

const StateColorsExact = {
    down: ['red.500', 'red.200'],
    idle: ['gray.500', 'gray.200'],
    printing: ['green.500', 'green.200']
};

const StateColors = {
    [PrintStates.QUEUED]: 'gray',
    [PrintStates.PRINTING]: 'green',
    [PrintStates.FAILED]: 'red',
    [PrintStates.COMPLETED]: 'green',
    [PrintStates.CANCELED]: 'red',
    down: 'red',
    idle: 'gray',
    printing: 'green'
};

export { PrintStates, StateColors, StateColorsExact };
