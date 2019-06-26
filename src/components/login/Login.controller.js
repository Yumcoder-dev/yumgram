import { Map } from 'immutable';
import { pipe, withLifecycle, withState, withHandlers } from '../../js/sys/index';

const init = (/* porps */) => Map({ showSearchCountry: false });

const componentDidMount = () => {
  document.body.style = 'background: #e7ebf0;';
};

const componentWillUnmount = () => {
  document.body.style = 'background: ;';
};

const openSearchContry = ({ setData }) => () => setData(s => s.set('showSearchCountry', true));
const closeSearchCountry = ({ setData }) => () => setData(s => s.set('showSearchCountry', false));

export default pipe(
  withState(init),
  withHandlers({ openSearchContry, closeSearchCountry }),
  withLifecycle({
    componentDidMount,
    componentWillUnmount,
  }),
);
