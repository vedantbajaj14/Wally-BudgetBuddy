import fs from 'fs';

const read = () => {
  if (fs.existsSync('categories.json')) {
    const categories = fs.readFileSync('categories.json', 'utf8');
    return JSON.parse(categories);
  } else {
    return {};
  }
};

const write = (categories) => {
  fs.writeFileSync('categories.json', JSON.stringify(categories, null, 4));
};
const drop = () => {
  if (fs.existsSync('categories.json')) {
    fs.unlinkSync('categories.json');
  }
};

export default {
  read,
  write,
  drop,
};
