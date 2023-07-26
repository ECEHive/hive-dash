const PrintStates = {
    QUEUED: 0,
    PRINTING: 1,
    FAILED: 2,
    COMPLETED: 3,
    CANCELLED: 4
};

const StateColors = {
    [PrintStates.QUEUED]: 'gray',
    [PrintStates.PRINTING]: 'green',
    [PrintStates.FAILED]: 'red',
    [PrintStates.COMPLETED]: 'green',
    [PrintStates.CANCELLED]: 'red',
    printing: 'green',
    idle: 'yellow',
    down: 'red'
};

export { PrintStates, StateColors };
