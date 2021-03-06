<?php
/**
 * @link http://www.cleverstone.cn/
 * @copyright Copyright (c) 2020 黑与白
 * @license http://yii-manager.cleverstone.cn/license/
 */

namespace app\builder\table;

/**
 * 自定义筛选控件接口
 * @author cleverstone <yang_hui_lei@163.com>
 * @since 1.0
 */
interface CustomControl
{
    /**
     * 渲染Html字符串方法
     * @return string
     */
    public function render();

    /**
     * 返回用于获取筛选值的Js脚本
     * @return string
     */
    public function getValuesJsFunction();

    /**
     * 返回清空筛选值的Js脚本
     * @return string
     */
    public function clearValuesJsFunction();

    /**
     * 返回用于初始化筛选值的Js脚本
     * @return string
     */
    public function initValuesJsFunction();
}