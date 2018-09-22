$(function () {
    WeiXinMenu.GetMenuData(WeiXinMenu.LoadMenuTreeView);
    $("#AddMenu").click(function () {
        WeiXinMenu.AddMenu();
    })

    $("#EditMenu").click(function () {
        WeiXinMenu.EditMenu();
    })
    $(".menuSave").click(function () {
        WeiXinMenu.SaveMenu(this);
    });
    $("#RefreshMenu").click(function () {
        WeiXinMenu.DeleteMenu();
    })
    $("#SaveMenu").click(function () {
        WeiXinMenu.SetMenu();
    })
})
var WeiXinMenu = (function () {
    var MenuData = [];
    var SelectMenuNode = null;
    var api = {
        GetMenuAPI: "/api/WeiXin/GetMenu",
        SetDefaultMenuAPI: "/api/WeiXin/SetDefaultMenu/",
        DeleteDefaultMenuAPI: "/api/WeiXin/DeleteDefaultMenu/",
    };
    var GetMenuData = function (callback) {
        AjaxCustom.getAjax(api.GetMenuAPI, function (data) {
            if (data.menu != null) {
                MenuData = data.menu.button;
            }
            if (typeof callback == "function") {
                callback();
            }
        });
    }
    var LoadMenuTreeView = function () {
        var alternateData = [];
        var Nodechildren = function (obj) {
            var str = [];
            for (var i = 0; i < obj.length; i++) {
                var strdata = {
                    text: obj[i].name,
                    wxtype: obj[i].type,
                    wxhref: obj[i].href,
                    wxkey: obj[i].key,
                    icon: '',
                    href: '#demo',
                    type: "children",
                    nodes: null,
                }
                str.push(strdata);
            }
            return str;
        }
        for (var i = 0; i < MenuData.length; i++) {
            var str = {
                text: MenuData[i].name,
                wxtype: MenuData[i].type,
                wxhref: MenuData[i].href,
                wxkey: MenuData[i].key,
                icon: '',
                type: "parent",
                href: '#demo',
                nodes: MenuData[i].sub_button.length <= 0 ? null : Nodechildren(MenuData[i].sub_button),
            };
            alternateData.push(str)
        }
        $('.menu-treeciew').treeview({
            data: alternateData,
            levels: 2,
            showTags: true,
            onNodeSelected: function (event, node) {
                SelectMenuNode = node;
            },
            onNodeUnselected: function (event, node) {
                SelectMenuNode = null;
            }
        });

    }

    var SaveMenu = function (self) {
        var name = $("#WeiXinMenuName").val();
        var type = $("#WeiXinMenuType").val();
        var key = $("#WeiXinMenuKey").val();
        var url = $("#WeiXinMenuHref").val();
        if (name.length == 0) {
            sweetAlert("警告", "请输入菜单名称", "warning");
            return;
        }
        if (SelectMenuNode == null) {
            if (name.replace(/[^x00-xFF]/g, '**').length > 16) {
                sweetAlert("警告", "一级菜单名称超出限制", "warning");
                return;
            }
        }
        else {
            if (name.replace(/[^x00-xFF]/g, '**').length > 60) {
                sweetAlert("警告", "二级菜单名称超出限制", "warning");
                return;
            }
        }
        var hasName = false;
        $.each(MenuData, function (key, item) {
            if (item.name == name) {
                hasName = true;
            }
            $.each(item.sub_button, function (_key, _item) {
                if (_item.name == name) {
                    hasName = true;
                }
            })
        })
        if (hasName) {
            sweetAlert("警告", "菜单名称重复！", "warning");
            return;
        }
        if (key.replace(/[^x00-xFF]/g, '**').length > 128) {
            sweetAlert("警告", "key字数超出限制", "warning");
            return;
        }
        if (url.replace(/[^x00-xFF]/g, '**').length > 128) {
            sweetAlert("警告", "链接地址字数超过限制", "warning");
            return;
        }
        var isAdd = $(self).data("isAdd");
        if (isAdd) {
            if (SelectMenuNode == null) {
                MenuData.push(
                    {
                        name: name,
                        type: type,
                        key: key,
                        url: url,
                        sub_button: []
                    })
            }
            else {
                $.each(MenuData, function (key, item) {
                    if (item.name == SelectMenuNode.text) {
                        item.sub_button.push(
                            {
                                name: name,
                                type: type,
                                key: key,
                                url: url,
                                sub_button: []
                            });
                    }
                })
            }
        }
        else {
            if (SelectMenuNode != null) {
                $.each(MenuData, function (key, item) {
                    if (item.name == SelectMenuNode.text) {
                        item.name = name;
                        item.type = type;
                        item.key = key;
                        item.url = url;
                    }
                    $.each(item.sub_button, function (_key, _item) {
                        if (_item.name == SelectMenuNode.text) {
                            _item.name = name;
                            _item.type = type;
                            _item.key = key;
                            _item.url = url;
                        }
                    })
                })
            }
        }
        LoadMenuTreeView();
        if (SelectMenuNode != null) {
            $('.menu-treeciew').treeview('selectNode', [SelectMenuNode.nodeId, { silent: true }]);

        }
        // SelectMenuNode = null;
        $("#MenuModal").modal("hide");
    }

    var AddMenu = function () {
        if (SelectMenuNode == null) {
            if (MenuData.length == 3) {
                sweetAlert("警告", "一级菜单超出，不可添加，最大个数为3", "warning");
                return;
            }
        }
        else {
            if (SelectMenuNode.type == "children") {
                sweetAlert("警告", "微信菜单只支持二级菜单，三级菜单不可添加", "warning");
                return;
            }
            if (SelectMenuNode.nodes != null) {
                if (SelectMenuNode.nodes.length == 5) {
                    sweetAlert("警告", "二级菜单超出，不可添加，最大个数为5", "warning");
                    return;
                }
            }
        }
        $(".menuSave").data("isAdd", true);
        $("#WeiXinMenuName").val('');
        $("#WeiXinMenuType").val('click');
        $("#WeiXinMenuKey").val('');
        $("#WeiXinMenuHref").val('');
        $("#MenuModal").modal("show");
    }

    var EditMenu = function () {
        if (SelectMenuNode == null) {
            sweetAlert("警告", "请选择菜单节点进行修改", "warning");
            return;
        }
        $("#WeiXinMenuName").val(SelectMenuNode.text);
        $("#WeiXinMenuType").val(SelectMenuNode.wxtype);
        $("#WeiXinMenuKey").val(SelectMenuNode.wxkey);
        $("#WeiXinMenuHref").val(SelectMenuNode.wxhref);
        $(".menuSave").data("isAdd", false);
        $("#MenuModal").modal("show");
    }

    var SetMenu = function () {
        AjaxCustom.postAjax(api.SetDefaultMenuAPI, { button: MenuData }, function () {
            sweetAlert("提示", "同步成功", "success");
        })
    }

    var DeleteMenu = function () {
        AjaxCustom.getAjax(api.DeleteDefaultMenuAPI, function (data) {
            MenuData = [];
            LoadMenuTreeView();
        });
    }

    return {
        API: api,
        AddMenu: AddMenu,
        EditMenu: EditMenu,
        GetMenuData: GetMenuData,
        SaveMenu: SaveMenu,
        LoadMenuTreeView: LoadMenuTreeView,
        SetMenu: SetMenu,
        DeleteMenu: DeleteMenu,
    }

})()

