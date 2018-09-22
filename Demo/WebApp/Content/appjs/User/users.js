function operateLocationFormatter(value, row, index) {
    return row.Country + "-" + row.Province + "-" + row.City;
}
function operateHeaderImageFormatter(value, row, index) {
    if (value == "") {
        return value;
    }
    return '<img src="' + value + '" style="width:50px;"  alt="">';
}
var tableextend = new TableExtend();
tableextend.addtable("usertable", function (toolshtml, that) {
    toolshtml.push('<input id="searchText" class="search-text" style="float:left;" placeholder="搜索当前用户" />');
    toolshtml.push(sprintf('<button id="stratUseing" style="float:right;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="stratUseing" title="%s">', '启用'),
        '<span class="fa fa-unlock" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', '启用'), '</button>');
    toolshtml.push(sprintf('<button id="endUseing" style="float:right;margin-right:15px;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="endUseing" title="%s">', '禁用'),
        '<span class="fa fa-unlock-alt" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', '禁用'), '</button>');
}, function (that) {
    $("#searchText").off("keyup").on("keyup", function () {
        $('#usertable').bootstrapTable('refresh');
    })
    that.$toolbar.find('button[name="stratUseing"]')
        .off('click').on('click', function () {
            User.UseUserAction(true);
        });
    that.$toolbar.find('button[name="endUseing"]')
        .off('click').on('click', function () {
            User.UseUserAction(false);
        });
});
tableextend.addtable("UserServiceLifeTable", function (toolshtml, that) {
    toolshtml.push(sprintf('<button id="license" style="float:right;margin-right:15px;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="license" title="%s">', '授权'),
        '<span class="fa fa-paypal" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', '授权'), '</button>');
}, function (that) {
    that.$toolbar.find('button[name="license"]')
        .off('click').on('click', function () {
            $('#UserServiceLifeFromModal').modal('show');
        });
});

function operateFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="用户授权信息" class="btn btn-circle btn-primary userServiceLifeBtn"><i class="fa fa-tags"></i></a>');
    return str.join('');
}

var User = (function () {
    var api = {
        UseUserActionAPI: "/api/User/UseUserAction",
        SaveProductServiceLifeAPI: "/api/User/SaveProductServiceLife/",
        GetAllProductDataInfosAPI: "/api/Product/GetAllProductDataInfos/",
        GetProductServiceLifeDataInfoByUserIDAPI: "/api/User/GetProductServiceLifeDataInfoByUserID",
    }
    var UseUserAction = function (result) {
        var selectData = $("#usertable").bootstrapTable('getSelections');
        if (selectData.length == 0) {
            sweetAlert("警告", "请选择用户", "warning");
            return;
        }
        var ids = [];
        $.each(selectData, function (key, item) {
            ids.push(item.ID);
        })
        AjaxCustom.getAjax(api.UseUserActionAPI + "?ids=" + ids.join(',') + "&actionResult=" + result, function () {
            $('#usertable').bootstrapTable('refresh');
        });

    }
    var GetUserServiceLife = function (id, callback) {
        AjaxCustom.getAjax(api.GetProductServiceLifeDataInfoByUserIDAPI + "/?userID=" + id, function (data) {
            $("#UserServiceLifeTable").bootstrapTable("load", data);
            if (typeof callback == "function") {
                callback();
            }
        });
    }

    var SaveUserServiceLife = function () {
        var useMonth = $("#UseMonth").val();
        var productID = $("#ProductID").val();
        var isPermanent = $("#IsPermanent").is(":checked");
        var userId = $("#UserID").val();
        var data = { ProductID: productID, UseMonth: useMonth, IsPermanent: isPermanent, UserID: userId }
        AjaxCustom.postAjax(api.SaveProductServiceLifeAPI, data, function () {
            GetUserServiceLife(userId, function () {
                $('#UserServiceLifeFromModal').modal('hide');
            })
        })
    }

    return {
        API: api,
        UseUserAction: UseUserAction,
        GetUserServiceLife: GetUserServiceLife,
        SaveUserServiceLife: SaveUserServiceLife
    }
})();

$(function () {
    AjaxCustom.getAjax(User.API.GetAllProductDataInfosAPI, function (data) {
        var strHtml = '';
        for (var i = 0; i < data.length; i++) {
            strHtml += '<option value="' + data[i].ID + '">' + data[i].Name + '</option>'
        }
        $("#ProductID").append(strHtml);
    })
    $(".userServiceLifeSave").click(function () {
        User.SaveUserServiceLife();
    })
})
window.operateEvents = {
    'click .userServiceLifeBtn': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        User.GetUserServiceLife(row.ID);
        $("#UserID").val(row.ID);
        $('#UserServiceLifeModal').modal('show');

    }

};