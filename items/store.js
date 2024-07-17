import fs from 'fs';

const read = () => {
  if (fs.existsSync('items.json')) {
    const items = fs.readFileSync('items.json', 'utf8');
    return JSON.parse(items);
  } else {
    return {};
  }
};

const write = (items) => {
  fs.writeFileSync('items.json', JSON.stringify(items, null, 4));
};

const drop = () => {
  if (fs.existsSync('items.json')) {
    fs.unlinkSync('items.json');
  }
};

export default {
  read,
  write,
  drop,
};
