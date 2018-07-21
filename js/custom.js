function initPeriod () {
    // Select current period option
    var period = Cookies.get('period') || '7d',
        input = $(':input[name="period"][value=' + period + ']').attr('checked', 'checked'),
        button = input.parent();
    button.addClass('active').attr('aria-pressed', true);
    Cookies.set('period', period);

    // Bind period change
    $(':input[name="period"]').change(function () {
        Cookies.set('period', this.value);
        location.reload();
    });
}

$(function () {
    initPeriod();
    initCharts();
    initTables();
    $('[data-toggle="tooltip"]').tooltip();
});
