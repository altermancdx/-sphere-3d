const Cube = (m, e, r) => {
  return function (name, dep, func) {
    func(m, e, r);
  }
}

module.exports = Cube;
