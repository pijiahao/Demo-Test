
$(function () {
    $("#EventsType").change(function () {
        var value = $(this).val();
        $(".menu-key").slideUp();
        $(".fuzzy-matching").slideUp();
        switch (value) {
            case "click":
            case "view":
                $(".menu-key").slideDown();
                break;
            case "subscribe":
            case "scan":
                break;
            case "text":
                $(".fuzzy-matching").slideDown();
                break;

        }

    });
    $(".pushTemplateSave").click(function () {
        PushTemplate.SavPushTemplate();
    });
    $(".pushTemplateDetailsSave").click(function () {
        PushTemplate.SavPushTemplateDetails();
    });
    $(".upload-file").click(function () {
        $("#FileCtrl").click();
        $("#FileCtrl").data("type", $(this).data("type"));
        $("#FileCtrl").data("control", $(this));
    })
    $("#FileCtrl").change(function () {
        var type = $(this).data("type");
        var file = this.files;
        $.each(file, function (k, v) {
            var i = Math.floor(Math.log(v.size) / Math.log(1024));
            var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var filename = v.name;
            var fileext = filename.split('.');
            var ext = fileext[fileext.length - 1].toLowerCase().trim();
            if (type == "image") {
                if (i > 2) {
                    sweetAlert("警告", "超出限制大小！！！", "warning");

                }
                else if (ext != "jpg" && ext != "png") {
                    sweetAlert("警告", "图片格式不正确！！！", "warning");
                }
                else {
                    PushTemplate.UploadMediaFile(type, file[0]);
                }

            }
            else {
                var size = (v.size / Math.pow(1024, i)).toFixed(2) * 1;
                if (i > 2 && size > 2) {
                    sweetAlert("警告", "超出限制大小！！！", "warning");

                }
                else if (ext != "jpg" && ext != "png" && ext != "jpeg" && ext != "gif" && ext != "bmp") {
                    sweetAlert("警告", "图片格式不正确！！！", "warning");
                }
                else {
                    PushTemplate.UploadMediaFile(type, file[0]);
                }
            }
        });
    });
});
var tableextend = new TableExtend();
tableextend.addtable("PushTemplateTable", function (toolshtml, that) {
    toolshtml.push('<input id="searchText" class="search-text" style="float:left;" placeholder="搜索推送模板" />');
    toolshtml.push(sprintf('<button id="AddPushTemplate" style="float:right;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="AddPushTemplate" title="%s">', that.options.formatAdd()),
        '<span class="fa fa-plus-square" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', that.options.formatAdd()), '</button>');
}, function (that) {
    $("#searchText").off("keyup").on("keyup", function () {
        $('#PushTemplateTable').bootstrapTable('refresh');
    });
    that.$toolbar.find('button[name="AddPushTemplate"]')
        .off('click').on('click', function () {
            $("#PushTemplateID").val(0);
            $("#EventsType").val('click');
            $("#MenuKey").val('');
            $("#PriorityLevel").val('text');
            $("#FuzzyMatchingValue").val('');
            $("#EventsType").attr("disabled", false);
            $('#PushTemplateModal').modal('show');
        });
});
tableextend.addtable("pushTemplateDetailstable", function (toolshtml, that) {
    toolshtml.push(sprintf('<button id="AddPushTemplateDetails" style="float:right;" class="btn btn-default' +
        (that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize) +
        '" type="button" name="AddPushTemplateDetails" title="%s">', that.options.formatAdd()),
        '<span class="fa fa-plus-square" style="top: 3px;margin-right: 6px;"></span>',
        sprintf('%s', that.options.formatAdd()), '</button>');
}, function (that) {
    that.$toolbar.find('button[name="AddPushTemplateDetails"]')
        .off('click').on('click', function () {
            $("#PushTemplateDetailsID").val(0);
            $("#WeiXinMedia").attr('src', '/Content/images/uploadfile.png');
            $("#MediaID").val('');
            $("#MediaType").val('text');
            $("#Title").val('');
            $("#Description").val('');
            $("#NewUrl").val('');
            $("#PicUrl").val('');
            $("#MediaUrl").val('');
            $("#Sort").val('1');
            $("#WeiXinImage").attr('src', '/Content/images/uploadimage.png');
            $('#PushTemplateDetailsModal').modal('show');
        });
});
function operatePicFormatter(value, row, index) {
    return '<img src="' + value + '" style="width:50px;"  alt="">';
}
function operateDetailsFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="修改模板内容" class="btn btn-circle btn-primary updatePushTemplateMedia"><i class="fa fa-pencil-square-o"></i></a>');
    str.push('<a href="javascript:;" title="删除模板内容"  class="btn btn-circle btn-danger deletePushTemplateMedia"><i class="fa fa-trash"></i></a>');
    return str.join('');
}
function operateFormatter(value, row, index) {
    var str = [];
    str.push('<a href="javascript:;" title="推送内容" class="btn btn-circle btn-info pushTemplateDetails"><i class="fa fa-newspaper-o"></i></a>');
    str.push('<a href="javascript:;" title="修改模板" class="btn btn-circle btn-primary updatePushTemplate"><i class="fa fa-pencil-square-o"></i></a>');
    str.push('<a href="javascript:;" title="删除模板"  class="btn btn-circle btn-danger deletePushTemplate"><i class="fa fa-trash"></i></a>');
    return str.join('');
}
function operateUrlFormatter(value, row, index) {
    if (value == "" || value==null) {
        return "无";
    }
    return '<a href="' + value + '" target="_blank">查看</a>';
}


var PushTemplate = (function () {
    var api = {
        AddOrUpdatePushTemplateAPI: "/api/WeiXin/AddOrUpdatePushTemplate",
        DeletePushTemplateAPI: "/api/WeiXin/DeletePushTemplate/",
        GetPushTemplateMediaDataInfosAPI: "/api/WeiXin/GetPushTemplateMediaDataInfos/",
        AddOrUpdatePushTemplateMediaAPI: "/api/WeiXin/AddOrUpdatePushTemplateMedia/",
        DeletePushTemplateMediaAPI: "/api/WeiXin/DeletePushTemplateMedia/",
        UploadMediaFileAPI: "/api/WeiXin/UploadMediaFile/"
    };

    var SavPushTemplate = function () {
        var id = $("#PushTemplateID").val();
        var eventsType = $("#EventsType").val();
        var menukey = $("#MenuKey").val();
        var priorityLevel = $("#PriorityLevel").val();
        var fuzzyMatchingValue = $("#FuzzyMatchingValue").val();
        var data = {
            ID: id, EventsType: eventsType, Menukey: menukey, PriorityLevel: priorityLevel,
            FuzzyMatchingValue: fuzzyMatchingValue
        };
        AjaxCustom.postAjax(api.AddOrUpdatePushTemplateAPI, data, function () {
            $('#PushTemplateModal').modal('hide');
            $('#PushTemplateTable').bootstrapTable('refresh');
        });
    };
    var SavPushTemplate = function () {
        var id = $("#PushTemplateID").val();
        var eventsType = $("#EventsType").val();
        var menukey = $("#MenuKey").val();
        var priorityLevel = $("#PriorityLevel").val();
        var fuzzyMatchingValue = $("#FuzzyMatchingValue").val();
        var data = {
            ID: id, EventsType: eventsType, Menukey: menukey, PriorityLevel: priorityLevel,
            FuzzyMatchingValue: fuzzyMatchingValue
        };
        AjaxCustom.postAjax(api.AddOrUpdatePushTemplateAPI, data, function () {
            $('#PushTemplateModal').modal('hide');
            $('#PushTemplateTable').bootstrapTable('refresh');
        });
    };

    var SavPushTemplateDetails = function () {
        var id = $("#PushTemplateDetailsID").val();
        var mediaID = $("#MediaID").val();
        var mediaType = $("#MediaType").val();
        var pushTemplateID = $("#PushTemplateID").val();
        var mediaUrl = $("#MediaUrl").val();
        var title = $("#Title").val();
        var description = $("#Description").val();
        var newUrl = $("#NewUrl").val();
        var picUrl = $("#PicUrl").val();
        var sort = $("#Sort").val();
        var data = {
            ID: id, MediaID: mediaID, MediaType: mediaType, PushTemplateID: pushTemplateID,
            Title: title, Description: description, NewUrl: newUrl, PicUrl: picUrl, Sort: sort,
            MediaUrl: mediaUrl
        };
        AjaxCustom.postAjax(api.AddOrUpdatePushTemplateMediaAPI, data, function () {
            $('#PushTemplateDetailsModal').modal('hide');
            GetPushTemplateMediaDataInfos(pushTemplateID);
        });
    };

    var GetPushTemplateMediaDataInfos = function (id) {
        AjaxCustom.getAjax(PushTemplate.API.GetPushTemplateMediaDataInfosAPI + "?pushTemplateId=" + id, function (data) {
            $('#pushTemplateDetailstable').bootstrapTable('load', data);
        });
    };

    var UploadMediaFile = function (type, file) {
        var formData = new FormData();
        formData.append("type", type);
        formData.append("file", file);
      //  formData.append("token", "13_8bqPgfw0uh3fnapeBlaQImhiXg01P5hBwVoi2wny49ewqxeIzeLIB6SDqgt63IHtIxk_LjC3vcqyHiPUb7aMDkfh7PVEKUlYjRI2H20Z1gottj115wkaf7Pn19oS7GN3O5lZ-g98UJyN79ePAXEeAIAMJQ");
        AjaxCustom.formDataAjax(api.UploadMediaFileAPI, formData, function (data) {
            $("#FileCtrl").data("control").attr("src", data.myurl);
            if (type == "image") {
                $("#PicUrl").val(data.url);
            }
            else {
                $("#MediaID").val(data.media_id);
                $("#MediaUrl").val(data.url);
            }
        });
    };

    return {
        API: api,
        SavPushTemplate: SavPushTemplate,
        GetPushTemplateMediaDataInfos: GetPushTemplateMediaDataInfos,
        UploadMediaFile: UploadMediaFile,
        SavPushTemplateDetails: SavPushTemplateDetails
    };
})();



window.operateEvents = {
    'click .updatePushTemplate': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $(".menu-key").slideUp();
        $(".fuzzy-matching").slideUp();
        switch (row.EventsType) {
            case "click":
            case "view":
                $(".menu-key").slideDown();
                break;
            case "subscribe":
            case "scan":
                break;
            case "text":
                $(".fuzzy-matching").slideDown();
                break;
        }
        $("#PushTemplateID").val(row.ID);
        $("#EventsType").val(row.EventsType);
        $("#MenuKey").val(row.Menukey);
        $("#PriorityLevel").val(row.PriorityLevel);
        $("#FuzzyMatchingValue").val(row.FuzzyMatchingValue);
        $("#EventsType").attr("disabled", true);
        $('#PushTemplateModal').modal('show');

    },
    'click .deletePushTemplate': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        AjaxCustom.deleteConfirmAjax(PushTemplate.API.DeletePushTemplateAPI + row.ID, function () {
            $('#PushTemplateTable').bootstrapTable('refresh');
        });

    },
    'click .pushTemplateDetails': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $("#PushTemplateID").val(row.ID);
        PushTemplate.GetPushTemplateMediaDataInfos(row.ID);
        $('#pushTemplateDetailsTableModal').modal('show');
    },
    'click .updatePushTemplateMedia': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        $("#PushTemplateDetailsID").val(row.ID);
        if (row.MediaUrl == null || row.MediaUrl == "") {
            $("#WeiXinMedia").attr('src', '/Content/images/uploadfile.png');
        }
        else {
            $("#WeiXinMedia").attr('src', row.PicUrl);
        }
        $("#MediaID").val(row.MediaID);
        $("#MediaType").val(row.MediaType);
        $("#MediaUrl").val(row.MediaUrl);
        $("#Title").val(row.Title);
        $("#Description").val(row.Description);
        $("#NewUrl").val(row.NewUrl);
        $("#PicUrl").val(row.PicUrl);
        $("#Sort").val(row.Sort);
        if (row.PicUrl == null || row.PicUrl == "") {
            $("#WeiXinImage").attr('src', '/Content/images/uploadimage.png');
        }
        else {
            $("#WeiXinImage").attr('src', row.PicUrl);
        }
        $('#PushTemplateDetailsModal').modal('show');

    },
    'click .deletePushTemplateMedia': function (e, value, row, index) {
        e.stopPropagation();
        e.preventDefault();
        AjaxCustom.deleteConfirmAjax(PushTemplate.API.DeletePushTemplateMediaAPI + row.ID, function () {
            PushTemplate.GetPushTemplateMediaDataInfos(row.PushTemplateID);

        });

    }
};