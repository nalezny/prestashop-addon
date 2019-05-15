$( document ).ready(function() {
  body_id = $('body').attr('id');
    if (body_id == 'search' || body_id == 'category'){
        product_ids = [];

        $("#product_list .ajax_block_product ").each(function( index ) {
            product_ids.push($(this).data('id-product'));
        });

        updateproductlist(product_ids);

    }

    if (body_id == 'product'){
      $("body").on('propertychange change click keyup input paste', "#our_price_display", function() {
          setTimeout(function(){
            total_price = $('#our_price_display').text();
            product_price = total_price.match(/\d/g).join("");
            productdetailwidget(product_price);
          }, 2000);
      });
    }
});

function updateleasingplans(amount){
  var contract_table = '<label for="" class="wasa_label"><h2>Wasa Kredit Leasing</h2><ul>';

  if (amount < 5000){
    contract_table += '<p>Din varukorg måste uppgå till minst 5000:- exkl.moms för att använda detta betalningsalternativ</p></label>';
    impregnateWasaOption(contract_table, false);
  }else{
    $.ajax({
        type: "POST",
        url: ajax_url+'get_totalleasing.php',
        data: { total: amount},
        success: function(response) {
            if (response){

              results = $.parseJSON(response);
              $(results).each(function( index ) {
                data = $(this);
                contract = data[0];
                contract_table += '<li>'+contract['monthly_cost']['amount']+' kr/mån ('+contract['contract_length']+' mån)</li>';
              });
              contract_table += '</ul></label>';
              impregnateWasaOption(contract_table, true);
            }
        }
    });    
  }

  return true;
}

function impregnateWasaOption(contract_table, enable){
  $("#paymentMethodsTable .payment_name img").each(function( index ) {
      find_wasa = $(this).attr('src');
      id = $(this).parent().parent().parent().find('input[name="id_payment_method"]').attr('id');

      if (find_wasa.indexOf("jn_wasakredit") >= 0){
        $('#paymentMethodsTable .first_item input[name="id_payment_method"]').prop( "checked", true );
        if (enable){
          $(this).parent().parent().parent().find('.payment_description').html(contract_table);
          $(this).parent().parent().parent().find('input[name="id_payment_method"]').removeAttr('disabled');
          $('.wasa_label').attr('for', id);
        }else{
          $(this).parent().parent().parent().find('.payment_description').html(contract_table);
          $(this).parent().parent().parent().find('input[name="id_payment_method"]').attr('disabled','disabled');
          setTimeout(function(){
            $('#paymentMethodsTable .first_item input[name="id_payment_method"]').prop( "checked", true );
          }, 500);
          $('.wasa_label').attr('for', id);
        }
      }
  });
}

function productdetailwidget(product_price){
  $.ajax({
      type: "POST",
      url: ajax_url+'get_productwidget.php',
      data: { product_price: product_price},
      success: function(response) {
          if (response){
            results = $.parseJSON(response);
            $('.jnw_product_item').html(results);
          }
      }
  });
  return true;
}

function updateproductlist(product_ids){

  $( ".ajax_block_product .price_container" ).each(function( index ) {
      $( "<p class='leasing'></p>" ).appendTo($(this));
  });

  $.ajax({
      type: "POST",
      url: ajax_url+'get_productlist.php',
      data: { product_ids: product_ids},
      success: function(response) {
          if (response){
            results = $.parseJSON(response);
            $(results).each(function( index ) {
              data = $(this);
              product = data[0];
              leasable = product['leasable'];
              if (leasable == true){
                amount = product['monthly_cost']['amount'];
                product_id = product['product_id'];
                console.log(product_id);
                  $('[data-id-product="'+product_id+'"].ajax_block_product .price_container p.leasing').text("Leasing "+amount+" kr/mån");
              }
            });
          }
      }
  });
  return true;
}



