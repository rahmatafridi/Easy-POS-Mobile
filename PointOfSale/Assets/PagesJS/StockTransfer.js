


var ResetAll = function () {

    $('#transferDate').val(SetCurrentDate());
    LoadLocationsDDL();
    $('#ShipToLoc').val("2").trigger("chosen:updated");
    GetTransferNo();
    InitGrid();
}

$(document).ready(function () {
    GetTransferNo();
    $('#data_2 .input-group.date').datepicker({
        startView: 1,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        format: "dd/mm/yyyy"
    });

    $('#transferDate').val(SetCurrentDate());
    LoadLocationsDDL();
    $('#ShipToLoc').attr('disabled', true);
    $('#ShipToLoc').val("2").trigger("chosen:updated");
    InitGrid();
});

$('#btn-reset').click(function () {
    ResetAll();
});

//making class
var POGrid = function () {
    this.ItemId = '0';
    this.Barcode = '0';
    this.IssueQty = '0';

};

function SavePO() {
    if ($('#transferNo').val() == '') {
        swal("Please Refresh Screen To Generate Purchase Order #.");
        return;
    }
    if ($('#transferDate').val() == '') {
        swal("Please Select Valid Purchase Order Date.");
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

        if (data.name == 0) {
            swal('Please Select Valid Item');
            return;
        }

        if (data.IssueQty == '') {
            swal('Please provide valid Quantity.');
            return;
        }
        
        if (data.AvailQty < data.IssueQty) {
            swal('Please Enter less or equal value then Available quantity');
            return;
        }
        if (isNaN(data.IssueQty)) {
            swal('Please provide valid Quantity.');
            return;
        }
        if (data.IssueQty <= 0) {
            swal('Please provide valid Quantity.');
            return;
        }

    }

    var ListItemsClassObject = new Array();
    for (var i = 0; i < count; i++) {
        var data = $('#tblAppendGrid').appendGrid('getRowValue', i);

        var objItemsClass = new POGrid();

        objItemsClass.ItemId = data.name;
        objItemsClass.Barcode = data.Barcode;
        objItemsClass.IssueQty = data.IssueQty;
        ListItemsClassObject.push(objItemsClass);
    }

    var serviceURL = "";

    serviceURL = "../StockTransfer/AddTransaction?tNo=" + $('#transferNo').val() + "&tDate=" + $('#transferDate').val() + "&ShipToLoc=" + $('#ShipToLoc').val();
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

            swal(
                'Success',
                'Stock Transfer Saved Successfully!',
                'success'
                )
            ResetAll();

        }
    }
    function errorFunc(xhr, textStatus, err) {
        var jsonResponse = JSON.parse(xhr.responseText);
        swal(jsonResponse.Message);
    }
}



$('#btn-save').click(function () {
    SavePO();
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
        caption: 'Stock Transfer',
        initRows: 1,
        columns: [


            {
                name: 'name', display: 'Item', type: 'select', ctrlCss: { width: '150px', 'text-align': 'left', 'font-size': '12px' },
                ctrlOptions: LoadItemDDL(),
                onChange: handleChange
            },
             {
                 name: 'Barcode', display: 'Barcode', type: 'input', ctrlCss: { width: '150px', 'text-align': 'left', 'font-size': '12px' },
                 ctrlAttr: { disabled: 'disabled' }
             },
             {
                 name: 'CategoryId', display: 'Category', type: 'text', ctrlCss: { width: '100px', 'text-align': 'right', 'font-size': '12px' }
                 , ctrlAttr: { disabled: 'disabled' }
             },
            {
                name: 'UomId', display: 'Unit Of Measure', type: 'text', ctrlCss: { width: '120px', 'text-align': 'right', 'font-size': '12px' },
                ctrlAttr: { disabled: 'disabled' }
            },
             {
                 name: 'AvailQty', display: 'Available Quantity', type: 'text', ctrlCss: { width: '140px', 'text-align': 'right', 'font-size': '12px' },
                 ctrlAttr: { disabled: 'disabled' }
             },
            {
                name: 'IssueQty', display: 'Quantity', type: 'text', ctrlCss: { width: '90px', 'text-align': 'right', 'font-size': '12px' }
            },


        ],
        hideButtons: {
            removeLast: true,
            moveUp: true,
            moveDown: true,
            insert: true
        }
    });
}

function handleChange(evt, rowIndex) {

    var ItemName = $('#tblAppendGrid').appendGrid('getCtrlValue', 'name', rowIndex);
    $('#tblAppendGrid').appendGrid('setCtrlValue', 'Barcode', rowIndex, LoadBarcodeById(ItemName));
    $('#tblAppendGrid').appendGrid('setCtrlValue', 'CategoryId', rowIndex, LoadCategoryById(ItemName));
    $('#tblAppendGrid').appendGrid('setCtrlValue', 'UomId', rowIndex, LoadUomById(ItemName));
    $('#tblAppendGrid').appendGrid('setCtrlValue', 'AvailQty', rowIndex, LoadAvailQtyById(ItemName));
    var elem = $('#tblAppendGrid').appendGrid('getCellCtrl', 'IssueQty', rowIndex);

    elem.value = "1";
    elem.focus();
    elem.select();
}

function LoadUomById(ItemName) {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../StockTransfer/LoadUom?Id=" + ItemName,
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadAvailQtyById(ItemName) {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../StockTransfer/LoadAvailQty?Id=" + ItemName,
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadCategoryById(ItemName) {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../StockTransfer/LoadCategory?Id=" + ItemName,
        success: function (data) {
            Rdate = data;
        }
    });
    return Rdate;
}

function LoadBarcodeById(ItemName) {
    var Rdate;
    $.ajax({
        type: "POST",
        async: false,
        url: "../StockTransfer/LoadBarcode?Id=" + ItemName,
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
        url: "../StockTransfer/LoadItems",
        success: function (data) {
            Rdate = data


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

var GetTransferNo = function () {

    $.ajax({
        type: "POST",
        async: false,
        url: "../StockTransfer/GetTransferNo",
        success: function (data) {
            $('#transferNo').removeAttr('disabled');
            $('#transferNo').val(data);
            $('#transferNo').attr('disabled', true);
        }
    });
}


var LoadLocationsDDL = function () {
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        url: "../StockTransfer/LoadLocation",
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