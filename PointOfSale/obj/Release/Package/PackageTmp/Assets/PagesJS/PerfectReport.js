$(document).ready(function () {
    $('#tblSaleReport').DataTable();
    //LoadCategories();
    LoadPicker();
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

$(document).on('click', '.btn-saleReport', function () {


    $("#tblbody").html('');
 
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
    var fromdate = $("#dFrom").val();
    var todate = $("#dTo").val();
  
    $("#fromdate").html('');
    $("#todate").html('');
    $("#fromdate").append(fromdate);
    $("#todate").append(todate);



    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadPerfect?FromDate=" + fromdate + "&ToDate=" + todate ,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
            if (data != "No Item") {
                if (data != "error") {
                    var soldqty = 0;
                    var TotalQty = 0;
                    var TotalCost = 0;
                    var TotalSale = 0;
                    var OverallCost = 0;
                    var OverallSale = 0;
                    var totalPerfect = 0;
                    var sr = 0;

                    data = JSON.parse(data);
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        sr++;

                        var obj = data[i];
                        html += '<tr>';
                      
                      
                        TotalCost += obj.Cost;
                        TotalSale += obj.Sale;
                        totalPerfect += obj.Perfect;
                        TotalQty += obj.Qty;
                        html += '<td>' + sr + '</td>';

                        if (obj.ItemName != null) {
                            html += '<td>' + obj.ItemName + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.Barcode != null) {
                            html += '<td>' + obj.Barcode + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }


                        if (obj.Category != null) {
                            html += '<td style="text-align:center">' + obj.Category + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.Qty != null) {
                            html += '<td>' + obj.Qty + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        
                        if (obj.Cost != null) {
                            html += '<td >' + obj.Cost + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.Sale != null) {
                            html += '<td >' + obj.Sale + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        
                        if (obj.Perfect != null) {
                            html += '<td >' + obj.Perfect + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        
                        

                        html += '</tr>';
                    }
                    html += '<tr>';

                    html += '<td   style="font-size:20px"></td>';
                    html += '<td colspan="3"k2 style="text-align: right; font-size:20px"><b>Total</b></td>';
                    html += '<td   style="font-size:20px">' + TotalQty + '</td>';
                    html += '<td   style="font-size:20px">' + TotalCost + '</td>';
                    html += '<td   style="font-size:20px">' + TotalSale + '</td>';
                    html += '<td   style="font-size:20px">' + totalPerfect + '</td>';
            
                    html += '</tr>';

                    $("#tblbody").append(html);
                }

            }

        }
    });

});


function openNewWin(url) {
    var x = window.open(url, '_blank');
    x.focus();
}

// Getting Value From Query String By Param Name
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
