<?php


namespace Bixie\ModDfmApp\Helpers;


use Joomla\CMS\Application\CMSApplication;

class RequestParamsHelper {

    /**
     * @var array
     */
    protected $requestfilter = [
        'params' => [
            'DataProvider' => FILTER_SANITIZE_STRING,
            'IncludeInactive' => FILTER_VALIDATE_INT,
            'Benchmark' => FILTER_SANITIZE_STRING,
            'Watchlists' => FILTER_SANITIZE_STRING,
            'TradingLiquidity' => FILTER_SANITIZE_STRING,
            'HistoricalPrice' => FILTER_SANITIZE_STRING,
            'AdjustedPrice' => FILTER_SANITIZE_STRING,
            'MARRatio' => FILTER_SANITIZE_STRING,
            'Trend' => FILTER_SANITIZE_STRING,
            'TrendPeriod' => FILTER_SANITIZE_STRING,
            'Ranking' => FILTER_SANITIZE_STRING,
            'ShortCorrelation' => FILTER_SANITIZE_STRING,
            'LongCorrelation' => FILTER_SANITIZE_STRING,
            'Investment' => FILTER_VALIDATE_INT,
            'PortfolioSize' => FILTER_VALIDATE_INT,
            'LongShort' => FILTER_SANITIZE_STRING,
            'HoldingPeriod' => FILTER_SANITIZE_STRING,
            'ValidationPeriod' => FILTER_VALIDATE_INT,
            'InvestementObjective' => FILTER_SANITIZE_STRING,
            'PriceWeighing' => FILTER_SANITIZE_STRING,
            'HedgePercentage' => FILTER_VALIDATE_INT,
            'LowerBound' => FILTER_SANITIZE_STRING,
            'SetupPeriod' => FILTER_VALIDATE_INT,
            'WeightInterval' => FILTER_VALIDATE_INT,
            'OptimalizationTechnique' => FILTER_SANITIZE_STRING,
            'TransactionCosts' => FILTER_SANITIZE_STRING,
            'LoanPercentage' => FILTER_SANITIZE_STRING,
            'DividendTax' => FILTER_SANITIZE_STRING
        ],
        'options' => [
            'width' => FILTER_VALIDATE_INT,
            'layout' => FILTER_SANITIZE_STRING,
            'locale' => FILTER_SANITIZE_STRING,
        ],
    ];

    /**
     * @var array Sanitized input
     */
    protected $input = [];

    public function __construct(CMSApplication $app) {
        //only process complete requests
        $params = $app->input->json->get('params', null, 'array');
        $options = $app->input->json->get('options', null, 'array');
        if (empty($params) || empty($options)) {
            return;
        }
        // trim the data before any spaces get encoded to "%20"
        array_filter($params, 'trim');
        array_filter($options, 'trim');
        //sanatize input via filters
        $this->input['params'] = filter_var_array($params, $this->requestfilter['params']);
        $this->input['options'] = filter_var_array($options, $this->requestfilter['options']);
    }


    /**
     * Get sanitazed data from request
     * @param $key
     * @return array
     */
    public function getData($key){
        return isset($this->input[$key]) ? $this->input[$key] : [];
    }
}
