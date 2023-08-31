const PrintStates = {
    QUEUED: 0,
    PRINTING: 1,
    FAILED: 2,
    COMPLETED: 3,
    CANCELED: 4
};

const PrinterStates = {
    DOWN: 10,
    IDLE: 11,
    PRINTING: 12
};

const StateColors = {
    [PrintStates.QUEUED]: 'gray',
    [PrintStates.PRINTING]: 'green',
    [PrintStates.FAILED]: 'red',
    [PrintStates.COMPLETED]: 'green',
    [PrintStates.CANCELED]: 'red',
    [PrinterStates.DOWN]: 'red',
    [PrinterStates.IDLE]: 'yellow',
    [PrinterStates.PRINTING]: 'green'
};

export { PrintStates, PrinterStates, StateColors };
