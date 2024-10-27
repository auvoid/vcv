import { sign, verify } from 'jsonwebtoken';

export const createJsonWebToken = (
    payload: Record<string, unknown>,
    expiresIn: string | number = '1h',
) => {
    return sign(payload, process.env.SESSION_SECRET, { expiresIn });
};

export const validateJsonWebToken = (token: string) => {
    try {
        const payload = verify(token, process.env.SESSION_SECRET);
        return { payload, expired: false };
    } catch (error) {
        return {
            payload: null,
            expired: error.message.includes('token expired'),
        };
    }
};
