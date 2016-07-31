/**
 * Created by qoder on 16-7-31.
 */
angular.module('QQApp', [])
    .controller('QQCtrl', QQCtrl);

function QQCtrl($scope, $timeout) {
    var avator = ['./avator/1.jpg', './avator/2.jpg', './avator/3.jpg', './avator/4.jpg'];
    var timer = null;
    $scope.isAddFirend = false;
    $scope.tip = {
        show: false,
        content: ""
    };
    $scope.searchResult = [];


    //初始化好友列表
    (function () {
        if (localStorage.getItem('friends')) {
            var friends = JSON.parse(localStorage.getItem('friends'));
            if (Array.isArray(friends)) {
                $scope.friendList = friends;
            } else {
                $scope.friendList = [];
                localStorage.removeItem('friends');
            }
        } else {
            $scope.friendList = [];
        }
    })();

    //添加好友
    $scope.addFriend = function () {
        if (!$scope.name) {
            $scope.showTips('好友姓名不能为空');
        } else {
            var obj = {
                name: $scope.name,
                avator: avator[Math.floor(Math.random() * 4)]
            };
            $scope.friendList.unshift(obj);
            $scope.saveFriend($scope.friendList);
            $scope.name = "";
            $scope.showTips('添加好友成功');
            $scope.hideAdd();

        }
    };

    //显示添加好友弹框
    $scope.showAdd = function () {
        $scope.isAddFirend = true;
    };

    //隐藏添加好友弹框
    $scope.hideAdd = function () {
        $scope.isAddFirend = false;
    };


    //置顶好友
    $scope.topFriend = function (index) {
        if (index === 0) {
            $scope.showTips('已经置顶啦~~');
        } else {
            var copy = $scope.friendList[index];
            $scope.friendList.splice(index, 1);
            $scope.friendList.unshift(copy);
            $scope.saveFriend($scope.friendList);
            $scope.showTips('置顶好友成功');
        }
    };

    //删除好友
    $scope.rmFriend = function (index) {
        var flag = window.confirm('您确定要删除好友' + $scope.friendList[index].name + "?");
        if (flag) {
            $scope.friendList.splice(index, 1);
            $scope.saveFriend($scope.friendList);
            $scope.showTips('删除好友成功');
        }
    };


    //清空好友
    $scope.clear = function () {
        var flag = window.confirm('您确定要清空所有好友?清空后无法恢复，请谨慎操作!');
        if (flag) {
            $scope.friendList.length = 0;
            localStorage.removeItem('friends');
            $scope.showTips('清空好友成功');
        }
    };


    //显示提示
    $scope.showTips = function (content) {
        $timeout.cancel(timer);
        $scope.tip.show = false;
        $scope.tip = {
            show: true,
            content: content
        };
        timer = $timeout(function () {
            $scope.tip.show = false;
        }, 1000);
    };

    //搜索好友
    $scope.searchFriends = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            if (!$scope.search) {
                $scope.showTips('输入不能为空～～');
            } else {
                var reg = new RegExp($scope.search, 'gim');
                $scope.searchResult = $scope.friendList.filter(function (friend) {
                    return friend.name.match(reg);
                });

                if ($scope.searchResult.length === 0) {
                    $scope.showTips('搜索结果为空~');
                } else {
                    $scope.showTips('共搜到' + $scope.searchResult.length + '位伙伴');
                }
                $scope.search = "";
            }
        }
    };

    //存储好友
    $scope.saveFriend = function (friends) {
        if (Array.isArray(friends)) {
            localStorage.setItem('friends', JSON.stringify(friends));
        }
    }

}

