﻿$(document).ready(function () {
    LoadVendorDetail();
    var fDate = getParameterByName('fDate');
    var tDate = getParameterByName('tDate');
    if (fDate != "" && tDate != "" && fDate != "null" && tDate != "null") {
        LoadVendorTransactionDetailWithDate();
    }
    else {
        LoadVendorTransactionDetail();
    }

});


var LoadVendorDetail = function () {
    var uid = getParameterByName('UID');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/VendorDetail?UID=" + uid,
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);

                $("#name").append(obj.Name);
                $("#Contact").append(obj.Contact);

            }
        }
    })
}



var LoadVendorTransactionDetailWithDate = function () {
    var uid = getParameterByName('UID');
    var fDate = getParameterByName('fDate');
    var tDate = getParameterByName('tDate');

    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/VendorTransactionDetailWithDate?UID=" + uid + "&fDate=" + fDate + "&tDate=" + tDate,
        processData: false,
        contentType: false,
        success: function (data) {
                
            data = JSON.parse(data);
            //alert(data);
            var Balance = 0.00;
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                Balance += obj.Debit - obj.Credit;
                html += '<td>' + (i + 1) + '</td>';
                var desc = null;


                if (obj.TransDate != null) {
                    html += '<td style="text-align:center">' + obj.TransDate + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Reference != null) {
                    html += '<td>' + obj.Reference + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.InvoiceNo != null) {
                    html += '<td style="text-align:center">' + obj.InvoiceNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Descp != null) {
                    html += '<td>' + obj.Descp + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Debit != null) {
                    html += '<td style="text-align:center">' + obj.Debit + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Credit != null) {
                    html += '<td style="text-align:center">' + obj.Credit + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Balance != null) {
                    html += '<td style="text-align:center">' + obj.Balance + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }


                //   if (obj.EntryType == 1) {
                //       desc = 'Opening balance  on ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 2) {
                //    desc = 'Payment recieved On ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 3) {
                //    desc = 'Stock sold against ' + obj.SoNumber + ' on ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 4) {
                //    desc = 'Stock Refund against ' + obj.SoNumber + ' on ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 5) {
                //    desc = 'Amout Paid against reversal  on ' + FormatDate(obj.CreatedOn)
                //}
                //if (desc != null) {
                //    html += '<td>' + desc + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}

                //if (obj.Debit != null) {
                //    html += '<td style="text-align:center">' + obj.Debit + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}

                //if (obj.Credit != null) {
                //    html += '<td style="text-align:center">' + obj.Credit + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}
                //html += '<td style="text-align:center">' + Balance + '</td>';

                html += '</tr>'

            }
            $("#tblbody").append(html);

        }
    })
}



//for detail table data
var LoadVendorTransactionDetail = function () {
    var uid = getParameterByName('UID');
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/VendorTransactionDetail?UID=" + uid,
        processData: false,
        contentType: false,
        success: function (data) {

            data = JSON.parse(data);
            //alert(data);
            var Balance = 0.00;
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';
                html += '<td>' + (i + 1) + '</td>';

                //Balance += obj.Debit - obj.Credit;

                if (obj.TransDate != null) {
                    html += '<td style="text-align:center">' + obj.TransDate + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Reference != null) {
                    html += '<td style="text-align:center">' + obj.Reference + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.InvoiceNo != null) {
                    html += '<td style="text-align:center">' + obj.InvoiceNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Descp != null) {
                    html += '<td>' + obj.Descp + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Debit != null) {
                    html += '<td style="text-align:center">' + obj.Debit + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Credit != null) {
                    html += '<td style="text-align:center">' + obj.Credit + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Balance != null) {
                    html += '<td style="text-align:center">' + obj.Balance + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }


                //html += '<td>' + (i + 1) + '</td>';
                //var desc=null;
                //if (obj.EntryType == 1) {
                //    desc = 'Opening balance  on ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 2) {
                //    desc = 'Payment recieved On ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 3) {
                //    desc = 'Stock sold against ' + obj.SoNumber + ' on ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 4) {
                //    desc = 'Stock Refund against ' + obj.SoNumber + ' on ' + FormatDate(obj.CreatedOn)
                //}
                //if (obj.EntryType == 5) {
                //    desc = 'Amout Paid against reversal  on ' + FormatDate(obj.CreatedOn)
                //}
                //if (desc != null) {
                //    html += '<td>' + desc + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}

                //if (obj.Debit != null) {
                //    html += '<td style="text-align:center">' + obj.Debit + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}

                //if (obj.Credit != null) {
                //    html += '<td style="text-align:center">' + obj.Credit + '</td>';
                //}
                //else {
                //    html += '<td>-</td>';
                //}
                //html += '<td style="text-align:center">' + Balance + '</td>';

                html += '</tr>'

            }
            $("#tblbody").append(html);

        }
    })
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
function FormatDate(Date) {
    var today = Date;
    var yyyy = today.substring(0, 4);
    var mm = today.substring(7, 5);
    var dd = today.substring(10, 8);
    today = yyyy + '/' + mm + '/' + dd;
    return today
}



