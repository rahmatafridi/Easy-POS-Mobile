$(document).ready(function () {
    LoadCategories();
    var cate = 0;
    LoadSubCategories(cate);
    LoadPicker();
});

var Reset = function () {
    
 
}

$('#catgorydd').change(function () {
    
    var cate = $('#catgorydd').val()
    LoadSubCategories(cate);
});

function FormatDate(Date) {
    var today = Date;
    var yyyy = today.substring(0, 4);
    var mm = today.substring(7, 5);
    var dd = today.substring(10, 8);
    today = dd + '/' + mm + '/' + yyyy;
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

    
    var fromdate = $("#dFrom").val()
    var todate = $("#dTo").val()
    $("#tblbody").html('');
    $("#fromdate").html('');
    $("#todate").html('');
    $("#fromdate").append(fromdate);
    $("#todate").append(todate);
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
        url: "../Reports/ItemProfitLossGet?FromDate=" + fromdate + "&ToDate=" + todate + "&Cat=" + $("#catgorydd").val() + "&SubCat=" + $("#SubCategory").val(),

        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            //alert(data);
            var html = '';
            var TotalQty = 0;
            var TotalDiscount = 0;
            var TotalCost = 0;
            var TotalSale = 0;
            var TotalNetAmount = 0;
            var sr = 0;
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';
                sr++;

                TotalQty +=obj.Qty;
                TotalDiscount += obj.Discount;
                TotalCost += obj.NetCost;
                TotalSale += obj.NetSale;
                TotalNetAmount += obj.Profit;


                html += '<td>' + (sr) + '</td>';

                if (obj.Date != null) {
                    html += '<td>' + FormatDate(obj.Date) + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Item != null) {
                    html += '<td style="text-align:center">' + obj.Item + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Barcode != null) {
                    html += '<td style="text-align:right">' + obj.Barcode + '</td>';
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
                    html += '<td style="text-align:center">' + obj.CostPrice + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.SalePrice != null) {
                    html += '<td style="text-align:center">' + obj.SalePrice + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Qty != null) {
                    html += '<td style="text-align:center">' + obj.Qty + '</td>';
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
                if (obj.NetCost != null) {
                    html += '<td style="text-align:center">' + obj.NetCost + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.NetSale != null) {
                    html += '<td style="text-align:center">' + obj.NetSale + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Profit != null) {
                    html += '<td style="text-align:center">' + obj.Profit + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

            html += '</tr>'

            }
            html += '<tr>'
            html += '<td colspan="8" style="text-align:right; font-size:20px"><b>Total</b></td>';
            html += '<td style="text-align:center; font-size:20px">' + TotalQty + '</td>';
            html += '<td style="text-align:center; font-size:20px">' + TotalDiscount + '</td>';
            html += '<td style="text-align:center; font-size:20px">' + TotalCost + '</td>';
            html += '<td style="text-align:center; font-size:20px">' + TotalSale + '</td>';
            html += '<td style="text-align:center; font-size:20px">' + TotalNetAmount + '</td>';

            html += '</tr>'
            html += '</tr><td td colspan="13" style="text-align:left"><small>Formula : (Net Sale)-(Net Cost)-(Discount)=Profit/Loss</small></td></tr>'
            
    
            
                

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
