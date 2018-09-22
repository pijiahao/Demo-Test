var payquery = function (params) {
    var temp = {
        stratDate: $("#stratDate").val(),
        endDate:$("#endDate").val(),
        isPayDate: $("#isPayDate").val(),
        searchText: (($("#searchText").val() == undefined) ? "" : $("#searchText").val()),//自定义查询   Condition: params.searchText == undefined ? "" : params.searchText, 自带查询
        pageSize: params.pageSize,
        pageIndex: params.pageNumber
    };
    return temp;
};
var tableextend = new TableExtend();
tableextend.addtable("productPayOrderTable", function (toolshtml, that) {
    toolshtml.push('<input id="searchText" class="search-text" style="float:left;" placeholder="按订单号、支付订单号、备注搜索" />');
    toolshtml.push('<input id="stratDate" readonly  class="search-date" style="float:left;" placeholder="开始时间" />');
    toolshtml.push('<input id="endDate"  readonly class="search-date" style="float:left;" placeholder="结束时间" />');
    toolshtml.push('<select id="isPayDate" class="form-control" style="width:120px;float:left;margin-right:10px"><option value="true">支付时间</option> <option value="false">创建时间</option></select>');
    toolshtml.push(sprintf('<button id="searchPayOrder" style="float:right;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="searchPayOrder" title="%s">', '查询'),
        '<span class="fa fa-search" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', '查询'), '</button>');
}, function (that) {
    $('#stratDate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        timePicker24Hour: true,
        timePicker: true,
        "locale": {
            format: 'YYYY-MM-DD HH:mm',
        }
    });
    $('#endDate').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        timePicker24Hour: true,
        timePicker: true,
        "locale": {
            format: 'YYYY-MM-DD HH:mm',
        }
    });
    $('#stratDate').val('');
    $('#endDate').val('');
    that.$toolbar.find('button[name="searchPayOrder"]')
        .off('click').on('click', function () {
            $('#productPayOrderTable').bootstrapTable('refresh');
        });
});