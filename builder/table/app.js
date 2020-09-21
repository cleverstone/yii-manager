/**
 * table builder js
 * @author cleverstone
 * @since 1.0
 */
!function (window, angular) {
    "use strict";

    var $thisApp = angular.module("thisApp", ["$YmApp"]);
    $thisApp.controller('thisCtrl', [
        "$scope",
        "$http",
        "$timeout",
        "$interval",
        "$rootScope",
        "$YmApp",
        "$toastr",
        "$jq",
        "$yii",
        "$YmSpinner",
        "$swal",
        "$laydate",
        "$layer",
        function (
            $scope,
            $http,
            $timeout,
            $interval,
            $rootScope,
            $YmApp,
            $toastr,
            $jq,
            $yii,
            $YmSpinner,
            $swal,
            $laydate,
            $layer
        ) {
            // ------ 列表start

            // 获取请求链接
            var link = '<?= $link ?>';
            $scope.getUrl = function (page, perPage, query) {
                page = page || $scope.pageNumber || 1;
                perPage = perPage || $scope.perPageNumber || 20;
                query = query || $scope.queryParams || {}

                $scope.pageNumber = page;
                $scope.perPageNumber = perPage;
                $scope.queryParams = query;

                var param = {
                    page: page,
                    'per-page': perPage,
                };

                /* 使用Jq的对象合并方案 */
                $jq.extend(param, query);
                return link + '?' + $jq.param(param);
            };

            // 获取数据列表
            $scope.getList = function (page, perPage, param) {
                // 节流
                var i = $YmSpinner.show();
                $http.get($scope.getUrl(page, perPage, param)).then(function (result) {
                    $YmSpinner.hide(i);

                    var data = result.data;
                    $scope.ymPage = data.page;
                    $scope.list = data.data;

                    $scope.cancalCheckboxChecked();
                }, function (error) {
                    $YmSpinner.hide(i);
                    $toastr.error(error.data || "数据加载失败，请稍后重试", "通知");
                    console.error(error);
                });
            };

            // 列表刷新时，取消多选框的选中状态
            $scope.cancalCheckboxChecked = function () {
                $YmApp.uncheckTableIcheck();
            };

            // 初始化方法
            ($scope.init = function () {
                // 初始化导出列表
                $scope.exportMap = [];
                // 初始化筛选表单中的日期控件
                $jq(".YmFilterDate").each(function () {
                    var id = $jq(this).attr('id');
                    var range = $jq(this).attr('range');
                    var tag = $jq(this).attr('tag');

                    var options = {
                        elem: "#" + id,
                        type: tag,
                        calendar: true,
                        done: function(value, date, endDate){
                            /* 触发input事件 */
                            $jq(this.elem).val(value).trigger("input");
                        }
                    };

                    if (range === '1') {
                        options.range = '/';
                    }

                    $laydate.render(options);
                });
                // 初始化筛选属性
                $scope.ymFilter = $jq.parseJSON('<?= $filterColumns ?>');
                // 初始化列表
                $scope.getList();
            }());

            // 分页
            $scope.getPage = function (page, perPage) {
                $scope.getList(page, perPage);
            };

            // 跳转到指定页
            $scope.dumpSpecialPage = function (perPage) {
                var page = $scope.currentPage;
                $scope.getList(page, perPage);
            };

            // 设置数据条数
            $jq('body').on('change', '#pageSelect', function () {
                $scope.getList(1, $jq(this).val());
            });

            // 监听angular列表渲染完成
            $scope.$on('ev-repeat-finished', function () {
                // 初始化Icheck
                $YmApp.initTableIcheck();
            });

            // 行操作 - 解析参数
            $scope.resolveParams = function (data, params) {
                var to = {};
                for (var i in params) {
                    if (i % 1 === 0) {
                        // 从data中获取参数值
                        to[params[i]] = (data[params[i]] === void 0 ? '' : data[params[i]]);
                    } else {
                        to[i] = params[i];
                    }
                }

                return to;
            };

            // 行操作入口
            $scope.rowActions = function (item, config) {
                config = $jq.parseJSON(config);
                var type = config.type;
                var options = config.options;
                var method = options.method || 'get';
                var params = options.params || [];
                var route = options.route;
                var title = options.title || '默认标题';
                var width = options.width || '800px';
                var height = options.height || '520px';

                // 解析参数
                params = $scope.resolveParams(item, params);
                switch (type) {
                    case "page":
                        $scope.openPage(title, params, route);
                        break;
                    case "modal":
                        $scope.openModal(title, params, route, width, height);
                        break;
                    case "ajax":
                        $scope.ajaxRequest(method, params, route);
                        break;
                    default:
                        $toastr.warning("行类型" + type + "暂不支持", "通知");
                }
            };

            // 行操作 - 打开模态框
            $scope.openModal = function (title, params, route, width, height) {
                var closeBtn = 2;
                if (width === '100%') {
                    closeBtn = 1;
                }

                params = $jq.param(params);
                $layer.open({
                    type: 2,
                    shade: 0.3,
                    anim: -1,
                    title: title,
                    maxmin: false,
                    shadeClose: false,
                    closeBtn: closeBtn,
                    area : [width, height],
                    content: route + '?' + params,
                });
            };

            // 行操作 - 打开页面
            $scope.openPage = function (title, params, route) {
                params['pageTitle'] = title;
                params = $jq.param(params);

                window.location.href = route + '?' + params;
            };

            // 行操作 - ajax
            $scope.ajaxRequest = function (method, params, route) {
                $swal.fire({
                    title: '确定要执行该操作么？',
                    text: '',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(function (result) {
                    if (result.value) {
                        var flag = $YmSpinner.show("操作执行中,请稍后...");

                        var instance;
                        if (method === "get") {
                            instance = $http.get(route + '?' + $jq.param(params));
                        } else if (method === "post") {
                            params[$yii.getCsrfParam()] = $yii.getCsrfToken();
                            instance = $http.post(route, $jq.param(params));
                        }

                        instance.then(function (result) {
                            $YmSpinner.hide(flag);
                            var data = result.data;
                            if (data.code === 200) {
                                $toastr.success(data.msg, "通知");
                                // reload list
                                $timeout(function () {
                                    $scope.getList();
                                }, 150);
                            } else if (data.code === 500) {
                                $toastr.warning(data.msg, "通知");
                            } else if (data.code === 401) {
                                $toastr.error(data.msg, "通知");
                            } else {
                                $toastr.error(data.msg, "通知");
                            }

                        }, function (error) {
                            $YmSpinner.hide(flag);
                            $toastr.error(error.data || "操作执行失败", "通知");
                            console.error(error);
                        });
                        // For more information about handling dismissals please visit
                        // https://sweetalert2.github.io/#handling-dismissals
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // cancel
                        // ...
                    }
                });
            };

            // ------ 列表 end

            // ------ 工具栏 start
            // 筛选
            $scope.filterMethod = function () {
                $layer.open({
                    type: 1,
                    shade: 0.3,
                    anim: -1,
                    title: '筛选',
                    maxmin: false,
                    shadeClose: false,
                    closeBtn: 2,
                    area: ['750px'],
                    btn: ['确定筛选', '清空'],
                    yes: function(index, layero){
                        $scope.$apply(function () {
                            $scope.getList(1, null, $scope.ymFilter);
                        });
                        $layer.close(index);
                    },
                    btn2: function(index, layero){
                        $scope.$apply(function () {
                            var tempObj = {};
                            for (var i in $scope.ymFilter) {
                                tempObj[i] = "";
                            }

                            $scope.ymFilter = tempObj;
                        });
                        return false;
                    },
                    content: $jq("#YmFilterForm"),
                });
            };

            // 导出
            $scope.exportMethod = function () {
                var query = $jq.extend({}, $scope.queryParams || {});
                query['__export'] = 1;
                var u = link + '?' + $jq.param(query);
                // 节流
                var i = $YmSpinner.show();
                $http.get(u).then(function (result) {
                    $YmSpinner.hide(i);
                    var data = result.data;
                    if (data.length) {
                        var tempMap = [];
                        data.forEach(function (value) {
                            query['offset'] = value.offset;
                            query['limit'] = value.limit;
                            var u = link + '?' + $jq.param(query);
                            tempMap.push({
                                page: value.page,
                                url: u,
                            });
                        });
                        $scope.exportMap = tempMap;
                        $layer.open({
                            type: 1,
                            shade: 0.3,
                            anim: -1,
                            title: '导出',
                            maxmin: false,
                            shadeClose: false,
                            closeBtn: 2,
                            area: ['400px', '700px'],
                            content: $jq("#YmExportForm"),
                        });
                    } else {
                        $toastr.info('数据列表为空,没有需要导出的数据!', "通知");
                    }
                }, function (error) {
                    $YmSpinner.hide(i);
                    $toastr.error(error.data || "数据导出列表加载失败，请稍后重试", "通知");
                    console.error(error);
                });

            };

            // 自定义
            $scope.customMethod = function () {
                var data = $YmApp.getTableCheckedData();
                console.log('custom');
            };

            // ------ 工具栏 end

        }]);
}(window, window.angular);