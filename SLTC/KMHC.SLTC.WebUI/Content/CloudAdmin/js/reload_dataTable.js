 //Collapse
    //jQuery('.box .tools .collapse, .box .tools .expand').click(function () {
    //    var el = jQuery(this).parents(".box").children(".box-body");
    //    if (jQuery(this).hasClass("collapse")) {
    //        jQuery(this).removeClass("collapse").addClass("expand");
    //        var i = jQuery(this).children(".fa-chevron-up");
    //        i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
    //        el.slideUp(200);
    //    } else {
    //        jQuery(this).removeClass("expand").addClass("collapse");
    //        var i = jQuery(this).children(".fa-chevron-down");
    //        i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
    //        el.slideDown(200);
    //    }
    //});

    ///* Close */
    //jQuery('.box .tools a.remove').click(function () {
    //    var removable = jQuery(this).parents(".box");
    //    if (removable.next().hasClass('box') || removable.prev().hasClass('box')) {
    //        jQuery(this).parents(".box").remove();
    //    } else {
    //        jQuery(this).parents(".box").parent().remove();
    //    }
    //});

    ///* Reload */
    //jQuery('.box .tools a.reload').click(function () {
    //    var el = jQuery(this).parents(".box");
    //    App.blockUI(el);
    //    window.setTimeout(function () {
    //        App.unblockUI(el);
    //    }, 1000);
    //});
    //Data Tables
    //$('#datatable1').dataTable({
    //    "sPaginationType": "bs_full"
    //});
    $('#datatable1').dataTable({
        "sPaginationType": "bs_full",
        sDom: "<'row'<'dataTables_header clearfix'<'col-md-4'l><'col-md-8'Tf>r>>t<'row'<'dataTables_footer clearfix'<'col-md-6'i><'col-md-6'p>>>",
        oTableTools: {
            aButtons: ["copy", "print", "csv", "xls", "pdf"],
            sSwfPath: "../Content/CloudAdmin/js/datatables/extras/TableTools/media/swf/copy_csv_xls_pdf.swf"
        }
    });

    $('.datatable').each(function () {
        var datatable = $(this);
        // SEARCH - Add the placeholder for Search and Turn this into in-line form control
        var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
        search_input.attr('placeholder', 'Search');
        search_input.addClass('form-control input-sm');
        // LENGTH - Inline-Form control
        var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
        length_sel.addClass('form-control input-sm');
    });