export const validateEmail = (email: string) => {
    const validationPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validationPattern.test(email);
};
