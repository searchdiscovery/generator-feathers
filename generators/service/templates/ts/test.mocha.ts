import global from '../setup';
import 'mocha';

const { app, expect } = global;

describe(`\'<%= name %>\' service`, () => {
  it('registered the service', () => {
    const service = app.service('<%= path %>');
    expect(service).to.be.ok;
  });
});
