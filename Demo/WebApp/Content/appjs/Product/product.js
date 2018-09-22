
var tableextend = new TableExtend();
tableextend.addtable("producttable", function (toolshtml, that) {
    toolshtml.push('<input id="searchText" class="search-text" style="float:left;" placeholder="搜索当前产品" />');
    toolshtml.push(sprintf('<button id="addproduct" style="float:right;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="addproduct" title="%s">', that.options.formatAdd()),
        '<span class="fa fa-plus-square" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', that.options.formatAdd()), '</button>');
}, function (that) {
    $("#searchText").off("keyup").on("keyup", function () {
        $('#producttable').bootstrapTable('refresh');
    })
    that.$toolbar.find('button[name="addproduct"]')
        .off('click').on('click', function () {
            $("#productid").val(0);
            $("#Name").val('');
            $("#Remark").val('');
            $("#DisplayName").val('');
            $("#ProductKey").val(randomString(6));
            $('#ProductModal').modal('show');
        });
});

function operateFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="修改产品" class="btn btn-circle btn-primary updateproduct"><i class="fa fa-pencil-square-o"></i></a>');
    str.push('<a href="javascript:;" title="删除产品"  class="btn btn-circle btn-danger deleteproduct"><i class="fa fa-trash"></i></a>');
    return str.join('');
}
$(function () {
    $("#ProductsForm").validate();
    $(".productSave").click(function () {
        var flag = $("#ProductsForm").valid();
        if (!flag) {
            //没有通过验证
            return;
        }
        Product.SaveProduct();
    })

     
})

var Product = (function () {
    var api = {
        AddOrUpdateProductAPI: "/api/Product/AddOrUpdateProduct",
        DeleteProductAPI: "/api/Product/DeleteProduct/",
    }

    var SaveProduct = function () {
        var id = $("#productid").val();
        var name = $("#Name").val();
        var productKey = $("#ProductKey").val();
        var displayName = $("#DisplayName").val();
        var remark = $("#Remark").val();
        var data = { ID: id, Name: name, DisplayName: displayName, ProductKey: productKey, Remark: remark }
        AjaxCustom.postAjax(api.AddOrUpdateProductAPI, data, function () {
            $('#ProductModal').modal('hide');
            $('#producttable').bootstrapTable('refresh');
        })
    }

    return {
        API: api,
        SaveProduct: SaveProduct
    }
})();

window.operateEvents = {
    'click .updateproduct': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $("#productid").val(row.ID);
        $("#Name").val(row.Name);
        $("#Remark").val(row.Remark);
        $("#ProductKey").val(row.ProductKey);
        $("#DisplayName").val(row.DisplayName);
        $('#ProductModal').modal('show');

    },
    'click .deleteproduct': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        AjaxCustom.deleteConfirmAjax(Product.API.DeleteProductAPI + row.ID, function () {
            $('#producttable').bootstrapTable('refresh');
        })
    }

}