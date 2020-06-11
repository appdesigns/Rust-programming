ZTS.alerts = {

    updateSubtotal: function() {
        //Updates subtotal for PLP Qck ordering, each function
        $(".js-qty-selector-input, .js-qty-selector-multiples-input , .js-qty-selector-multiples-input-qck , .js-qty-selector-input-qck ").each(function() {
            var multipleStep = $(this).data("multiple-step");
            if (multipleStep) {
                var price = $(this).data("price-value");
                var formatedValueID = $(this).data("formated-value");
                var inputVal = $(this).val();

                var cussISO = document.getElementById('currencyISO').value;
                var formatVal = $("#formatVal").val();
                var currencySymbol = formatVal.split(/(\d+)/);

                var volprice = ZTS.alerts.formatPrice(price * multipleStep, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, this);

                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, this);

                if ($("#addToCartForm")[0]) {
                    $("#qty").val(multipleStep);
                }
            }
        });



        //Updates subtotal for PLP, each function
        $(".js-qty-selector-input, .js-qty-selector-multiples-input , .js-qty-selector-multiples-input-qck ").each(function() {
            var multipleStep = $(this).data("multiple-step");
            if (multipleStep) {
                var price = $(this).data("price-value");
                var formatedValueID = $(this).data("formated-value");
                var inputVal = $(this).val();

                var cussISO = document.getElementById('currencyISO').value;
                var formatVal = $("#formatVal").val();
                var currencySymbol = formatVal.split(/(\d+)/);

                var volprice = ZTS.alerts.formatPrice(price * multipleStep, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, this);

                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, this);

                if ($("#addToCartForm")[0]) {
                    $("#qty").val(multipleStep);
                }
            }
        });
    },

    scalePriceCalculation: function(inputValue, productPrice, currencyIsoCode, currencySymbol, productCode, element) {

        //Check if there is logic for scale price

        if (typeof $(element).closest(".js-product-row").find(".js-scale-max-price_" + productCode).val() != 'undefined') {
            var checkForScalePrice = $(element).closest(".js-product-row").find(".js-scale-max-price_" + productCode).val().split(",");

            if (checkForScalePrice[1] > 0) {

                var maxarray = checkForScalePrice;

                //Checks if there is scale price


                pdpAddtoCartInput = inputValue;
                var scalePrice = productPrice;

                var pricearray = $(element).closest(".js-product-row").find(".js-scale-price_" + productCode).val().split(",");
                var minarray = $(element).closest(".js-product-row").find(".js-scale-min-price_" + productCode).val().split(",");

                for (var i = 1; i < (pricearray.length); i++) {
                    var min = parseInt(minarray[i]);
                    var max = parseInt(maxarray[i]);
                    var price = pricearray[i];

                    if (isNaN(max)) {
                        scalePrice = price;
                        break;
                    } else if (min <= pdpAddtoCartInput && max >= pdpAddtoCartInput) {
                        scalePrice = price;
                        break;
                    }
                }

                scalePrice = ZTS.alerts.formatPrice(scalePrice, currencyIsoCode);


                //checkForPLPtoAdd
                var productPriceToUpdate = $("#topformatValue");
                var franceSite = ACC.config.encodedContextPath.indexOf('zoetis-fr') != -1 ? true : false;

                if (scalePrice && $("#topformatValue")[0]) {
                    productPriceToUpdate.val(currencySymbol[0].concat(scalePrice));
                    if ($(".language-en_US")[0]) {
                        productPriceToUpdate.val(currencySymbol[0].concat(scalePrice));
                    } else if ($(".language-fr_CA")[0] && priceVal >= 1000 || $(".language-es_ES")[0] && priceVal >= 1000 || franceSite) {
                        productPriceToUpdate.val(scalePrice.concat(currencySymbol[4]));
                    } else if ($(".language-fr_CA")[0] || $(".language-es_ES")[0]) {
                        productPriceToUpdate.val(scalePrice.concat(currencySymbol[4]));
                    } else {
                        productPriceToUpdate.val(currencySymbol[0].concat(scalePrice));
                    }
                } else {

                    productPriceToUpdate = $(element).closest(".js-product-row").find("#" + productCode + "_formatPriceValue1");

                    productPriceToUpdate.html(currencySymbol[0].concat(scalePrice));
                    if ($(".language-en_US")[0]) {
                        productPriceToUpdate.html(currencySymbol[0].concat(scalePrice));
                    } else if ($(".language-fr_CA")[0] && priceVal >= 1000 || $(".language-es_ES")[0] && priceVal >= 1000 || franceSite) {
                        productPriceToUpdate.html(scalePrice.concat(currencySymbol[4]));
                    } else if ($(".language-fr_CA")[0] || $(".language-es_ES")[0]) {
                        productPriceToUpdate.html(scalePrice.concat(currencySymbol[4]));
                    } else {
                        productPriceToUpdate.html(currencySymbol[0].concat(scalePrice));
                    }
                }

                scalePrice = Number(scalePrice.replace(/[^0-9.-]+/g, ""));

                var scaledSubtotalPrice = ZTS.alerts.formatPrice(scalePrice * inputValue, currencyIsoCode);
                ZTS.alerts.refreshSubtotalValue(scaledSubtotalPrice, productCode, currencySymbol, scalePrice, element);

            }
        }
    },

    formatPrice: function(p, currency) {

        var decimalSeparator = ".";
        var thousandsSeparator = ",";
        var franceSite = ACC.config.encodedContextPath.indexOf('zoetis-fr') != -1 ? true : false;
        // Set decimal and thousand separator for Switzerland
        if (currency == 'CHF') {
            decimalSeparator = ",";
            thousandsSeparator = ".";
        }

        if ($(".language-it")[0] || $(".language-nl")[0] || $(".language-es_ES")[0] || $(".language-pt_BR")[0] || $(".language-es_AR")[0]) {
            decimalSeparator = ",";
            thousandsSeparator = ".";
        }

        if ($(".language-fr_CA")[0] || franceSite) {
            decimalSeparator = ",";
            thousandsSeparator = " ";
        }

        // Format price in float based on currencyISO
        if (currency == 'KRW' || currency == 'JPY') {
            p = parseFloat(Math.round(p * 100) / 100).toFixed(0);
        } else {
            p = parseFloat(Math.round(p * 100) / 100).toFixed(2);
        }

        // Replace decimal separator
        if (decimalSeparator != null && decimalSeparator !== '.') {
            p = p.replace('.', decimalSeparator);
        }

        // Place thousand separator
        if (thousandsSeparator !== null) {
            var parts = p.toString().split(decimalSeparator);
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
            p = parts.join(decimalSeparator);
        }
        return p;
    },

    refreshSubtotalValue: function(price, formatedValueID, currencySymbol, priceVal, element) {
        var subtotalID = $(element).closest(".js-product-row").find("#" + formatedValueID + "_formatValue");
        var franceSite = ACC.config.encodedContextPath.indexOf('zoetis-fr') != -1 ? true : false;
        if (price) {
            if ($(".language-en_US")[0]) {
                subtotalID.html(currencySymbol[0].concat(price));
            } else if ($(".language-fr_CA")[0] && priceVal >= 1000 || $(".language-es_ES")[0] && priceVal >= 1000 || franceSite) {
                subtotalID.html(price.concat(currencySymbol[4]));
            } else if ($(".language-fr_CA")[0] || $(".language-es_ES")[0]) {
                subtotalID.html(price.concat(currencySymbol[4]));
            } else {
                subtotalID.html(currencySymbol[0].concat(price));
            }
        }

    },

    alertsQuantity: function() {

        //Updates Subtotal on page load
        ZTS.alerts.updateSubtotal();
        cartPageQuantityCheck();
        checkoutButtonTrigger();

        $(document).on("click", ".js-qty-selector-multiple-plus", function(e) {
            calculateStep(true, this);
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".js-qty-selector-multiple-minus", function(e) {
            calculateStep(false, this);
            e.stopImmediatePropagation();
        });

        //TODO: to move this to quick order JS --START
        $(document).on("click", ".js-qty-selector-multiple-plus-quick", function(e) {
            calculateStepQuickOrder(true, this);
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".js-qty-selector-multiple-minus-quick", function(e) {
            calculateStepQuickOrder(false, this);
            e.stopImmediatePropagation();
        });

        $(document).on("click", ".js-qty-selector-plus-quick", function() {
            calculateSingleItem(true, true, this);
        });

        $(document).on("click", ".js-qty-selector-minus-quick", function() {
            calculateSingleItem(false, true, this);
        });

        $(document).on("change blur", ".js-qty-selector-input-qck, .js-qty-selector-multiples-input-qck", function() {
            calculateMultipleQck(false, false, this);
        });

        //TODO: to move this to quick order JS --END

        $(document).on("click", ".js-qty-selector-plus", function() {
            calculatePrice(true, this);
        });

        $(document).on("click", ".js-qty-selector-minus", function() {
            calculatePrice(false, this);
        });

        $(document).on("change", ".js-qty-selector-input, .js-qty-selector-multiples-input", function() {
            calculateMultiple(false, false, this);
        });

        $(document).on("change", ".js-qty-selector-multiple-cart-input", function(e) {
            if ($(this).parent().find("input[name='initialQuantity']").val() !== $(this).val()) {
                if (calculateCartMultiple(this)) {
                    ACC.cartitem.handleUpdateQuantity(this, e);
                }
            }
        });

        $(".js-qty-selector-multiple-cart-input").bind("keypress", function(e) {
            if (e.keyCode == 13) {
                if ($(this).parent().find("input[name='initialQuantity']").val() === $(this).val()) {
                    e.preventDefault();
                }
                if (!calculateCartMultiple(this)) {
                    e.preventDefault();
                }
            }
        });

        function calculateMultiple(plusSignButton, inputField, element) {
            var multipleID = $(element).data("multiple-id");
            var inputVal = $("#js-alert-multiples-" + multipleID).val();
            var multipleClass = $(".multiple-section-" + multipleID);
            var multiples = multipleClass.data("multiples");
            var multipleStep = $(element).data("multiple-step");
            var price = $(element).data("price-value");
            var formatedValueID = $(element).data("formated-value");
            var cussISO = document.getElementById('currencyISO').value;
            var formatVal = $(element).closest("form").find("#formatVal").val();

            if (typeof formatVal === "undefined") {
                formatVal = $("#formatVal").val();
            }

            if (typeof formatedValueID === "undefined") {
                formatedValueID = $('.product-pdp-info').data('id');
            }

            if (typeof price === "undefined") {
                price = $('.product-pdp-info').data('price');
            }

            var currencySymbol = formatVal.split(/(\d+)/);

            if (inputVal == 0) {
                $("#js-alert-multiples-" + multipleID).val(multipleStep);
                inputVal = multipleStep;
            } else {
                if (inputVal < 9999) {
                    $(element).closest('.js-qty-selector').find('.plus').removeAttr('disabled');
                } else {
                    $(element).closest('.js-qty-selector').find('.plus').attr('disabled', 'disabled');
                }
            }

            if (inputField) {
                if (plusSignButton) {
                    inputVal = (+inputVal + 1);
                } else {
                    inputVal = inputVal - 1;
                }
            } else {
                inputVal = $(element).val();
            }



            if (inputVal % multipleStep == 0) {
                multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                $("#js-alert-multiples-" + multipleID).removeClass("border-danger");
                $("#" + multipleID + "_addToCartButton").removeClass("disabled");

                myProdcutsTableCheckboxState(multipleID, false);

                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);

                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);

            } else {
                multipleClass.removeClass("alerts-info").addClass("alerts-danger");
                $("#js-alert-multiples-" + multipleID).addClass("border-danger");
                $("#" + multipleID + "_addToCartButton").addClass("disabled");

                myProdcutsTableCheckboxState(multipleID, true);

                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);

                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);
            }

            $("#qty").val(inputVal);
        }

        function calculateMultipleQck(plusSignButton, inputField, element) {
            var multipleID = $(element).data("multiple-id");
            var inputVal = $(element).parent().children().closest(".qty-add").val();
            var multipleClass = $(".multiple-section-qck-" + multipleID);
            var multiples = multipleClass.data("multiples");
            var multipleStep = $(element).data("multiple-step");
            var price = $(element).data("price-value");
            var formatedValueID = $(element).data("formated-value");
            var cussISO = document.getElementById('currencyISO').value;
            var formatVal = $("#" + multipleID + "_formatValQuick").val();

            var currencySymbol = formatVal.split(/(\d+)/);

            if (inputVal == 0) {
                $("#js-alert-multiples-" + multipleID).val(multipleStep);
                inputVal = multipleStep;
            }

            if (inputField) {
                if (plusSignButton) {
                    inputVal = (+inputVal + 1);
                } else {
                    inputVal = inputVal - 1;
                }
            } else {
                inputVal = $(element).val();
            }


            if (inputVal % multipleStep == 0) {
                multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                $("#js-alert-multiples-quick-" + multipleID).removeClass("border-danger");
                $("#js-add-to-cart-quick-order-btn-top").removeClass("disabled");
                $("#js-add-to-cart-quick-order-btn-bottom").removeClass("disabled");

                var autoshipSelected = ACC.csr.checkNullAutoship();
                if (!autoshipSelected) {
                    ACC.quickorder.$submitAutoshipBtn.attr('disabled', 'disabled');
                } else {
                    ACC.quickorder.enableDisableAddToCartBtn();
                }

                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);

                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);
            } else {
                multipleClass.removeClass("alerts-info").addClass("alerts-danger");
                $("#js-alert-multiples-quick-" + multipleID).addClass("border-danger");
                $("#js-add-to-cart-quick-order-btn-top").addClass("disabled");
                $("#js-add-to-cart-quick-order-btn-bottom").addClass("disabled");
                ACC.quickorder.$submitAutoshipBtn.attr('disabled', 'disabled');


                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);

                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);
            }

            $("#qty").val(inputVal);


        }


        //TODO Remove unnecessary lines
        function calculateSingleItem(plusSignButton, inputField, element) {

            var multipleID = $(element).data("multiple-id");
            var inputVal = $("#js-alert-multiples-quick-" + multipleID).val();
            var multipleClass = $(".multiple-section-" + multipleID);
            var multiples = multipleClass.data("multiples");
            var multipleStep = $(element).data("multiple-step");
            var price = $(element).data("price-value");
            var formatedValueID = $(element).data("formated-value");
            var cussISO = document.getElementById('currencyISO').value;
            var formatVal = $("#" + multipleID + "_formatValQuick").val();

            if (typeof formatVal === "undefined") {
                formatVal = $("#formatVal").val();
            }

            var currencySymbol = formatVal.split(/(\d+)/);

            if (inputField) {
                if (plusSignButton) {
                    inputVal = (+inputVal + 1);
                } else {
                    if (inputVal > 1) {
                        inputVal = inputVal - 1;
                    }
                }
            } else {
                inputVal = $(element).val();
            }

            multipleClass.removeClass("alerts-danger").addClass("alerts-info");
            $("#js-alert-multiples-quick-" + multipleID).removeClass("border-danger");
            $("#" + multipleID + "_addToCartButton").removeClass("disabled");

            if (plusSignButton) {

                $("#js-alert-multiples-quick-" + multipleID).val(inputVal);
                multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                $("js-alert-multiples-quick-" + multipleID).removeClass("border-danger");

                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);
                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);
            } else {
                $("#js-alert-multiples-quick-" + multipleID).val(inputVal);
                multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                $("js-alert-multiples-quick-" + multipleID).removeClass("border-danger");
                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);
                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);

            }
        }


        function calculateCartMultiple(element) {
            var multipleID = $(element).data("multiple-id");
            var inputVal = $(element).val();
            var multipleClass = $(".multiple-section-" + multipleID);
            var multiples = multipleClass.data("multiples");
            var multipleStep = $(element).data("multiple-step");

            if (inputVal % multipleStep == 0) {
                multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                $(element).removeClass("border-danger");
                $(".js-continue-checkout-button").removeAttr("disabled");
                return true;

            } else {
                multipleClass.removeClass("alerts-info").addClass("alerts-danger");
                $(element).addClass("border-danger");
                $(".js-continue-checkout-button").attr("disabled", "disabled");
                return false;
            }
        }

        function calculateStep(plusSignButton, element) {
            var multipleID = $(element).data("multiple-id");
            var inputVal = $(element).closest(".common-selector").find("#js-alert-multiples-" + multipleID).val();
            var multipleClass = $(".multiple-section-" + multipleID);
            var multiples = multipleClass.data("multiples");
            var multipleStep = $(element).data("multiple-step");
            var price = $(element).data("price-value");
            var formatedValueID = $(element).data("formated-value");
            var moduleDifference = inputVal % multipleStep;
            var cussISO = document.getElementById('currencyISO').value;
            var formatVal = $(element).closest("form").find("#formatVal").val();

            if (typeof formatVal === "undefined") {
                formatVal = $("#formatVal").val();
            }

            var currencySymbol = formatVal.split(/(\d+)/);

            if (plusSignButton) {
                temp = (parseFloat(inputVal) + parseFloat(multipleStep) - parseFloat(moduleDifference));
                if (temp < 9999) {
                    inputVal = (+inputVal + multipleStep - moduleDifference);
                    $(element).closest('.js-qty-selector').find('.plus').removeAttr('disabled');
                } else {
                    $(element).attr("disabled", "disabled");
                }
                $(element).closest(".add_to_cart_form").find("#js-alert-multiples-" + multipleID).val(inputVal);
                multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                $("#" + multipleID + "_addToCartButton").removeClass("disabled");
                $("#js-alert-multiples-" + multipleID).removeClass("border-danger");

                myProdcutsTableCheckboxState(multipleID, false);

                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);

                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);


            } else {
                if (inputVal > multipleStep) {

                    if (moduleDifference > 0) {
                        inputVal = (inputVal - moduleDifference);
                    } else {
                        inputVal = (inputVal - multipleStep);
                    }
                    $(element).closest(".add_to_cart_form").find("#js-alert-multiples-" + multipleID).val(inputVal);
                    multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                    $("#" + multipleID + "_addToCartButton").removeClass("disabled");
                    $("#js-alert-multiples-" + multipleID).removeClass("border-danger");
                    $(element).closest('.js-qty-selector').find('.plus').removeAttr('disabled');

                    myProdcutsTableCheckboxState(multipleID, false);

                    var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                    ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);

                    ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);

                } else {
                    /*$(element).addClass("disabled");*/
                }

            }
            $("#qty").val(inputVal);
            $(element).closest(".common-selector").find("#js-alert-multiples-" + multipleID).val(inputVal);
        }



        function calculateStepQuickOrder(plusSignButton, element) {
            var multipleID = $(element).data("multiple-id");
            var inputVal = $("#js-alert-multiples-quick-" + multipleID).val();
            var multipleClass = $(".multiple-section-qck-" + multipleID);
            var multiples = multipleClass.data("multiples");
            var multipleStep = $(element).data("multiple-step");
            var price = $(element).data("price-value");
            var formatedValueID = $(element).data("formated-value");
            var moduleDifference = inputVal % multipleStep;
            var cussISO = document.getElementById('currencyISO').value;
            var formatVal = $("#" + multipleID + "_formatValQuick").val();

            var currencySymbol = formatVal.split(/(\d+)/);
            if (plusSignButton) {
                inputVal = (+inputVal + multipleStep - moduleDifference);
                $("#js-alert-multiples-quick-" + multipleID).val(inputVal);
                multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                $("#" + multipleID + "_addToCartButton").removeClass("disabled");
                $("#js-alert-multiples-quick-" + multipleID).removeClass("border-danger");
                $("#js-add-to-cart-quick-order-btn-top , #js-add-to-cart-quick-order-btn-bottom ").removeClass("disabled");


                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);

                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);
                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);


            } else {
                if (inputVal > multipleStep) {

                    if (moduleDifference > 0) {
                        inputVal = (inputVal - moduleDifference);
                    } else {
                        inputVal = (inputVal - multipleStep);
                    }
                    $("#js-alert-multiples-quick-" + multipleID).val(inputVal);
                    multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                    $("#" + multipleID + "_addToCartButton").removeClass("disabled");
                    $("#js-alert-multiples-quick-" + multipleID).removeClass("border-danger");
                    $("#js-add-to-cart-quick-order-btn-top , #js-add-to-cart-quick-order-btn-bottom ").removeClass("disabled");

                    var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                    ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);
                    ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);


                } else {
                    /*$(element).addClass("disabled");*/
                }
            }

            $("#qty").val(inputVal);
        }


        function calculatePrice(plusSignButton, element) {
            var multipleID = $(element).data("multiple-id");
            var inputVal = $(element).closest('.js-qty-selector').find("#js-alert-multiples-" + multipleID).val();
            var price = $(element).data("price-value");
            var formatedValueID = $(element).data("formated-value");
            var cussISO = document.getElementById('currencyISO').value;
            var formatVal = $(element).closest("form").find("#formatVal").val();

            if (typeof inputVal === "undefined") {
                inputVal = $(element).closest('.js-qty-selector').find(".js-qty-selector-input").val();
            }

            if (typeof formatedValueID === "undefined") {
                formatedValueID = $('.product-pdp-info').data('id');
            }

            if (typeof formatVal === "undefined") {
                formatVal = $("#formatVal").val();
            }

            if (typeof formatedValueID === "undefined") {
                formatedValueID = $('.product-pdp-info').data('id');
            }

            if (typeof price === "undefined") {
                price = $('.product-pdp-info').data('price');
            }
            var currencySymbol = formatVal.split(/(\d+)/);

            if (plusSignButton) {
                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);
                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);
            } else {
                var volprice = ZTS.alerts.formatPrice(price * inputVal, cussISO);
                ZTS.alerts.refreshSubtotalValue(volprice, formatedValueID, currencySymbol, price, element);
                ZTS.alerts.scalePriceCalculation(inputVal, price, cussISO, currencySymbol, formatedValueID, element);
            }

            $("#qty").val(inputVal);
        }

        function cartPageQuantityCheck() {
            $(".js-qty-selector-multiple-cart-input").each(function() {
                var multipleStep = $(this).data("multiple-step");
                var multipleID = $(this).data("multiple-id");
                var multipleClass = $(".multiple-section-" + multipleID);
                var inputVal = $(this).val();

                if (inputVal % multipleStep == 0) {
                    multipleClass.removeClass("alerts-danger").addClass("alerts-info");
                    $(this).removeClass("border-danger");
                    $(this).removeClass("checkout-btn-trigger");
                } else {
                    multipleClass.removeClass("alerts-info").addClass("alerts-danger");
                    $(this).addClass("border-danger");
                    $(this).addClass("checkout-btn-trigger");
                }
            });
        }

        function checkoutButtonTrigger() {
            if ($(".checkout-btn-trigger")[0]) {
                $(".js-continue-checkout-button").attr("disabled", "disabled");
            } else {
                $(".js-continue-checkout-button").removeAttr("disabled");
            }
        }

        function myProdcutsTableCheckboxState(multipleid, disabled) {

            if ($(".my-products-table-component")[0]) {
                var uiAction;

                if ($("#js-ffo-my-product-checkbox-" + multipleid).prop("disabled")) {

                    $("#js-ffo-my-product-checkbox-" + multipleid).attr("disabled", "disabled").attr('checked', false).closest('tr').removeClass("my-product-row-selected").find(".zts-checkbox-box").addClass("disabled-checkbox");
                } else {
                    $("#js-ffo-my-product-checkbox-" + multipleid).closest('tr').find(".zts-checkbox-box").removeClass("disabled-checkbox");
                    $("#js-ffo-my-product-checkbox-" + multipleid).removeAttr("disabled");
                }
                ZTS.myproduct.handleAddBtnMyProducts();
            }
        }
    },

    refreshSubtotalValueQck: function(price, formatedValueID, currencySymbol, priceVal) {
        if (price) {

            var franceSite = ACC.config.encodedContextPath.indexOf('zoetis-fr') != -1 ? true : false;

            $("#" + formatedValueID + "_formatValue").html(currencySymbol[0].concat(price));
            if ($(".language-en_US")[0]) {
                $("#" + formatedValueID + "_formatValue").html(currencySymbol[0].concat(price));
            } else if ($(".language-fr_CA")[0] && priceVal >= 1000 || $(".language-es_ES")[0] && priceVal >= 1000 || franceSite) {
                $("#" + formatedValueID + "_formatValue").html(price.concat(currencySymbol[4]));
            } else if ($(".language-fr_CA")[0] || $(".language-es_ES")[0]) {
                $("#" + formatedValueID + "_formatValue").html(price.concat(currencySymbol[4]));
            } else {
                $("#" + formatedValueID + "_formatValue").html(currencySymbol[0].concat(price));
            }
        }
    },

    popoverToggle: function() {
        var isIpad = navigator.userAgent.toLowerCase().indexOf("ipad");

        $('[data-toggle="popover"]').popover({
            trigger: "hover"
        });

        if (isIpad > -1) {
            $(".js-substitute-alert").on("click", function() {
                $(this).popover("show");
            });
        }
    }

}

$(document).ready(function() {
    ZTS.alerts.alertsQuantity();
    ZTS.alerts.popoverToggle();
});