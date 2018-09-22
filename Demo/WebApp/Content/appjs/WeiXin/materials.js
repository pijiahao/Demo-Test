var MaterialsType = "news";
$(function () {
    AjaxCustom.getAjax(MeterialsByProduct.API.GetAllProductDataInfosAPI, function (data) {
        var strHtml = '';
        for (var i = 0; i < data.length; i++) {
            strHtml += '<option value="' + data[i].ID + '">' + data[i].Name + '</option>';
        }
        $("#ProductID").append(strHtml);
    });
    $(".nav-list li").click(function () {
        var a = $(this).find("a");
        MaterialsType = $(this).data("type");
        if (a.attr("href") == "#Processed") {
            $("#NewsMediatable").bootstrapTable('refresh');
        }
        else {
            $("#OtherMediatable").bootstrapTable('refresh', { url: "/api/WeiXin/GetWeiXinMedia" });
        }
    });
    $(".mediaByProductSave").click(function () {
        MeterialsByProduct.SaveMediaByProductDataInfo();
    });
});
var MeterialsByProduct = (function () {
    var api = {
        SaveMediaByProductDataInfoAPI: "/api/WeiXin/SaveMediaByProductDataInfo",
        GetToken: "/api/WeiXin/GetToken",
        GetAllProductDataInfosAPI: "/api/Product/GetAllProductDataInfos/",
    };
    var SaveMediaByProductDataInfo = function () {
        var mediaID = $("#mediaID").val();
        var productId = $("#ProductID").val();
        var isUnConcernedPush = $("#IsUnConcernedPush").is(":checked");
        var isConcernedPush = $("#IsConcernedPush").is(":checked");
        var mediaTitle = $("#mediaTitle").val();
        var data = { MediaID: mediaID, ProductId: productId, IsUnConcernedPush: isUnConcernedPush, IsConcernedPush: isConcernedPush, MediaTitle: mediaTitle }
        AjaxCustom.postAjax(api.SaveMediaByProductDataInfoAPI, data, function () {
            $("#SettingMediaModal").modal("hide");
            var a = $(".nav-list li.active").find("a");
            if (a.attr("href") == "#Processed") {
                $("#NewsMediatable").bootstrapTable('refresh');
            }
            else {
                $("#OtherMediatable").bootstrapTable('refresh', { url: "/api/WeiXin/GetWeiXinMedia" });
            }
        });
    };

    return {
        API: api,
        SaveMediaByProductDataInfo: SaveMediaByProductDataInfo
    };
})();

var meterialsQuery = function (params) {
    var temp = {
        type: MaterialsType,
        searchText: (($("#searchTextLog").val() == undefined) ? "" : $("#searchTextLog").val()),//自定义查询   Condition: params.searchText == undefined ? "" : params.searchText, 自带查询
        pageSize: params.pageSize,
        pageIndex: params.pageNumber
    };
    return temp;
};
function operateTitleFormatter(value, row, index) {
    var titleStr = '';
    var newsItem = row.content.news_item;
    for (var i = 0; i < newsItem.length; i++) {
        titleStr += '【' + newsItem[i].title + '】';
        if (i != (newsItem.length - 1)) {
            titleStr += ",";
        }
    }
    return titleStr;
}

function operateShow_cover_picFormatter(value, row, index) {

    return value == 0 ? "不显示" : "显示";
}

function operateUrlFormatter(value, row, index) {
    if (value == "") {
        return "无";
    }
    return '<a href="' + value + '" target="_blank">查看</a>';
}


function operateNewsFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="查看图文详情" class="btn btn-circle btn-info newsDetails"><i class="fa fa-newspaper-o"></i></a>');
    //str.push('<a href="javascript:;" title="设置素材"  class="btn btn-circle btn-primary settingMedia"><i class="fa fa-gear"></i></a>');
    return str.join('');
}
function operateOtherFormatter(value, row, index) {
    var str = [];
   // str.push('<a href="javascript:;" title="设置素材"  class="btn btn-circle btn-primary settingMedia"><i class="fa fa-gear"></i></a>');
    return str.join('');
}

window.operateEvents = {
    'click .newsDetails': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $("#NewsMediaDetailstable").bootstrapTable("load", row.content.news_item);
        $("#NewsMediaDetailsModal").modal("show");

    },
    'click .settingMedia': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $("#mediaID").val(row.media_id);
        if (row.ProductId != 0) {
            $("#ProductID").val(row.ProductId);
        }
        if (MaterialsType == "news") {
            var titleStr = '';
            var newsItem = row.content.news_item;
            for (var i = 0; i < newsItem.length; i++) {
                titleStr += '【' + newsItem[i].title + '】';
                if (i != (newsItem.length - 1)) {
                    titleStr += ",";
                }
            }
            $("#mediaTitle").val(titleStr);
        }
        else {
            $("#mediaTitle").val(row.name);
        }

        if (row.IsUnConcernedPush) {
            $("#IsUnConcernedPush").prop("checked", true);
        }
        else {
            $("#IsUnConcernedPush").prop("checked", false);
        }
        if (row.IsConcernedPush) {
            $("#IsConcernedPush").prop("checked", true);
        }
        else {
            $("#IsConcernedPush").prop("checked", false);
        }
        $("#SettingMediaModal").modal("show");


    }

}