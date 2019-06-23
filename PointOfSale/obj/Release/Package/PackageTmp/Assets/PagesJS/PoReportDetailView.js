$(document).ready(function () {
    LoadMainData();
    LoadDetailData();
});
//Load Customer Name etc
var LoadMainData = function () {
    var uid = getParameterByName('UID');
    var data = new FormData();
    data.append("UID", uid);
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/PoMain?UID=" + uid,
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                console.log(Rdata);
                var obj = JSON.parse(Rdata);
                obj = obj[0];
                console.log(obj);
                $("#name").append(obj.vendorName);
                $("#number").append(obj.orderNo);
            
            }
        }
    })
}

//for detail table data
var LoadDetailData = function () {
    var uid = getParameterByName('UID');
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/PoDetail?UID=" + uid,
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            //alert(data);
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                   html += '<td>' + (i+1) + '</td>';
                
                if (obj.itemName != null) {
                    html += '<td>' + obj.itemName + '</td>';
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

                if (obj.Quantity != null) {
                    html += '<td style="text-align:center">' + obj.Quantity + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.costRate != null) {
                    html += '<td style="text-align:center">' + obj.costRate + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.saleRate != null) {
                    html += '<td style="text-align:right">' + obj.saleRate + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                
                if (obj.costAmount != null) {
                    html += '<td style="text-align:center">' + obj.costAmount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.saleAmount != null) {
                    html += '<td style="text-align:center">' + obj.saleAmount + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
               
                
                if (obj.Batch != null) {
                    html += '<td style="text-align:center">' + obj.Batch + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Expiry != null) {
                    html += '<td>' + obj.Expiry + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
               


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
