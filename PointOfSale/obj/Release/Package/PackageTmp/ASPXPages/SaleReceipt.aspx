﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SaleReceipt.aspx.cs" Inherits="PointOfSale.ASPXPages.SaleReceipt" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <script>
        function printpage() {
            var p = getParameterByName('IsPrint');
            console.log(p);
            if (p == 0) {

            } else {
                window.print(true)                
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
            font-size: small;
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
            width: 272px;
            
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
                        <td>
                           <%--<center><h2 style="margin-bottom: 0px;"><label id="ClientName" runat="server"></label></h2></center>--%>
                            <img src="/Images/logo2.png" style="width:52px;margin-left:96px"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <center><label style="font-size:13px;" id="ClientAddress" runat="server"></label></center>
                        </td>
                    </tr>
                     <tr>
                       <td>
                            <center style="font-size:15px;"><label><b>Contact # </b></label><label id="ClientPhone" runat="server" ></label><label><b>     :</b> </label><label id="ClientEmail" runat="server" ></label></center>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <center><b><span style="margin-top: 20px; font-size: 15px;">Sale Invoice</span></b></center>
                        </td>
                    </tr>
                    
                </table>
                <table style="border: 1px solid black; width: 100%">
                    <tr>
                        <td style="padding: 1%; text-align: left; width: 60%;">
                            <div id="dvBillNo" runat="server" class="format" style="font-size:9px;"></div>
                        </td>
                        <td style="padding: 1%; text-align: right;">
                            <div id="dvDate" runat="server" class="format" style="font-size:9px;">11 Dec 2016</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 1%; text-align: left; width: 60%;">
                            <div id="dvCustomer" runat="server" class="format" style="font-size:9px;"></div>
                        </td>
                        <td style="padding: 1%; text-align: right;">
                            <div id="dvTime" runat="server" class="format" style="font-size:9px;">09:30:04PM</div>
                        </td>
                    </tr>
                </table>

                <asp:Repeater runat="server" ID="rptBillItems">
                    <HeaderTemplate>
                        <table cellspacing="0" cellpadding="0" width="100%" style="border-bottom: 1px solid;">
                            <tr style="background-color: black;">
                                <td class="format" style="width: 31%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; padding: 1%;">
                                    <asp:Label ID="Label1" runat="server" Text="Product" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                                <td class="format" style="width: 15%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; padding: 1%; font-weight: bold; text-align: right;">
                                    <asp:Label ID="lblItem" runat="server" Text="Price" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                                <td class="format" style="width: 12%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; padding: 1%; font-weight: bold; text-align: center;">
                                    <asp:Label ID="lblPrice" runat="server" Text="Qty" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                                <td class="format" style="width: 20%; border-left: 1px solid black; border-top: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; font-weight: bold; text-align: right; ">
                                    <asp:Label ID="lblAmount" runat="server" Text="Amount" Style="font-size: smaller; font-weight: bold; color: white;"></asp:Label>
                                </td>
                            </tr>
                        </table>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <table cellspacing="0" cellpadding="0" width="100%" style="border-bottom: 1px solid">
                            <tr>
                                <td class="format" style="width: 31%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: left">
                                    <asp:Label ID="Label2" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%# Bind("Description")%>'></asp:Label>
                                </td>
                                <td class="format" style="width: 15%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: right">
                                    <asp:Label ID="Item" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%#DataBinder.Eval(Container.DataItem, "Price", "{0:0,0}") %>'></asp:Label>
                                </td>
                                <td class="format" style="width: 12%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; text-align: center;">
                                    <asp:Label ID="Price" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%# Bind("Qty")%>'></asp:Label>
                                </td>
                                <td class="format" style="width: 20%; border-left: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black; padding: 1%; text-align: right;">
                                    <asp:Label ID="Amount" CssClass="format" runat="server" Style="font-size: 9px;" Text='<%#DataBinder.Eval(Container.DataItem, "DiscountedAmount", "{0:0,0}")%>'></asp:Label>
                                </td>
                            </tr>
                        </table>
                    </ItemTemplate>
                </asp:Repeater>
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="format" style="width: 40%; padding: 1%; text-align: center;">
                            <strong style="font-size:9px;">THANK YOU FOR YOUR KIND VISIT</strong>
                        </td>
                        <td class="format" style="width: 60%; border-left: 1px solid black; border-bottom: 1px solid black; padding: 1%; border-right: 1px solid black;" align="left">
                            <table width="100%" cellpadding="0" cellspacing="0">

                                <tr id="trPBal" runat="server">
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Previous Balance:
                                    </td>
                                    <td id="pBal" runat="server" class="format" style="width: 40%;  text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>

                                <tr>
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Total Bill:
                                    </td>
                                    <td id="lbltotalbill" runat="server" class="format" style="width: 40%;  text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>
                                <tr id="trdisc" runat="server">
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Discount
                                    </td>
                                    <td id="lbldiscount" runat="server" class="format" style="width: 40%;  text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>
                                <tr id="tradjustment" runat="server">
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Adjustment
                                    </td>
                                    <td id="lblAdjustment" runat="server" class="format" style="width: 40%; padding: 1%; text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>


                                <tr>
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Net Payable
                                    </td>
                                    <td id="lblnetpayable" runat="server" class="format" style="width: 40%; text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>
                                <tr>
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Amount Received
                                    </td>
                                    <td id="lblcashreceived" runat="server" class="format" style="width: 40%; text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>
                                <tr id="changeHide" runat="server">
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Change
                                    </td>
                                    <td id="lblreturnback" runat="server" class="format" style="width: 40%; text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>
                                <tr id="RemainBalHide" runat="server">
                                    <td class="format" style="width: 60%; padding: 1%; text-align: left; font-weight: bold; font-size: 8px;">Remaining Balance
                                    </td>
                                    <td id="rBal" runat="server" class="format" style="width: 40%; text-align: right; font-size: 9px;">80.00 
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>
                <%-- <br />--%>
                <%--<table style="width: 100%; border-top: 1px solid; border-bottom: 1px solid;">
                    <tr>
                        <td style="font-size: 10px;">Software Developed By: Webixoft Solutions. 0323-7775448</td>
                    </tr>
                </table>--%>

<%--                <table style="width: 100%;">
                    <tr>
                        <td class="noteclass"><strong>Note: &nbsp; </strong>No guarantee of imported items.
                        </td>
                    </tr>

                    <tr>
                        <td class="noteclass">
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td class="noteclass">
                            <center> G-2 Royal Arcade, Qainchi Amer Sidhu, Ferozpur Road, Lahore.</center>
                        </td>
                    </tr>
                    <tr>
                        <td class="noteclass">
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td class="noteclass">
                            <center>Designed & Developed By <strong>Creamerz Soft</strong></center>
                        </td>
                    </tr>
                    <tr>
                        <td class="noteclass">
                            <center><strong>Contact:</strong> 03237775448, 03324450153</center>
                        </td>
                    </tr>
                </table>--%>

             <%--    <hr/>
                <table style="width: 100%;">
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
