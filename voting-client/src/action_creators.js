export function setState(state) {
    return {
        type: 'SET_STATE',
        state
    };
}

export function vote(entry, voter) {
    return {
        meta: {remote: true},
        type: 'VOTE',
        entry,
        voter
    };
}

export function next() {
    return {
        meta: {remote: true},
        type: 'NEXT'
    };
}