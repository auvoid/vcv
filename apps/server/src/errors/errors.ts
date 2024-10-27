// type compactError = [string, string];
type error = {
    code: string;
    message: string;
};
type storeError = {
    [key: string]: error;
};
// const expandErrors: (compactErrors: compactError[]) => storeError = (
//     compactErrors,
// ) => {
//     let errors: storeError = {};
//     compactErrors.forEach((compactError) => {
//         let code = compactError[0];
//         let message = compactError[1];
//         errors = {
//             ...errors,
//             code: {
//                 code,
//                 message,
//             },
//         };
//     });
//     return errors;
// };
const common: storeError = {
    ORGANIZATION_NOT_FOUND: {
        code: 'ORGANIZATION_NOT_FOUND',
        message: 'organization not found',
    },
    BAD_APPLICATION_FORMAT: {
        code: 'BAD_APPLICATION_FORMAT',
        message: 'the application was not filled correctly',
    },
    BAD_RECIPIENT_EMAIL: {
        code: 'BAD_RECIPIENT_EMAIL',
        message: 'recipient email was badly formatted',
    },
    TEMPLATE_NOT_FOUND: {
        code: 'TEMPLATE_NOT_FOUND',
        message: 'the template was not found',
    },
    NO_DATA: {
        code: 'NO_DATA',
        message: 'data not provided',
    },
    INTERNAL_SERVER_ERROR: {
        code: 'INTERNAL_SERVER_ERR',
        message:
            'an internal server error occurred while processing the request',
    },
    NO_OWNERSHIP: {
        code: 'NO_OWNERSHIP',
        message: 'action requires ownership of the organization',
    },
    NOT_MEMBER: {
        code: 'NOT_MEMBER',
        message: 'this user is not a member of this org',
    },
    CREDENTIAL_LIMIT_REACHED: {
        code: 'CREDENTIAL_LIMIT_REACHED',
        message: 'issuing org has reached credential issuance limit',
    },
    EXPIRED_TOKEN: {
        code: 'EXPIRED_TOKEN',
        message: 'invalid session',
    },
    INVALID_CONTEXT: {
        code: 'INVALID_CONTEXT',
        message: 'required context unavailable',
    },
    INVALID_SCOPE: {
        code: 'INVALID_SCOPE',
        message: 'required scope unavailable',
    },
};
export const errors = {
    admin: {
        BAD_RECIPIENT_EMAIL: common.BAD_RECIPIENT_EMAIL,
        ORGANIZATION_NOT_FOUND: common.ORGANIZATION_NOT_FOUND,
        CREDENTIAL_LIMIT_REACHED: common.CREDENTIAL_LIMIT_REACHED,
        BAD_APPLICATION_FORMAT: common.BAD_APPLICATION_FORMAT,
    },
    applications: {
        BAD_RECIPIENT_EMAIL: common.BAD_RECIPIENT_EMAIL,
        MISSING_TEMPLATE_ID: {
            code: 'MISSING_TEMPLATE_ID',
            message: 'the template id is missing',
        },
        TEMPLATE_NOT_FOUND: common.TEMPLATE_NOT_FOUND,
        BAD_APPLICATION_FORMAT: common.BAD_APPLICATION_FORMAT,
        NO_DATA: common.NO_DATA,
    },
    flows: {
        INDEX_CONFLICT: {
            code: 'FLOW_INDEX_CONFLICT',
            message: 'Index already exists',
        },
        NOT_FOUND: {
            code: 'FLOW_NOT_FOUND',
            message: 'Flow not found',
        },
        FIELDS_AND_TEMPLATE_MISMATCH_ISSUER: {
            code: 'FLOW_STEP_FIELDS_AND_TEMPLATE_MISMATCH',
            message:
                'All field IDs need to exist on the template, and be marked as issuer fields',
        },
        FIELDS_AND_TEMPLATE_MISMATCH_USER: {
            code: 'FLOW_STEP_FIELDS_AND_TEMPLATE_MISMATCH',
            message:
                'All field IDs need to exist on the template, and be marked as user fields',
        },
        FIELDS_EXIST_IN_PREVIOUS_STEP: {
            code: 'FLOW_STEP_FIELDS_EXIST_IN_PREVIOUS_STEP',
            message: 'One or more fields already exist in a previous step',
        },
    },
    dids: {
        IDENTITY_LIMIT_REACHED: {
            code: 'IDENTITY_LIMIT_REACHED',
            message: 'organization has reached the identity limit',
        },
        IDENTITY_ALREADY_EXISTS: {
            code: 'IDENTITY_ALREADY_EXISTS',
            message: 'another identity for said org already exists',
        },
        ORGANIZATION_NOT_FOUND: {
            ...common.ORGANIZATION_NOT_FOUND,
            message: 'user does not belong to said organization',
        },
        NO_OWNERSHIP: common.NO_OWNERSHIP,
        NO_USER: {
            code: 'NO_USER_FOUND',
            message: 'No user found',
        },
        BAD_OID_CRED_OFFER: {
            code: 'BAD_OID_CRED_OFFER',
            message: 'the cred does not follow oid cred offer spec',
        },
        INTERNAL_SERVER_ERR: common.INTERNAL_SERVER_ERROR,
        CRED_NOT_FOUND: {
            code: 'CRED_NOT_FOUND',
            message: 'requested credential was not found',
        },
    },
    oid: {
        NOT_APPROVED: {
            code: 'NOT_APPROVED',
            message: 'application not approved',
        },
        NO_TOKEN: {
            code: 'NO_TOKEN',
            message: 'token is required to proceed',
        },
    },
    org: {
        INVALID_SCOPE: {
            code: 'INVALID_SCOPE',
            message: 'required scope unavailable',
        },
        ORGANIZATION_NOT_FOUND: {
            code: 'ORGANIZATION_NOT_FOUND',
            message: 'Organization was not found',
        },
        EXPIRED_TOKEN: common.EXPIRED_TOKEN,
        NO_USER: {
            code: 'NO_USER',
            message: 'invalid user',
        },
        INVALID_CONTEXT: {
            code: 'INVALID_CONTEXT',
            message: 'required context unavailable',
        },
    },
    org_key: {
        NOT_MEMBER: common.NOT_MEMBER,
    },
    payments: {
        BAD_STRIPE: {
            code: 'BAD_STRIPE',
            message: 'bad stripe session',
        },
    },
    roles: {
        ROLE_NOT_FOUND: {
            code: 'ROLE_NOT_FOUND',
            message: 'this role was not found in this org',
        },
        ACTIVE_ROLE_USERS: {
            code: 'ACTIVE_ROLE_USERS',
            message:
                'role users must be removed from this role before deletion',
        },
    },
    staff: {
        NOT_MEMBER: common.NOT_MEMBER,
        NO_OWNERSHIP: common.NO_OWNERSHIP,
        INVITE_EXPIRED: {
            code: 'INVITE_EXPIRED',
            message: 'this invite is expired',
        },
        BAD_INVITE: {
            code: 'BAD_INVITE',
            message: 'invalid invite',
        },
        UNINVITED_USER: {
            code: 'UNINVITED_USER',
            message: 'only invited user can use this invite',
        },
    },
    templates: {
        // ...expandErrors([
        //     ['TEMPLATE_LIMIT_REACHED', 'org has reached its template limit'],
        // ]),
        TEMPLATE_LIMIT_REACHED: {
            code: 'TEMPLATE_LIMIT_REACHED',
            message: 'org has reached its template limit',
        },
        DEFAULT_DID_UNAVAILABLE: {
            code: 'BAD_DID',
            message: 'default did not found',
        },
        BAD_BADGE: {
            code: 'BAD_BADGE',
            message: 'bad badge data',
        },
        TEMPLATE_NOT_FOUND: {
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template Not Found',
        },
        NOT_MEMBER: common.NOT_MEMBER,
        CREDENTIAL_LIMIT_REACHED: common.CREDENTIAL_LIMIT_REACHED,
        BAD_APPLICATION_FORMAT: common.BAD_APPLICATION_FORMAT,
    },
    users: {
        NO_ALLOW_EMAIL: {
            code: 'NO_ALLOW_EMAIL',
            message: 'user email change not allowed',
        },
        EXPIRED_TOKEN: common.EXPIRED_TOKEN,
        INVALID_SCOPE: common.INVALID_SCOPE,
        INVALID_CONTEXT: common.INVALID_CONTEXT,
        ALREADY_VERIFIED: {
            code: 'ALREADY_VERIFIED',
            message: 'cannot re-verify already verified user email',
        },
        BAD_EMAIL_VERIFICATION: {
            code: 'BAD_EMAIL_VERIFICATION',
            message: 'must be signed into same email auvo account',
        },
    },
    well_known: {
        NO_ISSUER_DID: {
            code: 'NO_ISSUER_DID',
            message: 'couldnt find issuer did',
        },
        NO_CHALLENGE: {
            code: 'NO_CHALLENGE',
            message: 'couldnt find challenge',
        },
    },
    organizations: {
        ORGANIZATION_NOT_FOUND: {
            code: 'ORGANIZATION_NOT_FOUND',
            message: 'Organization not found',
        },
        ORGANIZATION_BAD_DATA: {
            code: 'ORGANIZATION_BAD',
            message: 'Bad organization data',
        },
    },
};
