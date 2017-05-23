import { Meteor } from 'meteor/meteor';
import ScssProcessor from 'meteor-scss-processor';
import fs from 'fs';
import path from 'path';
import meteorProjectPath from 'meteor-project-path';
global.vue = global.vue || {};
global.vue.lang = global.vue.lang || {};


const sassProcessor = new ScssProcessor({ importFile });

global.vue.lang.sass = Meteor.wrapAsync(sassHandler);
global.vue.lang.scss = Meteor.wrapAsync(sassHandler);

let lastContents = null;
function sassHandler({ source, inputFile, dependencyManager, }, cb) {
  try {
    const result = Promise.await(sassProcessor.process(inputFile, {
      importPath: inputFile.getPathInPackage(),
      contents: source
    }, {}));
    result.dependencies.forEach(dependencyPath => dependencyManager.addDependency(dependencyPath));

    cb(null, {
      css: result.css,
      map: result.map,
    });
  } catch (err) {
    if (!err.message.match(/^File not found at any of the following paths/)) {
      console.error(err.stack.toString().split('\n').slice(0, 5));
    }
    cb(null, {handledError:true});
  }
}

async function importFile(potentialFilePaths, rootFile) {
  try {
    const filePath = discoverImportPath(potentialFilePaths);
    rootFile.dependencies.push(filePath);
    lastContents = Plugin.fs.readFileSync(filePath, 'utf-8')
    return {
      contents: Plugin.fs.readFileSync(filePath, 'utf-8'),
      importPath: filePath
    };
  } catch (err) {
    // console.error(err.message)
    // console.error(err.stack)
    throw err;
  }
}

// console.log('fs', Plugin.fs)
function discoverImportPath(potentialPaths) {
  for (let i = 0,
         potentialPath = potentialPaths[i]; i < potentialPaths.length; i++, potentialPath = potentialPaths[i]) {
    const absolutePath = getAbsoluteImportPath(potentialPath);
    if (fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isFile()) {
      return absolutePath;
    }
  }

  throw new Error(`File not found at any of the following paths:\n${JSON.stringify(potentialPaths, null, 2)}`);
}

function getAbsoluteImportPath(relativePath) {
  if (path.isAbsolute(relativePath)) {
    if (relativePath.match(meteorProjectPath)) {
      return relativePath.replace(/\\/g, '/');
    }
    relativePath.replace(/\\/g, '/').replace(/^\//, '');
  }

  return path.join(meteorProjectPath, relativePath).replace(/\\/g, '/');
}
