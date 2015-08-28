/**
    ** 滚动上下数值插件(input数字输入)
    ** 参数: {jquery:input元素,unit:滚动一格数值的长度}
    **/
    var scrollNumInput = function (o) {
        var configs = $.extend(true, {
            //input元素
            jquery: "",
            //每次改变值时的单位长度
            unit: 1,
            //输入错误值时:当memory为false,或该元素无上次的输入值,该默认值赋予给元素
            defaultNum: 0,
            //输入错误值时:是否记忆上次输入的值,如果为true,元素会获取上次成功获得的值
            memory: true,
            //最大值 如果设置成undefined,则无最大值上线
            max: undefined,
            min: undefined,
            checkbox: undefined
        }, o),
            $input = $(configs.jquery),
            upHtml = '<div class="input-click-up"></div>',
            downHtml = '<div class="input-click-down"></div>',
            pHeight = $input.parent().innerHeight(),
            tHeight = $input.innerHeight(),
            minus_parent = parseInt((pHeight-tHeight)/2),
            margin_unit = parseInt((tHeight - 14) / 3) + minus_parent;

        if (margin_unit < minus_parent) {
            margin_unit = parseInt((tHeight - 14) / 2) + minus_parent;
        }

        //添加该控件的css样式
        if (!$input.data('downHtml')) {
            var $downHtml = $(downHtml),
                $upHtml = $(upHtml);
            $input.after($downHtml).after($upHtml);
            $input.data('downHtml', $downHtml).data('downHtml', $upHtml);
        }
        //鼠标滚轮事件
        $input.unbind('mousewheel').mousewheel(function (event, delta) {
            var $this = $(this);
            if ($this.attr('disabled')) return;
            if (delta === 1) {
                $this.val(proceStr($this.val(), configs, configs.unit));
            } else if (delta === -1) {
                $this.val(proceStr($this.val(), configs, -configs.unit));
            }
            event.preventDefault();
        })
        .unbind('blur').bind('blur', function () {
            var $this = $(this);
            $this.val(proceStr($this.val(), configs, 0));
        })
        //值改变事件
        .unbind('input propertychange').bind('input propertychange', (function (event) {
            
        }))
        //添加方向键号样式
        .unbind('keydown').bind('keydown', function (event) {
            var $this = $(this);
            switch (event.keyCode) {
                //向上键
                case 38:
                    $this.val(proceStr($this.val(), configs, configs.unit));
                    event.preventDefault();
                    break;
                    //向下键
                case 40:
                    $this.val(proceStr($this.val(), configs, -configs.unit));
                    event.preventDefault();
                    break;
            }
        })
        //input元素后面的up元素点击事件
        .next('.input-click-up').unbind('click').bind('click', function (e) {
            var $t = $(this).prev();
            if ($t.attr('disabled')) return;
            $t.val(proceStr($t.val(), configs, configs.unit));
            
        })
        .css({ top: margin_unit, left: parseInt($input.position().left) + $input.innerWidth() - 9 })
        //input元素后面的down元素点击事件
        .next('.input-click-down').unbind('click').bind('click', function () {
            var $t = $(this).prev().prev();
            if ($t.attr('disabled')) return;
            $t.val(proceStr($t.val(), configs, -configs.unit));
        })
        .css({ bottom: margin_unit, left: parseInt($input.position().left) + $input.innerWidth() - 9 });

        //处理字符串变成数字,增加/减去(不动)额定数字函数
        var proceStr = function (str, configs, unit) {
            var num = configs.defaultNum;
            if (!/[^\d\-]/.test(str)) {
                if (str.length > 0) num = parseInt(str);
                if (isNaN(num)) {
                    if (unit === 0) {
                        return 0;
                    } else {
                        num = configs.defaultNum;
                    }
                }
            }
            num += unit;
            return valiNum(num, configs);
        },
        //验证数字是否符合规范内容,如果不符合,给予指定的数字
            valiNum = function (num, cofigs) {
                if (typeof configs.max === "number") {
                    if (num > configs.max) num = configs.max;
                }
                if (typeof configs.min === "number") {
                    if (num < configs.min) num = configs.min;
                }
                return num;
            };

        
    }