function Table() {

}

$.extend(Table.prototype, {
    init: function (option) {
        var defs = {
            $el: null,
            fixedNumber: 0,
            columns: [],
            data: [],
            rowReader: null
        }
        var opts = this.opts = $.extend({}, defs, option);
        this.$el = option.$el;
        this.drawContainer();
        this.box = this.getBox();
        this.initFiledMap(opts.columns);
        this.drawTable();
        this.setThWidth();
        this.setLeftFixedWidth();
        this.bindEvent();
    },
    //绘制容器
    drawContainer: function () {
        var $el = this.$el;
        var tableStr = '<table class="table table-bordered table-hover"><thead></thead><tbody></tbody></table>';
        var boxStr = '<div class="dy-base-table">' + tableStr + '</div><div class="dy-top-fixed">' + tableStr + '</div>';

        if (this.opts.fixedNumber) {
            boxStr = boxStr + '<div class="dy-left-fixed">' + boxStr + '</div>'
        }

        $el.html(boxStr)
    },
    //获取容器
    getBox: function () {
        var $el = this.$el;
        var $baseBox = $el.children(".dy-base-table"),
            $headerBox = $el.children(".dy-top-fixed"),
            $leftBox = $el.children(".dy-left-fixed");
        return {
            baseBox: $baseBox,
            headerBox: $headerBox,
            baseTable: $baseBox.find("table"),
            headerTable: $headerBox.find("table"),
            leftFixed: {
                box: $leftBox,
                baseBox: $leftBox.find(".dy-base-table"),
                headerBox: $leftBox.find(".dy-top-fixed")
            }
        };
    },
    //绘制默认表格
    drawTable: function () {
        var box = this.box, opts = this.opts;
        var columns = opts.columns;
        var headerHtml = this.getHeaderHtml(columns);
        //header
        box.headerTable.find("thead").html(headerHtml)
        box.baseTable.find("thead").html(headerHtml)
        //body
        var bodyHtml = this.getBodyHtml(columns, opts.data);
        box.baseTable.find("tbody").html(bodyHtml);
        if (opts.fixedNumber) {
            box.leftFixed.baseBox.html(box.baseBox.html());
            box.leftFixed.headerBox.html(box.headerBox.html());
        }
    },

    //获取header html
    getHeaderHtml: function (columns) {
        var h = [];
        h.push('<tr>');
        columns.forEach(function (d, i) {
            if (Array.isArray(d)) {
                d.forEach(function (f) {
                    h.push('<th rowspan="' + (f.rowspan||1) + '" colspan="' + (f.colspan||1) + '" class="' + (f.thClass || "") + '">' + f.title + '</th>');
                })
                h.push('</tr>');
                if (i < columns.length - 1) {
                    h.push('<tr>');
                }
            } else {
                h.push('<th rowspan="' + (d.rowspan||1) + '" colspan="' + (d.colspan||1) + '" class="' + (d.thClass || "") + '">' + d.title + '</th>');
            }
        })
        h.push('</tr>');
        return h.join("");
    },
    //获取字段列表
    initFiledMap: function (columns) {
        var map = {};
        var count = 0;
        var fn = function (d) {
            if (Array.isArray(d.field)) {
                d.field.forEach(function (p) {
                    count++;
                    map[count] = {
                        filed: p,
                        opt: d
                    };
                    d.fieldIndex = count;
                })
            } else {
                count++;
                map[count] = {
                    filed: d.field,
                    opt: d
                };
                d.fieldIndex = count;
            }
        }
        columns.forEach(function (d, i) {
            if (Array.isArray(d)) {
                d.forEach(function (k) {
                    var colspan = +k.colspan || 1;
                    var rowspan = +k.rowspan || 1;
                    if (colspan === 1 || rowspan === columns.length) {
                        fn(k);
                    }
                })
            } else {
                fn(d);
            }
        })
        this.fieldMap = map;
    },
    getBodyHtml: function (columns, data) {
        var map = this.fieldMap, opts = this.opts;
        var keys = Object.keys(map);
        var h = [];
        data.forEach(function (d, di) {
            var tr = ['<tr data-index="' + di + '">']
            for (var i = 1; i <= keys.length; i++) {
                var item = map[i];
                var tdClass = item.opt.tdClass || "";
                tr.push('<td class="'+tdClass+'">' + d[item.filed] + '</td>');
            }
            tr.push('</tr>');
            var $tr = $(tr.join(""));
            h.push($tr);
            opts.rowReader && opts.rowReader($tr, d, di);
        });
        return h

    },

    setThWidth: function () {
        var $el = this.$el, box = this.box;
        var $box = box.baseBox;
        var $table = box.baseTable;
        var $top_table = $el.find(".dy-top-fixed table");
        var fixed_th = Array.from(box.headerTable.find("thead th"));
        var leftFixed_th = Array.from(box.leftFixed.headerBox.find("thead th"));
        var th = Array.from($table.find("thead th"));
        th.forEach(function (d, i) {
            var w = d.offsetWidth;
            leftFixed_th[i].style.width = w + 'px';
            fixed_th[i].style.width = w + 'px';
        });
        var w = $table[0].getBoundingClientRect().width;
        $top_table.each(function () {
            this.style.width = w + 'px';
        });
        box.leftFixed.baseBox.find("table")[0].style.width = w + 'px';
        //去除 scroll 尺寸
        var scrollWidth = $box[0].offsetWidth - $box[0].clientWidth;
        box.headerBox[0].style.right = scrollWidth + 'px';
        var scrollHeight = $box[0].offsetHeight - $box[0].clientHeight;
        box.leftFixed.box[0].style.bottom = scrollHeight + 'px';
    },
    setLeftFixedWidth: function () {
        var box = this.box;
        var $left = box.leftFixed.box;
        var fixedNumber = this.opts.fixedNumber;
        var w = 0;
        box.baseBox.find("tbody").first("tr").find("td").each(function (i) {
            if ((i + 1) <= fixedNumber) {
                w += this.offsetWidth;
            }
        })
        $left.width(w);
    },

    bindEvent: function () {
        var box = this.box, self = this;
        box.baseBox.off("scroll.table").on("scroll.table", function (e) {
            var div = e.target;
            box.headerBox[0].scrollLeft = div.scrollLeft;
            box.leftFixed.baseBox[0].scrollTop = div.scrollTop;
        });
        box.leftFixed.box.off("mousewheel.table").on("mousewheel.table", function (e) {
            var num = box.baseBox[0].scrollTop - e.originalEvent.wheelDelta;
            box.leftFixed.baseBox.animate({scrollTop: num}, 0);
            box.baseBox[0].scrollTop = num;
            // box.baseTable.trigger("scroll");
        });
        box.baseTable.find("tr").hover(function () {
            var idx = +$(this).attr("data-index");
            box.leftFixed.baseBox.find("tbody tr").eq(idx).css("backgroundColor", $(this).css("backgroundColor"));
        }, function () {
            var idx = +$(this).attr("data-index");
            box.leftFixed.baseBox.find("tbody tr").eq(idx).removeAttr("style");
        });
        box.leftFixed.baseBox.find("tr").hover(function () {
            var idx = +$(this).attr("data-index");
            box.baseTable.find("tbody tr").eq(idx).css("backgroundColor", $(this).css("backgroundColor"));
        }, function () {
            var idx = +$(this).attr("data-index");
            box.baseTable.find("tbody tr").eq(idx).removeAttr("style");
        });

        $(window).off("resize.table").on("resize.table", function () {
            self.setThWidth();
            self.setLeftFixedWidth();
        })
    },


    //合并单元格
    mergeCells: function (options) {
        var box = this.box;
        var rowIdx = options.index;
        var map = this.fieldMap;
        var tdIdx = -1;
        for (var key in map) {
            if (map[key].filed === options.field) {
                tdIdx = key - 1;
                break;
            }
        }
        if (tdIdx === -1) {
            return;
        }
        var $tr = box.baseTable.find("tbody tr");
        var $fixTr = box.leftFixed.baseBox.find("tbody tr");
        var rowspan = options.rowspan || 1;
        var colspan = options.colspan || 1;
        if (rowspan > 1) {
            for (var i = 0; i < rowspan; i++) {
                if (i === 0) {
                    $tr.eq(rowIdx + i).find("td").eq(tdIdx).attr("rowspan", rowspan);
                    $fixTr.eq(rowIdx + i).find("td").eq(tdIdx).attr("rowspan", rowspan);
                } else {
                    $tr.eq(rowIdx + i).find("td").eq(tdIdx).hide();
                    $fixTr.eq(rowIdx + i).find("td").eq(tdIdx).hide();
                }
            }
        }
        if (colspan > 1) {
            for (var j = 0; j < colspan; j++) {
                if (j === 0) {
                    $tr.eq(rowIdx).find("td").eq(tdIdx + j).attr("colspan", colspan);
                    $fixTr.eq(rowIdx).find("td").eq(tdIdx + j).attr("colspan", colspan);
                } else {
                    $tr.eq(rowIdx).find("td").eq(tdIdx + j).hide();
                    $fixTr.eq(rowIdx).find("td").eq(tdIdx + j).hide();
                }
            }
        }

        this.setThWidth();
        this.setLeftFixedWidth();


    }


})



