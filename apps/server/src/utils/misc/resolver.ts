export async function getResolver() {
    const { Resolver } = await import('did-resolver');
    const webResolver = await import('web-did-resolver');
    const didJwkResolver = await import('@sphereon/did-resolver-jwk');
    const ebsiResolver = await import('@sphereon/did-resolver-ebsi');
    const keyResolver = await import('@tanglelabs/resolver-did-key');

    const jwkDidResolver = didJwkResolver.getDidJwkResolver();
    const keyDidResolver = keyResolver.getResolver();
    const webDidResolver = webResolver.getResolver();
    const ebsiDidResolver = ebsiResolver.getResolver();

    return new Resolver({
        ...keyDidResolver,
        ...webDidResolver,
        ...jwkDidResolver,
        ...ebsiDidResolver,
    });
}
