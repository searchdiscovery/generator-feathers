import global from '../setup';
import 'mocha';

const { app, expect } = global;

describe(`'<%= name %>' service`, () => {
  it('registered the service', () => {
    const service = app.service('<%= path %>');
    expect(service).to.be.ok;
  });

  it('creates an object', async () => {
    const obj = await global.factory.create('<%= snakeName %>');
    expect(obj).to.be.an('object');
  });
});
