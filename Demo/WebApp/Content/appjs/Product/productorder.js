
var tableextend = new TableExtend();
tableextend.addtable("productordertable", function (toolshtml, that) {
    toolshtml.push('<input id="searchText" class="search-text" style="float:left;" placeholder="搜索当前订单" />');
    toolshtml.push(sprintf('<button id="addproductorder" style="float:right;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="addproductorder" title="%s">', that.options.formatAdd()),
        '<span class="fa fa-plus-square" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', that.options.formatAdd()), '</button>');
}, function (that) {
    $("#searchText").off("keyup").on("keyup", function () {
        $('#productordertable').bootstrapTable('refresh');
    })
    that.$toolbar.find('button[name="addproductorder"]')
        .off('click').on('click', function () {
            $("#ProductOrderNo").val("");
            $("#OrderName").val('');
            $("#Remark").val('');
            $("#UseMonth").val('');
            $("#Price").val('');
            $('#ProductOrderModal').modal('show');
        });
});

function operateFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="修改产品订单" class="btn btn-circle btn-primary updateProductOrder"><i class="fa fa-pencil-square-o"></i></a>');
    str.push('<a href="javascript:;" title="删除产品订单"  class="btn btn-circle btn-danger deleteProductOrder"><i class="fa fa-trash"></i></a>');
    return str.join('');
}
$(function () {
    AjaxCustom.getAjax(ProductOrder.API.GetAllProductDataInfosAPI, function (data) {
        var strHtml = '';
        for (var i = 0; i < data.length; i++) {
            strHtml += '<option value="' + data[i].ID + '">' + data[i].Name + '</option>'
        }
        $("#ProductID").append(strHtml);
    })
    $("#ProductOrdersForm").validate();
    $(".productOrderSave").click(function () {
        var flag = $("#ProductOrdersForm").valid();
        if (!flag) {
            //没有通过验证
            return;
        }
        ProductOrder.SaveProductOrder();
    })

    $("#IsPermanent").change(function () {
        if ($(this).is(":checked")) {
            $(".use-month").slideUp();
        }
        else {
            $(".use-month").slideDown();
           
        }
    })
})

var ProductOrder = (function () {
    var api = {
        AddOrUpdateProductAPI: "/api/ProductOrder/AddOrUpdateProductOrder",
        DeleteProductAPI: "/api/ProductOrder/DeleteProductOrder/",
        GetAllProductDataInfosAPI: "/api/Product/GetAllProductDataInfos/",
    }

    var SaveProductOrder = function () {
        var no = $("#ProductOrderNo").val();
        var orderName = $("#OrderName").val();
        var useMonth = $("#UseMonth").val();
        var price = $("#Price").val();
        var remark = $("#Remark").val();
        var productID = $("#ProductID").val();
        var isPermanent = $("#IsPermanent").is(":checked");
        var data = { No: no, ProductID: productID, OrderName: orderName, UseMonth: useMonth, Price: price, Remark: remark,IsPermanent:isPermanent }
        AjaxCustom.postAjax(api.AddOrUpdateProductAPI, data, function () {
            $('#ProductOrderModal').modal('hide');
            $('#productordertable').bootstrapTable('refresh');
        })
    }

    return {
        API: api,
        SaveProductOrder: SaveProductOrder
    }
})();

window.operateEvents = {
    'click .updateProductOrder': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $("#ProductOrderNo").val(row.No);
        $("#OrderName").val(row.OrderName);
        $("#Remark").val(row.Remark);
        $("#UseMonth").val(row.UseMonth);
        $("#Price").val(row.Price);
        $("#ProductID").val(row.ProductID);
        if (row.IsPermanent) {
            $(".use-month").hide();
        }
        else {
            $(".use-month").show();
        }
        if (row.IsPermanent) {
            $("#IsPermanent").prop("checked", true);
        }
        else {
            $("#IsPermanent").prop("checked", false);
        }
        $('#ProductOrderModal').modal('show');

    },
    'click .deleteProductOrder': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        AjaxCustom.deleteConfirmAjax(ProductOrder.API.DeleteProductAPI + "?no=" + row.No, function () {
            $('#productordertable').bootstrapTable('refresh');
        })
    }

}