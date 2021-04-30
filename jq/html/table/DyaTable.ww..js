function DyaTable(option) {
    var def = {
        headList: [],
        data: []
    };
    var opt = $.extend({}, def, option);
    this.opt = opt;
    this.$box = $(opt.selector);
    this.$box.addClass("dya-table-box");
    var header_html = [], col_group = [];
    header_html.push('<tr>');
    col_group.push('<colgroup>');
    $.each(opt.headList, function (i, m) {
        header_html.push('<th ' + (m.cls ? ('class="' + m.cls + '"') : "") + '>' + m.text + '</th>');
        if (m.width) {
            col_group.push('<col style="width:' + m.width + '"/>')
        } else {
            col_group.push('<col/>')
        }
    });
    col_group.push('</colgroup>');
    header_html.push('</tr>');
    var colgroup = col_group.join("");
    var tableHtml = this.setHtmlByTag("table", colgroup + header_html.join(""));
    var headerHtml = this.setBoxByCls("dya-header-box", tableHtml);
    this.$box.append(headerHtml);
    var tableMain = this.getMainTableHtml(opt.headList, opt.data, colgroup);
    var mainHtml = this.setBoxByCls("dya-main-box", tableMain);
    this.$box.append(mainHtml);
    this.bindEvent(opt);
    opt.finish && opt.finish.cell(this, this.$box, opt);
}

DyaTable.prototype.checkScroll = function () {
    if (this.$box.find(".out-table").height() > this.$box.find(".dya-main-box").height()) {
        this.$box.find(".dya-header-box").addClass("header-scroll")
    } else {
        this.$box.find(".dya-header-box").removeClass("header-scroll")
    }
};
DyaTable.prototype.upScroll = function (dom) {
    var pos = dom[0].offsetTop + dom[0].offsetHeight;
    var top = this.$box.find(".dya-main-box")[0].scrollTop;
    var h = this.$box.find(".dya-main-box").height();
    if (pos - top >= h) {
        this.$box.find(".dya-main-box").animate({
            scrollTop: (pos - h) + 'px'
        })
    }
};
//根据editId 获取item
DyaTable.prototype.getItemById = function (editId) {
    var item = null;
    $.each(this.opt.data, function (i, m) {
        if (m._editId === editId) {
            item = m;
        }
    });
    return item;
};
//刷新item根据_editId
DyaTable.prototype.refreshItemById = function (tem, callback) {
    var item = null;
    $.each(this.opt.data, function (i, m) {
        if (m._editId === tem._editId) {
            item = m;
        }
    });
    if (item) {
        $.extend(item, tem);
        var $box = this.$box.find("tr[data-id='" + item._editId + "']");
        callback && callback.call(this, $box, item);
    }
};
//绑定事件
DyaTable.prototype.bindEvent = function (opt) {
    var self = this;
    //显示 or 隐藏编辑模板
    this.$box.find(".tr-list>td").off("click").on("click", function () {
        var $td = $(this);
        var $tr = $td.parent("tr");
        var editId = $tr.attr("data-id");
        var $editBox = $("#" + editId);
        var $next = $tr.next();
        var item = self.getItemById(editId);
        if ($editBox.length && $next[0] === $editBox[0]) {
            if ($editBox.eq(0).find(".inner-edit-box").is(":hidden")) {
                $tr.addClass("tr-active");
                $editBox.eq(0).show();
                opt.showEditPanel && opt.showEditPanel.call(self, $editBox, item, opt);
                $editBox.find(".inner-edit-box").slideDown(400, function () {
                    self.checkScroll();
                    self.upScroll($editBox);
                });
            } else {
                $tr.removeClass("tr-active");
                $editBox.eq(0).find(".inner-edit-box").slideUp(400, function () {
                    $editBox.eq(0).hide();
                    self.checkScroll();
                })
            }
        } else {
            var html = ['<tr class="tr-edit" id="' + editId + '">', '<td colspan="' + opt.headList.length + '">'];
            html.push($("#detailTable").html());
            html.push("</td>");
            var $editTr = $(html.join(""));
            $tr.after($editTr);
            opt.editCreat && opt.editCreat.call(self, $editTr, item, $tr, opt);
            $tr.addClass("tr-active");
            $editTr.show();
            opt.showEditPanel && opt.showEditPanel.call(self, $editTr, item, opt);
            $editTr.find(".inner-edit-box").slideDown(400, function () {
                self.checkScroll();
                self.upScroll($editTr);
            })
        }
    })
};
DyaTable.prototype.getMainTableHtml = function (headList, dataList, colgroup) {
    var self = this, tbody = ['<tbody>'];
    $.each(dataList, function (i, tr) {
        tbody.push(self.getMainTrHtml(headList, i, tr));
    });
    tbody.push('</tbody>');
    var tableHtml = this.setHtmlByTag("table", colgroup + tbody.join(""), "out-table");
    return tableHtml;
};
DyaTable.prototype.getMainTrHtml = function (headList, i, tr) {
    var self = this, tbody = [];
    tr._editId = (i + 100).toString() + '_' + new Date().getTime();
    tbody.push('<tr class="tr-list" data-id="' + tr._editId + '">');
    $.each(headList, function (idx, td) {
        tbody.push(self.setHtmlByTag('td', typeof(td.code) === "function" ? td.code(i, td, tr) : self.setHtmlByTag("span", tr[td.code]), td.cls))
    });
    tbody.push('</tr>');
    return tbody.join("");
};

DyaTable.prototype.resizeData = function () {
    var trList = this.$box.find(".tr-list");
    $.each(this.opt.headList, function (i, td) {
        if (typeof(td.code) === "function") {
            $.each(trList, function (idx, tr) {
                $(tr).find(">td").eq(i).html(td.code(idx, td, tr));
            })
        }
    });

};
//添加新行
DyaTable.prototype.addTrByData = function (item, idx) {
    var headList = this.opt.headList, self = this;
    var $tr = null;
    var add = function () {
        self.opt.data.push(item);
        var $tr = $(self.getMainTrHtml(headList, self.opt.data.length - 1, item));
        self.$box.find(".out-table>tbody").append($tr);
        self.checkScroll();
        return $tr;
    };
    if (idx === undefined) {
        $tr = add();
    } else {
        var trList = this.$box.find(".tr-list");
        if (idx < trList.length) {
            this.opt.data.splice(idx, 0, item);
            $tr = $(this.getMainTrHtml(headList, idx, item));
            trList.eq(idx).before($tr);
            this.resizeData();
            this.checkScroll();
        } else {
            $tr = add();
        }
    }
    this.bindEvent(this.opt);
    $tr.find("td").eq(0).trigger("click");
};
//刷新数据
DyaTable.prototype.refreshData = function (dataList) {
    var headList = this.opt.headList, self = this;
    var html = [];
    this.opt.data = dataList;
    $.each(dataList, function (i, tr) {
        html.push(self.getMainTrHtml(headList, i, tr));
    });
    this.$box.find(".out-table>tbody").html(html.join(""));
    this.bindEvent(this.opt);
    this.checkScroll();
};
DyaTable.prototype.delItemById = function (id) {
    this.$box.find("#" + id).remove();
    this.$box.find("tr[data-id='" + id + "']").remove();
    this.resizeData();
    this.checkScroll();
};

DyaTable.prototype.getAllData = function () {
    return this.opt.data;
}

DyaTable.prototype.setBoxByCls = function (cls, html) {
    return ['<div class="' + cls + '">', html, '</div>'].join("");
};
DyaTable.prototype.setHtmlByTag = function (tag, html, cls) {
    return ['<', tag, cls ? (' class="' + cls + '" >') : '>', html, '</' + tag + '>'].join("");
};