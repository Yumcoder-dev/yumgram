/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
// function startCounter(event) {
//   console.log(event.data, self);
//   let initial = event.data;
//   setInterval(() => this.postMessage(initial++), 1000);
// }
// self.addEventListener('message', startCounter);

// import Config from './js/app/config';

// const worker = () => {
//   console.log('Message received...', Config);

//   self.addEventListener('message', e => {
//     // eslint-disable-next-line no-undef
//     // const Config = require('./js/app/config');
//     postMessage('Response');
//   });
// };
// export default worker;
// import Config from './js/app/config';

const worker = () => {
  self.addEventListener('message', event => {
    // postMessage(calculatePi(event.data));
    self.importScripts(`${process.env.PUBLIC_URL}/static/js/config.js`);
    console.log('vvvv', event);
    self.postMessage('ssss');
  });
};
export default worker;
