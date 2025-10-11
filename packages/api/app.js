// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
//
// // __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// // Small test file
// const testFile = path.join(__dirname, 'test.txt');
//
// // Create a small test file if it doesn't exist
// if (!fs.existsSync(testFile)) {
//   fs.writeFileSync(testFile, 'Hello Node.js!', 'utf8');
// }
//
// // Async function using callback
// function someAsyncOperation(callback) {
//   fs.readFile(testFile, callback);
// }
//
// const timeoutScheduled = Date.now();
//
// setTimeout(() => {
//   const delay = Date.now() - timeoutScheduled;
//   console.log(`${delay}ms have passed since I was scheduled`);
// }, 100);
//
// // Perform async operation
// someAsyncOperation((err, data) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }
//
//   console.log('File content:', data.toString());
//
//   const startCallback = Date.now();
//
//   // Simulate 10ms synchronous work
//   while (Date.now() - startCallback < 10) {
//     // do nothing
//   }
//
//   console.log('Finished 10ms of work in callback');
// });
let startCallback = Date.now();
while (Date.now() - startCallback < 6) {
  // do nothing
  console.log("hey");
}
