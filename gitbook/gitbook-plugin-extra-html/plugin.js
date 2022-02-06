require(["gitbook", "jquery"],
    /**
     * @param gitbook
     * @param {JQueryStatic} $
     */
    function (gitbook, $) {
        var $qrcode = $(".extra-html-donate-qrcode").hide();
        $('.extra-html-donate button').on("click", function () {
            $qrcode.slideToggle()
        })
    }
);