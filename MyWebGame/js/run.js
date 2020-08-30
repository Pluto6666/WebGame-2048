var arr = []; //声明全局变量保存一下每次重新加载的方块类；
function getID(id) {
    return document.getElementById(id);
} //封装ID
function C(cls) {
    return document.getElementsByClassName(cls);
} //封装标签名字

var obj = { //创建一个游戏对象
    ROW: 4, //游戏行数
    COLUMN: 4, //游戏列数
    r: 0, //当前行
    c: 0, //当前列
    f: 0, //查找下一次
    keyPress: 0, //按键
    score: 0, //分数
    createEle: 0, //是否需要创建元素
    eleFragment: "", //文档片段变量
    //进入游戏
    gameStart: function() {
        obj.init();
        obj.musicPlay(1);
        document.onkeydown = function(e) { //自动获得事件对象
            switch (e.keyCode) { //判断按键号
                case 37:
                    obj.keyPress = 1;
                    obj.moveLeft();
                    obj.musicPlay(3);
                    break;
                case 38:
                    obj.keyPress = 2;
                    obj.moveUp();
                    obj.musicPlay(3);
                    break;
                case 39:
                    obj.keyPress = 1;
                    obj.moveRight();
                    obj.musicPlay(3);
                    break;
                case 40:
                    obj.keyPress = 2;
                    obj.moveDown();
                    obj.musicPlay(3);
                    break;
            }
            getID("score").innerHTML = obj.score; //更新分数
        }

    },
    //初始化表格，动态创建
    init: function() {
        obj.eleFragment = document.createDocumentFragment(); //创建ul元素
        for (r = 0; r < obj.ROW; r++) { //初始化行
            arr.push([]);
            for (c = 0; c < obj.COLUMN; c++) { //初始化列
                arr[r][c] = 0;
                if (obj.createEle == 1) { //需要创建一格元素
                    obj.create(r, c);
                }
            }
        }
        if (obj.createEle == 1) {
            obj.createEle = 0;
            getID("gameboard").innerHTML = ""; //清空原有的元素
            getID("gameboard").appendChild(obj.eleFragment); //添加新元素
        }
        obj.score = 0;
        getID("score").innerHTML = obj.score;
        getID("game").style.display = "none"; //不显示
        getID("gameover").style.display = "none"; //不显示
        //随机生成2个数（2或4）
        obj.random();
        obj.random();
        obj.updateView();
    },
    //播放音乐
    musicPlay: function(flag) {
        var a1024 = getID("a1024");
        var a512 = getID("a512");
        var loser = getID("lose");
        var clickclick = getID("clickclick");
        var winner = getID("winner");
        switch (flag) {
            case 0:
                a1024.play();
                break;
            case 1:
                a512.play();
                break;
            case 2:
                loser.play();
                break;
            case 3:
                clickclick.play();
                break;
            case 4:
                winner.play();
                break;
        }
    },
    //按键事件
    buttonsclick: function(event) {
        var but1 = getID("buton1");
        var but2 = getID("buton2");
        var but3 = getID("buton3");
        var but4 = getID("buton4");
        but1.onclick = function() {
            obj.keyPress = 2;
            obj.moveUp();
            obj.musicPlay(3);
            getID("score").innerHTML = obj.score;
        }
        but2.onclick = function() {
            obj.keyPress = 1;
            obj.moveLeft();
            obj.musicPlay(3);
            getID("score").innerHTML = obj.score;
        }
        but3.onclick = function() {
            obj.keyPress = 2;
            obj.moveDown();
            obj.musicPlay(3);
            getID("score").innerHTML = obj.score;
        }
        but4.onclick = function() {
            obj.keyPress = 1;
            obj.moveRight();
            obj.musicPlay(3);
            getID("score").innerHTML = obj.score;
        }
    },
    //创建单元格函数
    create: function(r, c) {
        var grid, cell;
        var increment = 14,
            grWidth, grHeight, grMarginTop, grMarginLeft, ceWidth, ceHeight;
        grid = document.createElement("div");
        cell = document.createElement("div");
        grid.id = "g" + r + c;
        grid.className = "grid";
        cell.id = "c" + r + c;
        cell.className = "cell";

        if (obj.ROW == 3) {
            increment = 26;
        } else if (obj.ROW == 4) {
            increment = 20;
        }
        //根据格子总数按比例计算
        grWidth = 66 + (6 - obj.ROW) * increment;
        grHeight = 66 + (6 - obj.ROW) * increment;
        ceWidth = 66 + (6 - obj.ROW) * increment;
        ceHeight = 66 + (6 - obj.ROW) * increment;
        grMarginTop = (480 - grWidth * obj.ROW) / (obj.ROW + 1);
        grMarginLeft = (480 - grWidth * obj.ROW) / (obj.ROW + 1);
        //转化为元素中的属性
        grid.style.width = grWidth + "px";
        grid.style.height = grHeight + "px";
        grid.style.marginTop = grMarginTop + "px";
        grid.style.marginLeft = grMarginLeft + "px";
        cell.style.width = ceWidth + "px";
        cell.style.height = ceHeight + "px";
        cell.style.top = grMarginTop + r * (grMarginTop + ceWidth) + "px";
        cell.style.left = grMarginLeft + c * (grMarginLeft + ceHeight) + "px";
        cell.style.lineHeight = ceHeight + "px";
        cell.style.fontSize = 15 + (6 - obj.ROW) * 10 + "px";
        cell.style.transition = 1 + "s";

        obj.eleFragment.appendChild(grid);
        obj.eleFragment.appendChild(cell);
    },

    //生成随机数函数
    random: function() {
        while (1) {
            var row = Math.floor(Math.random() * obj.ROW);
            var col = Math.floor(Math.random() * obj.COLUMN);
            if (arr[row][col] == 0) { //判断生成的随机数位置为0才随机生成2或4
                arr[row][col] = (Math.random() > 0.5) ? 4 : 2;
                break;
            }
        }
    },
    //更新页面
    updateView: function() {
        var win = 0; //判断是否胜利
        //遍历模板
        for (r = 0; r < obj.ROW; r++) {
            for (c = 0; c < obj.COLUMN; c++) {
                if (arr[r][c] == 0) { //不显示值为0的格子
                    getID("c" + r + c).innerHTML = "";
                    getID("c" + r + c).className = "cell";
                } else {
                    getID("c" + r + c).innerHTML = arr[r][c];
                    getID("c" + r + c).className = "cell n" + arr[r][c]; //添加不同数字的颜色
                    //判断胜利条件
                    if (obj.ROW == 3 && arr[r][c] == 1024) {
                        win = 1;
                    } else if (obj.ROW == 4 && arr[r][c] == 2048) {
                        win = 1;
                    } else if (obj.ROW == 5 && arr[r][c] == 4096) {
                        win = 1;
                    } else if (obj.ROW == 6 && arr[r][c] == 8192) {
                        win = 1;
                    }
                }
            }
        }
        if (win == 1) { //通关
            obj.musicPlay(4)
            getID("game").style.display = "block";
            getID("gameover").style.display = "block";
            getID("Score").innerHTML = "You win!<br>Score:" + obj.score;
        }
        if (obj.isGameOver()) { //游戏失败
            obj.musicPlay(2)
            getID("game").style.display = "block";
            getID("gameover").style.display = "block";
            getID("Score").innerHTML = "GAME OVER!<br>Score:" + obj.score;

        }
    },

    //游戏失败
    isGameOver: function() {
        for (r = 0; r < obj.ROW; r++) {
            for (c = 0; c < obj.COLUMN; c++) {
                if (arr[r][c] == 0) { //arr有元素就还没结束
                    return false;
                } else if (c != obj.COLUMN - 1 && arr[r][c] == arr[r][c + 1]) { //左往右，左和右不相等
                    obj.musicPlay(3);
                } else if (r != obj.ROW - 1 && arr[r][c] == arr[r + 1][c]) { //上往下，上和下不相等
                    return false;
                }
            }
        }

        return true;
    },

    //查找下一个不为0的数值的位置
    find: function(r, c, start, condition, direction) {
        if (obj.keyPress == 1) { //左右按键

            if (direction == 1) { //左按键   f++
                for (var f = start; f < condition; f += direction) {
                    if (arr[r][f] != 0) {
                        return f;
                    }
                }
            } else { //右按键  f--
                for (var f = start; f >= condition; f += direction) {
                    if (arr[r][f] != 0) {
                        return f;
                    }
                }
            }
        } else { //上下按键
            if (direction == 1) { //向上按键  f++
                for (var f = start; f < condition; f += direction) {
                    if (arr[f][c] != 0) {
                        return f;
                    }
                }
            } else { //向下按键 f--
                for (var f = start; f >= condition; f += direction) {
                    if (arr[f][c] != 0) {
                        return f;
                    }
                }
            }
        }
        return null; //循环结束仍然没有找到！=0的数值，返回null
    },
    // if 当前位置 不为零
    // 从当前位置，下一个成员开始，遍历，
    // 如果找到，与当前位置相等的数，
    // 两者相加，并把不为零的成员，设置为零
    // 如果 当前位置是 零
    // 从当前位置下一个成员开始遍历
    // 如果找到 第一个不为零的成员
    // 当前位置数值设置为这个不为零的成员的值 ，并且把那个不为零的成员设置为 0
    move: function(itertor) {
        var before, //没处理前
            after; //after处理后
        before = arr.toString();
        itertor(); //执行for函数
        after = arr.toString();
        if (before != after) { //前后对比，如果不同就update
            obj.random();
            obj.updateView();

        }
    },

    //左按键处理
    moveLeft: function() {
        obj.move(function() {
            for (r = 0; r < obj.ROW; r++) {
                obj.doLeft(r);
            }
        })

    },
    //实际左移函数
    doLeft: function(r) {
        var next;
        for (c = 0; c < obj.ROW; c++) {
            next = obj.find(r, c, c + 1, obj.COLUMN, 1); //找出第一个不为0的位置
            if (next == null) break; //没有找到就返回
            //如果当前位置为0
            if (arr[r][c] == 0) {
                arr[r][c] = arr[r][next]; //把找到的不为0的数值替换为当前位置的值
                arr[r][next] = 0; //找到的位置清0
                c--; //再次循环多一次，查看后面否有值与替换后的值相同，
            } else if (arr[r][c] == arr[r][next]) { //如果当前位置与找到的位置数值相等，则相加
                arr[r][c] *= 2;
                arr[r][next] = 0;
                obj.score += arr[r][c];
            }
        }
    },


    //右按键处理
    moveRight: function() {
        obj.move(function() {
            for (r = 0; r < obj.ROW; r++) {
                obj.doRight(r);
            }
        })
    },
    //实际右移函数
    doRight: function(r) {
        var next;
        for (c = obj.COLUMN - 1; c >= 0; c--) {
            next = obj.find(r, c, c - 1, 0, -1); //找出第一个不为0的位置
            if (next == null) break; //没有找到就返回
            //如果当前位置为0
            if (arr[r][c] == 0) {
                arr[r][c] = arr[r][next]; //把找到的不为0的数值替换为当前位置的值
                arr[r][next] = 0; //找到的位置清0
                c++; //再次循环多一次，查看后面否有值与替换后的值相同，
            } else if (arr[r][c] == arr[r][next]) { //如果当前位置与找到的位置数值相等，则相加
                arr[r][c] *= 2;
                arr[r][next] = 0;
                obj.score += arr[r][c];
            }
        }
    },

    //上按键处理
    moveUp: function() {
        obj.move(function() {
            for (c = 0; c < obj.COLUMN; c++) {
                obj.doUp(c);
            }
        })
    },
    //实际上移函数
    doUp: function(c) {
        var next;
        for (r = 0; r < obj.ROW; r++) {
            next = obj.find(r, c, r + 1, obj.ROW, 1); //找出第一个不为0的位置
            if (next == null) break;
            //如果当前位置为0
            if (arr[r][c] == 0) {
                arr[r][c] = arr[next][c]; //把找到的不为0的数值替换为当前位置的值
                arr[next][c] = 0; //找到的位置清0
                r--; //再次循环多一次，查看后面否有值与替换后的值相同
            } else if (arr[r][c] == arr[next][c]) { //如果当前位置与找到的位置数值相等，则相加
                arr[r][c] *= 2;
                arr[next][c] = 0;
                obj.score += arr[r][c];
            }
        }
    },

    //下按键处理
    moveDown: function() { //最后一个方法
        obj.move(function() {
            for (c = 0; c < obj.COLUMN; c++) {
                obj.doDown(c);
            }
        })
    },
    //实际下移函数
    doDown: function(c) {
        var next;
        for (r = obj.ROW - 1; r >= 0; r--) {
            next = obj.find(r, c, r - 1, 0, -1); //找出第一个不为0的位置
            if (next == null) {
                break;
            }
            //如果当前位置为0
            if (arr[r][c] == 0) {
                arr[r][c] = arr[next][c]; //把找到的不为0的数值替换为当前位置的值
                arr[next][c] = 0; //找到的位置清0
                r++; //再次循环多一次，查看后面否有值与替换后的值相同
            } else if (arr[r][c] == arr[next][c]) { //如果当前位置与找到的位置数值相等，则相加
                arr[r][c] *= 2;
                arr[next][c] = 0;
                obj.score += arr[r][c];
            }
        }
    }

}


window.onload = function() {
    obj.createEle = 1;
    obj.gameStart();
    obj.buttonsclick();
}

function getModel(e) { //事件冒泡获取a元素
    var a = e.target,
        modelValue = 4;
    if (a.nodeName == "A") {
        if (a.innerHTML == "3X3") {
            modelValue = 3;
        } else if (a.innerHTML == "4X4") {
            modelValue = 4;
        } else if (a.innerHTML == "5X5") {
            modelValue = 5;
        } else if (a.innerHTML == "6X6") {
            modelValue = 6;
        }
        obj.ROW = obj.COLUMN = modelValue;
        obj.createEle = 1; //需要创建格子div元素的标志
        obj.gameStart();
    }
}