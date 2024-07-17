import fs from 'fs';

const read = () => {
  if (fs.existsSync('query.json')) {
    const query = fs.readFileSync('query.json', 'utf8');
    return JSON.parse(query);
  } else {
    return {};
  }
};

const write = (query) => {
  fs.writeFileSync('query.json', JSON.stringify(query, null, 4));
};

const drop = () => {
  if (fs.existsSync('query.json')) {
    fs.unlinkSync('query.json');
  }
};

export default {
  read,
  write,
  drop,
};
