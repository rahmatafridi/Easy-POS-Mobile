$(document).ready(function () {
    LoadPicker();
});

var Reset = function () {
    
 
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
        url: "../Reports/LoadSaleMainAndDetail?FromDate=" + fromdate + "&ToDate=" + todate,

        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            //alert(data);
            var html = '';
            var z=0;
            var Invoice = "";
            var SumTotalBill = 0;
            var SumBillDiscount = 0;
            var SumAdjustment = 0;
            var SumNetBill = 0;
            var SumRecieved = 0;
            var SumChange = 0;
            var sr = 0;
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';
                
                if (Invoice != obj.InvoiceNo) {

                    Invoice = obj.InvoiceNo;

                    SumTotalBill += obj.TotalBill;
                    console.log(obj.TotalBill);
                    console.log(SumTotalBill);
                    SumBillDiscount += obj.BillDiscount;
                    SumAdjustment += obj.Adjustment;
                    SumNetBill += obj.NetBill;
                    SumRecieved += obj.Recieved;
                    SumChange += obj.Change;

                    html += '<tr><td colspan="4" style="background-color:lightgray"  align="center">Invoice No : ' + obj.InvoiceNo + '</td><td colspan="4" style="background-color:lightgray"  align="center">Customer : ' + obj.CustomerName + '</td></tr>';
                    sr = 0;
                }
                sr += 1;
                html += '<td>' + (sr) + '</td>';

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

                if (obj.Quantity != null) {
                    html += '<td style="text-align:right">' + obj.Quantity + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Price != null) {
                    html += '<td style="text-align:center">' + obj.Price + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Amount != null) {
                    html += '<td style="text-align:center">' + obj.Amount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Discount != null) {
                    html += '<td style="text-align:center">' + obj.Discount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.AmountAfterDiscount != null) {
                    html += '<td style="text-align:center">' + obj.AmountAfterDiscount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                z+=1;
                if (z == obj.CountRow)
                {
                    z = 0;
                    
                    html += '<tr>';
                    html += '<td colspan="7"  align="right"><h4><b>Total Bill : <br>';
                    html += 'Bill DIscount : <br>';
                    html += 'Adjustment : <br>';
                    html += 'Net Bill : <br>';
                    html += 'Recieve : <br>';
                    html += 'Change : </b></h4></td>';

                    html += '<td colspan="1"  align="right"><h4><b>' + obj.TotalBill + '<br>';
                    html += +obj.BillDiscount + '<br>';
                    html += +obj.Adjustment + '<br>';
                    html += +obj.NetBill + '<br>';
                    html += +obj.Recieved + '<br>';
                    html += +obj.Change + '</b></h4></td>';

                    html += '</tr>';



                }

                

                if (data.length==(i+1)) {
                    
                    html += '<tr><td align="center"><h3>Total Summary</h3></td></tr>';
                    html += '<tr>';
                    html += '<td colspan="7"  align="right"><h4><b>Total Bill : <br>';
                    html += 'Bill DIscount : <br>';
                    html += 'Adjustment : <br>';
                    html += 'Net Bill : <br>';
                    html += 'Recieve : <br>';
                    html += 'Change : </b></h4></td>';

                    

                    
                    
                    html += '<td colspan="1"  align="right"><h4><b>' + SumTotalBill + '<br>';
                    html += + SumBillDiscount + '<br>';
                    html += + SumAdjustment + '<br>';
                    html += + SumNetBill + '<br>';
                    html += + SumRecieved + '<br>';
                    html += + SumChange + '</b></h4></td>';

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
