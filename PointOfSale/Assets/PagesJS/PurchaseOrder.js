
var IsEditMode = false;

var ResetAll = function () {
    IsEditMode = false;
    LoaditemBarode();
    $('#PurchaseOrderDate').val(SetCurrentDate());
    $('#Comments').val("");
    LoadVendorDDL();
    $('#VendorId').val("").trigger("chosen:updated");
    LoadLocationsDDL();
    $('#ShipToLoc').val("1").trigger("chosen:updated");
    GetPurchaseOrderNo();
    $("#totalcost").html('0')
    $("#totalsalerate").html('0');
    $("#totalqty").html('0');
    $("#RNo").val("");
    InitGrid();    
}

$(document).ready(function () {
    
    GetPurchaseOrderNo();
    $('#data_2 .input-group.date').datepicker({
        startView: 1,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "dd/mm/yyyy"
    });

    $('#PurchaseOrderDate').val(SetCurrentDate());
    LoadVendorDDL();
    LoadLocationsDDL();
    $('#ShipToLoc').attr('disabled', true);
    $('#ShipToLoc').val("1").trigger("chosen:updated");
    InitGrid();
    $('#tblItemPOListing').DataTable();
    LoaditemBarode();
    LoadGridData();
    LoaditemNames();
});
$("#articleName").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        $('#txtQty').val(1);
        AddToGrid1();

    }
})

LoaditemNames = function () {
    $.ajax({
        url: "../PurchaseOrderManagement/LoaditemNames",
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
LoaditemBarode = function () {
    $.ajax({
        url: "../PurchaseOrderManagement/LoaditemcBarcode",
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#txtBarcode').autocomplete({
                source: JSON.parse(data),
                minLength: 0
            }).focus(function () {
                $('#txtBarcode').autocomplete("search", "");
            });
            $("#txtBarcode").attr('autocomplete', 'on');
        },
        error: function () {
            alert("Error");
        }
    });
}



$('#btn-reset').click(function () {
    ResetAll();
});

//making class
var POGrid = function () {
    this.ItemId = '0';
    this.CaegoryId = '0';
    this.ColorId = '0';
    this.UomId = '0';
    this.Quantity = '0';
    this.Rate = '0';
    this.Expired = '0';
    this.Batch = '0';
    this.Amount = '0';
    this.SaleRate = '0';
    this.SaleAmount = '0';
    this.SubCategoryId = '0';
    this.Barcode = '0';
};

$(document).on('click', '.btn-edit', function () {
    var uid = $(this).attr('id');
    LoadPOMainSection(uid);
    LoadPODetailSection(uid);
    SetTotals();
    IsEditMode = true;
});

function LoadPOMainSection(UID) {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../PurchaseOrderManagement/EditMain?UID=" + UID,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);
                $('#UID').val(obj.UID);
                $('#PurchaseOrderNo').val(obj.PurchaseOrderNo);
                $('#PurchaseOrderDate').val(FormatDate(obj.PurchaseOrderDate));
                $('#VendorId').val(obj.VendorId).trigger("chosen:updated");
                $('#ShipToLoc').val(obj.LocationId).trigger("chosen:updated");
                $('#Comments').val(obj.Comments);
                $('#RNo').val(obj.RNo);

                if (obj.IsPosted) {
                    $('#btn-save').hide();
                    $('#btn-save-post').hide();
                }
                else if (!obj.IsPosted) {
                    $('#btn-save').show();
                    $('#btn-save-post').show();
                }

                $(window).scrollTop(0);
            }
            else {
                swal("Error", "Data Not Loaded", "error");
            }
        },
        error: function (e) {
        }
    });
}

function LoadPODetailSection(UID) {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../PurchaseOrderManagement/EditDetail?UID=" + UID,
        processData: false,
        contentType: false,
        success: function (Rdata) {
            if (Rdata != 'error') {
                var obj = JSON.parse(Rdata);

                $('#tblAppendGrid').appendGrid('load', JSON.parse(Rdata));
                SetTotals();
                $(window).scrollTop(0);
            }
            else {
                swal("Error", "Data Not Loaded", "error");
            }
        },
        error: function (e) {
        }
    });
}

function SavePO(IsPosted) {
    if ($('#PurchaseOrderNo').val() == '') {
        swal("Please Refresh Screen To Generate Purchase Order #.");
        return;
    }
    if ($('#PurchaseOrderDate').val() == '') {
        swal("Please Select Valid Purchase Order Date.");
        return;
    }
    if ($('#VendorId').val() == '') {
        swal("Please Select Vendor.");
        return;
    }

    
    if ($('#ShipToLoc').val() == '') {
        swal("Please Refresh Your Screen To Set Location.");
        return;
    }

    var count = $('#tblAppendGrid').appendGrid('getRowCount');
    if (count <= 0) {
        swal("No Item(s) found.");
        return;
    }

    for (var i = 0; i < count; i++) {
        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

        if (data.itemid == '') {
            swal('Please Provide Valid Item');
            return;
        }
      
        if (data.barcode == '') {
            swal('Please Provide Valid Barcode');
        }
        if (data.CategoryId == '') {
            swal('Please Provide Valid Category');
            return;
        }
        if (data.category == '') {
            swal('Please Provide Valid Category');
            return;
        }
        
        
        if (data.uomid == '') {
            swal('Please Provide Valid Unit Of Measure');
            return;
        }
        if (data.uom == '') {
            swal('Please Provide Valid Unit Of Measure');
            return;
        }
        if (data.qty == '') {
            swal('Please provide valid Quantity.');
            return;
        }
        if (isNaN(data.qty)) {
            swal('Please Provide Valid Quantity.');
            return;
        }
        if (data.qty <= 0) {
            swal('Please Provide Valid Quantity.');
            return;
        }

        if (data.rate == '') {
            swal('Please Provide Valid Rate.');
            return;
        }
        if (isNaN(data.rate)) {
            swal('Please Provide Valid Rate.');
            return;
        }
        if (data.rate <= 0) {
            swal('Please Provide Valid Rate.');
            return;
        }

        if (data.amount == '') {
            swal('Please provide valid Amount.');
            return;
        }
        if (isNaN(data.amount)) {
            swal('Please Provide Valid Amount.');
            return;
        }
        if (data.amount <= 0) {
            swal('Please Provide Valid Amount.');
            return;
        }
        if ((data.category == "Mobile" || data.category == "Used Mobile" || data.category == "Used mobile" || data.category == "used mobile" || data.category == "mobile" || data.category == "Mobiles" || data.category == "mobiles") && data.qty > 1) {
            swal('Only one mobile can purchase at a time With One Barcode');
            return;
        }
        //if (data.CategoryId == 1 && data.qty > 1) {
        //    swal('Only one mobile can purchase at a time');
        //    return;
        //}

        if (parseFloat(data.saleRate) < parseFloat(data.rate)) {
            swal('Sale Rate cannot be lower then Cost rate.');
            return;
        }

        if (parseFloat(data.amount) < parseFloat(data.rate)) {
            //console.log(data.amount + " | " + data.rate);
            swal('Amount cannot be less than Rate.');
            return;
        }
    }

    var ListItemsClassObject = new Array();
    for (var i = 0; i < count; i++) {
        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

        var objItemsClass = new POGrid();

        objItemsClass.ItemId = data.itemid;
        objItemsClass.CategoryId = data.CategoryId;        
        objItemsClass.UomId = data.uomid;
        objItemsClass.Quantity = data.qty;
        objItemsClass.Rate = data.rate;
        objItemsClass.SaleRate = data.saleRate;
        objItemsClass.Amount = data.amount;
        objItemsClass.SaleAmount = data.saleAmount;
        objItemsClass.Batch = data.Batch;
        objItemsClass.Expired = data.Expired;
        objItemsClass.SubCategoryId = data.SubCategoryId;
        objItemsClass.Barcode = data.barcode;

        ListItemsClassObject.push(objItemsClass);
    }

    var serviceURL = "";

    if (!IsEditMode) {
               
        serviceURL = "../PurchaseOrderManagement/AddPO?PONum=" + $('#PurchaseOrderNo').val() +"&RNo="+$('#RNo').val()+ "&PODate=" + $('#PurchaseOrderDate').val() + "&Vendor=" + $('#VendorId').val() + "&ShipToLoc=" + $('#ShipToLoc').val() + "&Comments=" + $('#Comments').val() + "&Status=" + IsPosted + "&UID=" + "0" + "&IsEdit=" + IsEditMode;
    }
    else
        serviceURL = "../PurchaseOrderManagement/AddPO?PONum=" + $('#PurchaseOrderNo').val() + "&RNo=" + $('#RNo').val() + "&PODate=" + $('#PurchaseOrderDate').val() + "&Vendor=" + $('#VendorId').val() + "&ShipToLoc=" + $('#ShipToLoc').val() + "&Comments=" + $('#Comments').val() + "&Status=" + IsPosted + "&UID=" + $('#UID').val() + "&IsEdit=" + IsEditMode;
    $.ajax({
        type: "POST",
        url: serviceURL,
        data: JSON.stringify(ListItemsClassObject),
        async: false,
        contentType: "application/json; charset=utf-8",
        success: successFunc,
        error: errorFunc
    });
    function successFunc(data) {
        if (data != 'error') {
            //console.log(data);
            swal(
                'Success',
                'Purchase Order Saved Successfully!',
                'success'
                )
            //console.log(IsEditMode);
            if (!IsEditMode) {
                $('#tblItemPOListing').DataTable().destroy();
                var obj = JSON.parse(data);
                obj = obj[0];
                html += '';
                var html = '<tr>';
                
                html += '<td class="hidden">' + obj.UID + '</td>';
                

                if (obj.PurchaseOrderNo != null) {
                    html += '<td>' + obj.PurchaseOrderNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.ReciptNo != null) {
                    html += '<td>' + obj.ReciptNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.PurchaseOrderDate != null) {
                    html += '<td>' + obj.PurchaseOrderDate.substring(0, 10) + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Vendor != null) {
                    html += '<td>' + obj.Vendor + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Comments != null) {
                    html += '<td>' + obj.Comments + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Status) {
                    html += '<td><span class="label label-success label-xs">Posted</span></td>';
                }
                else {
                    html += '<td><span class="label label-danger label-xs">Not Posted</span></td>';
                }

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += 'Edit';
                html += ' </button>';
                html += ' </td>';

                html += '</tr>'

                $("#tblbody").append(html);
                $('#tblItemPOListing').DataTable().draw();
            }
            else if (IsEditMode) {                
                var count = 0;
                var myobj = JSON.parse(data);
                $('#tblItemPOListing').DataTable().destroy();

                myobj = myobj[0];
                $('#tblItemPOListing tbody tr').each(function (i, obj) {
                    var id = $(this).closest('tr').find('td:first-child').text();
                    
                //    myobj = myobj[0];                    
                    if (id == myobj.UID) {
                        console.log(id + " | " + myobj.UID);
                        if (myobj.PurchaseOrderNo != null) {
                            $(this).closest('tr').find('td:nth-child(2)').text(myobj.PurchaseOrderNo);
                        }
                        else {
                            $(this).closest('tr').find('td:nth-child(2)').text("-");
                        }
                        if (myobj.ReciptNo != null) {
                            $(this).closest('tr').find('td:nth-child(3)').text(myobj.ReciptNo);
                        }
                        else {
                            $(this).closest('tr').find('td:nth-child(3)').text("-");
                        }
                        if (myobj.PurchaseOrderDate != null) {
                            $(this).closest('tr').find('td:nth-child(4)').text(myobj.PurchaseOrderDate.substring(0, 10));
                        }
                        else {
                            $(this).closest('tr').find('td:nth-child(4)').text("-");
                        }

                        if (myobj.Vendor!= null) {
                            $(this).closest('tr').find('td:nth-child(5)').text(myobj.Vendor);
                        }
                        else {
                            $(this).closest('tr').find('td:nth-child(5)').text("-");
                        }

                        if (myobj.Comments!= null) {
                            $(this).closest('tr').find('td:nth-child(6)').text(myobj.Comments);
                        }
                        else {
                            $(this).closest('tr').find('td:nth-child(6)').text("-");
                        }

                        if (myobj.Status) {
                            //alert(data.IsActive);
                            $(this).closest('tr').find('td:nth-child(7)').html('<td><span class="label label-success label-xs">Posted</span></td>');
                        }
                        else {
                            //alert(data.IsActive);
                            $(this).closest('tr').find('td:nth-child(7)').html('<td><span class="label label-danger label-xs">Not Posted</span></td>');
                        }
                    }
                });
                console.log(count);
                $('#tblItemPOListing').DataTable().draw();
            }
            ResetAll();

        }
    }
    function errorFunc(xhr, textStatus, err) {
        var jsonResponse = JSON.parse(xhr.responseText);
        swal(jsonResponse.Message);
    }
}

var LoadGridData = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../PurchaseOrderManagement/LoadGrid",
        processData: false,
        contentType: false,
        success: function (data) {
            data = JSON.parse(data);
            $('#tblItemPOListing').DataTable().destroy();
            var html = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                html += '<tr>';

                html += '<td class="hidden">' + obj.UID + '</td>';

                if (obj.PurchaseOrderNo != null) {
                    html += '<td>' + obj.PurchaseOrderNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.ReciptNo != null) {
                    html += '<td>' + obj.ReciptNo + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.PurchaseOrderDate != null) {
                    html += '<td>' + obj.PurchaseOrderDate.substring(0, 10) + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Vendor != null) {
                    html += '<td>' + obj.Vendor + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }

                if (obj.Comments != null) {
                    html += '<td>' + obj.Comments + '</td>';
                }
                else {
                    html += '<td>-</td>';
                }
                if (obj.Status) {
                    html += '<td><span class="label label-success label-xs">Posted</span></td>';
                }
                else {
                    html += '<td><span class="label label-danger label-xs">Not Posted</span></td>';
                }

                html += '<td>';
                html += '<button id=' + obj.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                html += '<i class="fa fa-edit"></i>';
                html += 'Edit';
                html += ' </button>';
                html += ' </td>';

                //html += '<td class="hidden">';
                //html += '<button id=' + data.UID + ' class="btn btn-warning btn-block btn-xs btn-edit">';
                //html += '<i class="fa fa-edit"></i>';
                //html += 'Edit';
                //html += ' </button>';
                //html += ' </td>';

                html += '</tr>'
            }

            $("#tblbody").append(html);
            $('#tblItemPOListing').DataTable().draw();
        }
    });
}

$('#btn-save').click(function () {
    SavePO(0);
});

$('#btn-save-post').click(function () {
    swal({
        title: 'Are you sure?',
        text: "You won't be able to make changes in POSTED Purchase Order afterwards!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Post it!'
    }).then(function () {
        
        SavePO(1);
    });

});



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

function SetExpiryDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear()+1;

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    return today
}

function FormatDate(Date) {
    var today = Date;
    var yyyy = today.substring(0, 4);
    var mm = today.substring(7, 5);
    var dd = today.substring(10, 8);
    today = mm + '/' + dd + '/' + yyyy;
    return today
}


function InitGrid() {
    $('#tblAppendGrid').appendGrid({
        caption: 'Purchasing',
        initRows: 0,
        columns: [
            {
                name: 'itemid', display: 'Item', type: 'text', ctrlCss: { width: '120px', 'text-align': 'left', 'font-size': '12px' },
                invisible: true
            },
            {
                name: 'name', display: 'Item', type: 'text', ctrlCss: { width: '120px', 'text-align': 'left', 'font-size': '12px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'barcode', display: 'Barcode', type: 'text', ctrlCss: { width: '150px', 'text-align': 'left', 'font-size': '12px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'CategoryId', display: 'Category', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '12px' },
                invisible: true
            },
            {
                name: 'category', display: 'Category', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '12px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'SubCategoryId', display: 'Sub Category', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '12px' },
                invisible: true
            },
            {
                name: 'subcategory', display: 'Sub Category', type: 'text', ctrlCss: { width: '100px', 'text-align': 'left', 'font-size': '12px' },
                ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'uomid', display: 'UOM', type: 'text', ctrlCss: { width: '50px', 'text-align': 'left', 'font-size': '12px' },
                invisible: true
            },
            {
                name: 'uom', display: 'UOM', type: 'text', ctrlCss: { width: '50px', 'text-align': 'left', 'font-size': '12px' },
                ctrlAttr: { disabled: 'disabled' }
            },           
            {
                name: 'qty', display: 'Qty', type: 'text', ctrlCss: { width: '30px', 'text-align': 'right', 'font-size': '12px' },
                onChange: function (evt, rowIndex) {

                    var qty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'qty', rowIndex);
                    var rate = $('#tblAppendGrid').appendGrid('getCtrlValue', 'rate', rowIndex);
                    var amount = $('#tblAppendGrid').appendGrid('getCtrlValue', 'saleRate', rowIndex);
                    if (!isNaN(qty)) {
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', rowIndex, Math.round(qty * rate));
                        SetTotals();
                    }
                    else {
                        sweetAlert("Invalid Value for Quantity. Provide Correct Value", "", "error");
                    }
                    if (!isNaN(qty)) {
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'saleAmount', rowIndex, Math.round(qty * amount));
                        SetTotals();
                    }
                    else {
                        sweetAlert("Invalid Value for Quantity. Provide Correct Value", "", "error");
                    }

                }
            },
            {
                name: 'rate', display: 'Cost Rate', type: 'text', ctrlCss: { width: '80px', 'text-align': 'right', 'font-size': '12px' },
                onChange: function (evt, rowIndex) {

                    var qty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'qty', rowIndex);
                    var rate = $('#tblAppendGrid').appendGrid('getCtrlValue', 'rate', rowIndex);                    
                    if (!isNaN(qty) && !isNaN(rate)) {
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', rowIndex, Math.round(qty * rate));
                        SetTotals();
                    }
                    else {
                        sweetAlert("Invalid Value for Rate. Provide Correct Value", "", "error");
                    }                    
                }
            },
            {
                name: 'saleRate', display: 'Sale Rate', type: 'text', ctrlCss: { width: '90px', 'text-align': 'right', 'font-size': '12px' },
                onChange: function (evt, rowIndex) {

                    var qty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'qty', rowIndex);
                    var saleRate = $('#tblAppendGrid').appendGrid('getCtrlValue', 'saleRate', rowIndex);
                    if (!isNaN(qty) && !isNaN(saleRate)) {
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'saleAmount', rowIndex, Math.round(qty * saleRate));
                        SetTotals();
                    }
                    else {
                        sweetAlert("Invalid Value for sale Rate. Provide Correct Value", "", "error");
                    }
                }
            },
            {
                name: 'amount', display: 'Cost Amount', type: 'text', ctrlCss: { width: '100px', 'text-align': 'right', 'font-size': '12px' }, ctrlAttr: { disabled: 'disabled' }
            },
            {
                name: 'saleAmount', display: 'Sale Amount', type: 'text', ctrlCss: { width: '100px', 'text-align': 'right', 'font-size': '12px' }, ctrlAttr: { disabled: 'disabled' }
            },
             {
                 name: 'Expired', display: 'Expired', type: 'ui-datepicker', ctrlCss: { width: '80px', 'text-align': 'left', 'font-size': '12px' },
                 ctrlAttr: { value: SetExpiryDate(), disabled: 'disabled' }, uiOption: { dateFormate: 'dd/mm/yyyy' }, invisible: true
                 

             },
            {
                name: 'Batch', display: 'Batch#', type: 'input', ctrlCss: { width: '60px', 'text-align': 'left', 'font-size': '12px' },
                ctrlAttr: { disabled: 'disabled' },invisible:true

            },
        ],
        afterRowRemoved: function () {
            SetTotals();
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

function handleChange(evt, rowIndex) {

    var ItemName = $('#tblAppendGrid').appendGrid('getCtrlValue', 'name', rowIndex);
    $('#tblAppendGrid').appendGrid('setCtrlValue', 'CategoryId', rowIndex, LoadCategoryById(ItemName));
    $('#tblAppendGrid').appendGrid('setCtrlValue', 'colorid', rowIndex, LoadColorById(ItemName));
    $('#tblAppendGrid').appendGrid('setCtrlValue', 'uom', rowIndex, LoadUomById(ItemName));

    var elem = $('#tblAppendGrid').appendGrid('getCellCtrl', 'qty', rowIndex);
    elem.value = "1";
    elem.focus();
    elem.select();
}

function LoadCategoryById(ItemName) {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/LoadCategoryById?Id=" + ItemName,
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadColorById(ItemName) {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/LoadColorById?Id=" + ItemName,
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadUomById(ItemName) {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/LoadUomById?Id=" + ItemName,
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadItemDDL() {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/LoadItems",
        success: function (data) {
            Rdate = data


        }
    });
    return Rdate;
}

function LoadTypeDDL() {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/LoadCategories",
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadColorDDL() {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/LoadColor",
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadUOMDDL() {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/LoadUOM",
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}


//function createOption(value, text) {
//    var option = document.createElement('option');
//    option.text = text;
//    option.value = value;
//    return option;
//}

var GetPurchaseOrderNo = function () {

    $.ajax({
        type: "POST",
        async: false,
        url: "../PurchaseOrderManagement/GetPurchaseOrderNo",
        success: function (data) {
            $('#PurchaseOrderNo').removeAttr('disabled');
            $('#PurchaseOrderNo').val(data);
            $('#PurchaseOrderNo').attr('disabled', true);
        }
    });
}

var LoadVendorDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        url: "../PurchaseOrderManagement/LoadVendor",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);

            var $el = $("#VendorId");
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

var LoadLocationsDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: "../PurchaseOrderManagement/LoadLocation",
        processData: false,
        contentType: false,
        success: function (data) {
            var sch = JSON.parse(data);
            var $el = $("#ShipToLoc");
            $el.empty();
            if (sch.length > 0) {
                $el.append('<option value="">' + "Select" + '</option>');
                $.each(sch, function (idx, obj) {
                    $el.append('<option value="' + obj.Id + '">' + obj.Name + '</option>');
                });
            }
            else {
                $el.append('<option value="">' + "Select" + '</option>');
            }
            $el.trigger("liszt:updated");
            $el.chosen();
        }
    });
}

//Usman Modifications 18-08-2017
$("#txtBarcode").keyup(function (e) {
    var key = e.keyCode;
    if (key == 13) {
        if ($("#txtBarcode").val() != '') {
            $.ajax({
                url: "../PurchaseOrderManagement/ProductDetailsByBarcode?Barcode=" + $("#txtBarcode").val(),
                type: "GET",
                async: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data != "") {                        
                        var obj = data[0];
                        //alert(obj.Name);
                        $("#txtItemName").val(obj.Name);
                        $('#txtItemName').attr('disabled', true);
                        $('#txtQty').val(1);
                        AddToGrid();
                    }
                    else {
                        swal("No Data Found.");
                        $("#txtBarCode").val("");
                        return;
                    }
                },
                error: function () {
                    alert("Error");
                }
            });
        }
    }
});
function AddToGrid1() {
    $.ajax({
        url: "../PurchaseOrderManagement/GetProductDetailsByBarcodeByName?Barcode=" + $("#articleName").val(),
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
           
            if (data != "") {
                var obj = data[0];
                //Add NEW ROW & data
                var rowIndex = 0;
                //alert(rowIndex);
                var count = $('#tblAppendGrid').appendGrid('getRowCount');
                //alert(count);
                rowIndex = count - 1;
                //alert(rowIndex);
                if ((parseInt(rowIndex) + 1) == count) {

                    var newindex = (parseInt(rowIndex) + 1);
                    //alert(newindex);
                    var elem = $('#tblAppendGrid').appendGrid('insertRow', 1, newindex);

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'itemid', newindex, obj.ItemId);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'name', newindex, obj.Name);

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, obj.Barcode);

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'CategoryId', newindex, obj.CategoryId);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, obj.CategoryName);

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'SubCategoryId', newindex, obj.SubCategoryId);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'subcategory', newindex, obj.SubCategoryName);

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'uomid', newindex, obj.UomId);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, obj.UOMName);

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'qty', newindex, $('#txtQty').val());

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, obj.CostPrice);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'saleRate', newindex, obj.SalePrice);

                    var ctamount = parseInt($('#txtQty').val()) * parseInt(obj.CostPrice);
                    var stamount = parseInt($('#txtQty').val()) * parseInt(obj.SalePrice);

                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, ctamount);
                    $('#tblAppendGrid').appendGrid('setCtrlValue', 'saleAmount', newindex, stamount);
                    SetTotals();
                    ShowGrid();
                }

                //reset area
                $('#txtBarcode').val('');
                //$('#txtItemName').val('');
                $('#txtQty').val('');
                //$('#txtBarcode').focus();
            }
            else {
                swal("No Data Found.");
            }
        },
        error: function () {
            alert("Error");
        }
    });
}
function AddToGrid() {
        $.ajax({
            url: "../PurchaseOrderManagement/GetProductDetailsByBarcode?Barcode=" + $("#txtBarcode").val(),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != "") {
                    var obj = data[0];
                    //Add NEW ROW & data
                    var rowIndex = 0;
                    //alert(rowIndex);
                    var count = $('#tblAppendGrid').appendGrid('getRowCount');
                    //alert(count);
                    rowIndex = count - 1;
                    //alert(rowIndex);
                    if ((parseInt(rowIndex) + 1) == count) {

                        var newindex = (parseInt(rowIndex) + 1);
                        //alert(newindex);
                        var elem = $('#tblAppendGrid').appendGrid('insertRow', 1, newindex);

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'itemid', newindex, obj.ItemId);
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'name', newindex, obj.Name);

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'barcode', newindex, obj.Barcode);

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'CategoryId', newindex, obj.CategoryId);
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'category', newindex, obj.CategoryName);

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'SubCategoryId', newindex, obj.SubCategoryId);
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'subcategory', newindex, obj.SubCategoryName);

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'uomid', newindex, obj.UomId);
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'uom', newindex, obj.UOMName);

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'qty', newindex, $('#txtQty').val());

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'rate', newindex, obj.CostPrice);
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'saleRate', newindex, obj.SalePrice);

                        var ctamount = parseInt($('#txtQty').val()) * parseInt(obj.CostPrice);
                        var stamount = parseInt($('#txtQty').val()) * parseInt(obj.SalePrice);

                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'amount', newindex, ctamount);
                        $('#tblAppendGrid').appendGrid('setCtrlValue', 'saleAmount', newindex, stamount);
                        SetTotals();
                        ShowGrid();
                    }
                    
                    //reset area
                    $('#txtBarcode').val('');
                    $('#txtItemName').val('');
                    $('#txtQty').val('');
                    $('#txtBarcode').focus();
                }
                else {
                    swal("No Data Found.");
                }
            },
            error: function () {
                alert("Error");
            }
        });
}
function SetTotals() {
    var count = $('#tblAppendGrid').appendGrid('getRowCount');
    var totalqty = "0";
    var totalsale = "0";
    var totalcoast = "0";
    var bal = "0";
    var Qty = "0";
    var cost = "0";
    if (count > 0) {
        for (i = 0; i < count; i++) {

            // Set Total Qty
            var TotalQty = $('#tblAppendGrid').appendGrid('getCtrlValue', 'qty', i);
            if (!isNaN(TotalQty)) {
                totalqty = parseInt(totalqty) + parseInt(TotalQty);
            }

            // alert(totalqty);
            $("#totalqty").html(totalqty);
            // Sub Total 
            var totalsale = $('#tblAppendGrid').appendGrid('getCtrlValue', 'saleAmount', i);
            if (!isNaN(totalsale)) {
                bal = parseInt(bal) + parseInt(totalsale);
            }
            $("#totalsalerate").html(bal);
            // Items Discount
            var Costrate = $('#tblAppendGrid').appendGrid('getCtrlValue', 'amount', i);
            if (!isNaN(Costrate)) {
                cost = parseInt(cost) + parseInt(Costrate);
            }
            $("#totalcost").html(cost);


        }
    }

}
function ShowGrid() {
    var countagain = $('#tblAppendGrid').appendGrid('getRowCount')

    if (parseInt(countagain) >= 1) {
        $("#divgrid").css('opacity', 1);
    }
}
