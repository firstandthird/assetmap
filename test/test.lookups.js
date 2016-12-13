'use strict';
const AssetMap = require('../index.js');
const chai = require('chai');

describe('ClientkitAsset', () => {
  it('can load the class', (done) => {
    const assetMap = new AssetMap({ pathToAssetMap: '../temp' });
    chai.expect(assetMap.pathToAssetMap).to.equal('../temp');
    return done();
  });
  it('can AssetMap a mapped file when assetMap is given as an object', (done) => {
    const assetMap = new AssetMap({ assetMap: { 'file1.js': 'file2.js' } });
    assetMap.lookupAsset('file1.js', (err, mappedName) => {
      chai.expect(err).to.equal(null);
      chai.expect(mappedName).to.equal('file2.js');
      done();
    });
  });
  it('can AssetMap a mapped file when pathToAssetMap is given as a string', (done) => {
    const assetMap = new AssetMap({ pathToAssetMap: 'test/assetsMap/assets.json' });
    assetMap.lookupAsset('file1.js', (err, mappedName) => {
      chai.expect(err).to.equal(null);
      chai.expect(mappedName).to.equal('file2.js');
      assetMap.lookupAsset('filea.js', (err2, mappedName2) => {
        chai.expect(err2).to.equal(null);
        chai.expect(mappedName2).to.equal('fileb.js');
        done();
      });
    });
  });
});
