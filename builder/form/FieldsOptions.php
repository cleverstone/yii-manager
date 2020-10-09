<?php
// +----------------------------------------------------------------------
// | yii-manager version 1.0.0
// +----------------------------------------------------------------------
// | ���ڣ�2020/10/9
// +----------------------------------------------------------------------
// | ���ߣ�cleverstone <yang_hui_lei@163.com>
// +----------------------------------------------------------------------
namespace app\builder\form;

use app\builder\common\BaseOptions;

/**
 * �����ֶ�����ѡ��
 * @author cleverstone <yang_hui_lei@163.com>
 * @since 1.0
 */
class FieldsOptions extends BaseOptions
{
    // �ı�
    const CONTROL_TEXT = 'text';
    // ����
    const CONTROL_NUMBER = 'number';
    // ����
    const CONTROL_PASSWORD = 'password';
    // ��ѡ
    const CONTROL_CHECKBOX = 'checkbox';
    // ��ѡ
    const CONTROL_RADIO = 'radio';
    // ���ڣ���ʽ��Y-m-d H:i:s
    const CONTROL_DATETIME = 'datetime';
    // ���ڣ���ʽ��Y-m-d
    const CONTROL_DATE = 'date';
    // �꣬��ʽ��Y
    const CONTROL_YEAR = 'year';
    // �£���ʽ��m
    const CONTROL_MONTH = 'month';
    // ʱ����ʽ��H:i:s
    const CONTROL_TIME = 'time';
    // ����ѡ��
    const CONTROL_SELECT = 'select';
    // ����
    const CONTROL_HIDDEN = 'hidden';
    // �ļ�
    const CONTROL_FILE = 'file';
    // �ı���
    const CONTROL_TEXTAREA = 'textarea';
    // ���ı�
    const CONTROL_RICHTEXT = 'richtext';
    // �Զ���
    const CONTROL_CUSTOM = 'custom';

    /**
     * �ؼ����ͣ�Ĭ��`text`
     * @var string
     */
    public $control = self::CONTROL_TEXT;

    /**
     * ��ʼ��
     * @author cleverstone <yang_hui_lei@163.com>
     * @since 1.0
     */
    public function init()
    {

    }
}