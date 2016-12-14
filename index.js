const fs = require('fs');
const path = require('path');

class AssetMap {

  constructor(options, done) {
    // can pass in an object ot use as the asset map:
    this.assetMap = typeof options.assetMap === 'object' ? options.assetMap : false;
    this.mapIsReference = options.assetMap !== undefined;
    // otherwise will read the asset map from file:
    this.pathToAssetMap = options.pathToAssetMap;
    this.cache = true;
    if (options.cache === false) {
      this.cache = false;
    }
    // load immediately if this is true, requires a done callback handler:
    if (options.readOnLoad) {
      if (!done) {
        done = (err) => {
          if (err) {
            throw err;
          }
        };
      }
      this.readAssetFile(options.pathToAssetMap, done);
    }
  }

  // looks things up in the assetMap when it exists:
  lookupInMap(filenameToMap) {
    if (this.assetMap[filenameToMap]) {
      return this.assetMap[filenameToMap];
    }
    const withoutPath = path.basename(filenameToMap);
    if (this.assetMap[withoutPath]) {
      return this.assetMap[withoutPath];
    }
    return new Error(`Could not find a reference like ${filenameToMap} in assetMap`);
  }

  // call without a 'done' for full sync behavior:
  readAssetFile(fileName, done) {
    if (this.cache || this.mapIsReference) {
      if (this.assetMap) {
        return done(null, this.assetMap);
      }
    }
    fs.readFile(fileName, (err, data) => {
      if (err) {
        return done(err);
      }
      this.assetMap = JSON.parse(data.toString());
      return done(null, this.assetMap);
    });
  }

  // public facing function for looking up assets by filename:
  lookupAsset(filenameToMap, done) {
    this.readAssetFile(this.pathToAssetMap, (err) => {
      if (err) {
        throw err;
      }
      return done(null, this.lookupInMap(filenameToMap));
    });
  }
}

module.exports = AssetMap;
