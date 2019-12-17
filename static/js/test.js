//添加label控件
var Control = {
    controllayer: null,
    draglayer: null,
    labellayer: null,
    ifmove: false,
    contextmenu: null,
    map: null,
    selectedgraphic: null,//选中要素
    arrowpoint: null,//右键菜单定位
    initControl: function (map) {
        Control.map = map;
        Control.controllayer = new esri.layers.GraphicsLayer();
        Control.draglayer = new esri.layers.GraphicsLayer();
        Control.labellayer = new esri.layers.GraphicsLayer();
        Control.map.addLayer(Control.controllayer);
        Control.map.addLayer(Control.draglayer);
        Control.map.addLayer(Control.labellayer);
        Control.initLayerEvent();
        Control.initMapEvent();
        Control.initContextMenu();
    },
    initLayerEvent: function () {//图层事件
        Control.controllayer.on('mouse-over', function () {
            if (Control.ifmove) {
                Control.map.disablePan();
            } else {
                Control.ifmove = true;
                Control.map.disablePan();
            }
        });
        Control.controllayer.on('mouse-out', function () {
            if (Control.ifmove) {
                Control.ifmove = false;
                Control.map.enablePan();
            }
        });

        Control.draglayer.on('mouse-over', function () {
            if (Control.ifmove) {
                Control.map.disablePan();
            } else {
                Control.ifmove = true;
                Control.map.disablePan();
            }
        });
        Control.draglayer.on('mouse-out', function () {
            if (Control.ifmove) {
                Control.ifmove = false;
                Control.map.enablePan();
            }
        });

        Control.labellayer.on('mouse-over', function () {
            if (Control.ifmove) {
                Control.map.disablePan();
            } else {
                Control.ifmove = true;
                Control.map.disablePan();
            }
        });
        Control.labellayer.on('mouse-out', function () {
            if (Control.ifmove) {
                Control.ifmove = false;
                Control.map.enablePan();
            }
        });
    },
    initMapEvent: function () {//地图事件
        Control.map.on('mouse-drag', function (evt) {
            if (Control.ifmove) {
                var point = evt.mapPoint;
                if (!evt.graphic) return;
                if (evt.graphic.attributes.type == 2) {
                    Control.reDrawControl(point, evt.graphic.attributes.id);
                } else {
                    Control.dragControl(point, evt.graphic.attributes.id);
                }
            }
        }),
        Control.map.on('mouse-drag-end', function (evt) {
            if (Control.ifmove) {
                var point = evt.mapPoint;
                if (!evt.graphic) return;
                if (evt.graphic.attributes.type == 2) {
                    Control.reDrawControl(point, evt.graphic.attributes.id);
                } else {
                    Control.dragControl(point, evt.graphic.attributes.id);
                }
            }
        });
    },
    initAddControlBtn: function (x, y) {//初始化控件
        var div = document.createElement("div");
        div.style.width = '32px';
        div.style.height = '22px';
        div.style.padding = '5px';
        div.style.position = 'absolute';
        div.style['z-index'] = '9999';
        div.style.left = '20px';
        div.style.top = '100px';
        div.style['border-radius'] = '6px';
        div.style.cursor = 'pointer';
        div.style['background-color'] = '#ffffff';
        document.body.appendChild(div);
        div.innerHTML = '添加';
        div.addEventListener('mouseover', function () {
            div.style['background-color'] = '#dedede';
        });
        div.addEventListener('mouseout', function () {
            div.style['background-color'] = '#ffffff';
        });
        div.addEventListener('click', function () {
            Control.addControl(new esri.geometry.ScreenPoint(x, y)); //相对屏幕坐标，，左上为原点
        });
    },
    initAddLayerBtn: function (json) {//初始化控件
        var div = document.createElement("div");
        div.style.width = '32px';
        div.style.height = '22px';
        div.style.padding = '5px';
        div.style.position = 'absolute';
        div.style['z-index'] = '9999';
        div.style.left = '20px';
        div.style.top = '100px';
        div.style['border-radius'] = '6px';
        div.style.cursor = 'pointer';
        div.style['background-color'] = '#ffffff';
        document.body.appendChild(div);
        div.innerHTML = '加载';
        div.addEventListener('mouseover', function () {
            div.style['background-color'] = '#dedede';
        });
        div.addEventListener('mouseout', function () {
            div.style['background-color'] = '#ffffff';
        });
        div.addEventListener('click', function () {
            Control.addControlLayer(json);
        });
    },
    initContextMenu: function () {//初始化右键菜单
        var table = document.getElementById('map_gc');//屏蔽了平面图的右键菜单
        table.oncontextmenu = function () {
            return false;
        }
        Control.contextmenu = new dijit.Menu({});
        Control.contextmenu.addChild(new dijit.MenuItem({
            label: "编 辑",
            onClick: function () {
                var content = '<ul><li>1</li><li>2</li><li>3</li><li>4</li></ul>';
                Control.map.infoWindow.setContent(content);
                Control.map.infoWindow.setTitle('绑定设备');
                Control.map.infoWindow.show(Control.arrowpoint);
            }
        }));
        Control.contextmenu.addChild(new dijit.MenuItem({
            label: "删 除",
            onClick: function () {
                Control.deleteGraphic(Control.selectedgraphic);
            }
        }));
        Control.contextmenu.startup();
        Control.controllayer.on("mouse-over", function (evt) {
            Control.selectedgraphic = evt.graphic;
            Control.contextmenu.bindDomNode(evt.graphic.getDojoShape().getNode());
        });
        Control.controllayer.on("mouse-down", function (evt) {
            Control.arrowpoint = evt.mapPoint;
        });
    },
    deleteGraphic: function (graphic) {//删除要素
        Control.map.infoWindow.hide();
        var draggraphic = Control.queryGraphic(Control.draglayer, graphic.attributes.id);
        var labelgraphic = Control.queryGraphic(Control.labellayer, graphic.attributes.id);
        if (graphic) Control.controllayer.remove(graphic);
        if (draggraphic) Control.draglayer.remove(draggraphic);
        if (labelgraphic) Control.labellayer.remove(labelgraphic);
    },
    queryGraphic: function (graphiclayer, guid) {//根据guid获取graphic
        var graphic = null;
        for (var i = 0; i < graphiclayer.graphics.length; i++) {
            if (graphiclayer.graphics[i].attributes.id == guid) {
                graphic = graphiclayer.graphics[i];
            }
        }
        return graphic;
    },
    addControlLayer: function (json) {//添加控件图层（从数据库读取数据，加载页面）
        if (Control.controllayer) {
            Control.controllayer.clear();
        }
        if (Control.draglayer) {
            Control.draglayer.clear();
        }
        if (Control.labellayer) {
            Control.labellayer.clear();
        }
        var symbol1 = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 0]), 1), new dojo.Color([0, 255, 0, 1]));
        var symbol2 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([4, 153, 82]), 2), new dojo.Color([4, 153, 82, 1]));
        var font = new esri.symbol.Font();
        font.setSize('16px');
        font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
        for (var i = 0; i < json.length; i++) {
            var rectangle = new esri.geometry.Extent(json[i].xmin, json[i].ymin, json[i].xmax, json[i].ymax, new esri.SpatialReference({ wkid: 102113 }));
            var point = new esri.geometry.Point(json[i].xmax, json[i].ymin, new esri.SpatialReference({ wkid: 102113 }));
            var graphic = new esri.Graphic(rectangle, symbol2, { type: 1, id: json[i].id }, null);
            var draggraphic = new esri.Graphic(point, symbol1, { type: 2, id: json[i].id }, null);
            var textsymbol = new esri.symbol.TextSymbol(json[i].value).setColor(new dojo.Color([0, 0, 0])).setOffset(0, -6).setFont(font);
            var centerpoint = new esri.geometry.Point((json[i].xmax + json[i].xmin) / 2, (json[i].ymin + json[i].ymax) / 2, new esri.SpatialReference({ wkid: 102113 }));
            var labelgraphic = new esri.Graphic(centerpoint, textsymbol, { type: 3, id: json[i].id }, null);
            Control.controllayer.add(graphic);
            Control.draglayer.add(draggraphic);
            Control.labellayer.add(labelgraphic);
        }
    },
    getAllAttributes: function () {//获取页面所有属性
        var attributes = [];
        for (var i = 0; i < Control.controllayer.graphics.length; i++) {
            var attribute = Control.controllayer.graphics[i].attributes;
            attribute.xmin = Control.controllayer.graphics[i].geometry.xmin;
            attribute.ymin = Control.controllayer.graphics[i].geometry.ymin;
            attribute.xmax = Control.controllayer.graphics[i].geometry.xmax;
            attribute.ymax = Control.controllayer.graphics[i].geometry.ymax;
            attributes.push(attribute);
        }
        return attributes;
    },
    setAttributes: function (graphic, field, value) {//根据字段名和value，，设置要素属性，，，点击地图获取graphic
        var attribute = graphic.attributes;
        attribute[field] = value;
        graphic.setAttributes(attribute);
    },
    addControl: function (point) {//添加控件
        var centerpoint = point;
        var extent = Control.map.extent;
        var width = Control.map.width;
        var height = Control.map.height;
        var guidobj = new GUID();
        var guid = guidobj.newGUID();
        var screenpoint1 = new esri.geometry.ScreenPoint(centerpoint.x - 30, centerpoint.y + 20);
        var screenpoint2 = new esri.geometry.ScreenPoint(centerpoint.x + 30, centerpoint.y - 20);
        var screenpoint3 = new esri.geometry.ScreenPoint(centerpoint.x + 30, centerpoint.y + 20);
        var point1 = esri.geometry.toMapPoint(extent, width, height, screenpoint1);
        var point2 = esri.geometry.toMapPoint(extent, width, height, screenpoint2);
        var point3 = esri.geometry.toMapPoint(extent, width, height, screenpoint3);
        var rectangle = new esri.geometry.Extent(point1.x, point1.y, point2.x, point2.y, new esri.SpatialReference({ wkid: 102113 }));
        var symbol1 = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 0]), 1), new dojo.Color([0, 255, 0, 1]));

        var symbol2 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([4, 153, 82]), 2), new dojo.Color([4, 153, 82, 1]));

        var graphic = new esri.Graphic(rectangle, symbol2, { type: 1, id: guid }, null);

        var draggraphic = new esri.Graphic(point3, symbol1, { type: 2, id: guid }, null);
        Control.controllayer.add(graphic);
        Control.draglayer.add(draggraphic);
    },
    dragControl: function (point, guid) {//拖拽控件
        var width = (Control.queryGraphic(Control.controllayer, guid).geometry.xmin + Control.queryGraphic(Control.controllayer, guid).geometry.xmax) / 2 - point.x;
        var height = (Control.queryGraphic(Control.controllayer, guid).geometry.ymin + Control.queryGraphic(Control.controllayer, guid).geometry.ymax) / 2 - point.y;
        var point1 = new esri.geometry.Point(Control.queryGraphic(Control.controllayer, guid).geometry.xmin - width, Control.queryGraphic(Control.controllayer, guid).geometry.ymin - height);
        var point2 = new esri.geometry.Point(Control.queryGraphic(Control.controllayer, guid).geometry.xmax - width, Control.queryGraphic(Control.controllayer, guid).geometry.ymax - height);
        var point3 = new esri.geometry.Point(Control.queryGraphic(Control.controllayer, guid).geometry.xmax - width, Control.queryGraphic(Control.controllayer, guid).geometry.ymin - height, new esri.SpatialReference({ wkid: 102113 }));
        var rectangle = new esri.geometry.Extent(point1.x, point1.y, point2.x, point2.y, new esri.SpatialReference({ wkid: 102113 }));
        Control.queryGraphic(Control.controllayer, guid).setGeometry(rectangle);
        Control.queryGraphic(Control.draglayer, guid).setGeometry(point3);

        var centerpoint = new esri.geometry.Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, new esri.SpatialReference({ wkid: 102113 }));
        if (Control.queryGraphic(Control.labellayer, guid)) {
            Control.queryGraphic(Control.labellayer, guid).setGeometry(centerpoint);
        }
    },
    reDrawControl: function (point, guid) {//重新绘制控件
        var point1 = new esri.geometry.Point(Control.queryGraphic(Control.controllayer, guid).geometry.xmin, point.y);
        var point2 = new esri.geometry.Point(point.x, Control.queryGraphic(Control.controllayer, guid).geometry.ymax);
        var rectangle = new esri.geometry.Extent(point1.x, point1.y, point2.x, point2.y, new esri.SpatialReference({ wkid: 102113 }));
        Control.queryGraphic(Control.controllayer, guid).setGeometry(rectangle);
        Control.queryGraphic(Control.draglayer, guid).setGeometry(point);

        var centerpoint = new esri.geometry.Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, new esri.SpatialReference({ wkid: 102113 }));
        if (Control.queryGraphic(Control.labellayer, guid)) {
            Control.queryGraphic(Control.labellayer, guid).setGeometry(centerpoint);
        }
    }
}


new Control.initControl(map);//初始化控件

new Control.initAddControlBtn(130, 120);