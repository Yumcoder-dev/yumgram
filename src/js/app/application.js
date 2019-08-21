import SwitchLayout from './layoutSwitch';
import Idle from './idle';

export default class Application {
  static start() {
    SwitchLayout.start();
    Idle.start();

    // if (Config.Modes.force_mobile) {
    //   layout = 'mobile';
    // } else if (Config.Modes.force_desktop) {
    //   layout = 'desktop';
    // }

    // switch (layout) {
    //   case 'mobile':
    //     Config.Mobile = true;
    //     break;
    //   case 'desktop':
    //     Config.Mobile = false;
    //     break;
    //   default:
    //     var width = $(window).width();
    //     Config.Mobile = Config.Navigator.mobile || (width > 10 && width < 480);
    //     break;
    // }
  }
}
