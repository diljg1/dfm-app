<?php


use Bixie\DfmApi\DfmApi;
use Bixie\DfmApi\PreviewZip;
use Bixie\ModDfmApp\Helpers\RequestParamsHelper;
use Joomla\CMS\Access\Exception\NotAllowed as NotAllowedException;
use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\Registry\Registry;

abstract class ModDfmAppHelper {

    public const YAHOO_LOOKUP_URL = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=%s&region=1&lang=en';

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
        $app = Factory::getApplication();
        self::checkToken($app);
        JLoader::registerNamespace('Bixie\\ModDfmApp', __DIR__ . '/src', false, false, 'psr4');
        $moduleParams = self::getParams();

        //get userinfo/license key
        $user = JFactory::getUser();
        [[$licenseKey, $isTrial,],] = \JEventDispatcher::getInstance()->trigger('getActiveLicenseKey', [$user,]);
//        $licenseKey = 'test';
        if (!$licenseKey) {
            Factory::getApplication()->setHeader('status', 403, true);
            throw new NotAllowedException('No valid license key found');
        }

        $requestparams = new RequestParamsHelper($app);
        $api = self::getApi($moduleParams);
        //when not in trial, a separate CSI license is required
        if (!$isTrial && ($requestparams->getData('params')['DataProvider'] ?? '') === 'CSI') {
            [$valid,] = \JEventDispatcher::getInstance()->trigger('onCheckCsiSubscription', [$user,]);
            if (!$valid) {
                Factory::getApplication()->setHeader('status', 403, true);
                throw new NotAllowedException('No valid CSI license found');
            }
        }

        $preview_id = uniqid('dfm_preview');
        $params = $requestparams->getData('params');
        $options = $requestparams->getData('options');
        $options['licenseKey'] = $licenseKey;
        $options['userId'] = $user->id;
        $options['email'] = $user->email;

        $response = $api->post('/preview/' . $preview_id, compact('params', 'options'));
        if ($responseData = $response->getData()) {
            if ($responseData['result'] == true) {
                return ['preview_id' => $preview_id, 'result' => true,];
            } else {
                return ['preview_id' => $preview_id, 'result' => false, 'error' => $responseData['error']];
            }
        } else {
            $app->setHeader('status', $response->getStatusCode(), true);
            throw new \RuntimeException((string)$response->getError());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public static function previewAjax () {
        $app = Factory::getApplication();
        self::checkToken($app);
        $moduleParams = self::getParams();

        if (!$preview_id = $app->input->get->get('preview_id', '', 'string')) {
            $app->setHeader('status', 400, true);
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
     * @return array
     * @throws Exception
     */
    public static function getWatchlistsAjax ()
    {
        $app = Factory::getApplication();
        self::checkToken($app);
        $user = self::getUser($app);

        $moduleParams = self::getParams();
        $api = self::getApi($moduleParams);
        $url = sprintf('/watchlists/%d', $user->id);
        $response = $api->get($url);
        if ($responseData = $response->getData()) {
            return $responseData;
        } else {
            $app->setHeader('status', $response->getStatusCode(), true);
            throw new \RuntimeException((string)$response->getError());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public static function getWatchlistAjax ()
    {
        $app = Factory::getApplication();
        self::checkToken($app);
        $user = self::getUser($app);

        $id = $app->input->json->get('id', '', 'int');

        $moduleParams = self::getParams();
        $api = self::getApi($moduleParams);
        $url = sprintf('/watchlists/%d%s', $user->id, $id ? "/{$id}" : '');
        $response = $api->get($url);
        if ($responseData = $response->getData()) {
            return $responseData;
        } else {
            $app->setHeader('status', $response->getStatusCode(), true);
            throw new \RuntimeException((string)$response->getError());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public static function saveWatchlistAjax ()
    {
        $app = Factory::getApplication();
        self::checkToken($app);
        $user = self::getUser($app);

        $id = $app->input->json->get('id', '', 'int');
        $name = $app->input->json->get('name', '', 'string');
        $items = $app->input->json->get('items', '', 'string');
        $ordering = $app->input->json->get('ordering', '', 'int');

        $moduleParams = self::getParams();
        $api = self::getApi($moduleParams);
        $url = sprintf('/watchlists/%d%s', $user->id, $id ? "/{$id}" : '');
        $response = $api->post($url, compact('name', 'items', 'ordering'));
        if ($responseData = $response->getData()) {
            return $responseData;
        } else {
            $app->setHeader('status', $response->getStatusCode(), true);
            throw new \RuntimeException((string)$response->getError());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public static function removeWatchlistAjax ()
    {
        $app = Factory::getApplication();
        self::checkToken($app);
        $user = self::getUser($app);

        $id = $app->input->json->get('id', '', 'int');

        $moduleParams = self::getParams();
        $api = self::getApi($moduleParams);
        $url = sprintf('/watchlists/%d%s', $user->id, $id ? "/{$id}" : '');
        $response = $api->delete($url);
        if ($responseData = $response->getData() and $responseData !== false) {
            return $responseData;
        } else {
            $app->setHeader('status', $response->getStatusCode(), true);
            throw new \RuntimeException((string)$response->getError());
        }
    }

    /**
     * @return array
     * @throws Exception
     */
    public static function updateUserFieldAjax ()
    {
        $app = Factory::getApplication();
        self::checkToken($app);
        if (!$field_name = $app->input->json->get('field_name', '', 'string')) {
            $app->setHeader('status', 400, true);
            throw new \RuntimeException('No field name provided');
        }
        $value = $app->input->json->get('value', '', 'string');
        $user = self::getUser($app);

        if ($field_name == 'license_key') {
            [$exists,] = \JEventDispatcher::getInstance()->trigger('licenseKeyAlreadyExists', [$user, $value,]);
            if ($exists) {
                $app->setHeader('status', 422, true);
                throw new \InvalidArgumentException('License key already in use');
            }
        }

        if ($field_name == 'csi_email' && $value) {
            [$valid,] = \JEventDispatcher::getInstance()->trigger('onCheckCsiSubscription', [$user, $value,]);
            if (!$valid) {
                $app->setHeader('status', 422, true);
                throw new \InvalidArgumentException('CSI license is not valid');
            }
        }

        [$success,] = \JEventDispatcher::getInstance()->trigger('updateUserField', [$user, $field_name, $value,]);
        if (!$success) {
            $app->setHeader('status', 500, true);
            throw new \RuntimeException('Error in saving value');
        }
        [$user_data,] = \JEventDispatcher::getInstance()->trigger('getUserDfmAppData', [$user,]);
        return compact('success', 'user_data');
    }

    /**
     * @param CMSApplication|null $app
     */
    protected static function checkToken (CMSApplication $app): void
    {
        if (!JSession::checkToken()) {
            $app->setHeader('status', 401, true);
            throw new NotAllowedException('Invalid token');
        }
    }

    protected static function getUser (CMSApplication $app)
    {
        $user = JFactory::getUser();
        if (!$user->id) {
            $app->setHeader('status', 403, true);
            throw new NotAllowedException('Access denied');
        }
        return $user;
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
