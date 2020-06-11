import sinon from 'sinon';
import supertest from 'supertest';
import chai from 'chai';

const PATH = '/yadu/api/v1/auth';

describe(`${PATH}`, () => {
  let sandbox: sinon.SinonSandbox;

  before(() => {});

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  after(() => {});

  afterEach(() => {
    sandbox.restore();
  });

  describe(`GET ${PATH}/login`, () => {});

  describe(`POST ${PATH}/login`, () => {});

  describe(`POST ${PATH}/logout`, () => {});
});
