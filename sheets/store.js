import fs from 'fs';

const read = () => {
  if (fs.existsSync('sheets.json')) {
    const sheets = fs.readFileSync('sheets.json', 'utf8');
    return JSON.parse(sheets);
  } else {
    return {};
  }
};

const write = (sheets) => {
  fs.writeFileSync('sheets.json', JSON.stringify(sheets, null, 4));
};

const drop = () => {
  if (fs.existsSync('sheets.json')) {
    fs.unlinkSync('sheets.json');
  }
};

export default {
  read,
  write,
  drop,
};
