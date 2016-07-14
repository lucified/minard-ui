const fs = require('fs');
const deployOpt = require('./deploy-config.js');
const defaultArtifactFile = 'build-info.json';

function writeBuildArtifact(url, fn) {
  const folder = process.env.CIRCLE_ARTIFACTS;
  if (folder) {
    const path = `${folder}/${fn}`;
    fs.writeFileSync(path, JSON.stringify({ url }));
    console.log(`Wrote the url to ${path}`);
  } else {
    console.log('CIRCLE_ARTIFACTS not defined');
  }
}

writeBuildArtifact(deployOpt.base.url, defaultArtifactFile);
