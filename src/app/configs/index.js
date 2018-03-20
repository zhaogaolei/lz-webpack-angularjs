/**
 * Created by leiz on 2018/2/6 17:21.
 * 路由集中在此追加
 */
import configModule from './config.module';

import appConfig from './config';
import activityConfig from './activity/route.config';
import channelConfig from './channel/route.config';
import channelRoiConfig from './channelroi/route.config';
import dashboardConfig from './dashboard/route.config';
import deliverConfig from './deliverplan/route.config';
import intelligentConfig from './intelligent/route.config';
import materialConfig from './material/route.config';
import mgmConfig from './mgm/route.config';
import proxyConfig from './proxy/route.config';
import semConfig from './sem/route.config';
import settingConfig from './setting/route.config';

configModule.config(appConfig);
configModule.config(activityConfig);
configModule.config(channelConfig);
configModule.config(channelRoiConfig);
configModule.config(dashboardConfig);
configModule.config(deliverConfig);
configModule.config(intelligentConfig);
configModule.config(materialConfig);
configModule.config(mgmConfig);
configModule.config(proxyConfig);
configModule.config(semConfig);
configModule.config(settingConfig);
