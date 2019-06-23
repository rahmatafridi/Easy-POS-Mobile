$(document).ready(function () {
    LoadPicker();
    LoadCustomers();
});

var Reset = function () {
    
 
}


var LoadCustomers = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadCustomers",
        processData: false,
        contentType: false,
        success: function (data) {
            //console.log(data);
            var sch = JSON.parse(data);

            var $el = $('#Customers');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="0">' + "Select" + '</option>');
                $.each(sch, function (idx, obj) {
             
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="0">' + "Select " + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

function FormatDate(Date) {
    var today = Date;
    var yyyy = today.substring(0, 4);
    var mm = today.substring(7, 5);
    var dd = today.substring(10, 8);
    today = mm + '/' + dd + '/' + yyyy;
    return today
}

$(document).on('click', '.btn-saleReport', function () {

    
    var fromdate = $("#dFrom").val()
    var todate = $("#dTo").val()
    $("#tblbody").html('');
    $("#fromdate").html('');
    $("#todate").html('');
    $("#fromdate").append(fromdate);
    $("#todate").append(todate);

    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadRefundDetailData?FromDate=" + fromdate + "&ToDate=" + todate + "&CustomerId=" + $('#Customers').val(),

        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            //alert(data);
            var html = '';
            var z=0;
            var Invoice = "";
            var TotalQty = 0;
            var TotalRate = 0;
            var TotalDiscount = 0;
            var TotalNetAmount = 0;
            var TotalAmount = 0;
            var sr = 0;
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';
                TotalQty += obj.Qty;
                TotalRate += obj.Rate;
                TotalDiscount += obj.Discount;
                TotalNetAmount += obj.NetAmount;
                TotalAmount += obj.Amount;

                sr += 1;
                html += '<td>' + (sr) + '</td>';

                if (obj.CustomerName != null) {
                    html += '<td>' + obj.CustomerName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.InvoiceNo != null) {
                    html += '<td>' + obj.InvoiceNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Date != null) {
                    html += '<td>' + FormatDate(obj.Date) + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }



                if (obj.Description != null) {
                    html += '<td>' + obj.Description + '</td>';
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
                if (obj.Rate != null) {
                    html += '<td>' + obj.Rate + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }







                if (obj.Discount != null) {
                    html += '<td>' + obj.Discount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.NetAmount != null) {
                    html += '<td>' + obj.NetAmount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Amount != null) {
                    html += '<td>' + obj.Amount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }





             

                if (data.length==(i+1)) {
                    

                    html += '<tr>';
                    html += '<td colspan="5"  align="right"><h4><b>Total Amount : <br>';

                    html += '<td><b>' + TotalQty + '</b></td>';
                    html += '<td><b>' + TotalRate + '</b></td>';
                    html += '<td><b>' + TotalDiscount + '</b></td>';
                    html += '<td><b>' + TotalNetAmount + '</b></td>';
                    html += '<td><b>' + TotalAmount + '</b></td>';

                    html += '</tr>';

                }
                

            html += '</tr>'

        }
            $("#tblbody").append(html);
            

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
//Load Customer Name etc


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
