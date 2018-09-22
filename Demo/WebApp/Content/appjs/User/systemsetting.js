
var logquery = function (params) {
    var temp = {
        userId: $("#userid").val(),
        searchText: (($("#searchTextLog").val() == undefined) ? "" : $("#searchTextLog").val()),//自定义查询   Condition: params.searchText == undefined ? "" : params.searchText, 自带查询
        pageSize: params.pageSize,
        pageIndex: params.pageNumber,
    };
    return temp;
};
var tableextend = new TableExtend();
tableextend.addtable("usertable", function (toolshtml, that) {
    toolshtml.push('<input id="searchText" class="search-text" style="float:left;" placeholder="搜索当前用户" />');
    toolshtml.push(sprintf('<button id="adduser" style="float:right;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="adduser" title="%s">', that.options.formatAdd()),
        '<span class="fa fa-plus-square" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', that.options.formatAdd()), '</button>');
}, function (that) {
    $("#searchText").off("keyup").on("keyup", function () {
        $('#usertable').bootstrapTable('refresh');
    })
    that.$toolbar.find('button[name="adduser"]')
        .off('click').on('click', function () {
            $("#userid").val(0);
            $("#Name").val('');
            $("#Password").val('');
            $("#ConfirmPassword").val('');
            $("#DisplayName").val('');
            //  $("#password").rules("add", { required: true });
            // $("#ConfirmPassword").rules("add", { required: true, equalTo: "#Password" });
            $('#SystemUserModal').modal('show');
        });
});
tableextend.addtable("logtable", function (toolshtml, that) {
    toolshtml.push('<input id="searchTextLog" class="search-text" style="float:left;" placeholder="搜索当前日志" />');
    //toolshtml.push(sprintf('<button id="adduser" style="float:right;" class="btn btn-default' +
    //    (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
    //    '" type="button" name="adduser" title="%s">', "查询所有"),
    //    '<span class="fa fa-search" style="top: 3px;margin-right: 6px;"></span>',
    //    sprintf('%s', "查询所有"), '</button>');
}, function (that) {
    $("#searchTextLog").off("keyup").on("keyup", function () {
        $('#logtable').bootstrapTable('refresh');
    })

});
function operateFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="修改用户" class="btn btn-circle btn-primary updateuser"><i class="fa fa-pencil-square-o"></i></a>');
    str.push('<a href="javascript:;" title="删除用户"  class="btn btn-circle btn-danger deleteuser"><i class="fa fa-trash"></i></a>');
    return str.join('');
}
function operateLogFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="删除日志"  class="btn btn-circle btn-danger deletelog"><i class="fa fa-trash"></i></a>');
    return str.join('');
}
function operateRemarkFormatter(value, row, index) {
    var str = [];
    str.push('<div style="width:700px;word-wrap: break-word;">' + value + '<div>');
    return str.join('');
}
$(function () {
    $("#SystemUsersForm").validate();
    $(".systemUserSave").click(function () {
        var flag = $("#SystemUsersForm").valid();
        if (!flag) {
            //没有通过验证
            return;
        }
        SystemUser.SaveSystemUser();
    })
    $("#usertable").off("click-row.bs.table").on("click-row.bs.table", function (e, row, event) {
        var hasDefault = $(event).hasClass("default");
        $("#usertable tr").removeClass("default");
        if (!hasDefault) {
            $("#userid").val(row.ID);
            $(event).addClass("default");
        }
        else {
            $("#userid").val(0);
        }
        $('#logtable').bootstrapTable('refresh');
    })
})

var SystemUser = (function () {
    var api = {
        AddOrUpdateSystemUserAPI: "/api/SystemUser/AddOrUpdateSystemUser",
        DeleteSystemUserAPI: "/api/SystemUser/DeleteSystemUser/",
    }
    var SaveSystemUser = function () {
        var id = $("#userid").val();
        var userName = $("#Name").val();
        var password = $("#Password").val();
        var displayName = $("#DisplayName").val();
        var data = { ID: id, UserName: userName, DisplayName: displayName, Password: password }
        AjaxCustom.postAjax(api.AddOrUpdateSystemUserAPI, data, function () {
            $('#SystemUserModal').modal('hide');
            $('#usertable').bootstrapTable('refresh');
        })

    }
    return {
        API: api,
        SaveSystemUser: SaveSystemUser,

    }

})();

window.operateEvents = {
    'click .updateuser': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $("#userid").val(row.ID);
        $("#Name").val(row.UserName);
        $("#DisplayName").val(row.DisplayName);
        $("#Password").val('');
        $("#ConfirmPassword").val('');
        $('#SystemUserModal').modal('show');

    },
    'click .deleteuser': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        AjaxCustom.deleteConfirmAjax(SystemUser.API.DeleteSystemUserAPI + row.ID, function () {
            $('#usertable').bootstrapTable('refresh');
        })
    }

}