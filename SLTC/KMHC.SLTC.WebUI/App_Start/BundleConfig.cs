using System.Web;
using System.Web.Optimization;

namespace KMHC.SLTC.WebUI
{
    public class BundleConfig
    {
        // 有关绑定的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            //加载首页样式
            bundles.Add(new StyleBundle("~/Content/Index/css").Include(
                //"~/Content/CloudAdmin/css/responsive.css"
                //, "~/Content/CloudAdmin/css/animatecss/animate.min.css" // ANIMATE
                //, "~/Content/CloudAdmin/js/jquery-todo/css/styles.css" // TODO
                //, "~/Content/CloudAdmin/js/jquery-todo/css/cloud-admin.css" // TODO
                //, "~/Content/CloudAdmin/js/fullcalendar/fullcalendar.min.css" // FULL CALENDAR
                //, "~/Content/CloudAdmin/js/gritter/css/jquery.gritter.css" // GRITTER
                //, "~/Content/CloudAdmin/js/bootstrap-switch/bootstrap-switch.min.css" // 
                //, "~/Content/user.css" // 
                //, "~/Content/CloudAdmin/js/datatables/media/css/jquery.dataTables.min.css" // DATA TABLES
                //, "~/Content/CloudAdmin/js/datatables/media/assets/css/datatables.min.css" // 
                //, "~/Content/CloudAdmin/js/datatables/extras/TableTools/media/css/TableTools.min.css" // 
                //, "~/Content/CloudAdmin/js/tablecloth/css/tablecloth.min.css" // TABLE CLOTH
                //, "~/Content/CloudAdmin/js/select2/select2.min.css" // 
                //, "~/Content/CloudAdmin/js/jquery-ui-1.10.3.custom/css/custom-theme/jquery-ui-1.10.3.custom.min.css" // JQUERY UI
                         "~/Content/CloudAdmin/js/hubspot-messenger/css/messenger.min.css" // HUBSPOT MESSENGER
                        , "~/Content/CloudAdmin/js/hubspot-messenger/css/messenger-spinner.min.css" // 
                        , "~/Content/CloudAdmin/js/hubspot-messenger/css/messenger-theme-future.min.css" // 
                //, "~/Content/CloudAdmin/js/uniform/css/uniform.default.min.css" // 
                //, "~/Content/CloudAdmin/js/bootstrap-treeview/bootstrap-treeview.min.css" // TREE VIEW
                //, "~/Content/CloudAdmin/js/magic-suggest/magicsuggest-2.1.4-min.css" // MAGIC SUGGEST    
                //, "~/Content/CloudAdmin/js/jqgrid/css/ui.jqgrid.min.css" // jqgrid 
                //, "~/Content/CloudAdmin/js/please-wait/please-wait-default.css" //   
                //, "~/Content/CloudAdmin/js/please-wait/please-wait.css" //   
                //, "~/Content/CloudAdmin/js/textAngular/textAngular.css" //  
                        , "~/Content/user.css" // 
                        , "~/Content/w5cValidator/style.css"
                , "~/Content/loading-bar/loading-bar.min.css"


                        , "~/Content/Metronic/assets/global/plugins/simple-line-icons/simple-line-icons.min.css"
                        , "~/Content/Metronic/assets/global/plugins/font-awesome/css/font-awesome.min.css"
                        , "~/Content/Metronic/assets/global/plugins/bootstrap/css/bootstrap.min.css"
                        , "~/Content/Metronic/assets/global/plugins/uniform/css/uniform.default.css"
                        , "~/Content/Metronic/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css"
                        , "~/Content/Metronic/assets/global/css/components-md.css"
                        , "~/Content/Metronic/assets/global/css/plugins-md.css"
                        , "~/Content/Metronic/assets/global/plugins/select2/select2.css"
                        , "~/Content/Metronic/assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css"
                        , "~/Content/Metronic/assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css"
                        , "~/Content/Metronic/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"
                        , "~/Content/uploadify/uploadify.css"
                //, "~/Content/Metronic/assets/global/plugins/bootstrap-fileinput/css/fileinput.min.css"
                        ));

            //加载首页JS
            bundles.Add(new ScriptBundle("~/Content/Index/js").Include(
                        "~/Content/CloudAdmin/js/jquery/jquery-2.0.3.min.js" // JQUERY
                        , "~/Content/Metronic/assets/global/plugins/jquery-migrate.min.js"
                        , "~/Content/Metronic/assets/global/plugins/jquery-ui/jquery-ui.min.js"
                        , "~/Content/Metronic/assets/global/plugins/bootstrap/js/bootstrap.min.js"
                        , "~/Content/Metronic/assets/global/plugins/bootbox/bootbox.min.js"
                        , "~/Content/Metronic/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js"
                        , "~/Content/Metronic/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js"
                        , "~/Content/Metronic/assets/global/plugins/jquery.blockui.min.js"
                        , "~/Content/Metronic/assets/global/plugins/jquery.cokie.min.js"
                        , "~/Content/Metronic/assets/global/plugins/uniform/jquery.uniform.min.js"
                        , "~/Content/Metronic/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"
                        , "~/Content/Metronic/assets/global/scripts/metronic.js"
                        , "~/Content/Metronic/assets/admin/layout/scripts/layout.js"
                        , "~/Content/Metronic/assets/admin/layout/scripts/quick-sidebar.js"
                        , "~/Content/Metronic/assets/global/plugins/select2/select2.min.js"
                        , "~/Content/Metronic/assets/global/plugins/datatables/media/js/jquery.dataTables.min.js"
                        , "~/Content/Metronic/assets/global/plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js"
                        , "~/Content/Metronic/assets/global/plugins/datatables/extensions/ColReorder/js/dataTables.colReorder.min.js"
                        , "~/Content/Metronic/assets/global/plugins/datatables/extensions/Scroller/js/dataTables.scroller.min.js"
                        , "~/Content/Metronic/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"
                        , "~/Content/Metronic/assets/global/plugins/bootstrap-closable-tab/bootstrap-closable-tab.js"
                //, "~/Content/Metronic/assets/global/plugins/bootstrap-fileinput/js/fileinput.min.js"
                //, "~/Content/Metronic/assets/global/plugins/bootstrap-fileinput/js/locales/zh.js"

                        //, "~/Content/CloudAdmin/js/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js" // JQUERY UI
                ////, "~/Content/CloudAdmin/bootstrap-dist/js/bootstrap.js" // BOOTSTRAP
                //, "~/Content/CloudAdmin/js/jQuery-slimScroll-1.3.0/jquery.slimscroll.min.js" // SLIMSCROLL
                //, "~/Content/CloudAdmin/js/jQuery-slimScroll-1.3.0/slimScrollHorizontal.min.js" // 
                ////, "~/Content/CloudAdmin/js/jQuery-BlockUI/jquery.blockUI.min.js" // BLOCK UI
                //, "~/Content/CloudAdmin/js/sparklines/jquery.sparkline.min.js" // SPARKLINES
                //, "~/Content/CloudAdmin/js/jquery-easing/jquery.easing.min.js" // EASY PIE CHART
                //, "~/Content/CloudAdmin/js/easypiechart/jquery.easypiechart.min.js" // 
                //, "~/Content/CloudAdmin/js/flot/jquery.flot.min.js" // FLOT CHARTS
                //, "~/Content/CloudAdmin/js/flot/jquery.flot.time.min.js" // 
                //, "~/Content/CloudAdmin/js/flot/jquery.flot.selection.min.js" // 
                //, "~/Content/CloudAdmin/js/flot/jquery.flot.resize.min.js" // 
                //, "~/Content/CloudAdmin/js/flot/jquery.flot.pie.min.js" // 
                //, "~/Content/CloudAdmin/js/flot/jquery.flot.stack.min.js" // 
                //, "~/Content/CloudAdmin/js/flot/jquery.flot.crosshair.min.js" // 
                //, "~/Content/CloudAdmin/js/jquery-todo/js/paddystodolist.js" // TODO
                //, "~/Content/CloudAdmin/js/timeago/jquery.timeago.js" // TIMEAGO
                //, "~/Content/CloudAdmin/js/fullcalendar/fullcalendar.js" // FULL CALENDAR
                //, "~/Content/CloudAdmin/js/datatables/media/js/jquery.dataTables.js" // DATA TABLES
                //, "~/Content/CloudAdmin/js/datatables/media/assets/js/datatables.min.js" // 
                //, "~/Content/CloudAdmin/js/datatables/extras/TableTools/media/js/TableTools.js" // 
                //, "~/Content/CloudAdmin/js/datatables/extras/TableTools/media/js/ZeroClipboard.min.js" // 
                //, "~/Content/CloudAdmin/js/jQuery-Cookie/jquery.cookie.min.js" // COOKIE
                //, "~/Content/CloudAdmin/js/gritter/js/jquery.gritter.min.js" // GRITTER
                //, "~/Content/CloudAdmin/js/select2/select2.min.js" // 
                //, "~/Content/CloudAdmin/js/tablecloth/js/jquery.tablecloth.js" // TABLE CLOTH
                //, "~/Content/CloudAdmin/js/tablecloth/js/jquery.tablesorter.js" // 
                //, "~/Content/CloudAdmin/js/jQuery-slimScroll-1.3.0/jquery.slimscroll.min.js" // 
                //, "~/Content/CloudAdmin/js/jQuery-slimScroll-1.3.0/slimScrollHorizontal.min.js" // 
                //, "~/Content/CloudAdmin/js/bootstrap-switch/bootstrap-switch.min.js" // 
                //, "~/Content/CloudAdmin/js/bootbox/bootbox.min.js" // BOOTBOX
                        , "~/Content/CloudAdmin/js/hubspot-messenger/js/messenger.min.js" // HUBSPOT MESSENGER
                        , "~/Content/CloudAdmin/js/hubspot-messenger/js/messenger-theme-flat.js" // 
                        , "~/Scripts/paging.js" // 
                //, "~/Content/CloudAdmin/js/uniform/jquery.uniform.min.js" // UNIFORM
                //, "~/Content/CloudAdmin/js/jquery-validate/jquery.validate.js" // 
                //, "~/Content/CloudAdmin/js/jquery-validate/additional-methods.js" // 
                //, "~/Content/CloudAdmin/js/bootstrap-treeview/bootstrap-treeview.min.js" // TREE VIEW
                        , "~/Content/CloudAdmin/js/magic-suggest/magicsuggest-2.1.4-min.js" // MAGIC SUGGEST  
                        , "~/Content/CloudAdmin/js/highcharts/highcharts.js" //     
                        , "~/Content/CloudAdmin/js/highcharts/highcharts-exporting.js" //
                //, "~/Content/CloudAdmin/js/jqgrid/js/grid.locale-en.min.js" //   
                //, "~/Content/CloudAdmin/js/jqgrid/js/jquery.jqGrid.min.js" //    
                        , "~/Content/CloudAdmin/js/please-wait/please-wait.min.js" //    
                        , "~/Content/CloudAdmin/js/jqprint/jQuery.print.js" //  
                        , "~/Content/handlebars/handlebars.min.js"
                        , "~/Content/Moment/moment.min.js"
                        ));

            //加载angular框架库
            bundles.Add(new ScriptBundle("~/Scripts/angular").Include(
                        "~/Scripts/angular.min.js"
                        , "~/Scripts/angular-ui-router.js"
                        , "~/Scripts/angular-resource.js"
                        , "~/Scripts/angular-animate.js"
                        , "~/Scripts/angular-cookies.js"
                        , "~/Scripts/angular-messages.js"
                        , "~/Scripts/angular-sanitize.js"
                        , "~/Content/CloudAdmin/js/textAngular/textAngular-rangy.min.js" //
                        , "~/Content/CloudAdmin/js/textAngular/textAngular-sanitize.min.js" //
                        , "~/Content/CloudAdmin/js/textAngular/textAngular.min.js" //  
                        , "~/Content/w5cValidator/w5cValidator.js"
                        ));

            // 可视化报表加载angular框架库
            bundles.Add(new ScriptBundle("~/BI/Scripts/angular").Include(
                        "~/Scripts/angular.min.js"
                        , "~/Scripts/angular-ui-router.js"
                        , "~/Scripts/angular-resource.js"
                        , "~/Scripts/angular-animate.js"
                        , "~/Scripts/angular-cookies.js"
                        , "~/Scripts/angular-messages.js"
                        , "~/Scripts/angular-touch.js"
                        ));

            //加载公用脚本
            bundles.Add(new ScriptBundle("~/Scripts/AppCommon").Include(
                        "~/WebScripts/home/DCApp.js"
                        , "~/WebScripts/route/DCRoute.js"
                        , "~/WebScripts/common/*.js"
                        , "~/WebScripts/components/inputChargeItem/*.js"
                        , "~/WebScripts/components/inputResident/*.js"
                        , "~/WebScripts/components/selectCode/*.js"
                        , "~/WebScripts/components/selectItems/*.js"
                        , "~/WebScripts/components/inputStaff/*.js"
                        , "~/WebScripts/components/inputOrg/*.js"
                        , "~/WebScripts/components/inputBed/*.js"
                        , "~/WebScripts/components/inputICD9/*.js"
                        , "~/WebScripts/components/residentCard/*.js"
                        , "~/WebScripts/components/inputResident/*.js"
                        , "~/WebScripts/components/inputPerson/*.js"
                        , "~/WebScripts/components/inputResidentCheck/*.js"
                        , "~/WebScripts/components/residentList/*.js"
                        , "~/WebScripts/components/selectMultipleCode/*.js"
                        , "~/WebScripts/components/inputSelect/*.js"
                        , "~/WebScripts/components/residentSelect/*.js"
                        , "~/WebScripts/components/citySelector/*.js"
                //, "~/WebScripts/components/city/*.js"
                        , "~/WebScripts/components/selectDCode/*.js"
                        , "~/WebScripts/components/inputMonitorItem/*.js"
                        , "~/WebScripts/components/inputAddress/*.js"
                       ));

            //加载日照业务
            bundles.Add(new ScriptBundle("~/Scripts/DC").Include(
                         "~/WebScripts/controllers/Charges/*.js"
                        , "~/WebScripts/controllers/OrganizationManage/*.js"
                        , "~/WebScripts/controllers/GroupActivity/*.js"
                        , "~/WebScripts/controllers/Page/*.js"
                        , "~/WebScripts/controllers/Resident/*.js"
                        , "~/WebScripts/controllers/UserManage/*.js"
                        , "~/WebScripts/controllers/ServiceOrder/*.js"
                        , "~/WebScripts/controllers/Service/*.js"
                        , "~/WebScripts/controllers/Assessment/*.js"
                        , "~/WebScripts/controllers/Home/*.js"
                        , "~/WebScripts/controllers/SystemManage/*.js"
                        , "~/WebScripts/controllers/Nursing/*.js"
                        , "~/WebScripts/controllers/Monitor/*.js"
                        , "~/WebScripts/controllers/DC/SocialWorker/*.js"
                        , "~/WebScripts/controllers/DC/NurseCare/*.js"
                        , "~/WebScripts/controllers/DC/CrossSpeciality/*.js"
                        , "~/WebScripts/controllers/DC/Resident/*.js"
                        , "~/WebScripts/controllers/DC/CasesWorkStation/*.js"
                        , "~/WebScripts/controllers/BI/*.js"
                        , "~/WebScripts/controllers/ActivityManage/*.js"
                        , "~/WebScripts/controllers/GuestService/*.js"
                        , "~/WebScripts/controllers/DC/financialManagement/*.js"
                        ));

            //加载Wap脚本
            bundles.Add(new ScriptBundle("~/Scripts/Wap").Include(
                        "~/WapScripts/common/*.js"
                        , "~/WapScripts/home/*.js"
                        , "~/WapScripts/route/*.js"
                        , "~/WapScripts/controllers/*.js"
                        , "~/WapScripts/components/selectCode/*.js"
                        ));

            //加载Report脚本
            bundles.Add(new ScriptBundle("~/Scripts/Report").Include(
                        "~/WebScripts/home/ReportApp.js"
                        , "~/WebScripts/route/ReportRoute.js"
                        , "~/WebScripts/controllers/Report/*.js"
                        ));

            //加载Report脚本
            bundles.Add(new ScriptBundle("~/Scripts/ReportManage").Include(
                "~/WebScripts/controllers/Report/ResidentStatisticController.js",
                "~/WebScripts/controllers/Report/Top10ServiceStatisticController.js",
                "~/WebScripts/controllers/Report/PaymentStatisticController.js",
                "~/WebScripts/controllers/Report/ResidentAgeStatisticController.js",
                "~/WebScripts/controllers/Report/OrderStatisticController.js",
                "~/WebScripts/controllers/Report/EvaluationStatisticController.js",
                "~/WebScripts/controllers/Report/OrderTaskRateController.js",
                "~/WebScripts/controllers/Report/reportTempManage.js"
            ));

            //加载echart
            bundles.Add(new ScriptBundle("~/Scripts/echarts").Include(
                "~/Content/echarts/echarts.min.js"
            ));

            //加载Sequence脚本
            bundles.Add(new ScriptBundle("~/Scripts/Sequence").Include(
                     "~/WebScripts/controllers/Sequence/*.js"
            ));
            //启用合并优化
            //BundleTable.EnableOptimizations = true;
        }
    }
}
