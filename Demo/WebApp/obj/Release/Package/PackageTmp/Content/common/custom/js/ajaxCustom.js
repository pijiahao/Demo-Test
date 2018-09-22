var AjaxCustom = (function () {
    var HandleJsonAlert = function (data) {
        if (data.responseJSON != undefined && data.responseJSON.HasMessage) {
            if (data.responseJSON.MessageModel.Type == 2) {
                sweetAlert("错误", data.responseJSON.MessageModel.Message, "error");
            } else if (data.responseJSON.MessageModel.Type == 3) {
                sweetAlert("警告", data.responseJSON.MessageModel.Message, "warning");
            } else {
                sweetAlert("未知错误", data.responseJSON.MessageModel.Message, "Information");
            }
        } else if (data.responseJSON != undefined) {
            sweetAlert("错误", data.responseJSON.ExceptionMessage, "error");
        } else {
            sweetAlert("错误", data.statusText, "error");
        }
    }

    var getAjax = function (url, callback, errorCallback, isAsync) {
        $.ajax({
            type: "Get",
            url: url,
            async: (isAsync === true),
            dataType: "json",
            success: function (data) {
                if (data.HasMessage && data.MessageModel.Type == 1) {
                    sweetAlert("成功", data.MessageModel.Message, "success");
                }
                if (typeof callback === "function") {
                    callback(data.ResultData);
                }
            },
            error: function (data) {
                if (typeof errorCallback === "function") {
                    errorCallback(data.ResultData);
                }
                HandleJsonAlert(data);
            }
        });
    }
    var postAjax = function (url, dataInfo, callback, errorCallback, contentType, isAsync) {
        if (contentType == undefined) {
            contentType = "application/x-www-form-urlencoded";
        }
        $.ajax({
            type: "Post",
            url: url,
            data: dataInfo,
            dataType: "json",
            async: (isAsync === true),
            contentType: contentType,
            success: function (data) {
                if (data.HasMessage && data.MessageModel.Type == 1) {
                    sweetAlert("成功", data.MessageModel.Message, "success");
                }
                if (typeof callback === "function") {
                    callback(data.ResultData);
                }
            },
            error: function (data) {
                if (typeof errorCallback === "function") {
                    errorCallback(data.ResultData);
                }
                HandleJsonAlert(data);
            }
        });
    }
    var deleteConfirmAjax = function (url, callback, errorCallback, isAsync, info) {
        info = info || "确定删除吗？";
        swal({
            title: "警告",
            text: info,
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "确定",
            confirmButtonColor: "#ec6c62"
        }, function () {
            getAjax(url, callback, errorCallback, isAsync);
        });
    }

    var submitAjax = function (url, formId, callback, errorCallback) {
        $('#' + formId + '').ajaxSubmit({
            type: "Post",
            url: url,
            dataType: "json",
            success: function (data) {
                if (data.HasMessage && data.MessageModel.Type == 1) {
                    sweetAlert("成功", data.MessageModel.Message, "success");
                }
                if (typeof callback === "function") {
                    callback(data.ResultData);
                }
            },
            error: function (data) {
                if (typeof errorCallback === "function") {
                    errorCallback(data.ResultData);
                }
                HandleJsonAlert(data);
            }
        });
    };

    var formDataAjax = function (url, formData, callback, errorCallback) {
        $.ajax({
            type: 'post',
            url: url,
            data: formData,
            cache: false,
            processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
            contentType: false, // 不设置Content-type请求头
            success: function (data) {
                if (data.HasMessage && data.MessageModel.Type == 1) {
                    sweetAlert("成功", data.MessageModel.Message, "success");
                }
                if (typeof callback === "function") {
                    callback(data.ResultData);
                }
            },
            error: function (data) {
                if (typeof errorCallback === "function") {
                    errorCallback(data.ResultData);
                }
                HandleJsonAlert(data);
            }
        })
    }

    return {
        getAjax: getAjax,
        postAjax: postAjax,
        deleteConfirmAjax: deleteConfirmAjax,
        submitAjax: submitAjax,
        formDataAjax: formDataAjax
    }
})();


