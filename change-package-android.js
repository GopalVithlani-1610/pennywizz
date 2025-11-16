// import path from 'path';
// import fs from 'node:fs';
const path = require('path');
const fs = require('node:fs');
const androidPath = path.join(
  __dirname,
  'android',
  'app',
  'src',
  'main',
  'java',
);

const devFolderPath = 'com.demo.demo';
const prodFolder = 'com.budgetplanner.spendsure';
function changeToDevelopment() {
  const pathParts = devFolderPath.split('.');
  const isPresent = fs.existsSync(
    path.join(androidPath, ...devFolderPath.split('.')),
  );
  if (isPresent) {
    return;
  }
  fs.mkdirSync(path.join(androidPath, ...pathParts), {recursive: true});

  const files = fs.readdirSync(
    path.join(androidPath, ...prodFolder.split('.')),
  );
  const fileDir = path.join(androidPath, ...prodFolder.split('.'));
  for (const file of files) {
    const filePath = path.join(fileDir, file);
    let buffer = fs.readFileSync(filePath, {encoding: 'utf8'});
    buffer = buffer.replace(prodFolder, devFolderPath);
    fs.writeFileSync(path.join(androidPath, ...pathParts, file), buffer);
  }
  fs.rmdirSync(
    path.join(androidPath, prodFolder.split('.')[0], prodFolder.split('.')[1]),
    {
      recursive: true,
    },
  );
  const appPath = path.join(__dirname, 'android', 'app');
  const buildGradle = path.join(appPath, 'build.gradle');

  const read = fs.readFileSync(buildGradle, {encoding: 'utf8'});
  fs.writeFileSync(buildGradle, read.replaceAll(prodFolder, devFolderPath));
}

function changeToProduction() {}
changeToDevelopment();
