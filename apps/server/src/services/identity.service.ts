import {
  IdentityAccount,
  IdentityManager,
  IdentityManagerOptions,
  StorageSpec,
} from '@tanglelabs/ssimon';
import { promises } from 'fs';
import path from 'path';

import { getResolver } from '../utils';
import { Injectable } from '@nestjs/common';
import nacl from 'tweetnacl';
import axios from 'axios';

const { readFile, writeFile } = promises;

function constructSimpleStore() {
  const reader = async () => {
    const raw = await readFile(
      path.join(process.env.IDENTITY_PATH, './simple-store'),
    );
    try {
      return JSON.parse(raw.toString());
    } catch {
      return [];
    }
  };

  const writer = async (data: { id: string; pin: number }[]) => {
    await writeFile(
      path.join(process.env.IDENTITY_PATH, './simple-store'),
      JSON.stringify(data),
    );
  };

  return { reader, writer };
}

@Injectable()
export class IdentityService {
  manager: IdentityManager<IdentityAccount>;
  storage: StorageSpec<any, any>;

  constructor() {
    this.build();
  }

  private async build() {
    const { DidWebAdapter } = await import('@tanglelabs/web-identity-adapter');
    const { DidKeyAdapter } = await import('@tanglelabs/key-identity-adapter');
    const { IotaIdentityAdapter } = await import(
      '@tanglelabs/iota-identity-adapter'
    );
    const { StorageDriver } = await import(
      '@tanglelabs/typeorm-storage-driver'
    );

    const storage = await StorageDriver.build({
      type: 'postgres',
      databaseUrl: process.env.IDENTITY_DATABASE_URL,
      ssl:
        process.env.ENV_TYPE !== 'dev'
          ? {
              rejectUnauthorized: false,
              ca: process.env.DB_CA_CERT,
            }
          : false,
    });
    this.manager = await IdentityManager.build({
      adapters: [DidWebAdapter, DidKeyAdapter, IotaIdentityAdapter],
      storage: storage,
    } as IdentityManagerOptions<any>);
  }

  private async buildSigner(privKeyHex: string) {
    const { bytesToString, stringToBytes } = await import('@tanglelabs/ssimon');
    const didJWT = await import('did-jwt');
    const key = nacl.box.keyPair.fromSecretKey(stringToBytes(privKeyHex));
    const secret = privKeyHex + bytesToString(key.publicKey);
    const keyPair = stringToBytes(secret);
    return didJWT.EdDSASigner(keyPair);
  }

  private async _enrichAccountWithRelyingPartyAndIssuer(
    account: IdentityAccount,
    did: string,
  ) {
    const {
      OpenidProvider,
      RelyingParty,
      SigningAlgs,
      SimpleStore,
      VcHolder,
      VcIssuer,
    } = await import('@tanglelabs/oid4vc');
    const config = await this.manager.storage.findOne({ did });

    const org = null;
    const resolver = await getResolver();

    const logo = new URL(
      '/images/Logo.png',
      process.env.PUBLIC_CLIENT_URI,
    ).toString();
    const document = await account.getDocument();
    const kid = document.verificationMethod[0].id;
    const signer = await this.buildSigner(config.seed);
    const rp = new RelyingParty({
      redirectUri: `${process.env.PUBLIC_BASE_URI}/oid4vc/auth`,
      resolver,
      did: account.getDid(),
      kid,
      clientId: account.getDid(),
      signer,
      signingAlgorithm: SigningAlgs.EdDSA,
      clientMetadata: {
        subjectSyntaxTypesSupported: ['did:key'],
        idTokenSigningAlgValuesSupported: [SigningAlgs.EdDSA],
        clientName: org ? org.name : 'AuvoID',
        logoUri: logo,
      },
    });
    const holder = new VcHolder({
      did: account.getDid(),
      kid,
      signer,
      signingAlgorithm: SigningAlgs.EdDSA,
    });
    const { reader, writer } = constructSimpleStore();
    const issuer = new VcIssuer({
      batchCredentialEndpoint: new URL(
        '/api/oid4vc/credentials',
        process.env.PUBLIC_BASE_URI,
      ).toString(),
      clientName: org ? org.name : 'AuvoID',
      credentialEndpoint: new URL(
        '/api/oid4vc/credential',
        process.env.PUBLIC_BASE_URI,
      ).toString(),
      cryptographicBindingMethodsSupported: ['did:key'],
      credentialSigningAlgValuesSupported: ['EdDSA'],
      signer,
      signingAlgorithm: SigningAlgs.EdDSA,
      did: account.getDid(),
      kid,
      resolver,
      tokenEndpoint: new URL(
        `/api/oid4vc/token`,
        process.env.PUBLIC_BASE_URI,
      ).toString(),
      logoUri: logo,
      credentialIssuer: new URL(`/api`, process.env.PUBLIC_BASE_URI).toString(),
      proofTypesSupported: ['jwt'],
      store: new SimpleStore({ reader, writer }),
    });

    const op = new OpenidProvider({
      did: account.getDid(),
      kid,
      resolver,
      signer,
      signingAlgorithm: SigningAlgs.EdDSA,
    });

    const enriched = { account, rp, op, holder, issuer };

    return enriched;
  }

  async newDid(props: { alias: string; seed?: string; method: string }) {
    const did = await this.manager
      .createDid({
        ...props,
        store: this.storage,
      })
      .catch(async (e) => {
        if (e.address && e.amount) {
          console.log('requesting funds');
          await axios
            .post(process.env.FAUCET_ENDPOINT, {
              address: e.address,
              amount: e.amount,
            })
            .catch((e) => console.error(e));
          console.log('received funds');
          return this.manager.createDid({
            ...props,
            store: this.storage,
          });
        }
        throw new Error(e);
      });
    return this._enrichAccountWithRelyingPartyAndIssuer(did, did.getDid());
  }

  private async getDid(props: { alias?: string; did?: string }) {
    const did = await this.manager.getDid({
      ...props,
      store: this.storage,
    });
    return this._enrichAccountWithRelyingPartyAndIssuer(did, did.getDid());
  }

  async getAdminDid() {
    const alias = process.env.PUBLIC_ADMIN_DID;
    const seed = process.env.IDENTITY_SEED;

    const identity = await this.newDid({
      alias,
      seed,
      method: 'web',
    }).catch(async (e) => {
      if (!e.message.includes('Alias already exists')) {
        console.log(e);
        throw new Error('500::Unable to create identity');
      }
      const did = await this.getDid({ alias });
      return did;
    });

    return identity;
  }
}
