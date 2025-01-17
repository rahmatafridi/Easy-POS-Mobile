﻿$(document).ready(function () {
    LoadCategories();
    var cate = 0;
    LoadSubCategories(cate);
});

var Reset = function () {
    
 
}

$('#catgorydd').change(function () {
    
    var cate = $('#catgorydd').val()
    LoadSubCategories(cate);
});





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
                $el.append('<option value="0">' + "Select Category" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="0">' + "Select Category" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}


var LoadSubCategories = function (cate) {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadSubCategories?Cat="+cate,
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#SubCategory');
            $el.empty();
            $el.chosen('destroy');
            if (sch.length > 0) {
                $el.append('<option value="0">' + "Select Sub Category" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="0">' + "Select Sub Category" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}







$(document).on('click', '.btn-saleReport', function () {

    
    $("#tblbody").html('');
    
    if ($("#catgorydd").val()>0) {
        $("#lblCat").text($("#catgorydd option:selected").text());
    }
    else {
        $("#lblCat").text('All');
    }
    if ($("#SubCategory").val() > 0) {
        $("#lblSubCat").text($("#SubCategory option:selected").text());
    }
    else {
        $("#lblSubCat").text('All');
    }


    $.ajax({
        type: "POST",
        cache: false,
        url: "../Reports/LoadSellingItemsSummary?Cat=" + $("#catgorydd").val() + "&SubCat=" + $("#SubCategory").val(),
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
                    var purchesqty = 0;
                    var sr = 0;

                    data = JSON.parse(data);
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        sr++;

                        var obj = data[i];
                        html += '<tr>';
                        soldqty += obj.SoldQty;
                        TotalQty += obj.Quantity;
                        TotalCost += obj.CostPrice;
                        TotalSale += obj.SalePrice;
                        purchesqty += obj.PurchaseQty;
                        OverallCost += (obj.Quantity * obj.CostPrice);
                        OverallSale += (obj.Quantity * obj.SalePrice);
                        html += '<td>' + sr + '</td>';

                        if (obj.ItemName != null) {
                            html += '<td>' + obj.ItemName + '</td>';
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
                        if (obj.SubCategoryName != null) {
                            html += '<td style="text-align:center">' + obj.SubCategoryName + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }

                        if (obj.CostPrice != null) {
                            html += '<td >' + obj.CostPrice + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.SalePrice != null) {
                            html += '<td >' + obj.SalePrice + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.PurchaseQty != null) {
                            html += '<td >' + obj.PurchaseQty + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.SoldQty != null) {
                            html += '<td >' + obj.SoldQty + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.Quantity != null) {
                            html += '<td >' + obj.Quantity + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.CostPrice != null) {
                            html += '<td >' + (obj.Quantity * obj.CostPrice) + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }
                        if (obj.SalePrice != null) {
                            html += '<td >' + (obj.Quantity * obj.SalePrice) + '</td>';
                        }
                        else {
                            html += '<td>-</td>';
                        }

                        html += '</tr>';
                    }
                    html += '<tr>';

                    html += '<td colspan="6" style="text-align: right; font-size:20px"><b>Total</b></td>';
                    html += '<td   style="font-size:20px">' + purchesqty + '</td>';
                    html += '<td   style="font-size:20px">' + soldqty + '</td>';
                    html += '<td   style="font-size:20px">' + TotalQty + '</td>';
                    html += '<td   style="font-size:20px">' + OverallCost + '</td>';
                    html += '<td   style="font-size:20px">' + OverallSale + '</td>';
                    html += '</tr>';

                    $("#tblbody").append(html);
                }

            }

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
