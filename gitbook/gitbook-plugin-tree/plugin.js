require(["gitbook"], function(gitbook) {

    var config = null;

    var itemStates = {};
    var saveState = function($, config, isFirst) {
        var items = $('.summary li');
        items.each(function(i, item) {
            var $item = $(this);
            var level = $item.attr('data-level');
            itemStates[level] = $item.hasClass('open') ? "open" : "close";
        });
    };

    var recoveryState = function($, config, isFirst) {
        var items = $('.summary li');
        items.each(function(i, item) {
            var $item = $(this);
            var level = $item.attr('data-level');
            $item.addClass(itemStates[level]);
        });
    };

    var bindEvent = function($, config, isFirst) {
        var items = $('.summary li');
        items.removeClass('active');
        items.each(function(i, item) {
            var $item = $(item);
            //高亮当前项
            var path = ($item.attr('data-path') || '').toLowerCase();
            if (location.href.toString().toLowerCase().indexOf(path) > -1) {
                $item.addClass('active');
            }
            //
            item.childList = $item.children('ul');
            item.hasChildList = item.childList.length > 0;
            //
            var level = $item.attr('data-level');
            $item.addClass(item.hasChildList ? (itemStates[level] || 'close') : "no-child");
            if (!item.treeBtnAdded) {
                item.sn = $item.children('span,a');
                item.sn.html('<span class="tree-btn"><span class="t1">+</span><span class="t2">-</span></span>' + item.sn.html());
                item.treeBtnAdded = true;
            }
            //
            if (!item.hasChildList) return;
            item.btn = $item.find('.tree-btn');
            item.btn.off('click').on('click', function(event) {
                var item = this.parentNode.parentNode,
                    $item = $(item);
                if ($item.hasClass('close')) {
                    $item.addClass('open').removeClass("close");
                } else {
                    $item.addClass("close").removeClass('open');
                }
                saveState($, config);
                return false;
            });
        });
    };

    gitbook.events.bind("start", function(e, _config) {
        config = _config;
        bindEvent(jQuery, config, true);
        saveState(jQuery, config, true);
    });

    gitbook.events.bind("page.change", function() {
        recoveryState(jQuery, config, false);
        bindEvent(jQuery, config, false);
    });
});