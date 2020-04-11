<?php


use Bixie\DfmApi\DfmApi;
use Bixie\DfmApi\PreviewZip;
use Bixie\ModDfmApp\Helpers\RequestParamsHelper;
use Joomla\CMS\Access\Exception\NotAllowed as NotAllowedException;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\Registry\Registry;

abstract class ModDfmAppHelper {

    /**
     * /index.php?option=com_ajax&module=dfm_app&ignoreMessages=0&format=json
     * @return Registry
     */
    public static function getParams (): Registry
    {
        $module  = ModuleHelper::getModule('mod_dfm_app');
        return new Registry($module->params);
    }

    /**
     * @return array
     * @throws Exception
     */
    public static function requestAjax (): array
    {
        if (!JSession::checkToken()) {
            Factory::getApplication()->setHeader('status', 401, true);
            throw new NotAllowedException('Invalid token');
        }
        JLoader::registerNamespace('Bixie\\ModDfmApp', __DIR__ . '/src', false, false, 'psr4');
        $moduleParams = self::getParams();

        //todo get userinfo/license key
        $app = Factory::getApplication();

        $requestparams = new RequestParamsHelper();
        $api = self::getApi($moduleParams);

        $preview_id = uniqid('dfm_preview');
        $params = $requestparams->getData('params');
        $options = $requestparams->getData('options');

        $response = $api->post('/preview/' . $preview_id, compact('params', 'options'));
        if ($responseData = $response->getData()) {
            if ($responseData['result'] == true) {
                return ['preview_id' => $preview_id, 'result' => true,];
            } else {
                return ['preview_id' => $preview_id, 'result' => false, 'error' => $responseData['error']];
            }
        } else {
            $app->setHeader('status', 500, true);
            throw new \RuntimeException($response->getError());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public static function previewAjax () {
        $app = Factory::getApplication();
        if (!JSession::checkToken()) {
            $app->setHeader('status', 401, true);
            throw new NotAllowedException('Invalid token');
        }
        JLoader::registerNamespace('Bixie\\ModDfmApp', __DIR__ . '/src', false, false, 'psr4');
        $moduleParams = self::getParams();

        if (!$preview_id = $app->input->get->get('preview_id', '', 'string')) {
            $app->setHeader('status', 500, true);
            throw new \RuntimeException('No preview ID provided');
        }

        $previewZip = self::getPreviewZip($moduleParams);
        $files = $previewZip->getPreviewFilesContents($preview_id);
        if ($files === false) {
            return ['preview_status' => 'pending', 'preview_id' => $preview_id,];
        }
//    $previewZip->removeTempZip($preview_id);
        return ['preview_id' => $preview_id, 'preview_status' => 'received', 'files' => $files,];
    }

    /**
     * @param Registry $params
     * @return DfmApi
     * @throws Exception
     */
    protected static function getApi (Registry $params): DfmApi
    {
        $api_path = realpath(JPATH_ROOT . '/' . $params->get('dfm_api.api_path'));
        if (!$api_path || !file_exists($api_path . '/vendor/autoload.php')) {
            Factory::getApplication()->setHeader('status', 500, true);
            throw new \RuntimeException('API path not found: ' . $params->get('dfm_api.api_path'));
        }
        include $api_path . '/vendor/autoload.php';
        return new DfmApi((array)$params->get('dfm_api'), JDEBUG);
    }

    /**
     * @param Registry $params
     * @return PreviewZip
     * @throws Exception
     */
    protected static function getPreviewZip (Registry $params): PreviewZip
    {
        $api_path = realpath(JPATH_ROOT . '/' . $params->get('dfm_api.api_path'));
        if (!$api_path || !file_exists($api_path . '/vendor/autoload.php')) {
            Factory::getApplication()->setHeader('status', 500, true);
            throw new \RuntimeException('API path not found: ' . $params->get('dfm_api.api_path'));
        }
        include $api_path . '/vendor/autoload.php';
        return new PreviewZip(JPATH_ROOT . '/' . $params->get('dfm_api.previewimages_folder', '../image-web'));
    }
}
