const characters = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz".split(
  ""
);

const randomToken = (length = 5) =>
  range(length)
    .map(() => characters[Math.floor(Math.random() * characters.length)])
    .join("");

const range = length => [...Array(length).keys()];

module.exports = {
  randomToken,
  range
};
