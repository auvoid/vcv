export function compareSorted<Values>(
    a1: Array<Values>,
    a2: Array<Values>,
): boolean {
    if (a1.length !== a2.length) {
        return false;
    }

    /** Unique values */
    const set1 = new Set<Values>(a1);
    const set2 = new Set<Values>(a2);
    if (set1.size !== set2.size) {
        return false;
    }

    return [...set1].every((value, index) => value === [...set2][index]);
}
