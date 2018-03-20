/*system interfaces url*/
/**
 * 登录
 * */
export const LOGIN_AUTH = "/mc/login/authenUser";
/*
 *查询所有投放计划
 */
export const QUERY_CAMPAIGNPLAN = "/mc/campaignPlan/list";
/*
 *投放类型
 */
export const DELIVER_TYPE = '/dataDic/getDataDicList/publish_type';
/*
 *广告位属性
 */
export const BANNER_PROPERTY = '/dataDic/getDataDicList/banner_property';

/*
 *业务产品
 */
export const BUSINESS_PRODUCT = '/dataDic/getDataDicListByDataType/';
/*
 *创建投放计划
 */
export const PLAN_CREATE = '/mc/campaignPlan/addCampaignPlan';
/*
 *更新投放计划
 */
export const PLAN_UPDATE = '/mc/campaignPlan/updateCampaignPlan';
/*
 *复制投放计划
 */
export const PLAN_COPY = '/mc/campaignPlan/copyCampaignPlan/';
/*
 *查询投放计划-基本信息
 */
export const SELECT_CAMPAIGNPLAN = '/mc/campaignPlan/selectCampaignPlan/';
/*
 *删除投放计划
 */
export const DEL_CAMPAIGNPLAN = '/mc/campaignPlan/delCampaignPlan/';
/*
 *查询所有投放动作
 */
export const GET_PUBLISHBYCAMPAIGNPLAN = '/mc/publish/getPublishsByCampaignIdPagination/';
export const GET_PUBLISH = '/mc/publish/getPublishsByCampaignId/';
/*
 *查询所有单渠道 适用于弹框中单渠道
 */
export const GET_ALL_REFFERAL = '/refferal/';
/*所有单渠道和代理商 适用于下拉搜索*/
export const GET_ALL_REFFERAL_AGENT = '/refferal/getRefferalAndAngentList';

/*添加投放动作*/
export const ADD_PUBLISH = '/mc/publish/insertPublishList';

/*编辑投放动作-广告位*/
export const UPD_PUBLISH = '/mc/publish/updatePublish';
/*编辑投放动作-渠道开始结束时间*/
export const UPD_PUBLISH_TIME = '/mc/publish/updatePublishTime';

/*删除投放动作*/
export const DEL_PUBLISH = '/mc/publish/delPublish/';

/*停止投放动作*/
export const STOP_PUBLISH = '/mc/publish/stopPublish/';

/*获取Keyword*/
export const GET_KEYWORD = '/mc/publish/getKeyword';

/*查询广告栏位*/
export const GET_BANNER_REFFERAL = '/banner/getBannersByRefferalIdAndPublishId';

/*查询所有素材任务*/
export const GET_MATERIAL_TASKLIST = '/materialTask/getMaterialTaskList/';

/*素材类型*/
export const DATA_DIC = '/materialTask/getDataDicList';

/*查询分配任务*/
export const GET_MATERIAL_TASK = '/materialTask/view/';

/*分配的用户*/
export const ALLOCATION_USER = '/materialTask/getUserList';

/*查询所有的附件*/
export const GET_ATTACH_MUL = '/attachment/getMultipleAttachments';

/*删除附件*/
export const DEL_ATTACH = '/attachment/deleteMultipleAttachments';

/*分配*/
export const ASSIGN_MATERIAL = '/materialTask/batchSave/';

/*上传*/
export const UPLOAD = '/attachment/push/';

/*下载*/
export const DOWNLOAD = '/attachment/fetch/';

/*导出投放URL列表*/
export const EXPORT_URL = "/mc/publish/export/";

/*验收完成*/
export const CHECK_COMPLETE = "/materialTask/complete/";
/**
 * target
 * */
export const TARGET = "/dataDic/getDataDicList/target";
/**
 * 渠道管理
 * */
/**获取渠道类型*/
/*12.07 SEM分支新增1 所有类型 2非SEM 3只SEM渠道 不传默认为不含SEM的*/
export const GET_CHANNEL_TYPE = "/dataDic/getDataDicList/refferal_type";
/**
 * 获取部门
 * */
export const GET_DEPARTMENT = "/dataDic/getDataDicList/refferal_dept";
/**
 * 获取渠道列表
 * */
export const GET_CHANNEL_LIST = "/refferal/refferalList";
/**
 *获取渠道ROI列表
 **/
export const GET_ROI_LIST = "/roi/roiList";
/**
 * 获取渠道状态
 * */
export const GET_CHANNEL_STATUS = "/dataDic/getDataDicList/refferal_state";
/**
 * 渠道导入模板地址
 * */
export const TEMPLATE_URL = "/refferal/template";
/**
 * 渠道导入地址
 * */
export const EXCEL_IMPORT_URL = "/refferal/excelImport";
/**
 * 开放接口
 * */
export const OPEN_API = "/dataDic/getDataDicList/refferal_port";
/**
 * 结算方式
 * */
export const SETTLE_MODE = "/dataDic/getDataDicList/refferal_payment";
/**
 * 产品接口
 * */
export const PRODUCT_API = "/product/getList";
/**
 * 获取单条渠道信息 -- id
 * */
export const VIEW_CHANNEL_BY_ID = "/refferal/view";
/**
 * 渠道保存
 * */
export const CHANNEL_SAVE = "/refferal/save";
/**
 * 渠道复制 --id
 * */
export const CHANNEL_COPY_BY_ID = "/refferal/copy";
/**
 * 渠道删除 --id
 * */
export const CHANNEL_DELETE_BY_ID = "/refferal/delete";
/**
 * 广告位
 * */
/**
 *获取广告位列表
 * */
export const GET_BANNER_BY_REFFERALID = "/banner/getBannersByRefferalId";
/**
 * 获取广告位类型
 * */
export const GET_BANNNER_TYPE = "/dataDic/getDataDicList/banner_type";
/**
 * 获取广告位置
 * */
export const GET_BANNNER_POSITION = "/dataDic/getDataDicList/banner_place";
/**
 * 获取单条广告位信息 --id
 * */
export const GET_BANNERINFO_BY_ID = "/banner/view";
/**
 * 保存广告位信息
 * */
export const BANNER_SAVE = "/banner/save";
/**
 * 广告位模板下载
 * */
export const AD_TEMPLATE_DOWNLOAD = "/banner/template";
/**
 * 广告位模板上传
 * */
export const AD_TEMPLATE_UPLOAD = "/banner/template/upload";
/**
 * 广告位导入
 * */
export const AD_EXCEL_IMPORT_URL = "/banner/excelImport";

/**素材管理*/
/**
 * 获取素材状态
 * */
export const GET_MATERIAL_STATUS = "/materialTask/getDataDicList";
/**
 * 获取素材列表
 * */
export const GET_MATERIAL_LIST = "/materialTask/selectMaterialTaskList";
/**
 * 获取单条素材task信息
 * */
export const GET_MATERIAL_TASK_BY_ID = "/materialTask/selectMaterialTask";
/**
 * 接受任务
 * */
export const ACCEPT_TASK = "/materialTask/updateTaskStatu";
/**
 * 获取素材管理列表
 * */
export const GET_MATERIAL_MANAGE_LIST = "/attachment/getMaterialList";
/**
 * 获取历史记录
 * */
export const GET_OPERATE_HISTORY = "/attachment/history/list/";
/**
 * 素材列表--删除素材
 * */
export const DELETE_MATERIAL = "/attachment/deleteMaterial";
/**
 * 邮件通知接口
 * */
export const NOTICE_EMAIL = "/email/custome";
/*字典数据*/
export const GET_DATA_DIC = "/dataDic/getDataDicList/";
/*主数据分页列表*/
export const MAIN_DATA_PAGINATION = "/dataDic/getMainDataListByPagination";
/*子数据添加*/
export const ADD_SUB_DATA = "/dataDic/insert";
/*子数据更新*/
export const UPDATE_SUB_DATA = "/dataDic/update";
/*子数据删除*/
export const DEL_SUB_DATA = "/dataDic/delete/";
/*数据CODE生成*/
export const GET_SUB_DATA_CODE = "/dataDic/getDataCode/";

/*代理商 for pagination*/
export const GET_AGENT_PANINATION = "/agent/getAgentList";
/*agent get*/
export const GET_AGENT_ALL = "/agent/getall";
/*agent save*/
export const SAVE_AGENT = "/agent/save";
/*agent load*/
export const GET_AGENT = "/agent/view/";
/*add agent channel*/
export const ADD_AGENT_CHANNEL = "/agent/saveAgentRefferal/";
/*get agent channel by pagination*/
export const GET_AGENT_CHANNEL = "/agent/getAgentRefferal";
/*remove agent channel by id*/
export const DEL_AGENT_CHANNEL = "/agent/deleteAgentRefferal/";
/*query channel by agent*/
export const GET_CHNNEL_BY_AGENT = "/refferal/getRefferalByAgentId/";


export const GET_DASHBOARD_OVERVIEW = "/dashboard/overViewData";
export const GET_CURRENT_DATA = "/dashboard/currentTimeMillis";
export const GET_CHANNEL_BYTYPE = "/dashboard/selectRefferalByDataType";
export const GET_CHANNEL_BYTYPE_ADMIN = "/dashboard/selectRefferalByDataTypeAdmin";
export const GET_DASHBOARD_CHAT1 = "/dashboard/selectRefferalCompare";
export const GET_DASHBOARD_CHAT2 = "/dashboard/selectRefferalTrend";
export const GET_DASHBOARD_CHAT3 = "/dashboard/selectRefferalConvertRatio";
export const GET_DASHBOARD_CHAT4 = "/dashboard/topN";
export const GET_DASHBOARD_NOWCHAT3 = "/dashboard/selectRegRealTime";

//DASHBOARD实时数据
export const GET_DASHBOARD_UVCHAT3 = "/dashboard/selectUvRealTime";
export const GET_DASHBOARD_PVCHAT3 = "/dashboard/selectPvRealTime";
/*新注册首投人数实时*/
export const GET_FIRSTINVEST_PERSON = "/dashboard/selectFirstInvestPerson";
/*新注册首投金额实时*/
export const GET_FIRSTINVEST_AMOUNT = "/dashboard/selectFirstInvestAmount";
/*新注册人均首投金额实时*/
export const GET_AVGFIRSTINVEST_AMOUNT = "/dashboard/selectAvgFirstInvestAmount";
/*新注册累计投资人数实时*/
export const GET_TOTALINVEST_PERSON = "/dashboard/selectTotalInvestPerson";
/*新注册累计投资金额实时*/
export const GET_TOTALINVEST_AMOUNT = "/dashboard/selectTotalInvestAmount";
/*新注册人均累计金额实时*/
export const GET_AVGTOTALFIRSTINVEST_AMOUNT = "/dashboard/selectAvgTotalInvestAmount";


// export const GET_DASHBOARD_DATADICLIST="/dataDic/getDataDicList/"
/*url可达性校验*/
export const CHECK_URL = "/mc/publish/checkUrlValid";
/*权限设置*/
export const POST_PERMISSION_LIST = "/user/getUserList";
/*权限设置-角色列表*/
export const GET_ROLE_LIST = "/dataDic/getRoleList";
/*权限设置-授权*/
export const POST_PERMISSION = "/user/batchPermission";

/**
 * 活动页相关接口
 * */
/*活动类型*/
export const GET_ACTIVITY_TYPE = "/dataDic/getDataDicList/active_type";
/*活动状态*/
export const GET_ACTIVITY_STATUS = "/dataDic/getDataDicList/active_status";
/*活动列表*/
export const GET_ACTIVITY_LIST = "/active/getActiveList";
/*保存、更新*/
export const SAVE_ACTIVITY = "/active/insertActive";
/*根据ID查询活动信息，例如：/active/selectActive/1000*/
export const GET_ACTIVITY_BY_ID = "/active/selectActive/";
/*更改发布状态*/
export const UPDATE_ACTIVITY_STATUS = "/active/updateActiveStatus";
/*根据ID删除活动，例如：http://ip:port/active/delActive/1000*/
export const DELETE_ACTIVITY_BY_ID = "/active/delActive/";
/*获取操作记录*/
export const GET_ACTIVITY_HISTORY_BY_ID = "/active/getActiveHisList/";
/*获取广告位URL*/
export const GET_ACTIVITY_URL_LIST = "/active/getActiveUrlListByUser";

/**
 * 投放动作，根据渠道ID获取广告列表
 * 例如：http://ip:port/banner/getList/1000
 * */
export const GET_BANNERINFO_BY_REFFERALID = "/banner/getList/";
/**
 * 根据ID获取投放动作
 * */
export const GET_DEVILERINFO_BY_ID = "/mc/publish/selectPublish/";

/**
 *投放动作获取投放方式
 **/
export const GET_PUBLISH_WAY = "/dataDic/getDataDicList/publish_way";
/**
 * 下载对账明细
 */
export const EXPORT_DETAIL_LIST = "/report/export/roi/detail/";

/**
 * singleDashboard 素材下拉框
 */
    // dashboard投放计划下拉框查询
export const CAMPAING_PLAN_DASHBOARD = "/dashboard/publish/selectCompaignPlanByChannelAndBizType";
//素材,关键词下拉框
export const GET_UTM_BYBANNERID = "/dashboard/publish/getUtmByBannerId";
//广告位下拉框
export const GET_BANNER_BYCAMPAIGNPLANID = "/dashboard/publish/getBannersByCampaignPlanId";
//dashboard投放数据对比
export const SELECT_COMPARE = "/dashboard/publish/selectCompare";
//dashboard投放数据趋势
export const SELECT_PUBLISH_TREND = "/dashboard/publish/selectPublishTrend";

/*
channelDetail渠道明细报表
 */
//数据指标POST
// export  const  GET_TYPE_TITLE ="/dashboard/selectStatisticsType";
//查询数据
export const GET_STATISTIC_DATA = "/dashboard/selectStatisticsData";
//导出查询
export const DOWNLOAD_CHANNEL_DETAIL = "/dashboard/exportReport";
//获取所有渠道
export const GET_REFFERAL_BYPUBLISH = "/dashboard/getRefferalByPublish";

/**
 * JOB 相关接口
 */
/*获取job列表*/
export const GET_JOB_LIST = "/job/list";
/*查询单条job*/
export const GET_JOB_BY_GROUPNAME = "/job/select";
/*保存 job*/
export const JOB_SAVE = "/job/add";
/*编辑 job*/
export const JOB_UPDATE = "/job/update";
/*立即执行 job*/
export const JOB_EXECUTE = "/job/execute";
/*启动 job*/
export const JOB_START = "/job/resume";
/*暂停 job*/
export const JOB_PAUSE = "/job/pause";
/*删除 job */
export const JOB_DELETE = "/job/del";
/*查询执行历史*/
export const VIEW_JOB_HISTORY = "/job/history";
/*查询job异常信息*/
export const VIEW_JOB_ERROR = "/job/error";

/**
 * 智能运营 相关接口
 */
/*获取渠道*/
export const GET_REFFERAL_LIST = "/mc/publish/selectRefferal";
/*获取投放计划*/
export const GET_DELIVER_PLAN_LIST = "/mc/campaignPlan/selectCampaignPlans";
/*获取投放动作*/
/*export const GET_DELIVER_ACTION_LIST = "/mc/publish/selectPublishs";*/
export const GET_DELIVER_ACTION_LIST = "/mc/publish/selectPublishsByCondition";
/*查询列表接口*/
export const GET_COMPARE_LIST = "/abt/list";
/*投放对比初始化接口*/
export const COMPARE_INIT = "/abt/compareIntial";
/*新建投放对比*/
export const ABT_COMPARE = "/abt/compare";
/*获取abt最后的评分规则*/
export const GET_ABT_LASTOPTION = "/abt/lastOption";

/**
 * ABT ROI MODEL 相关接口
 * */
/*ROI维度字典接口*/
export const GET_REFFERAL_ROI_DIC = '/dataDic/getDataDicList/refferal_roi';
/*K线图接口*/
export const GET_REFFERAL_ROI_K = '/refferal/roi/costPro';
/*象限图接口*/
export const GET_REFFERAL_ROI_Q = '/refferal/roi/roiPro';
/*数据表格接口*/
export const GET_REFFERAL_ROI_LIST = '/refferal/roi/list';

/**
 * 渠道留存日报
 */
export const GET_OVER_REPORT = "/refferal/retention/selectRetentionData";

export const EXPORT_OVER_REPORT = "/refferal/retention/export/";
/**
 * People 相关接口
 */
/*获取渠道*/
export const PEOPLE_GET_REFFERAL_LIST = '/refferal/analyze/getRefferalList';
/*数据字典接口*/
export const PEOPLE_GET_DIC = '/dataDic/getDataDicList/refferal_analyze';
/*字典接口-操作符 /getDataDicByType/{parentId}/{dataType}*/
export const PEOPLE_GET_OPERATE = '/dataDic/getDataDicByType';
/*抱团类型 产品列表*/
export const GET_INVEST_TYPE = '/dataDic/getDataDicList/current_invest_type';
/*柱状图数据查询接口*/
export const PEOPLE_GET_ANALYZE_DATA = '/refferal/analyze/data';

/**
 * Sem相关接口
 */
/*获取投放动作*/
export const SEM_SELECT_PUBLISH = '/mc/publish/sem/selectPublish/';
/*新增投放动作*/
export const SEM_INSERT_PUBLISH = '/mc/publish/sem/insertPublish/';
/*修改投放动作*/
export const SEM_UPDATE_PUBLISH = '/mc/publish/sem/updatePublish/';
/*删除投放动作*/
export const SEM_DELETE_PUBLISH = '/mc/publish/sem/deletePublish/';
/*暂停投放动作*/
export const SEM_STOP_PUBLISH = '/mc/publish/sem/stopPublish/';
/*根据投放动作id获取投编辑详情*/
export const GET_SET_PUBLISH = '/mc/publish/sem/getSemPublishByPublishId/';
/*根据投放动作id获取对应账户详情*/
export const GET_ACTION_DETAIL = '/mc/publish/sem/getSemPlanByPublishId/';
/*导出sem投放动作明细*/
export const SEM_DOWNLOAD_DETAIL = '/report/exportSemPublishDetail/';
/*单渠道下新建账户*/
export const CREATE_ACCOUNT_SEM = '/mc/sem/account/save';
/*单渠道下查询账户*/
export const SELECT_ACCOUNT_SEM = '/mc/sem/account/selectList';
/*获取所有渠道**/
export const GET_CHANNEL_BYTYPE_SEM = "/refferal/getSemRefferal";
/*投放动作上传excel报表*/
export const SEM_UPLOAD_EXCEL = "/mc/publish/sem/getSemPlanByExcel";
/**
 * sem报表
 */
/*获取sem渠道和账户*/
export const GET_SEM_REFFERAL_ACCOUNT = '/mc/sem/report/refferalAccount';
/*主报表*/
export const GET_SEM_REPORT_MAIN = '/mc/sem/report/main';
/*明细报表*/
export const GET_SEM_REPORT_DETAIL = '/mc/sem/report/detail';
/*导出报表*/
export const SEM_REPORT_EXPORT = '/report/exportSemReport';

/**
 * 活动数据
 */
export const ACTIVITY_DATA_EXPORT = '/mc/activityData/exportActivityData';
export const ACTIVITY_DATA_EXPORT_BY_PAGEID = '/mc/activityData/exportByPageId';

/**
 *MGM模块
 */
/*mgm主报表*/
export const MGM_REPORT_MAIN = '/mgm/mgmMainReport/getList/';
/*mgm主报表导出*/
export const MGM_REPORT_MAINEXPORT = '/mgm/mgmMainReport/exportReport/';
/*mgm明细报表查询*/
export const MGM_REPORT_DETAIL = '/mgm/mgmDetailReport/getList/';
/*mgm明细报表导出*/
export const MGM_REPORT_DETAILEXPORT = '/mgm/mgmDetailReport/exportReport/';

/*结算发券接口*/
export const MGM_SETTLE_SEND = '/mgm/mgmSettle/manualSendCoupon';
/*批量发放接口*/
export const MGM_BATCH_SETTLE_SEND = '/mgm/mgmSettle/batchManualSendCoupon';

/*MGM活动列表分页查询接口*/
export const MGM_ACTIVITY_LIST = '/mgm/activity/query';
/*MGM活动列表停止*/
export const MGM_ACTIVITY_STOP = '/mgm/activity/stop';
/*MGM活动列表删除*/
export const MGM_ACTIVITY_DELETE = '/mgm/activity/delete';


/*mgm字典*/
export const MGM_DICTIONARY = '/mgm/dataDic/getDataDicList/';
/*编辑查询，根据Id查询*/
export const QUERY_BY_MGMID = '/mgm/activity/queryByMgmId/';
/*新增活动*/
export const ADD_MGM_ACTIVITY = '/mgm/activity/add';
/*更新活动*/
export const UPDATE_MGM_ACTIVITY = '/mgm/activity/update';
/*奖励发放报表*/
export const MGM_AWARD_REPORT = '/mgm/mgmSettle/queryByCondition';
/*手动发放奖励*/
export const MGM_MANUAL_SEND = '/mgm/mgmSettle/manualSendCoupon';
/*奖励统计主表*/
export const MGM_SETTLE_REPORT = '/mgm/mgmSettle/mainSettleReport';
/*奖励统计明细表*/
export const MGM_SETTLE_REPORT_DETAIL = '/mgm/mgmSettle/detailSettleReport';

/**
 * 代理人模块
 * */
/*代理人等级 --Start*/
/*代理人等级管理查询*/
export const PROXY_LEVEL_QUERY = '/proxy/level/selectAll';
/*设置佣金系数*/
export const PROXY_LEVEL_SET_COMMISSION_FACTOR = '/proxy/level/setProxyLevelBrokerage';
/*查询当前等级已选择的邀请权益*/
export const PROXY_LEVEL_IR_QUERY_BY_LEVELID_SELECTED = '/proxy/equity/getProxyEquityByLevelId/';
/*查询邀请权益池*/
export const PROXY_LEVEL_IR_QUERY_BY_LEVELID_ALL = '/proxy/equity/unselected/';
/*编辑当前等级邀请权益*/
export const PROXY_LEVEL_IR_CURRENT_EDIT = '/proxy/levelEquity/batchSave';
/*新增邀请权益*/
export const PROXY_LEVEL_IR_ADD = '/proxy/equity/save';
/*删除邀请权益*/
export const PROXY_LEVEL_IR_DELETE = '/proxy/equity/delteById/';
/*券计划--券类型*/
export const PROXY_LEVEL_IR_COUPON_PLAN = '/proxy/promotion/getCouponPlanAndTemplateList';
/*代理人等级 --End*/

/*奖励发放 --Start*/
/*奖励发放列表*/
export const PROXY_AWARD_LIST ='/award/list';
/*奖励发放 --End*/

/*代理人用户管理 --Start*/
/*奖励发放列表*/
export const PROXY_USER_LIST ='/proxy/listPage';
export const PROXY_USER_ADD ='/proxy/add';
export const PROXY_USER_UPDATE ='/proxy/update';
export const PROXY_USER_FREEZE ='/proxy/stop';
export const PROXY_USER_UNFREEZE ='/proxy/unfreeze';
export const PROXY_USER_DELETE ='/proxy/delete';
export const PROXY_USER_TYPE ='/proxy/classify';
/*代理人用户管理 --End*/
