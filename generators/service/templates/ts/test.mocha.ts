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
    // Cleanup
    await global.cleanUp();
  });

  it('returns array', async () => {
    const result: any = await global.request
      .get('/<%= path %>?$limit=1')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${global.testToken}`);
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('object');
    expect(result.body.data).to.be.a('array');
  });
});
