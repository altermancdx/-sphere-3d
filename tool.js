const path = require('path');
const chalk = require('chalk');
const fs = require('graceful-fs');

let npmDepts = [];

const filePath = './src/source/map3d-earth-scanner/0.0.12.js';
const specailName = '/com/map3d-earth-scanner/0.0.12';
const comName = 'map3d-earth-scanner';

const splitStr = 'datav:' + specailName;

const splitReg = new RegExp(`Cube\\("${splitStr}`, 'g');

const str = fs.readFileSync(
  path.join(__dirname, filePath),
  'utf8',
);

const prefix = `const Cube = require('@/Cube')(module, module.exports, require);`;
const libs = str.split(splitReg)
  .filter((_, i) => i > 0)
  .map((str) => `Cube("${splitStr}${str}`)
  .map((str) => {
    const id = getId(str);
    const { dirname, filename, path } = getPath(id);
    return { id, path, dirname, filename, content: str };
  })
  .map((obj) => {
    return {
      ...obj,
      content: `${prefix}\n${handleDeps(obj.content)}`,
    };
  })
  .forEach((obj) => {
    writeFile(obj);
  });

function getId(str) {
  const reg = /Cube\("([^"]+?)",/;
  const res = str.match(reg);
  return res[1];
}

function getPath(id) {
  const output = id.replace(splitStr, comName);
  let dirname = path.dirname(output);
  let filename = path.basename(output);
  let extname = path.extname(output);
  if (!extname || typeof +extname === 'number') {
    dirname = output;
    filename = 'index.js';
  }
  // console.log({ output, dirname, filename, extname });
  return { dirname, filename, path: path.join(dirname, filename) };
}

function handleDeps(str) {
  const deptReg = /[:= ][a-zA-Z]\("datav:[^"]+?"\)/g;
  const matchedDept = str.match(deptReg);
  if (!matchedDept) {
    return str;
  }
  // console.log(matchedDept);
  matchedDept.forEach((dep) => {
    const sigleReg = /datav:([^"]+?)"\)/;
    const name = dep.match(sigleReg)[1];
    if (name.startsWith('/npm/')) {
      const npmDepReg = /datav:\/npm\/([^\/]+?)\/([0-9\.]*)/;
      const [oldDep, npmName, npmVersion] = dep.match(npmDepReg);
      npmDepts.push({ name: npmName, version: npmVersion });
      const newDep = dep.replace(oldDep, npmName)
        .replace('c', 'require');
      // console.log({ name, dep, oldDep, newDep });

      str = str.replace(dep, newDep);
      // console.log(newDep);
      // dep.replace()
    } else if (name.startsWith('/com/')) {
      if (!name.startsWith(specailName)) {
        console.log(chalk.red(dep));
      }
      const newDep = dep.replace(splitStr, '@/' + comName)
        .replace('c', 'require');
      str = str.replace(dep, newDep);
      // console.log({dep, name, newDep});
    }
  });
  // console.log(str);
  return str;
}

function writeFile(info) {
  // console.log(info);
  try {
    fs.mkdirSync(path.resolve(info.dirname), { recursive: true });
  } catch (err) {
    console.log(err);
  }
  fs.writeFileSync(path.resolve(info.path), info.content);
}

function installNpmDept() {
  // console.log(npmDepts);
  const res = npmDepts.reduce((pre, cur) => {
    const { name, version } = cur;
    if (pre[name] && pre[name] !== version) {
      console.log(chalk.red(dep));
      process.exit(1);
      // const verions = Array.isArray(pre[name]) ? pre[name] : [pre[name]];
      // pre[name] = [...verions, version];
    } else {
      pre[name] = version;
    }
    return pre;
  }, {});
  console.log(`npm i ${Object.entries(res).map(([name, version]) => {
    return name + '@' + version
  }).join(' ')}`);
  // console.log(res);
}
installNpmDept();

// fs.mkdirSync(path.resolve('map3d-earth/lib'), { recursive: true });
// console.log(getId(libs[0]));
// console.log(getPath(getId(libs[0])));
// libs.forEach((str) => {
//   const id = getId(str);
//   const res = getPath(id);
//   console.log(res);
// });
