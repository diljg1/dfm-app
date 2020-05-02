<?php
// No direct access
defined('_JEXEC') or die;

[$userFields,] = \JDispatcher::getInstance()->trigger('getUserDfmAppData', [JFactory::getUser(),]);

require JModuleHelper::getLayoutPath('mod_dfm_app');
