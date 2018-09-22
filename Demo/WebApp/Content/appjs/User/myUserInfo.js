$(function () {
    $("#SystemUsersForUpdateForm").validate();
    $("#SystemUsersForUpdatePasswordForm").validate();
    $(".updateInfoBtn").click(function () {
        $("#SystemUserForUpdateModal").modal("show");
    })
    $(".updateheaderimageBtn").click(function () {
        document.getElementById("headerImageFile").click();
    })
    $("#headerImageFile").change(function () {
        MyUserInfo.UpdateHeaderImage(this.files[0]);
    })
    $(".updatePasswordBtn").click(function () {
        $("#SystemUserForUpdatePasswordModal").modal("show");
    })
    $(".updateInfo").click(function () {
        var flag = $("#SystemUsersForUpdateForm").valid();
        if (!flag) {
            //没有通过验证
            return;
        }
        MyUserInfo.UpdateInfo();
    })
    $(".updatePassword").click(function () {
        var flag = $("#SystemUsersForUpdatePasswordForm").valid();
        if (!flag) {
            //没有通过验证
            return;
        }
        MyUserInfo.UpdatePassword();
    })
})


var MyUserInfo = (function () {
    var api = {
        UpdateInfoAPI: "/api/SystemUser/UpdateInfo",
        UpdatePassWordAPI: "/api/SystemUser/UpdatePassWord/",
        UploadHeaderImageAPI: "/api/SystemUser/UploadHeaderImage/",
    }
    var UpdateInfo = function () {
        var displayName = $("#DisplayName").val();
        var data = { DisplayName: displayName, }
        AjaxCustom.postAjax(api.UpdateInfoAPI, data, function () {
            $(".display-name").html('<i class="fa fa-info-circle user-profile-icon"></i>' + displayName);
            $('#SystemUserForUpdateModal').modal('hide');
        })
    }

    var UpdatePassword = function () {
        var oldPassword = $("#OldPassword").val();
        var newPassword = $("#NewPassword").val();
        var data = { NewPassword: newPassword, OldPassword: oldPassword }
        AjaxCustom.postAjax(api.UpdatePassWordAPI, data, function () {
            swal({
                title: "更新密码",
                text: "更新成功",
                type: "success",
                showCancelButton: false,
                closeOnConfirm: false,
                confirmButtonText: "确定",
                confirmButtonColor: "#ec6c62"
            }, function () {
                window.location.href = "/Account/AdminLogin";
            });

        })

    }
    var UpdateHeaderImage = function (filedata) {
        var formData = new FormData();
        formData.append("file", filedata);
        AjaxCustom.formDataAjax(api.UploadHeaderImageAPI, formData, function (data) {
            swal({
                title: "更新用户头像",
                text: "更新成功",
                type: "success",
                showCancelButton: false,
                closeOnConfirm: false,
                confirmButtonText: "确定",
                confirmButtonColor: "#ec6c62"
            }, function () {
                window.location.reload();
            });
        })
    }

    return {
        API: api,
        UpdateInfo: UpdateInfo,
        UpdatePassword: UpdatePassword,
        UpdateHeaderImage: UpdateHeaderImage,

    }
})();