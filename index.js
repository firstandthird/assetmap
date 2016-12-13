const fs = require('fs');
const path = require('path');

class AssetMap {

  constructor(options) {
    this.assetMap = typeof options.assetMap === 'object' ? options.assetMap : false;
    this.pathToAssetMap = options.pathToAssetMap;
  }

  lookupInMap(fileName) {
    if (this.assetMap[fileName]) {
      return this.assetMap[fileName];
    }
    const withoutPath = path.basename(fileName);
    if (this.assetMap[withoutPath]) {
      return this.assetMap[withoutPath];
    }
  }

  handleMap(originalName, mappedName, done) {
    if (mappedName) {
      return done(null, mappedName);
    }
    return done(new Error(`Could not find ${originalName} in assetMap`));
  }

  lookupAsset(fileName, done) {
    if (this.assetMap) {
      this.handleMap(fileName, this.lookupInMap(fileName), done);
    }
    fs.readFile(this.pathToAssetMap, (err, data) => {
      if (err) {
        return done(err);
      }
      this.assetMap = JSON.parse(data.toString());
      this.handleMap(fileName, this.lookupInMap(fileName), done);
    });
  }
}

module.exports = AssetMap;
