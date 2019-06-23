<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="VendorPaymentReceipt.aspx.cs" Inherits="PointOfSale.ASPXPages.VendorPaymentReceipt" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <script>
        //function printpage() {
        //    window.print(true)
        //    //window.close()
        //    setTimeout(function () { window.close(); }, 1);
        //}

        ////function cl() {
        ////    window.close()
        ////}

        function printpage() {
            var p = getParameterByName('IsPrint');
            console.log(p);
            if (p == 0) {

            } else {
                window.print(true)
                //window.close()
                setTimeout(function () { window.close(); }, 1);
            }
        }
        function cl() {
            window.close()
        }

        // Getting Value From Query String By Param Name
        function getParameterByName(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }


    </script>
    <style type="text/css" media="print">
        @page {
            size: auto; /* auto is the current printer page size */
            margin: 0mm; /* this affects the margin in the printer settings */
        }

        body {
            background-color: #FFFFFF;
            /*border: solid 1px black ;*/
            margin: 0px; /* the margin on the content before printing */
        }
    </style>

    <style>
        .format {
            font-size: x-small;
            font-family: Verdana;
            /*font-weight:bold;*/
        }
    </style>

    <style type="text/css" media="print">
        @page {
            size: landscape; /* auto is the current printer page size */
            margin: 0mm; /* this affects the margin in the printer settings */
        }

        body {
            background-color: #FFFFFF;
            margin: 0px; /* the margin on the content before printing */
        }
    </style>
    <style>
        .ticketprint {
            margin: 0px 0 0 10px;
            width: 520px;
            height: 600px;
        }

        .most-left {
            float: left;
            margin: 0px 0 0 0px;
            width: 250px;
            height: 300px;
        }

        #srno {
            float: left;
            margin: 0px 0 0 10px;
            width: 100%;
        }

        #filmname {
            float: left;
            margin: 8px 0 0 10px;
            width: 100%;
        }

        #pricetic {
            float: left;
            margin: 110px 0 0 10px;
            width: 100%;
        }

        .left-div {
            float: left;
            margin: 1px 0px 0 90px;
            width: 100px;
            height: 160px;
        }

        #timetic {
            float: left;
            margin: 4px 0 0 15px;
            width: 100%;
        }

        #rownametic {
            float: left;
            margin: 25px 0 5px 15px;
            width: 100%;
        }

        #seatnotic {
            float: left;
            margin: 29px 0 0 15px;
            width: 100%;
        }

        #date {
            float: left;
            margin: 25px 0 5px 15px;
            width: 100%;
        }

        .right-div {
            float: right;
            margin: 4px 0 0 0px;
            width: 72px;
            height: 160px;
        }

        #pricecounter {
            float: left;
            margin: 35px 0 5px 7px;
            width: 100%;
        }

        #timecounter {
            float: left;
            margin: 0px 0 0px 9px;
            width: 100%;
        }

        #rownamecounter {
            float: left;
            margin: 4px 0 0px 9px;
            width: 100%;
        }

        #seatnocounter {
            float: left;
            margin: 10px 0 0px 9px;
            width: 100%;
        }

        #datecounter {
            float: left;
            margin: 10px 0 0px 7px;
            width: 100%;
        }

        .noteclass {
            font-size: 11px;
            text-align: justify;
        }
    </style>


</head>
<body onload="printpage();">
    <form id="form1" runat="server">
        <div>

            <div class="ticketprint">
                <table width="100%">
                    <tr>
                        <td align="center">
                          <h2><b><label id="ClientName" runat="server"></label></b></h2>

                            <%--<img src="../Images/WXPOSNavLogo.png" id="imgLogo" runat="server" height="70" width="120" alt="BISMILLAH FONE" />--%>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size: 20px;">
                            <u>Vendor Payment Receipt</u>
                        </td>
                    </tr>
                    <tr id="trCustomer" runat="server">
                        <td align="left" style="font-size: 15px; font-weight: bold; padding-left: 9px;">Vendor: <span id="spnCustomer" runat="server" style="font-family:Arial"></span>
                        </td>
                    </tr>
                </table>
                <table style="border: 1px solid black; width: 100%">
                    <tr>
                        <td style="padding: 1%; text-align: left;">
                            <div id="dvDate" runat="server" class="format">11 Dec 2016</div>
                        </td>
                        <td style="padding: 1%; text-align: right;">
                            <div id="dvTime" runat="server" class="format">09:30:04PM</div>
                        </td>

                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td></td>
                        <td class="format" style="width: 100%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; border-right: 1px solid black;" align="left">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left;  font-size: 12px;">Previous Balance:
                                    </td>
                                    <td id="lblprevbal" runat="server" class="format" style="width: 40%; padding: 1%; text-align: right; font-size: 12px;">80.00 
                                    </td>
                                </tr>
                                <tr>
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left;  font-size: 12px;">Paid Amount
                                    </td>
                                    <td id="lblreceived" runat="server" class="format" style="width: 40%; padding: 1%; text-align: right; font-size: 12px;">80.00 
                                    </td>
                                </tr>
                                <tr>
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left;  font-size: 12px;">Current Balance
                                    </td>
                                    <td id="lblcurrbal" runat="server" class="format" style="width: 40%; padding: 1%; text-align: right; font-size: 12px;">80.00 
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
             <div class="row" style="margin-top: 10px;">
                   Thanks for your kind visit.
                </div>
             <%--   <hr />
                <div class="noteclass">
                    <center>Software Developed By <strong style="font-family:Arial">CREAMERZ SOFT</strong></center>
                </div>
                <div class="noteclass">
                    <center>Contact: <strong>0323-7775448, 03324450153</strong></center>
                </div>--%>

                    <hr/>
               <%-- <table style="width: 100%;">
                    <tbody><tr>
                        <td style="text-align:center;">
                            Developed By: <b>Creamerz Soft | www.creamerz.com | 03237775448, 03324450153</b>
                            </td>
                    </tr>
                </tbody></table>--%>
            </div>
        </div>
    </form>
</body>
</html>
