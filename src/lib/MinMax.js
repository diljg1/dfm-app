
const sortFormats = {
    'N/A': '-',
    'BOT#': '↓',
    'TOP#': '↑',
};

export default class MinMax {

    constructor(min, max, sort, nr,) {
        this.min = min;
        this.max = max;
        this.sort = sort;
        this.nr = nr;
    }

    withMinMax(min, max) {
        return new MinMax(min, max, this.sort, this.nr);
    }

    withSort(sort) {
        return new MinMax(this.min, this.max, sort, this.nr);
    }

    withNr(nr) {
        return new MinMax(this.min, this.max, this.sort, nr);
    }

    formattedValue() {
        return `${this.min}↔${this.max}, ${sortFormats[this.sort]} ${(this.sort === 'N/A' ? '-' : this.nr)}`;
    }

    toString() {
        return `${this.min};${this.max};${this.sort};${this.nr}`;
    }
}

MinMax.fromString = function (minMaxString,
                              minDefault = 'N/A',
                              maxDefault = 'N/A',
                              sortDefault = 'N/A',
                              nrDefault = '1',)
{
    if (!minMaxString.match(/^[0-9\.\-\%]+;[0-9\.\-\%]+;(?:N\/A|BOT#|TOP#);(?:[0-9])+$/)) {
        return new MinMax(minDefault, maxDefault, sortDefault, nrDefault);
    }
    const [min, max, sort, nr,] = minMaxString.split(';');
    return new MinMax(min, max, sort, nr);
}

MinMax.nrFromValue = function (value) {
    return Number(String(value).replace('%', ''));
}
