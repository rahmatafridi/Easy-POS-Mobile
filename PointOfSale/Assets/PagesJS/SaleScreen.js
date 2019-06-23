var IsEditMode = false;

$(document).ready(function () {

    LoadCustomers();
    //LoadBills();
    //LoadBill();
    //LoadItems();
    LoaditemNames();
    //LoadBarcodes();
    InitGrid();
    GenerateInvoiceNo();
    $("#Barcode").focus();
    $("body").removeClass("nav-md");
    $("body").addClass("nav-sm");
    //LoadGridData();
    //InitGridRev();
    //GetReversalCode();
    //LoadPaymentMethodDDL();
    //LoadBankDDL();

});





var IsCustomerReseller = function (Id) {
    $.ajax({
        url: "../SaleScreen/CheckCustomerIsReSaler?Id=" + $('#Customer').val(),
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            obj = JSON.parse(data);
            if (obj != 'success') {
                $("#CustomerBalance").text('');
                $('#RefDiv').hide();
            }
            else {

                $('#RefDiv').show();
            }

        },
        error: function () {
            //alert("Error");
        }
    });
}




var LoadBalance = function (Id) {
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: "../SaleScreen/LoadCustomerBalanceById?id=" + Id,
        processData: false,
        contentType: false,
        success: function (data) {
            var data = JSON.parse(data);
            $("#CustomerBalance").text('');
            if (data != null || data != 'error' || data != 'null') {
                //if (Id>1) {
                    $("#CustomerBalance").text('Balance:   ' + data.Balance);
                //}
            }
        }
    });
}

$("#Customer").on('change', function () {

    var Id = $("#Customer").val();
    IsCustomerReseller(Id);
    LoadBalance(Id);
});




// Load Products
var LoadCustomers = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SaleScreen/LoadCustomers",
        processData: false,
        contentType: false,
        success: function (data) {
            //console.log(data);
            var sch = JSON.parse(data);

            var $el = $('#Customer');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="1">' + "Walkin Customer" + '</option>');
                $.each(sch, function (idx, obj) {
                    //console.log(idx + "[]" + obj);
                    //if (idx < 1) {
                    //    $el.append('<option value="' + obj.Id + '" selected>' + obj.Name + '</option>');
                    //}
                     $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>'); 
                });
            }
            else {
                $el.append('<option value="">' + "Select " + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}



function InitGrid() {
    $('#tblAppendGrid').appendGrid({
        initRows: 0,
        columns: [
            {
                name: 'barcode', display: 'Barcode', type: 'text', ctrlCss: { width: '70px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'itemId', display: 'Item ID', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }, invisible: true,
            },
            {
                name: 'itemName', display: 'Item Name', type: 'text', ctrlCss: { width: '60px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },

            {
                name: 'categoryId', display: 'Category Id', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }, invisible: true,
            },
            {
                name: 'category', display: 'Category', type: 'text', ctrlCss: { width: '65px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'uomId', display: 'Uom Id', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }, invisible: true,
            },
            {
                name: 'uom', display: 'UOM', type: 'text', ctrlCss: { width: '70px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },

            {
                name: 'quantity', display: 'Quantity', type: 'text', ctrlCss: { width: '55px', 'text-align': 'right', 'font-size': '10px' },
                onChange: function (evt, rowIndex) {

                    var qty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'quantity', rowIndex);
                    var rate = $('#tblAppendGrid').appendGrid('getCtrlValue', 'rate', rowIndex); // Sale Rate

                    if (!isNaN(qty)) {
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', rowIndex, Math.round(qty * rate));

                        ItemWiseDiscountCalculation(rowIndex);
                        SetBillTotals();
                    }
                    else {
                        sweetAlert("Invalid Value for Quantity. Provide Correct Value", "", "error");
                    }
                }
            },
            {
                name: 'rate', display: 'Rate', type: 'text', ctrlCss: { width: '60px', 'text-align': 'right', 'font-size': '10px' }
                ,
                onChange: function (evt, rowIndex) {

                    var qty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'quantity', rowIndex);
                    var rate = $('#tblAppendGrid').appendGrid('getCtrlValue', 'rate', rowIndex); // Sale Rate

                    if (!isNaN(qty)) {
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', rowIndex, Math.round(qty * rate));

                        ItemWiseDiscountCalculation(rowIndex);
                        SetBillTotals();
                    }
                    else {
                        sweetAlert("Invalid Value for Quantity. Provide Correct Value", "", "error");
                    }
                }
            },
            {
                name: 'amount', display: 'Amount', type: 'text', ctrlCss: { width: '60px', 'text-align': 'right', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'discount', display: 'Discount', type: 'text', ctrlCss: { width: '60px', 'text-align': 'right', 'font-size': '10px' },
                ctrlAttr: { value: 0 },
                //onChange: handleChange, 
                onChange: function (evt, rowIndex) {
                    ItemWiseDiscountCalculation(rowIndex);
                    SetBillTotals();
                }
            },
            //{
            //    name: 'discount', display: 'Disc %age', type: 'text', ctrlOptions: GetItemWiseDiscountValuesDDL(),
            //    //onChange: handleChange, ctrlCss: { width: '70px', 'text-align': 'right', 'font-size': '10px' },
            //},
            {
                name: 'discountedamount', display: 'Disctd. Amount', type: 'number', ctrlAttr: { value: 0, disabled: 'disabled' }, ctrlCss: { width: '100px', 'text-align': 'right', 'font-size': '10px' },
            },
        ],
        afterRowRemoved: function (caller, rowIndex) {
            SetBillTotals();
        },
        hideButtons: {
            removeLast: true,
            moveUp: true,
            moveDown: true,
            insert: true,
            append: true
        }
    });
}
//function GetItemWiseDiscountValuesDDL() {
//    var Rdate;
//    $.ajax({
//        type: "GET",
//        async: false,
//        url: "../SaleScreen/GetItemWiseDiscountValuesDDL",
//        success: function (data) {
//            Rdate = data;
//        }
//    });
//    return Rdate;
//}

//function handleChange(evt, rowIndex) {
//    var elem = evt.target;
//    var selectedText = elem.options[elem.selectedIndex].innerHTML;
//    var TotalAmount = $('#tblAppendGrid').appendGrid('getCtrlValue', 'amount', rowIndex);
//    var Discount = (TotalAmount * (selectedText / 100));
//    var DiscountedAmount = TotalAmount - Discount;
//    $('#tblAppendGrid').appendGrid('setCtrlValue', 'discountedamount', rowIndex, DiscountedAmount);
//    SetBillTotals();
//}

$("#Barcode").keyup(function (e) {

    var key = e.keyCode;
    if (key == 13) {
      
        $("#ItemQty").val(1);
        $("#iDiscount").val(0);

        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            url: "../SaleScreen/LoadItemDiscountByCustomerIdwithBarcode?itemName=" + $("#Barcode").val() + "&CustomerId=" + $("#Customer").val(),
            processData: false,
            contentType: false,
            success: function (data) {
                //alert(data);
                var abc = JSON.parse(data)

                //console.log(data);
                
                if (abc != "error" && abc != null && abc != "" && abc != "null") {
                    $("#iDiscount").val(abc);

                }
                else {
                    $("#iDiscount").val(0);

                }
            }
                ,
            error: errorFunction
        });

        $("#lblItemsDiscount").focus();








    //var key = e.keyCode;
    //if (key == 13) {
    //    if ($("#Barcode").val() != '') {
    //        $("#ItemQty").val(1);
    //        $("#lblItemsDiscount").focus();
    //    };


        if ($("#ItemQty").val() != '' && $("#Barcode").val() != '') {
            if ($('#Customer').val() == '') {
                swal('Please Select Customer First.');
                return;
            }
            $.ajax({
                url: "../SaleScreen/LoadSellingItemByBarcode?Barcode=" + $("#Barcode").val(),
                type: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: MysuccessFunc,
                error: errorFunc
            });
        };
    }
});


//$("#ItemQty").keyup(function (e) {
//    var key = e.keyCode;
//    if (key == 13) {
//        if ($("#ItemQty").val() != '' && $("#Barcode").val() != '') {

//            if ($('#Customer').val() == '') {
//                swal('Please Select Customer First.');
//                return;
//            }

//            $.ajax({
//                url: "../SaleScreen/LoadSellingItemByBarcode?Barcode=" + $("#Barcode").val(),
//                type: "GET",
//                async: false,
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                success: MysuccessFunc,
//                error: errorFunc
//            });
//        };
//    }
//});

function MysuccessFunc(data, status) {

    if (data != "") {
        // Checking If Barcode Already Exist Then Add Qty Only        
        var count = $('#tblAppendGrid').appendGrid('getRowCount');
        var RowCount = 0;
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var Rdata = $('#tblAppendGrid').appendGrid('getRowValue', i);
                if (Rdata.barcode == data[0].barcode) {

                    var OldQty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'quantity', i);
                    var newQty = parseInt(OldQty) + parseInt($('#ItemQty').val());
                    var disc = parseInt($('#iDiscount').val());
                    if (disc=='' || disc==null || disc<0) {
                        disc = 0;
                    }
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'availableQty', i, data[0].availQty);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'quantity', i, newQty);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', i, Math.round(parseFloat(newQty) * parseFloat(data[0].rate)));
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'discountedamount', i, Math.round(parseFloat(newQty) * parseFloat(data[0].rate) - parseFloat(newQty) * parseFloat(disc)));
                    SetBillTotals();
                    $('#Barcode').val('');
                    $('#articleName').val('');
                    $('#ItemQty').val('');
                    //$("#Barcode").focus();
                }
                else {
                    RowCount += 1;
                }
            }

            if (RowCount == count) {
                //Add NEW ROW & data
                var rowIndex = 0;
                var count = $('#tblAppendGrid').appendGrid('getRowCount');
                rowIndex = count - 1;
                if ((parseInt(rowIndex) + 1) == count) {

                    var newindex = (parseInt(rowIndex) + 1);

                    var elem = $('#tblAppendGrid').appendGrid('insertRow', 1, newindex);
                    //console.log(data[0].availQty);
                    //console.log("good");

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, data[0].barcode);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'itemName', newindex, data[0].itemName);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'itemId', newindex, data[0].itemId);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, data[0].category);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, data[0].uom);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'uomId', newindex, data[0].uomId);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'categoryId', newindex, data[0].categoryId);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'quantity', newindex, parseInt($('#ItemQty').val()));
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'discount', newindex, parseInt($('#iDiscount').val()));
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, data[0].rate);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, parseInt(data[0].rate) * parseInt($('#ItemQty').val()));

                    ItemWiseDiscountCalculation(newindex);
                }

                $("#Barcode").val("");
                $("#articleName").val("");
                $('#ItemQty').val('');

                SetBillTotals();
            }
        }
        else {
            //Add NEW ROW & data
            var rowIndex = 0;
            var count = $('#tblAppendGrid').appendGrid('getRowCount');
            rowIndex = count - 1;
            if ((parseInt(rowIndex) + 1) == count) {

                var newindex = (parseInt(rowIndex) + 1);
                var elem = $('#tblAppendGrid').appendGrid('insertRow', 1, newindex);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, data[0].barcode);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'itemName', newindex, data[0].itemName);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'itemId', newindex, data[0].itemId);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, data[0].category);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, data[0].uom);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'uomId', newindex, data[0].uomId);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'categoryId', newindex, data[0].categoryId);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'quantity', newindex, parseInt($('#ItemQty').val()));
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'discount', newindex, parseInt($('#iDiscount').val()));
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, data[0].rate);
                $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, parseInt(data[0].rate) * parseInt($('#ItemQty').val()));

                ItemWiseDiscountCalculation(newindex);
            }

            $("#Barcode").val("");
            $("#articleName").val("");
            $('#ItemQty').val('');

            SetBillTotals();
        }

    }
    else {
        swal("No Data Found.");
        $("#Barcode").val("");

        return;
    }
}
function errorFunc(xhr, textStatus, err) {
    var jsonResponse = JSON.parse(xhr.responseText);
    swal(jsonResponse.Message);
}

function ItemWiseDiscountCalculation(rowIndex) {
    var elem = $('#tblAppendGrid').appendGrid('getCtrlValue', 'discount', rowIndex);
    var TotalAmount = $('#tblAppendGrid').appendGrid('getCtrlValue', 'rate', rowIndex);
    var tqty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'quantity', rowIndex);
    var DiscountedAmount = (TotalAmount - elem) * tqty;

    

   

    $('#tblAppendGrid').appendGrid('setCtrlValue', 'discountedamount', rowIndex, DiscountedAmount);
    

}

//total 
function SetBillTotals() {
    var count = $('#tblAppendGrid').appendGrid('getRowCount');
    var GrandSale = "0";
    var ItemsDiscount = "0";
    var GrandSaleAfterItemDisc = "0";
    var DiscountedAmount = "0";
    var Discount = "0";
    var NetAmontAfterRent = "0";
    var Rent = "0";
    var bal = "0";
    var Qty = "0";
    if (count > 0) {
        for (i = 0; i < count; i++) {

            // Set Total Qty
            var TotalQty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'quantity', i);
            if (!isNaN(TotalQty)) {
                Qty = parseInt(Qty) + parseInt(TotalQty);
            }
            $("#lbltotalqty").html(Qty);
            // Sub Total 
            var totalsale = $('#tblAppendGrid').appendGrid('getCtrlValue', 'amount', i);
            if (!isNaN(totalsale)) {
                GrandSale = parseInt(GrandSale) + parseInt(totalsale);
            }
            $("#lblsubtotal").html(GrandSale);
            // Items Discount
            var discountedamt = $('#tblAppendGrid').appendGrid('getCtrlValue', 'discountedamount', i);
            if (!isNaN(discountedamt)) {
                var itemdisc = parseInt(totalsale - discountedamt);
                ItemsDiscount = parseInt(ItemsDiscount) + parseInt(itemdisc);
                $("#lblItemsDiscount").html(ItemsDiscount);
            }

            GrandSaleAfterItemDisc = (parseInt(GrandSale) - parseInt(ItemsDiscount));
            //console.log(GrandSaleAfterItemDisc);

            $("#lbllblSubTotalAfterItemsDisc").html(GrandSaleAfterItemDisc);

            if ($('#disctype').val() == 1) { // Discount Amount                
                if (parseInt($("#discount").val()) != 0) {
                    DiscountedAmount = GrandSaleAfterItemDisc - parseInt($("#discount").val());
                }
                else {
                    DiscountedAmount = GrandSaleAfterItemDisc;
                }
            }
            else if ($('#disctype').val() == 2) { // Discount %age                
                if (parseInt($("#discount").val()) != 0) {
                    Discount = (GrandSaleAfterItemDisc * (parseInt($("#discount").val()) / 100));
                    DiscountedAmount = GrandSaleAfterItemDisc - Discount;
                }
                else {
                    DiscountedAmount = GrandSaleAfterItemDisc;
                }
            }

            var adjustment = $('#adjust').val();
            var AdjustedAmount = DiscountedAmount - parseFloat(adjustment);
            $("#lblTotalAfterDisc").html(AdjustedAmount);
            $("#received").val(AdjustedAmount);

            //for adding rent value..
            Rent = $("#rent").val();
            //alert(Rent);
            NetAmontAfterRent = parseFloat(AdjustedAmount) + parseFloat(Rent);

            $('#lblTotalAfterRent').html(NetAmontAfterRent);

            //bal = parseFloat($("#balance").html()) - parseFloat(NetAmontAfterRent) + parseFloat($("#received").val());
            bal = parseFloat($("#received").val()) - parseFloat(NetAmontAfterRent);
            //alert(bal);
            $("#change").html(bal);
        }
    }
    else {
        $("#lblsubtotal").html("0");
        $("#lbllblSubTotalAfterItemsDisc").html(0);
        $('#lblTotalAfterDisc').html(0);
        $("#received").val('0');
        $('#change').html(0);
        $('#lbltotalqty').html(0);
        $('#rent').val(0);
        $('#lblTotalAfterRent').html(0);
    }
}


//for rent value
$("#rent").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});


$("#discount").blur(function () {
    if ($('#discount').val() == '') {
        $('#discount').val('0');
    }
    SetBillTotals();
});



$("#discount").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        if ($('#discount').val() == '') {
            $('#discount').val('0');
        }
        SetBillTotals();
    }
});

$("#discount").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});

$("#adjust").blur(function () {
    if ($('#adjust').val() == '') {
        $('#adjust').val('0');
    }
    SetBillTotals();
    //alert('blur');
});

$("#adjust").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        if ($('#adjust').val() == '') {
            $('#adjust').val('0');
        }
        SetBillTotals();
        //alert('enter');
    }
});

$("#adjust").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});

$("#received").keyup(function (e) {
    var key = e.keyCode;
    var TotalDue = "0";
    if (key == 13) {
        if ($(this).val() != '') {

            //check
            TotalPayable = parseFloat($("#lblTotalAfterDisc").text())
            TotalDue = (parseFloat($('#received').val()) - TotalPayable)
            $("#lblTotalAfterRent").html(TotalPayable);
            $("#change").html(TotalDue);
        }
    }
});

$("#received").blur(function () {
    if ($('#received').val() == '') {
        $('#received').val('0');
    }

    var TotalDue = "0" ;
    TotalPayable = parseFloat($("#lblTotalAfterDisc").text())
    TotalDue = (parseFloat($('#received').val()) - TotalPayable)
    $("#lblTotalAfterRent").html(TotalPayable);
    $("#change").html(TotalDue);
    //if (parseFloat($('#change').html()) < 0) {
    //    swal("Please pay total amount");
    //    return;
    //}
    //SetBillTotals();
});

$("#rent").keyup(function (e) {
    var key = e.keyCode;
    var TotalDue = "0";
    if (key == 13) {
        if ($(this).val() != '') {
            TotalDue = (parseFloat($('#balance').html()) - parseFloat($("#lblTotalAfterDisc").text())) - (parseFloat($(this).val()) - parseFloat($("#received").val()));
            //checking
            TotalPayable = parseFloat($("#lblTotalAfterDisc").text()) + parseFloat($("#rent").val())
            $("#lblTotalAfterRent").html(TotalPayable);

            $("#change").html(TotalDue);
        }
    }
});

$("#rent").blur(function () {
    if ($('#rent').val() == '') {
        $('#rent').val('0');
    }
    SetBillTotals();
});


$("#received").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});

//// for balance
$("#Customer").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        if ($("#Customer").val() != '') {
            $.ajax({
                url: "../SaleScreen/LoadCustomerCurrentBalance?CName=" + $("#Customer").val(),
                type: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
        };
    }
});
function successFunc(data, status) {
    $("#balance").html(data);
    //$("#Barcode").focus();
    //$("#articleName").focus();
}
function errorFunc(xhr, textStatus, err) {
    var jsonResponse = JSON.parse(xhr.responseText);
    swal(jsonResponse.Message);
}

var GenerateInvoiceNo = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SaleScreen/GenerateInvoiceNo",
        processData: false,
        contentType: false,
        success: function (data) {
            //console.log(data);
            $('#invno').html(data);
        }
    });
}

//making class
var SaleGrid = function () {
    this.Barcode = '0';
    this.ItemId = '0';
    this.CategoryId = '0';
    this.UomId = '0';
    this.Qty = '0';
    this.Price = '0';
    this.Amount = '0';
    this.Discount = '0';
    this.AmountAfterDiscount = "0";
};
//article
$("#articleName").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        
        $("#ItemQty").val(1);
        $("#iDiscount").val(0);

        $.ajax({
            type: "POST",
            cache: false,
            async: false,
            url: "../SaleScreen/LoadItemDiscountByCustomerId?itemName=" + $("#articleName").val() + "&CustomerId=" + $("#Customer").val(),
            processData: false,
            contentType: false,
            success: function (data) {
                var abc = JSON.parse(data)

                //alert(abc);
                
                if (abc != "error" && abc != null && abc != "" && abc != "null") {
                    $("#iDiscount").val(abc);

                }
                else {
                    $("#iDiscount").val(0);

                }
            }
                ,
            error: errorFunction
        });

        $("#lblItemsDiscount").focus();

        $.ajax({
            url: "../SaleScreen/LoadItemByName?itemName=" + $("#articleName").val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: MysuccessFunc,
            error: errorFunction
        });

    }
});

//function MysuccessFunction(data) {
//    //if ($('#Customer').val() == '') {
//    //    swal('Please Select Customer First.');
//    //    return;
//    //}

//    if (data == 'invalid') {
//        swal('Invalid Article Provided.');
//        return;
//    }
//    if (status != 'error') {
//        //GetItemByBarcode(data);
//        data = data[0];
//        $('#availableqty').html(data.AvailableQty);
//        $('#Barcode').val(data.barcode);
//        $("#ItemQty").val(1);
//        $("#ItemQty").select();
//    }
//};
function errorFunction(xhr, textStatus, err) {
    var jsonResponse = JSON.parse(xhr.responseText);
    swal(jsonResponse.Message);
}


$('#printbill').click(function () {

    if ($('#received').val() == '') {
        $('#received').val('0');
    }
    //if (parseFloat($('#change').html()) < 0) {
    //    swal("Please pay total amount");
    //    return;
    //}

    if ($('#received').val() == '0') {
        swal({
            title: "Warning",
            text: 'Are you sure..!!   You are not receiving any amount against current bill.',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Print it!'
        }).then(function () {
            if (!IsEditMode) {
                SaveInvoice();
            }
            else {
                UpdateInvoice();
            }

        });
    } else {
        if (!IsEditMode) {
            SaveInvoice();
        }
        else {
            //UpdateInvoice();
        }
    }
    //}
    //else {
    //    swal({
    //        title: "Warning",
    //        text: 'Please Select Payment Method.',
    //        type: "warning"
    //        });
    //}
});

var SaveInvoice = function () {

    var SelectedCustomer = $('#Customer').val();
    var GrossBill = "0";
    var ItemsDiscount = "0";
    var BillAfterDisc = "0";
    var DiscType = "0";
    var DiscValue = "0"
    var Adjustment = "0";
    var NetBill = "0";
    var CashReceived = "0"
    var Balance = "0";
    var NetPayable = "0";
    
    //if (parseFloat($('#change').html()) < 0 ) {
    //    swal("Please pay total amount");
    //    return;
    //}


    if ($('#invno').html() == '') {
        swal("Please Refresh Screen To Generate Invoice #.");
        return;
    }
    if ($('#Customer').val() == '') {
        swal("Please Select Valid Customer.");
        return;
    }
    var check = true;

    if ($('#change').html() < 0) {
        $.ajax({
            url: "../SaleScreen/CheckCustomerIsReSaler?Id=" + $('#Customer').val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                obj = JSON.parse(data);
                if (obj != "success") {
                    swal("Please receive full payment as selected customer is not a reseller.");
                    check = false;
                }

            },
            error: function () {
                //alert("Error");
            }
        });
    }
    if (check==false) {
        return;
    }



    GrossBill = $('#lblsubtotal').html();
    ItemsDiscount = $('#lblItemsDiscount').html();
    BillAfterDisc = $('#lbllblSubTotalAfterItemsDisc').html();
    DiscType = $('#disctype').val();
    DiscValue = $('#discount').val();
    Adjustment = $('#adjust').val();
    NetBill = $('#lblTotalAfterDisc').html();
    CashReceived = $('#received').val();
    NetPayable = $('#lblTotalAfterRent').html();
    Balance = $('#change').html();
    TotalQty = $('#lbltotalqty').html();

    var count = $('#tblAppendGrid').appendGrid('getRowCount');
    if (count <= 0) {
        swal("No Item(s) found.");
        return;
    }

    for (var i = 0; i < count; i++) {
        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

        if (data.qty <= 0) {
            swal('Please provide valid quantity against barcode ' + data.barcode);
            return;
        }
    }


    var ListItemsClassObject = new Array();
    for (var i = 0; i < count; i++) {
        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

        var objItemsClass = new SaleGrid();

        objItemsClass.Barcode = data.barcode;
        objItemsClass.ItemId = data.itemId;
        objItemsClass.CategoryId = data.categoryId;
        objItemsClass.Price = data.rate;
        objItemsClass.UomId = data.uomId;
        objItemsClass.Qty = data.quantity;
        objItemsClass.Amount = data.amount;
        objItemsClass.Discount = data.discount;
        objItemsClass.AmountAfterDiscount = data.discountedamount;

        ListItemsClassObject.push(objItemsClass);
    }

    //if (CheckBalanceQty().length != 0) {

    //    swal({
    //        title: 'Insufficent Quantity',
    //        text: 'Barcode : ' + CheckBalanceQty() + ' have insufficient quantity.',
    //        width: 600,
    //        padding: 20,
    //        type: 'warning'
    //    })
    //    return;
    //}

    var serviceURL = "../SaleScreen/SaveInvoice?InvNo=" + $('#invno').html() + "&RefrenceName=" + $('#Refrence').val() + "&Customer=" + $('#Customer').val() + "&GrossBill=" + GrossBill + "&ItemsDiscount=" + ItemsDiscount + "&BillAfterDisc=" + BillAfterDisc + "&DiscType=" + DiscType + "&DiscValue=" + DiscValue + "&Adjustment=" + Adjustment + "&NetBill=" + NetBill + "&NetPayable=" + NetPayable + "&CashReceived=" + CashReceived + "&Balance=" + Balance + "&TotalQty=" + TotalQty;
    $.ajax({
        type: "POST",
        url: serviceURL,
        data: JSON.stringify(ListItemsClassObject),
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFuncSale,
        error: errorFuncSale
    });

    function successFuncSale(data, status) {
        if (data == "Not Enough Stock") {
            swal("Not Enough Stock");
            //console.log(data);
            return;
        }
        //alert(data);
        if (data != '') {

            $.ajax({
                url: "../SaleScreen/CheckCustomerIsReSaler?Id=" + $('#Customer').val(),
                type: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (Rdata) {
                    obj = JSON.parse(Rdata);
                    if (obj != "success") {
                        window.location = "../SaleScreen/Index";
                        //alert(data);
                        var url = '../ASPXPages/SaleReceipt.aspx?BillNo=' + data + '&IsPrint=1';
                        openNewWin(url);
                       
                    }
                    else {
                        window.location = "../SaleScreen/Index";

                        var url1 = '../ASPXPages/SaleRecieptForReseller.aspx?BillNo=' + data + '&IsPrint=1';
                        openNewWin(url1);
                    
                    }

                },
                error: function () {
                    alert("Error");
                }
            });

          
        }
        else {
            swal({
                title: 'ERROR',
                text: 'Refresh Sale Screen and Punch Bill Again.',
                timer: 5000
            }).then(function () {
                window.location = "../SaleScreen/Index";
            },
      // handling the promise rejection
      function (dismiss) {
          if (dismiss === 'timer') {
              window.location = "../SaleScreen/Index";
          }
      }
    )
        }
    }

    function errorFuncSale(xhr, textStatus, err) {
        var jsonResponse = JSON.parse(xhr.responseText);
        swal(jsonResponse.Message);
    }
}



function openNewWin(url) {
    var x = window.open(url, '_blank', 'width=980,height=1120,toolbar=1');
    x.focus();
}

$('#refresh').click(function () {
    window.location = '../SaleScreen/Index';
});

$('#reprint').click(function () {

    $.ajax({
        type: "POST",
        url: "../SaleScreen/GetLastBillBySameUser",
        async: false,
        success: function (data) {
            if (data != null) {

                $.ajax({
                    url: "../SaleScreen/CheckCustomerIsReSalerForReprint",
                    type: "GET",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    success: function (Rdata) {
                        obj = JSON.parse(Rdata);
                        if (obj != "success") {
                            window.location = "../SaleScreen/Index";
                            //alert(data);
                            var url = '../ASPXPages/SaleReceipt.aspx?BillNo=' + data + '&IsPrint=1';
                            openNewWin(url);

                        }
                        else {
                            window.location = "../SaleScreen/Index";

                            var url1 = '../ASPXPages/SaleRecieptForReseller.aspx?BillNo=' + data + '&IsPrint=1';
                            openNewWin(url1);

                        }

                    },
                    error: function () {
                        alert("Error");
                    }
                });






                //var url = '../ASPXPages/SaleReceipt.aspx?BillNo=' + data + '&IsPrint=1';
                //openNewWin(url);
                ////var url1 = '../ASPXPages/SaleRecieptForReseller.aspx?BillNo=' + data + '&IsPrint=1';
                ////openNewWin(url1);
            }

        }
    });
});

//making class
var CheckGrid = function () {
    this.Barcode = '0';
    this.ArticleId = '0';
    this.ColorId = '0';
    this.SizeId = '0';
    this.SellingQty = '0';
    this.AvailableQty = '0';
};

var CheckBalanceQty = function () {

    var ListItemsCheckQty = new Array();
    var status = [];
    var count = $('#tblAppendGrid').appendGrid('getRowCount');
    for (var i = 0; i < count; i++) {
        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

        var objItemsClass = new CheckGrid();

        objItemsClass.barcode = data.barcode;
        objItemsClass.itemName = data.itemName;
        objItemsClass.itemId = data.itemId;
        objItemsClass.category = data.category;
        objItemsClass.categoryId = data.categoryId;
        objItemsClass.rate = data.rate;
        objItemsClass.uom = data.uom;
        objItemsClass.uomId = data.uomId;
        objItemsClass.quantity = data.quantity;
        objItemsClass.Amount = data.amount;
        objItemsClass.DiscountPercent = data.discount;
        objItemsClass.DiscountedAmount = data.discountedamount;

        ListItemsCheckQty.push(objItemsClass);
    }

    $.ajax({
        type: "POST",
        url: "../SaleScreen/CheckBalanceQty",
        data: JSON.stringify(ListItemsCheckQty),
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != 'error') {
                for (var i = 0; i < data.length; i++) {
                    if (parseInt(data[i].AvailableQty) < parseInt(data[i].SellingQty)) {
                        status.push(data[i].Barcode);
                    }
                }
            }
        },
        error: function () {
            alert("Error!");
        }
    });
    return status;
};


var LoadPaymentMethodDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SaleScreen/LoadPaymentMethodDDL",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $("#Paymethod");
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Payment Method" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.DisplayName + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Payment Method" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

var LoadBankDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SaleScreen/LoadBankDDL",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $('#BankName');
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select Bank" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.DisplayName + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select Bank" + '</option>');
            }
            $el.trigger("liszt:updated");
            //$el.chosen();
        }
    });
}

$("#Barcode").keyup(function (e) {
    //alert(e.keyCode);
    var key = e.keyCode;
    if (key == 112) {

        $('#tblProductSearch').DataTable()
        $('#ProductSearchModal').modal('show');
    }
});


var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../SaleScreen/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblProductSearch').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];

                html += '<tr>';

                html += '<td>' + obj.Barcode + '</td>';
                html += '<td>' + obj.Article + '</td>';
                html += '<td>' + obj.Description + '</td>';
                html += '<td>' + obj.Color + '</td>';
                html += '<td>' + obj.Size + '</td>';
                html += '<td>' + obj.Quantity + '</td>';

                html += '<td>';
                html += '<button id=' + obj.Barcode + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += ' Select';
                html += ' </button>';
                html += ' </td>';

                html += '</tr>'
            }
            $("#tblbody").append(html);

            $('#tblProductSearch').DataTable().draw();
        }
    });
}

$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    $('#Barcode').val(uid);
    if ($("#Barcode").val() != '') {
        $("#ItemQty").val(1);

    };
    $('#ProductSearchModal').modal('hide');
    $("#ItemQty").select();
});

/* Bill Edit And Update Section Start */

$('#loadbill').keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        if ($("#loadbill").val() == '') {
            swal('Please Provide Valid Invoice #.');
            return;
        }
        $.ajax({
            url: "../SaleScreen/LoadBillByInvoice?InvoNo=" + $("#loadbill").val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunction,
            error: MyerrorFunction
        });
    }
});

function successFunction(data) {
    //alert(data);
    if (status != 'error') {
        $('#tblAppendGrid').appendGrid('load', data);
        LoadMainBillData();
        //IsEditMode = true;
    }
}

function MyerrorFunction(xhr, textStatus, err) {
    var jsonResponse = JSON.parse(xhr.responseText);
    swal(jsonResponse.Message);
}

LoadMainBillData = function () {
    $.ajax({
        url: "../SaleScreen/LoadBillMainByInvoice?InvoNo=" + $("#loadbill").val(),
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //alert(data);
            data = data[0];
            //console.log(data);
            $('#lblsubtotal').html(data.SubTotal);
            $('#lblItemsDiscount').html(data.ItemDiscount);
            $('#lbllblSubTotalAfterItemsDisc').html(data.TotalAfterDiscount);
            $('#adjust').val(data.Adjustment);
            $('#lblTotalAfterDisc').html(data.TotalPayable);
            $('#rent').val(data.Rent);
            $('#lblTotalAfterRent').html(data.NetPayable);
            $('#received').val(data.Received);
            $('#discount').val(data.BillDiscount);
            $('#change').html(data.Balance);
            $('#Customer').val(data.CustomerName);
            $('#Customer').attr('disabled', true);

            $('#invno').html($("#loadbill").val());

            var tqty = 0;
            var count = $('#tblAppendGrid').appendGrid('getRowCount');
            for (i = 0; i < count; i++) {
                var qty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'qty', i);
                tqty = parseInt(tqty) + parseInt(qty);
            };
            $('#lbltotalqty').html(tqty);
            // alert(tqty);
            var balance = data.Balance;
            var received = data.Received;
            var netbill = data.NetPayable;
            var cBalance = 0;
            if (data.Received == 0) {
                if (balance < 0) {
                    balance = balance * -1;
                    cBalance = balance - netbill;
                    $('#balance').html(cBalance * -1);
                }
                else {
                    cBalance = balance - netbill;
                    $('#balance').html(cBalance);
                }
            }
            else {
                cBalance = (balance) - ((received) - (netbill));
                $('#balance').html(cBalance);
            }
        },
        error: function () {
            alert("Error");
        }
    });
}

//for autocomplete invoice no.
LoadBills = function () {
    $.ajax({
        url: "../SaleScreen/LoadBills",
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#loadbill').autocomplete({
                source: JSON.parse(data),
                minLength: 0
            }).focus(function () {
                $('#loadbill').autocomplete("search", "");
            });
            $("#loadbill").attr('autocomplete', 'on');
        },
        error: function () {
            alert("Error");
        }
    });
}

LoaditemNames = function () {
    $.ajax({
        url: "../SaleScreen/LoaditemNames",
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#articleName').autocomplete({
                source: JSON.parse(data),
                minLength: 0
            }).focus(function () {
                $('#articleName').autocomplete("search", "");
            });
            $("#articleName").attr('autocomplete', 'on');
        },
        error: function () {
            alert("Error");
        }
    });
}

//Active if u want  Load barcode in barcode field like Name list shown in name field
LoadBarcodes = function () {
    $.ajax({
        url: "../SaleScreen/LoadBarcodes",
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#Barcode').autocomplete({
                source: JSON.parse(data),
                minLength: 0
            }).focus(function () {
                $('#Barcode').autocomplete("search", "");
            });
            $("#Barcode").attr('autocomplete', 'on');
        },
        error: function () {
            alert("Error");
        }
    });
}


//var UpdateInvoice = function () {

//    var SelectedCustomer = $('#Customer').val();
//    var GrossBill = "0";
//    var ItemsDiscount = "0";
//    var BillAfterDisc = "0";
//    var DiscType = "0";
//    var DiscValue = "0"
//    var Adjustment = "0";
//    var NetBill = "0";
//    var CashReceived = "0"
//    var Balance = "0";
//    var Rent = "0";
//    var NetPayable = "0";

//    if ($('#invno').html() == '') {
//        swal("Please Refresh Screen To Generate Invoice #.");
//        return;
//    }
//    if ($('#Customer').val() == '') {
//        swal("Please Select Valid Customer.");
//        return;
//    }

//    GrossBill = $('#lblsubtotal').html();
//    ItemsDiscount = $('#lblItemsDiscount').html();
//    BillAfterDisc = $('#lbllblSubTotalAfterItemsDisc').html();
//    DiscType = $('#disctype').val();
//    DiscValue = $('#discount').val();
//    Adjustment = $('#adjust').val();
//    NetBill = $('#lblTotalAfterDisc').html();
//    Rent = $('#rent').val();
//    CashReceived = $('#received').val();
//    NetPayable = $('#lblTotalAfterRent').html();
//    Balance = $('#change').html();

//    var count = $('#tblAppendGrid').appendGrid('getRowCount');
//    if (count <= 0) {
//        swal("No Item(s) found.");
//        return;
//    }

//    for (var i = 0; i < count; i++) {
//        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

//        if (data.qty <= 0) {
//            swal('Please provide valid quantity against barcode ' + data.barcode);
//            return;
//        }
//    }


//    var ListItemsClassObject = new Array();
//    for (var i = 0; i < count; i++) {
//        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

//        var objItemsClass = new SaleGrid();

//        objItemsClass.Barcode = data.barcode;
//        objItemsClass.ItemId = data.itemId;
//        objItemsClass.CategoryId = data.categoryId;
//        objItemsClass.Price = data.rate;
//        objItemsClass.UomId = data.uomId;
//        objItemsClass.Qty = data.quantity;
//        objItemsClass.Amount = data.amount;
//        objItemsClass.Discount = data.discount;
//        objItemsClass.AmountAfterDiscount = data.discountedamount;

//        ListItemsClassObject.push(objItemsClass);
//    }

//    //if (CheckBalanceQty().length != 0) {

//    //    swal({
//    //        title: 'Insufficent Quantity',
//    //        text: 'Barcode : ' + CheckBalanceQty() + ' have insufficient quantity.',
//    //        width: 600,
//    //        padding: 20,
//    //        type: 'warning'
//    //    })
//    //    return;
//    //}

//    var serviceURL = "../SaleScreen/UpdateInvoice?InvNo=" + $('#invno').html() + "&Customer=" + SelectedCustomer + "&GrossBill=" + GrossBill + "&ItemsDiscount=" + ItemsDiscount + "&BillAfterDisc=" + BillAfterDisc + "&DiscType=" + DiscType + "&DiscValue=" + DiscValue + "&Adjustment=" + Adjustment + "&NetBill=" + NetBill + "&NetPayable=" + NetPayable + "&CashReceived=" + CashReceived + "&Balance=" + Balance;
//    $.ajax({
//        type: "POST",
//        url: serviceURL,
//        data: JSON.stringify(ListItemsClassObject),
//        async: false,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: successFuncSale,
//        error: errorFuncSaleUp
//    });

//    function successFuncSale(data, status) {
//        if (data != '') {
//            var url = '../ASPXPages/SaleReceipt.aspx?BillNo=' + data + '&IsPrint=1';
//            openNewWin(url);
//            window.location = "../SaleScreen/Index";
//        }
//        else {
//            swal({
//                title: 'ERROR',
//                text: 'Refresh Sale Screen and Punch Bill Again.',
//                timer: 5000
//            }).then(function () {
//                window.location = "../SaleScreen/Index";
//            },
//      // handling the promise rejectionready
//      function (dismiss) {
//          if (dismiss === 'timer') {
//              window.location = "../SaleScreen/Index";
//          }
//      }
//    )
//        }
//    }

//    function errorFuncSaleUp(xhr, textStatus, err) {
//        var jsonResponse = JSON.parse(xhr.responseText);
//        swal(jsonResponse.Message);
//    }
//}




/* Bill Edit And Update Section End */