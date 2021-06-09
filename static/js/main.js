$(document).ready(function(){

  // Variables
  var numbers = []   
  const info = document.querySelector(".alert-info");
  var input = document.querySelector("#phone");
  var iti = window.intlTelInput(input, {
                              utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.3/build/js/utils.js",
                              preferredCountries: ["es", "gb", "ie", "it"],
  });
  window.iti = iti;

  //Reset function
  $( ".reset" ).click(function() {
    $('#status1').html('')
    $('#status2').html('') 
    $('#phone').val('')
  });
  
  //Submit function + validation
  $(document).on('submit','#message-form',function(e) {
    e.preventDefault();
    if (numbers.length == 0){
    info.style.display = "";
    $('#status1').html('')
    $('#status2').html('')
    info.innerHTML = `Please add a number`;
    $(this).prop("disabled", true);
    setTimeout(function(){
        $( "#s_button" ).prop('disabled', false)
    }, 1000);  
    
    
    } else if ($('#txt_body').val() == ''){
        info.style.display = "";
        info.innerHTML = `Please add a text body`;
        $(this).prop("disabled", true);
        setTimeout(function(){
            $( "#s_button" ).prop('disabled', false)
        }, 1000); 
        
    }else{
        info.style.display = "none";
        $( "#s_button" ).prop('disabled', false)
        info.style.display = "none";
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/message',
            data:{
              to: JSON.stringify(numbers),
              txt_body: $("#txt_body").val()
            },            
            success:function ()
            {
                
                $.getJSON({
                    url: "/update",                    
                   success: function (data){
                       console.log(data.data)
                    $('#status1').html('Status: ' + data.data)

                    if(data.data != 'delivered'){
                        setTimeout(
                            $.getJSON({
                            url: "/update",                    
                            success: function (data){
                               console.log(data.data)
                               $('#status2').html('Status: ' + data.data)
                                }
                            })
                          ,3000)
                        
                    }
                   }
                  });
            }
            
        });
    }
  });

  // Add numbers function  
  $( "#addNew" ).click(function(){
      conuter =0
      const phoneNumber = iti.getNumber();
      if (iti.isValidNumber()){
          info.style.display = "none";
          text = iti.getNumber();
          if( $.inArray(text, numbers) !== -1 ) {
              info.style.display = "";
              info.innerHTML = `You can not send to the same number twice`;
          }else{
              numbers.push(iti.getNumber())
              $('#phone').val('');
              console.log(numbers)

              var num = $(
                  '<button type="button" class = "numbers"/>',
                  {
                      text: iti.getNumber(),
                  });
                num.html( text );
                num.append('<span class="close">x</span>');
                num.insertBefore('#txt_body');

                var closebtns = document.getElementsByClassName("close");
                var i;

                for (i = 0; i < closebtns.length; i++) {
                  closebtns[i].addEventListener("click", function() {
                      jQuery(this).parent('button').addClass('isHidden');
                      var number = jQuery(this).parent('button').text()
                      number = number.slice(0, -1)
                      function checkNumber(x) {
                        return x !== number;
                      }
                      numbers = numbers.filter(checkNumber);
                      console.log(numbers)                   
                  }) 
                }

          }


      }else{
          info.style.display = "";
          info.innerHTML = `Invalid phone number`;
      }




  })
})