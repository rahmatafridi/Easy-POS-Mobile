$(document).ready(function () {
    LoadTodaysIncome();
    LoadTodaysItems();

    LoadDayData();
    LoadWeekData();
    LoadMonthData();

    Invoices();
});

//load grid
LoadDayData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UserDashboard/TopTenSale?option=0",
        processData: false,
        contentType: false,
        success: function (data) {
            
            data = JSON.parse(data);

            var html = '';

            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                
                html += '<tr>';

                var count = parseInt(i) + 1;

                html += '<td>' + count + '</td>';

                if (obj.ItemName != null) {
                    html += '<td>' + obj.ItemName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.TotalQty != null) {
                    html += '<td><center>' + obj.TotalQty + '</center></td>';
                }
                else {
                    html += '<td>-</td>';
                }
            }
            $("#daybody").append(html);
        }
    });
}

//load grid
LoadWeekData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UserDashboard/TopTenSale?option=1",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            var html = '';

            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                var count = parseInt(i) + 1;

                html += '<td>' + count + '</td>';

                if (obj.ItemName != null) {
                    html += '<td>' + obj.ItemName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.TotalQty != null) {
                    html += '<td><center>' + obj.TotalQty + '</center></td>';
                }
                else {
                    html += '<td>-</td>';
                }
            }
            $("#weekbody").append(html);
        }
    });
}

//load grid
LoadMonthData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UserDashboard/TopTenSale?option=2",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            var html = '';

            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                var count = parseInt(i) + 1;

                html += '<td>' + count + '</td>';

                if (obj.ItemName != null) {
                    html += '<td>' + obj.ItemName + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.TotalQty != null) {
                    html += '<td><center>' + obj.TotalQty + '</center></td>';
                }
                else {
                    html += '<td>-</td>';
                }
            }
            $("#monthbody").append(html);
        }
    });
}

//load grid
LoadTodaysIncome = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UserDashboard/TodayTotalSale",
        processData: false,
        contentType: false,
        success: function (data) {
            var figure = parseFloat(data);
            $('#htodaysincome').html('Rs.' + figure.toFixed(2));
        }
    });
}


//load grid
LoadTodaysItems = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UserDashboard/TotalItems",
        processData: false,
        contentType: false,
        success: function (data) {
            var figure = parseFloat(data);
            $('#htodaysitems').html(figure.toFixed(2));
        }
    });
}


//load grid
var InvoicesAr = new Array();
var DataAr = new Array();

Invoices = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../UserDashboard/TodayLastFifteenSale",
        processData: false,
        contentType: false,
        async: false,
        success: function (data) {
            obj = JSON.parse(data);
            //alert(obj);
            for (var i = 0; i < obj.length; i++) {
                var myobj = obj[i];
                InvoicesAr.push(myobj.InvoiceNo);
                DataAr.push(myobj.NetTotal)
            }
        }
    });
}

$(function () {
    var barData = {
        labels: InvoicesAr,
        datasets: [
            {
                label: "Sales",
                backgroundColor: 'rgba(26,179,148,0.5)',
                borderColor: "rgba(26,179,148,0.7)",
                pointBackgroundColor: "rgba(26,179,148,1)",
                pointBorderColor: "#fff",
                data: DataAr
            }
        ]
    };

    var barOptions = {
        responsive: true
    };

    var ctx2 = document.getElementById("barChart").getContext("2d");
    new Chart(ctx2, { type: 'bar', data: barData, options: barOptions });




});