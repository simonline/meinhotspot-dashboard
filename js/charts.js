function initCharts () {
    var period = Cookies.get('period');

    // Create weekday chart
    if ($('#chart-weekdays').length > 0) {
        var chart_weekdays = c3.generate({
            bindto: '#chart-weekdays',
            data: {
                url: './data/weekdays.json?period=' + period,
                mimeType: 'json',
                type : 'pie'
            }
        });
    }

    // Create returning users chart
    if ($('#chart-returning-users').length > 0) {
        var chart_returning_users = c3.generate({
            bindto: '#chart-returning-users',
            data: {
                url: './data/returning-users.json?period=' + period,
                mimeType: 'json',
                type: 'pie'
            }
        });
    }

    // Create user count chart
    if ($('#chart-user-count').length > 0) {
        var chart_user_count = c3.generate({
            bindto: '#chart-user-count',
            data: {
                x: 'labels',
                url: './data/users.json?period=' + period,
                mimeType: 'json'
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%d.%m.%Y'
                    }
                }
            },
            legend: {
                hide: true
            }
        });
    }

    // Create gender chart
    if ($('#chart-gender').length > 0) {
        var chart_gender = c3.generate({
            bindto: '#chart-gender',
            data: {
                url: './data/genders.json?period=' + period,
                mimeType: 'json',
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            }
        });
    }

    // Create age chart
    if ($('#chart-age').length > 0) {
        var chart_age = c3.generate({
            bindto: '#chart-age',
            data: {
                url: './data/ages.json?period=' + period,
                mimeType: 'json',
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            }
        });
    }
}