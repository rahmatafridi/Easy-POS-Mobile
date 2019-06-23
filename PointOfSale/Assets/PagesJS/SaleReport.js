$(document).ready(function () {
    $('#tblSaleReport').DataTable();
    LoadCategories();
    LoadPicker();
});


$(document).on('click', '.btn-saleReport', function () {
    $('#tblSaleReport').DataTable().destroy();
    if ($("#catgorydd").val() == "") {
        swal("Warning", "Please Select Category", "warning");
        $('#tblSaleReport').DataTable();
        return;
    }
    if ($("#dFrom").val() == "" || $("#dFrom").val() == null) {
        swal("Warning", "Please Select From Date", "warning");
        $('#tblSaleReport').DataTable();
        return;
    }
    if ($("#dTo").val() == "" || $("#dFrom").val() == null) {
        swal("Warning", "Please Select To Dates", "warning");
        $('#tblSaleReport').DataTable();
        return;
    }
    var fromdate = $("#dFrom").val()
    var todate = $("#dTo").val()
    var catId = $("#catgorydd").val()
    $("#tbody").html('');

    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadSaleByCategoryId?FromDate=" + fromdate + "&ToDate=" + todate + "&CatId=" + catId,

        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
            if (data != "No Item") {
                if (data != "error") {

                    data = JSON.parse(data);
                    $('#tblSaleReport').DataTable().destroy();
                    var html = '';
                    for (var i = 0; i < data.length; i++) {

                        var obj = data[i];

                        html += '<tr>';
                        if (obj.ItemName != null) {
                            html += '<td>' + obj.ItemName + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }

                        if (obj.Barcode != null) {
                            html += '<td style="text-align:center">' + obj.Barcode + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.CategoryName != null) {
                            html += '<td style="text-align:center">' + obj.CategoryName + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.TotalQty != null) {
                            html += '<td >' + obj.TotalQty + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }

                        html += '</tr>';
                    }

                    $("#tbody").append(html);
                }

            }
            $('#tblSaleReport').DataTable().draw();
        }
    });

});

var LoadPicker = function () {
    $('#dFrom').val(SetCurrentDate());
    $('#dTo').val(SetCurrentDate());
    $('#dateFrom .input-group.date').datepicker({
        startView: 1,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "mm/dd/yyyy"
    });
    $('#dateTo .input-group.date').datepicker({
        startView: 1,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "mm/dd/yyyy"
    });
}

function SetCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    return today
}


var LoadCategories = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadCategories",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#catgorydd');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Category" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Category" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}


//for opening new window
function openNewWin(url) {
    var x = window.open(url, '_blank');
    x.focus();
}

// Getting Value From Query String By Param Name
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
