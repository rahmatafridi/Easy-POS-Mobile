var IsEditMode = false;

$(document).ready(function () {
    rInitGrid();
});





function rInitGrid() {
    $('#rtblAppendGrid').appendGrid({
        initRows: 0,
        columns: [
               {
                   name: 'SaleDetailId', display: 'SaleDetailId', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '10px' },
                   invisible: true,
               },
               {
                   name: 'SmId', display: 'SmId', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '10px' },
                   invisible: true,
               },
               {
                   name: 'InvoiceNo', display: 'PO#', type: 'text', ctrlCss: { width: '75px', 'text-align': 'left', 'font-size': '10px' },
                   ctrlAttr: { disabled: 'disabled' }
               },
            {
                name: 'barcode', display: 'Barcode', type: 'text', ctrlCss: { width: '70px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'itemId', display: 'Item ID', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }, invisible: true,
            },
            {
                name: 'itemName', display: 'Item Name', type: 'text', ctrlCss: { width: '80px', 'text-align': 'left', 'font-size': '10px' },
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
                name: 'uom', display: 'UOM', type: 'text', ctrlCss: { width: '65px', 'text-align': 'left', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            
            {
                name: 'quantity', display: 'Quantity', type: 'text', ctrlCss: { width: '55px', 'text-align': 'right', 'font-size': '10px' },
                onChange: function (evt, rowIndex) {

                    var qty = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'quantity', rowIndex);
                    var rate = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'rate', rowIndex); // Sale Rate

                    if (!isNaN(qty)) {
                        $('#rtblAppendGrid').appendGrid('setCtrlValue', 'amount', rowIndex, Math.round(qty * rate));

                        //rItemWiseDiscountCalculation(rowIndex);
                        rSetBillTotals();
                    }
                    else {
                        sweetAlert("Invalid Value for Quantity. Provide Correct Value", "", "error");
                    }
                }
            },
            {
                name: 'rate', display: 'Rate', type: 'text', ctrlCss: { width: '60px', 'text-align': 'right', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'amount', display: 'Amount', type: 'text', ctrlCss: { width: '60px', 'text-align': 'right', 'font-size': '10px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            
        ],
        afterRowRemoved: function (caller, rowIndex) {
            rSetBillTotals();
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


function errorFunc(xhr, textStatus, err) {
    var jsonResponse = JSON.parse(xhr.responseText);
    swal(jsonResponse.Message);
}

function rItemWiseDiscountCalculation(rowIndex) {
    var elem = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'discount', rowIndex);
    var TotalAmount = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'rate', rowIndex);
    var tqty = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'quantity', rowIndex);
    var DiscountedAmount = (TotalAmount - elem) * tqty;





    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'discountedamount', rowIndex, DiscountedAmount);


}

//total 
function rSetBillTotals() {
    var count = $('#rtblAppendGrid').appendGrid('getRowCount');
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
            var TotalQty = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'quantity', i);
            if (!isNaN(TotalQty)) {
                Qty = parseInt(Qty) + parseInt(TotalQty);
            }
            $("#rlbltotalqty").html(Qty);
            // Sub Total 
            var totalsale = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'amount', i);
            if (!isNaN(totalsale)) {
                GrandSale = parseInt(GrandSale) + parseInt(totalsale);
            }
            $("#rlblsubtotal").html(GrandSale);
            $("#rlblTotalAfterDisc").html(GrandSale);

        }
    }
    else {
        $("#rlblsubtotal").html("0");
        $("#rlbllblSubTotalAfterItemsDisc").html(0);
        $('#rlblTotalAfterDisc').html(0);
        $("#rreceived").val('0');

        $('#rchange').html(0);
        $('#rlbltotalqty').html(0);
        $('#rrent').val(0);
        $('#rlblTotalAfterRent').html(0);
    }
}


//for rent value
$("#rrent").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});


$("#rdiscount").blur(function () {
    if ($('#rdiscount').val() == '') {
        $('#rdiscount').val('0');
    }
    rSetBillTotals();
});



$("#rdiscount").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        if ($('#rdiscount').val() == '') {
            $('#rdiscount').val('0');
        }
        rSetBillTotals();
    }
});

$("#rdiscount").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});

$("#radjust").blur(function () {
    if ($('#radjust').val() == '') {
        $('#radjust').val('0');
    }
    rSetBillTotals();
    //alert('blur');
});

$("#radjust").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        if ($('#radjust').val() == '') {
            $('#radjust').val('0');
        }
        rSetBillTotals();
        //alert('enter');
    }
});

$("#radjust").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});



$("#rreceived").keyup(function (e) {
    var key = e.keyCode;
    var TotalDue = "0";
    if (key == 13) {
        if ($(this).val() != '') {

            //check
            TotalPayable = parseFloat($("#rlblTotalAfterDisc").text())
            TotalDue = (parseFloat($('#rreceived').val()) - TotalPayable)
            $("#rlblTotalAfterRent").html(TotalPayable);
            $("#rchange").html(TotalDue);
        }
    }
});


$("#rreceived").blur(function () {
    if ($('#rreceived').val() == '') {
        $('#rreceived').val('0');
    }

    var TotalDue = "0";
    TotalPayable = parseFloat($("#rlblTotalAfterDisc").text())
    TotalDue = (parseFloat($('#rreceived').val()) - TotalPayable)
    $("#rlblTotalAfterRent").html(TotalPayable);
    $("#rchange").html(TotalDue);
    //if (parseFloat($('#rchange').html()) < 0) {
    //    swal("Please pay total amount");
    //    return;
    //}
    //rSetBillTotals();
});

$("#rrent").keyup(function (e) {
    var key = e.keyCode;
    var TotalDue = "0";
    if (key == 13) {
        if ($(this).val() != '') {
            TotalDue = (parseFloat($('#balance').html()) - parseFloat($("#rlblTotalAfterDisc").text())) - (parseFloat($(this).val()) - parseFloat($("#rreceived").val()));
            //checking
            TotalPayable = parseFloat($("#rlblTotalAfterDisc").text()) + parseFloat($("#rrent").val())
            $("#rlblTotalAfterRent").html(TotalPayable);

            $("#rchange").html(TotalDue);
        }
    }
});

$("#rrent").blur(function () {
    if ($('#rrent').val() == '') {
        $('#rrent').val('0');
    }
    rSetBillTotals();
});


$("#rreceived").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        return false;
    }
});

//// for balance




//making class
var rSaleGrid = function () {
    this.SmId = '0';
    this.Id = '0';
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
function errorFunction(xhr, textStatus, err) {
    var jsonResponse = JSON.parse(xhr.responseText);
    swal(jsonResponse.Message);
}




$('#rprintbill').click(function () {
    rSaveInvoice();

});




var rSaveInvoice = function () {

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

    var rcount = $('#rtblAppendGrid').appendGrid('getRowCount');
    if (rcount<1) {
        swal("Please add items to refund");
        return;
    }
    


    GrossBill = $('#rlblsubtotal').html();
    //ItemsDiscount = $('#rlblItemsDiscount').html();
    BillAfterDisc = $('#rlbllblSubTotalAfterItemsDisc').html();
    //DiscType = $('#rdisctype').val();
    //DiscValue = $('#rdiscount').val();
    //Adjustment = $('#radjust').val();
    NetBill = $('#rlblTotalAfterDisc').html();
    //CashReceived = $('#rreceived').val();
    NetPayable = $('#rlblTotalAfterRent').html();
    //Balance = $('#rchange').html();
    TotalQty = $('#rlbltotalqty').html();

    var count = $('#rtblAppendGrid').appendGrid('getRowCount');
    if (count <= 0) {
        swal("No Item(s) found.");
        return;
    }

    for (var i = 0; i < count; i++) {
        var data = $('#rtblAppendGrid').appendGrid('getRowValue', i);

        if (data.quantity <= 0) {
            swal('Please provide valid quantity against barcode ' + data.barcode);
            return;
        }
    }


    var ListItemsClassObject = new Array();
    for (var i = 0; i < count; i++) {
        var data = $('#rtblAppendGrid').appendGrid('getRowValue', i);
        var objItemsClass = new rSaleGrid();
        objItemsClass.SmId = data.SmId;
        objItemsClass.Id = data.SaleDetailId;
        objItemsClass.Barcode = data.barcode;
        objItemsClass.ItemId = data.itemId;
        objItemsClass.CategoryId = data.categoryId;
        objItemsClass.Price = data.rate;
        objItemsClass.UomId = data.uomId;
        objItemsClass.Qty = data.quantity;
        objItemsClass.Amount = data.amount;

        ListItemsClassObject.push(objItemsClass);
    }
    
    var serviceURL = "../PurchaseOrderManagement/VendorRefund?GrossBill=" + GrossBill + "&VendorId=" + $('#rCustomerId').val() + "&TotalQty=" + TotalQty + "&Reference=" + $('#rRefrence').val();
    $.ajax({
        type: "POST",
        url: serviceURL,
        data: JSON.stringify(ListItemsClassObject),
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFuncSale,
        error: rErrorFuncSale
    });

    function successFuncSale(data, status) {

        if (data == 'NotValidQty') {

            swal("warning", "Not enough quantity availabale! ", "warning")

            return;
        }



        if (data == 'AlreadyReturned') {

            swal("warning", "Invoice stock already returned! ", "warning")

            return;
        }

        if (data == 'InvalidInvoice') {
            swal("warning", "Invalid Invoice number! ", "warning")
            return;
        }

        if (data == 'CustomerNotFound') {
            swal("warning", "Customer Not Found! ", "warning")
            return;
        }

        if (data != 'error') {
            window.location = "../PurchaseOrderManagement/VendorReversalIndex";
            var url = '../ASPXPages/PoReturnInvoice.aspx?BillNo=' + data + '&IsPrint=1';
            openNewWin(url);
            swal("success", "Purchase Order Return Successfully!", "success")
        }

    }

    function rErrorFuncSale(xhr, textStatus, err) {
        console.log(xhr.responseText)
        //var jsonResponse = JSON.parse(xhr.responseText);
        //swal(jsonResponse.Message);
    }
}



function openNewWin(url) {
    var x = window.open(url, '_blank', 'width=980,height=1120,toolbar=1');
    x.focus();
}

$('#refresh').click(function () {
    window.location = '../PurchaseOrderManagement/VendorReversalIndex';
});


//making class
var rCheckGrid = function () {
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
    var count = $('#rtblAppendGrid').appendGrid('getRowCount');
    for (var i = 0; i < count; i++) {
        var data = $('#rtblAppendGrid').appendGrid('getRowValue', i);

        var objItemsClass = new rCheckGrid();

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
        url: "../PurchaseOrderManagement/CheckBalanceQty",
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


LoadInvoices = function () {
    $.ajax({
        url: "../PurchaseOrderManagement/LoadInvoices",
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#rInvoiceNumber').autocomplete({
                source: JSON.parse(data),
                minLength: 0
            }).focus(function () {
                $('#rInvoiceNumber').autocomplete("search", "");
            });
            $("#rInvoiceNumber").attr('autocomplete', 'on');
        },
        error: function () {
            alert("Error");
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

$('#rInvoiceAgainstBarcode').keyup(function (e) {

    var key = e.keyCode;
    if (key == 13) {
        if ($("#rScanBarcode").val() == '') {
            swal('Please Scan Barcode');
            return;
        }
        if ($("#rInvoiceAgainstBarcode").val() == '') {
            swal('Please Enter Invoice #');
            return;
        }

        $('.InvoicesLoad').hide();

        $.ajax({
            url: "../PurchaseOrderManagement/LoadCustomerInfoByInvoiceNo?InvoiceNo=" + $("#rInvoiceAgainstBarcode").val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LoadCustomerInfoByInvoiceNo,
            error: MyerrorFunction
        });
    }
});




function LoadCustomerInfoByInvoiceNo(data) {

    var count = $('#rtblAppendGrid').appendGrid('getRowCount');
    if (count > 0 && data.Name != $('#rPreOrCurrentCustomer').text()) {
        swal("warning", $('#rPreOrCurrentCustomer').text() + " not buy this Item! ", "warning")
        return;
    }



    if (data != 'error') {
        $('#rRefDivModel').show();

        $('#rPreOrCurrentCustomer').text(data.Name);

        $('#rCustomerId').val(data.Id);
        $('#rCustomerName').text('Vendor : ' + data.Name);
        
        $('#rCustomerBalance').text('Balance : ' + data.Balance);

    }
    else {
        $('#rRefDivModel').hide();
    }

    $.ajax({
        url: "../PurchaseOrderManagement/LoadItemByBarcodeAndInvoiceNo?ScanBarcode=" + $("#rScanBarcode").val() + "&InvoiceNo=" + $("#rInvoiceAgainstBarcode").val(),
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: LoadItemByBarcodeAndInvoiceNo,
        error: MyerrorFunction
    });




}


function LoadItemByBarcodeAndInvoiceNo(data) {
    if (data != 'error') {
        //$('#rtblAppendGrid').appendGrid('load', data);

        if (data == 'InvalidBarcode') {
            swal("warning", "Invalid Barcode! ", "warning")
            return;
        }

        if (data == 'AlreadyReversal') {
            swal("warning", "Item Already Refund! ", "warning")
            return;
        }

        if (data == 'NotSaleEver') {
            swal("warning", "Item Not Sale Ever! ", "warning")
            return;
        }
        if (data == 'InvalidInvoiceNo') {
            swal("warning", "Item Not Sale Ever! ", "warning")
            return;
        }



        // Checking If Barcode Already Exist Then Add Qty Only        
        var count = $('#rtblAppendGrid').appendGrid('getRowCount');
        var RowCount = 0;
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var Rdata = $('#rtblAppendGrid').appendGrid('getRowValue', i);
                if (Rdata.barcode == data[0].barcode) {

                    swal("warning", " Item already exist! ", "warning")

                }
                else {
                    RowCount += 1;
                }
            }

            if (RowCount == count) {
                //Add NEW ROW & data
                var rowIndex = 0;
                var count = $('#rtblAppendGrid').appendGrid('getRowCount');
                rowIndex = count - 1;
                if ((parseInt(rowIndex) + 1) == count) {

                    var newindex = (parseInt(rowIndex) + 1);

                    var elem = $('#rtblAppendGrid').appendGrid('insertRow', 1, newindex);
                    //console.log(data[0].availQty);
                    //console.log("good");
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'InvoiceNo', newindex, data[0].InvoiceNo);

                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SaleDetailId', newindex, data[0].SaleDetailId);
                    
                    
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SmId', newindex, data[0].SmId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, data[0].barcode);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemName', newindex, data[0].itemName);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemId', newindex, data[0].itemId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, data[0].category);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, data[0].uom);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uomId', newindex, data[0].uomId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'categoryId', newindex, data[0].categoryId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'quantity', newindex, data[0].quantity);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, data[0].rate);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, parseInt(data[0].rate) * parseInt(data[0].quantity));


                    //ItemWiseDiscountCalculation(newindex);
                }

                rSetBillTotals();
            }
        }
        else {
            //Add NEW ROW & data
            var rowIndex = 0;
            var count = $('#rtblAppendGrid').appendGrid('getRowCount');
            rowIndex = count - 1;
            if ((parseInt(rowIndex) + 1) == count) {

                var newindex = (parseInt(rowIndex) + 1);
                var elem = $('#rtblAppendGrid').appendGrid('insertRow', 1, newindex);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'InvoiceNo', newindex, data[0].InvoiceNo);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SmId', newindex, data[0].SmId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SaleDetailId', newindex, data[0].SaleDetailId);

                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, data[0].barcode);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemName', newindex, data[0].itemName);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemId', newindex, data[0].itemId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, data[0].category);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, data[0].uom);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uomId', newindex, data[0].uomId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'categoryId', newindex, data[0].categoryId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'quantity', newindex, data[0].quantity);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, data[0].rate);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, parseInt(data[0].rate) * parseInt(data[0].quantity));


                //ItemWiseDiscountCalculation(newindex);
            }

            $('#rItemQty').val('');

            rSetBillTotals();
        }

        //rLoadMainBillData();
        rSetBillTotals();
        //IsEditMode = true;
    }
    $('#rInvoiceAgainstBarcode').val('');
    $('#rScanBarcode').val('');
    $('#rScanBarcode').focus();
}









$('#rScanBarcode').keyup(function (e) {

    var key = e.keyCode;
    if (key == 13) {
        if ($("#rScanBarcode").val() == '') {
            swal('Please Scan Barcode');
            return;
        }

        $.ajax({
            url: "../PurchaseOrderManagement/CheckItemCategoryIsMobile?ScanBarcode=" + $("#rScanBarcode").val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: CategoryMobileOrOther,
            error: MyerrorFunctionss
        });

    }
});

function CategoryMobileOrOther(data) {

    if (data == 'InvalidBarcode') {
        swal("warning", "Invalid Barcode! ", "warning")
        return;
    }

    if (data == 'AlreadyReversal') {
        swal("warning", "Item Already Refund! ", "warning")
        return;
    }

    if (data == 'NotSaleEver') {
        swal("warning", "Item Not Sale Ever! ", "warning")
        return;
    }


    if (data == 'Mobile' || data == 'Used Mobile') {

        $('.InvoicesLoad').hide();

        $.ajax({
            url: "../PurchaseOrderManagement/LoadCustomerByMobileBarcode?MobileBarcode=" + $("#rScanBarcode").val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LoadCustomerByMobileBarcode,
            error: MyerrorFunction
        });


    }
    else {
        
        $('.InvoicesLoad').show();
        $('#rInvoiceAgainstBarcode').val('');
        $('#rInvoiceAgainstBarcode').focus();


        $.ajax({
            url: "../PurchaseOrderManagement/LoadInvoicesAgainstBarcode?ScanBarcode=" + $("#rScanBarcode").val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: LoadInvoicesAgainstBarcode,
            error: MyerrorFunction
        });

    }

}

function LoadInvoicesAgainstBarcode(data) {
    $('#rInvoiceAgainstBarcode').autocomplete({
        source: data,
        minLength: 0
    }).focus(function () {
        $('#rInvoiceAgainstBarcode').autocomplete("search", "");
    });
    $("#rInvoiceAgainstBarcode").attr('autocomplete', 'on');
}




function LoadCustomerByMobileBarcode(data) {

    var count = $('#rtblAppendGrid').appendGrid('getRowCount');
    if (count > 0 && data.Name != $('#rPreOrCurrentCustomer').text()) {
        swal("warning", $('#rPreOrCurrentCustomer').text() + " not Suply this Item! ", "warning")
        return;
    }



    if (data != 'error') {
        $('#rRefDivModel').show();

        $('#rPreOrCurrentCustomer').text(data.Name);

        $('#rCustomerId').val(data.Id);
        $('#rCustomerName').text('Vendor : ' + data.Name);
        
        $('#rCustomerBalance').text('Balance : ' + data.Balance);

    }
    else {
        $('#rRefDivModel').hide();
    }


    $.ajax({
        url: "../PurchaseOrderManagement/LoadSaleDetailDataForMobile?ScanBarcode=" + $("#rScanBarcode").val(),
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: LoadSaleDetailDataForMobile,
        error: MyerrorFunction
    });



}


function LoadSaleDetailDataForMobile(data) {
    if (data != 'error') {
        //$('#rtblAppendGrid').appendGrid('load', data);




        // Checking If Barcode Already Exist Then Add Qty Only        
        var count = $('#rtblAppendGrid').appendGrid('getRowCount');
        var RowCount = 0;
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var Rdata = $('#rtblAppendGrid').appendGrid('getRowValue', i);
                if (Rdata.barcode == data[0].barcode) {

                    swal("warning", " Item already exist! ", "warning")

                }
                else {
                    RowCount += 1;
                }
            }

            if (RowCount == count) {
                //Add NEW ROW & data
                var rowIndex = 0;
                var count = $('#rtblAppendGrid').appendGrid('getRowCount');
                rowIndex = count - 1;
                if ((parseInt(rowIndex) + 1) == count) {

                    var newindex = (parseInt(rowIndex) + 1);

                    var elem = $('#rtblAppendGrid').appendGrid('insertRow', 1, newindex);
                    //console.log(data[0].availQty);
                    //console.log("good");
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'InvoiceNo', newindex, data[0].InvoiceNo);
                    
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SaleDetailId', newindex, data[0].SaleDetailId);

                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SmId', newindex, data[0].SmId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, data[0].barcode);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemName', newindex, data[0].itemName);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemId', newindex, data[0].itemId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, data[0].category);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, data[0].uom);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uomId', newindex, data[0].uomId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'categoryId', newindex, data[0].categoryId);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'quantity', newindex, data[0].quantity);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, data[0].rate);
                    $('#rtblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, parseInt(data[0].rate) * parseInt(data[0].quantity));


                    //ItemWiseDiscountCalculation(newindex);
                }

                rSetBillTotals();
            }
        }
        else {
            //Add NEW ROW & data
            var rowIndex = 0;
            var count = $('#rtblAppendGrid').appendGrid('getRowCount');
            rowIndex = count - 1;
            if ((parseInt(rowIndex) + 1) == count) {

                var newindex = (parseInt(rowIndex) + 1);
                var elem = $('#rtblAppendGrid').appendGrid('insertRow', 1, newindex);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'InvoiceNo', newindex, data[0].InvoiceNo);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SmId', newindex, data[0].SmId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'SaleDetailId', newindex, data[0].SaleDetailId);

                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, data[0].barcode);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemName', newindex, data[0].itemName);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'itemId', newindex, data[0].itemId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, data[0].category);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, data[0].uom);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'uomId', newindex, data[0].uomId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'categoryId', newindex, data[0].categoryId);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'quantity', newindex, data[0].quantity);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, data[0].rate);
                $('#rtblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, parseInt(data[0].rate) * parseInt(data[0].quantity));


                //rItemWiseDiscountCalculation(newindex);
            }

            $('#rItemQty').val('');

            rSetBillTotals();
        }

        //rLoadMainBillData();
        rSetBillTotals();
        //IsEditMode = true;
    }

    $('#rInvoiceAgainstBarcode').val('');
    $('#rScanBarcode').val('');
    $('#rScanBarcode').focus();
}




//function successFunction(data) {
//    if (data != 'error') {
//        $('#rtblAppendGrid').appendGrid('load', data);
//        rLoadMainBillData();
//        rSetBillTotals();
//        IsEditMode = true;
//    }
//}

function MyerrorFunctionss(xhr, textStatus, err) {
    var jsonResponse = xhr.responseText;
    alert(jsonResponse.Message);
}

function MyerrorFunction(xhr, textStatus, err) {
    var jsonResponse = xhr.responseText;
    alert(jsonResponse.Message);
}

rLoadMainBillData = function () {
    $.ajax({
        url: "../PurchaseOrderManagement/LoadMainBillByInvoice?InvoNo=" + $("#rInvoiceNumber").val(),
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //alert(data);

            console.log(data);
            $('#rlblsubtotal').html(data.SubTotal);
            $('#rlblItemsDiscount').html(data.ItemDiscount);
            $('#rlbllblSubTotalAfterItemsDisc').html(data.TotalAfterDiscount);
            $('#rlblTotalAfterDisc').html(data.NetTotal);
            //$('#rrent').val(data.Rent);
            //$('#rlblTotalAfterRent').html(data.NetPayable);
            $('#rreceived').val(data.Recieved);


            //$('#rdiscount').val(data.BillDiscount);
            //$('#rchange').html(data.Change);
            //$('#radjust').val(data.Adjustment);

            //$('#rdisctype').val(data.BillDiscountType);

            var tqty = 0;
            var count = $('#rtblAppendGrid').appendGrid('getRowCount');
            for (i = 0; i < count; i++) {
                var qty = $('#rtblAppendGrid').appendGrid('getCtrlValue', 'quantity', i);
                tqty = parseInt(tqty) + parseInt(qty);
            };
            $('#rlbltotalqty').html(tqty);
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



