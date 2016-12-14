const fs = require('fs');
const path = require('path');

class AssetMap {

  constructor(options) {
    // can pass in an object ot use as the asset map:
    this.assetMap = typeof options.assetMap === 'object' ? options.assetMap : false;
    this.mapIsReference = options.assetMap !== undefined;
    // otherwise will read the asset map from file:
    this.pathToAssetMap = options.pathToAssetMap;
    this.cache = options.cache;
  }

  // looks things up in the assetMap when it exists:
  lookupInMap(fileName) {
    if (this.assetMap[fileName]) {
      return this.assetMap[fileName];
    }
    const withoutPath = path.basename(fileName);
    if (this.assetMap[withoutPath]) {
      return this.assetMap[withoutPath];
    }
  }

  // calls the callback with error if it didn't work:
  handleCallback(originalName, mappedName, done) {
    if (mappedName) {
      return done(null, mappedName);
    }
    return done(new Error(`Could not find ${originalName} in assetMap`));
  }

  // public facing function that looks in the map or loads it from file if not found:
  lookupAsset(fileName, done) {
    if (this.assetMap) {
      // if the map was already loaded or the map was passed as an object reference:
      if (this.cache || this.mapIsReference) {
        return this.handleCallback(fileName, this.lookupInMap(fileName), done);
      }
    }
    console.log(this.options)
    // if cache is false or if assetMap isn't loaded yet load from file or the passed object:
    fs.readFile(this.pathToAssetMap, (err, data) => {
      if (err) {
        return done(err);
      }
      this.assetMap = JSON.parse(data.toString());
      this.handleCallback(fileName, this.lookupInMap(fileName), done);
    });
  }
}

module.exports = AssetMap;
