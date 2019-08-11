import { Map } from 'immutable';
import { pipe, withLifecycle, withState, withHandlers } from '../../js/core/index';

const init = (/* porps */) => Map({ showSearchCountry: false, selectedCountry: {} });

const componentDidMount = () => {
  document.body.style = 'background: #e7ebf0;';
  // const dcID = 2;
  // const options = { dcID, createNetworker: true };
  // MtpApiManager.invokeApi('help.getNearestDc', {}, options)
  //   .then(sentCode => {
  //     console.log('help.getNearestDc:------', sentCode);
  //   })
  //   .catch(e => console.log('help.getNearestDc, err:------', e));
  // MtpApiManager.invokeApi(
  //   'auth.sendCode',
  //   {
  //     flags: 0,
  //     phone_number: '989353620311',
  //     api_id: Config.App.id,
  //     api_hash: Config.App.hash,
  //     lang_code: navigator.language || 'en',
  //   },
  //   options,
  // )
  //   .then(sentCode => {
  //     console.log('auth.sendCode:', sentCode);
  //   })
  //   .catch(e => console.log('auth.sendCode, err:', e));
  // Crypto.modPow([2, 2, 2], [1, 2, 3], [1, 2, 3]).then(sentCode => {
  //   console.log('----modPow----:', sentCode);
  // });
};

const componentWillUnmount = () => {
  document.body.style = 'background: ;';
};

const openSearchContry = ({ setData }) => () => setData(s => s.set('showSearchCountry', true));
const closeSearchCountry = ({ setData }) => () => setData(s => s.set('showSearchCountry', false));
const onChooseCountry = ({ setData }) => selectedItem => {
  console.log('select --->', selectedItem);
  setData(s => s.set('selectedCountry', selectedItem).set('showSearchCountry', false));
};

export default pipe(
  withState(init),
  withHandlers({ openSearchContry, closeSearchCountry, onChooseCountry }),
  withLifecycle({
    componentDidMount,
    componentWillUnmount,
  }),
);
