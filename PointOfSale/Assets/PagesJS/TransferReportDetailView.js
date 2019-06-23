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
        url: "../Reports/TransferMain?UID=" + uid,
        data: data,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                console.log(Rdata);
                var obj = JSON.parse(Rdata);
                obj = obj[0];
                console.log(obj);
                $("#name").append(obj.Location);
                $("#number").append(obj.TransferNo);

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
        url: "../Reports/TransferDetail?UID=" + uid,
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            //alert(data);
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td>' + (i + 1) + '</td>';

                if (obj.itemName != null) {
                    html += '<td>' + obj.itemName + '</td>';
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

                if (obj.Category != null) {
                    html += '<td style="text-align:right">' + obj.Category + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.BeforeQty != null) {
                    html += '<td style="text-align:center">' + obj.BeforeQty + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.IssueQty != null) {
                    html += '<td style="text-align:center">' + obj.IssueQty + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.AfterQty != null) {
                    html += '<td style="text-align:center">' + obj.AfterQty + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Date != null) {
                    html += '<td style="text-align:center">' + obj.Date + '</td>';
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
