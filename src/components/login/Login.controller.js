import { Map } from 'immutable';
import { pipe, withLifecycle, withState, withHandlers } from '../../js/core/index';

const init = (/* porps */) => Map({ showSearchCountry: false, selectedCountry: {} });

const componentDidMount = () => {
  document.body.style = 'background: #e7ebf0;';
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
