'use strict';
const AssetMap = require('../index.js');
const chai = require('chai');
const fs = require('fs');
const async = require('async');

describe('ClientkitAsset', () => {

  it('can load the class', (done) => {
    const assetMap = new AssetMap({ pathToAssetMap: '../temp', cache: true });
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

  it('can AssetMap a mapped file when pathToAssetMap is given as a string and cache is true', (done) => {
    const assetMap = new AssetMap({ pathToAssetMap: 'test/assetsMap/assets.json', cache: true });
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

  it('will reprocess on each call when cache is false', (allDone) => {
    const pathToAssetMap = 'test/assetsMap/assets2.json';
    const assetMap = new AssetMap({ pathToAssetMap, cache: false });
    async.autoInject({
      firstLookup: (done) => assetMap.lookupAsset('optionA.js', done),
      alter: (firstLookup, done) => {
        fs.writeFile(pathToAssetMap, JSON.stringify({ 'optionA.js': 'optionC.js' }), 'utf-8', done);
      },
      secondLookup: (alter, done) => assetMap.lookupAsset('optionA.js', done),
      confirm: (firstLookup, secondLookup, done) => {
        chai.expect(firstLookup).to.equal('optionB.js');
        chai.expect(secondLookup).to.equal('optionC.js');
        done();
      },
    }, (err) => {
      chai.expect(err).to.equal(null);
      fs.writeFile(pathToAssetMap, JSON.stringify({ 'optionA.js': 'optionB.js' }), 'utf-8', allDone);
    });
  });
});
