function iconFormatter (value, row, index, field) {
    var name = row[field.replace('_icon', '_name')];
    return '<i class="fa fa-' + value + '" data-toggle="tooltip" title="' + name + '"></i>';
}

function momentFormatter (value, row, index, field) {
    var  m = moment(value, "YYYY-MM-DD h:mm:ss").locale("de");
    return '<span title="' + m.format("DD.MM.YYYY h:mm") + '">' + m.fromNow() + '</span>';
}

function ratingFormatter (value, row, index, field) {
    var rating = '<span title="' + value + '">';
    for (var i = 1; i <= 5; i++) {
        if (i <= value) {
            rating += '<i class="fa fa-star"></i>';
        } else if (value === (i - 0.5)) {
            rating += '<i class="fa fa-star-half-o"></i>';
        } else if (i > value) {
            rating += '<i class="fa fa-star-o"></i>';
        }
    }
    rating += '</span>';
    return rating;
}

function downloadFormatter (value, row, index, field) {
    var url_html = row[field.replace('_csv', '_html')];
    var download = '<div class="dropdown show">';
    download += '<a title="' + value + ',' + url_html + '" class="dropdown-toggle" href="#" ';
    download += 'role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    download += '<i class="fa fa-download"></i>';
    download += '</a>';
    download += '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">';
    download += '<a class="dropdown-item" target="_blank" href="' + value + '">CSV</a>';
    download += '<a class="dropdown-item" target="_blank" href="' + url_html + '">HTML</a>';
    download += '</div>';
    download += '</div>';
    return download;
}

function exportHTMLCellData (cell, row, col, data) {
    // Use title attribute if exists
    if (data.startsWith('<')) {
        return $(data).attr('title');
    }
    return data;
}

function initExportDataType (options) {
    $('#toolbar').find('select#export_data_type').change(function () {
        var exportOptions = options;
        options.exportDataType = $(this).val();
        $('.table').bootstrapTable('destroy').bootstrapTable(options);
    });
}

Array.prototype.sum = function (prop) {
    var total = 0;
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop];
    }
    return total;
};

function initTables () {
    var tableOptions = {
            classes: 'table table-hover table-striped',
            pagination: true,
            sidePagination: 'client',
            pageSize: 10,
            search: true,
            showExport: true,
            //exportDataType: 'basic',
            exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
            toolbar: '#toolbar',
            exportOptions: {
                onCellHtmlData: exportHTMLCellData
            }
        },
        options,
        period = Cookies.get('period');

    // Latest ratings
    if ($('#latest-ratings').length > 0) {
        $.get('./data/ratings.json?period=' + period, function (data) {
            var ratings = '',
                rating,
                ratingAvg = 0,
                ratingAvgTitle = '';
            // Calculate rating average
            ratingAvg = data.sum('rating') / data.length;
            ratingAvg = Math.round( ratingAvg * 2 ) / 2;
            ratingAvgTitle = ratingAvg.toString().replace('.', ',') + ' von 5';
            $('#latest-ratings .rating-avg').text(ratingAvgTitle);
            $('#latest-ratings .rating-avg-stars').html(ratingFormatter(ratingAvg) +
                                                        ' (' + data.length + ')');
            // Show latest items
            for (var i = 0; i < 5; i++) {
                rating = data[i];
                ratings += '<a href="#" ';
                ratings += 'class="list-group-item list-group-item-action flex-column';
                ratings += ' align-items-start">';
                ratings += '<div class="d-flex w-100 justify-content-between">';
                ratings += '<h6 class="w-100 mb-1">';
                ratings += ratingFormatter(rating.rating);
                ratings += '<span class="pull-right"><span title="' + rating.email + '">';
                ratings += rating.name + '</span> ';
                ratings += '<i class="fa fa-' + rating.browser_icon + '" data-toggle="tooltip"';
                ratings += ' title="Browser: ' + rating.browser_name + '"></i> ';
                ratings += '<i class="fa fa-' + rating.os_icon + '" data-toggle="tooltip"';
                ratings += ' title="Betriebssystem: ' + rating.os_name + '"></i>';
                ratings += '</span></h6></div>';
                ratings += '<p class="mb-1">' + rating.comment + '</p>';
                ratings += '<small>' + momentFormatter(rating.timestamp) + '</small>';
                ratings += '</a>';
           }
           $(ratings).appendTo($('#latest-ratings .list-group'));
        });
    }

    // Latest logins
    if ($('table#latest-logins').length > 0) {
        options = {
            classes: 'table table-sm table-striped',
            pagination: true,
            pageSize: 5,
            url: './data/logins.json?period=' + period + '&limit=5',
            columns: [
                {
                    field: 'timestamp',
                    title: 'Zeitpunkt',
                    formatter: momentFormatter
                },
                {
                    field: 'name',
                    title: 'Name'
                },
                {
                    field: 'browser_icon',
                    title: '',
                    formatter: iconFormatter
                },
                {
                    field: 'os_icon',
                    title: '',
                    formatter: iconFormatter
                }
            ]
        };
        $('table#latest-logins').bootstrapTable(options);
        // Remove bootstrap-table classes
        $('table#latest-logins').parents('.fixed-table-body').removeClass('fixed-table-body')
            .parents('.fixed-table-container').removeClass('fixed-table-container')
            .parents('.bootstrap-table').removeClass('bootstrap-table');
    }

    // Latest archive
    if ($('table#latest-archive').length > 0) {
        options = {
            classes: 'table table-sm table-striped',
            pagination: true,
            pageSize: 5,
            url: './data/archive.json?period=' + period + '&limit=5',
            columns: [
                {
                    field: 'timestamp',
                    title: 'Zeitpunkt',
                    formatter: momentFormatter
                },
                {
                    field: 'interval',
                    title: 'Intervall'
                },
                {
                    field: 'url_csv',
                    title: '',
                    formatter: downloadFormatter
                }
            ]
        };
        $('table#latest-archive').bootstrapTable(options);
        // Remove bootstrap-table classes
        $('table#latest-archive').parents('.fixed-table-body').removeClass('fixed-table-body')
            .parents('.fixed-table-container').removeClass('fixed-table-container')
            .parents('.bootstrap-table').removeClass('bootstrap-table');
    }

    // Ratings table
    if ($('table#ratings').length > 0) {
        options = $.extend(tableOptions, {
            url: './data/ratings.json?period=' + period,
            columns: [
                {
                    field: 'state',
                    checkbox: true
                },
                {
                    field: 'timestamp',
                    title: 'Zeitpunkt',
                    sortable: true,
                    formatter: momentFormatter,
                    searchFormatter: false
                },
                {
                    field: 'rating',
                    title: 'Bewertung',
                    sortable: true,
                    formatter: ratingFormatter
                },
                {
                    field: 'email',
                    title: 'E-Mailadresse',
                    sortable: true
                },
                {
                    field: 'comment',
                    title: 'Kommentar',
                    sortable: true
                },
                {
                    field: 'browser_icon',
                    title: 'Browser',
                    sortable: true,
                    formatter: iconFormatter,
                    searchFormatter: false
                },
                {
                    field: 'os_icon',
                    title: 'Betriebssystem',
                    sortable: true,
                    formatter: iconFormatter,
                    searchFormatter: false
                }
            ]
        });
        $('table#ratings').bootstrapTable(options);
        // Export data type
        initExportDataType(options);
    }

    // Logins table
    if ($('table#logins').length > 0) {
        options = $.extend(tableOptions, {
            url: './data/logins.json?period=' + period,
            columns: [
                {
                    field: 'state',
                    checkbox: true
                },
                {
                    field: 'timestamp',
                    title: 'Zeitpunkt',
                    sortable: true,
                    formatter: momentFormatter,
                    searchFormatter: false
                },
                {
                    field: 'name',
                    title: 'Name',
                    sortable: true
                },
                {
                    field: 'email',
                    title: 'E-Mail-Adresse',
                    sortable: true
                },
                {
                    field: 'browser_icon',
                    title: 'Browser',
                    sortable: true,
                    formatter: iconFormatter,
                    searchFormatter: false
                },
                {
                    field: 'os_icon',
                    title: 'Betriebssystem',
                    sortable: true,
                    formatter: iconFormatter,
                    searchFormatter: false
                }
            ]
        });
        $('table#logins').bootstrapTable(options);
        initExportDataType(options);
    }

    // Logins table
    if ($('table#archive').length > 0) {
        options = $.extend(tableOptions, {
            url: './data/archive.json?period=' + period,
            columns: [
                {
                    field: 'state',
                    checkbox: true
                },
                {
                    field: 'timestamp',
                    title: 'Zeitpunkt',
                    sortable: true,
                    formatter: momentFormatter,
                    searchFormatter: false
                },
                {
                    field: 'from',
                    title: 'Von',
                    sortable: true,
                    formatter: momentFormatter,
                    searchFormatter: false
                },
                {
                    field: 'to',
                    title: 'Bis',
                    sortable: true,
                    formatter: momentFormatter,
                    searchFormatter: false
                },
                {
                    field: 'interval',
                    title: 'Intervall',
                    sortable: true
                },
                {
                    field: 'url_csv',
                    title: 'Download',
                    formatter: downloadFormatter
                }
            ]
        });
        $('table#archive').bootstrapTable(options);
        initExportDataType(options);
    }

    // Locations table
    if ($('table#locations').length > 0) {
        options = $.extend(tableOptions, {
            url: './data/locations.json?period=' + period,
            columns: [
                {
                    field: 'state',
                    checkbox: true
                },
                {
                    field: 'address',
                    title: 'Adresse',
                    sortable: true
                },
                {
                    field: 'login_count',
                    title: 'Logins',
                    sortable: true
                },
                {
                    field: 'rating_avg',
                    title: 'Bewertung Ø',
                    sortable: true,
                    formatter: ratingFormatter,
                    searchFormatter: false
                },
                {
                    field: 'weekday',
                    title: 'Wochentag',
                    sortable: true
                },
                {
                    field: 'returning_users',
                    title: 'Anteil wiederkehrender Nutzer',
                    sortable: true
                }
            ]
        });
        $('table#locations').bootstrapTable(options);
        initExportDataType(options);
    }
}