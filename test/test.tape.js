'use strict';
const AssetMap = require('../index.js');
const test = require('tape');
const fs = require('fs');
const async = require('async');

  test('can load the class', (t) => {
    t.plan(1);
    const assetMap = new AssetMap({ pathToAssetMap: '../temp', cache: true });
    t.equal(assetMap.pathToAssetMap, '../temp');
  });

  test('can AssetMap a mapped file when assetMap is given as an object', (t) => {
    t.plan(2);
    const assetMap = new AssetMap({ assetMap: { 'file1.js': 'file2.js' } });
    assetMap.lookupAsset('file1.js', (err, output) => {
      t.equal(err, null);
      t.equal(output, 'file2.js');
    });
  });

  test('can AssetMap a mapped file when pathToAssetMap is given as a string and cache is true', (t) => {
    t.plan(4);
    const assetMap = new AssetMap({ pathToAssetMap: 'test/assetsMap/assets.json', cache: true });
    assetMap.lookupAsset('file1.js', (err, output) => {
      t.equal(err, null);
      t.equal(output, 'file2.js');
    });
    assetMap.lookupAsset('filea.js', (err, output) => {
      t.equal(err, null);
      t.equal(output, 'fileb.js');
    });
  });

  test('can AssetMap a mapped file immediately when readOnLoad is true', (t) => {
    t.plan(4);
    const assetMap = new AssetMap({ pathToAssetMap: 'test/assetsMap/assets.json', readOnLoad: true }, (err, result) => {
      t.equal(err, null);
      t.equal(result['file1.js'], 'file2.js');
      assetMap.lookupAsset('filea.js', (err2, output) => {
        t.equal(err2, null);
        t.equal(output, 'fileb.js');
      });
    });
  });

  test('will reprocess on each call when cache is false', (t) => {
    t.plan(3);
    const pathToAssetMap = 'test/assetsMap/assets2.json';
    const assetMap = new AssetMap({ pathToAssetMap, cache: false });
    async.autoInject({
      firstLookup: (done) => assetMap.lookupAsset('optionA.js', done),
      alter: (firstLookup, done) => {
        fs.writeFile(pathToAssetMap, JSON.stringify({ 'optionA.js': 'optionC.js' }), 'utf-8', done);
      },
      secondLookup: (alter, done) => assetMap.lookupAsset('optionA.js', done),
      restore: (secondLookup, done) => {
        fs.writeFile(pathToAssetMap, JSON.stringify({ 'optionA.js': 'optionB.js' }), 'utf-8', done);
      },
      confirm: (firstLookup, secondLookup, restore, done) => {
        t.equal(firstLookup, 'optionB.js');
        t.equal(secondLookup, 'optionC.js');
        done();
      }
    }, (err) => {
      t.equal(err, null);
    });
  });
