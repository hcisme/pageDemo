import { cutFile } from './cutFile.js';

const input = document.querySelector("input[type='file']");

input.onchange = async (e) => {
  const file = e.target.files[0];
  console.time('cutfile');
  const chunks = await cutFile(file);
  console.timeEnd('cutfile');
  console.log(chunks);
};
