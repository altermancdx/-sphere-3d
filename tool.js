const path = require('path');
const chalk = require('chalk');
const fs = require('graceful-fs');
const str = fs.readFileSync(
  path.join(__dirname, './src/source/map3d-earth/0.1.14.js'),
  'utf8',
);

const prefix = `const Cube = require('@/Cube')(module, module.exports, require);`;

let npmDepts = [];
const libs = str.split(/Cube\(\"datav\:\/com\/@double11-2017\/map3d-earth\/0.1.14/g)
  .filter((_, i) => i > 0)
  .map((str) => `Cube("datav:/com/@double11-2017/map3d-earth/0.1.14${str}`)
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
  const output = id.replace('datav:/com/@double11-2017/map3d-earth/0.1.14', 'map3d-earth');
  let dirname = path.dirname(output);
  let filename = path.basename(output);
  let extname = path.extname(output);
  if (!extname || extname === '.14') {
    dirname = output;
    filename = 'index.js';
  }
  // console.log({ output, dirname, filename, extname });
  return { dirname, filename, path: path.join(dirname, filename) };
}

function handleDeps(str) {
  const deptReg = /[= ][a-zA-Z]\("datav:[^"]+?"\)/g;
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
      if (!name.startsWith('/com/@double11-2017/map3d-earth/0.1.14')) {
        console.log(chalk.red(dep));
      }
      const newDep = dep.replace('datav:/com/@double11-2017/map3d-earth/0.1.14', 'map3d-earth')
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
// installNpmDept();

// fs.mkdirSync(path.resolve('map3d-earth/lib'), { recursive: true });
// console.log(getId(libs[0]));
// console.log(getPath(getId(libs[0])));
// libs.forEach((str) => {
//   const id = getId(str);
//   const res = getPath(id);
//   console.log(res);
// });
