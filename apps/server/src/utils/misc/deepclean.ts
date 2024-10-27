export function deepClean<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                acc[key as keyof T] = deepClean(value) as any;
            } else {
                acc[key as keyof T] = value;
            }
        }
        return acc;
    }, {} as Partial<T>);
}
