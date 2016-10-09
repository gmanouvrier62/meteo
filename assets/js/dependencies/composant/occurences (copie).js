(function($)

{ 

    $.fn.occurences=function(opts)

    {
       var defauts=

            {
            'groups' : 0,
	        'currentIdx': 0,       //Intervalle entre chaque image, en millisecondes
	        'parentId' : $(this).attr('id'),
	        'callback': null,
          'une_contrainte': function () {
	        				  var sel = '<select class="occ_nb"><option value="2">2</option>';
	        				  		sel += '<option value="3">3</option><option value="4">4</option><option value="5">5</option>';
	        				  var directive = '<select class="occ_directive"><option value="<"><<option><option value=">">><option><option value="=">=<option></select>';
	        				  var fois = '<input class="occ_fois" type="text" value="" style="width:26px">fois &nbsp;';
	        				  var entre = '<input class="occ_date1" type="text" value="">';
	        				  var et = '<input class="occ_date2" type="text" value="">';
						        var ligne = '<tr class="occ_ligne"><td>' + sel + ' </td> <td>occurences' + directive + 'à</td> <td>' + fois + '</td> <td>entre ' + entre + ' </td> <td>et' + et + '</td>';
						      	  ligne += '<td><img id="' + parametres.parentId + '_plus" src="/js/dependencies/composant/plus.png"><img id="' + parametres.parentId + '_moins" src="/js/dependencies/composant/moins.png"></td></tr>';
						      
						      parametres.currentIdx += 1;
						      return ligne;
						  }        //Fonction appelée à chaque nouvelle image
			
            };  

           

            //On fusionne nos deux objets ! =D

      var parametres=$.extend(defauts, opts);
      
      $(this).attr("style","float:left; margin-top: 50px; padding: 10px 20px 20px; line-height: 1; color:#fff; -moz-border-radius: 30px; -webkit-border-radius: 30px; border-radius: 30px; background:linear-gradient(to top,#ED283F,#ED7171)");
      


	 
      var nouvelElement = $('<div id="' + parametres.parentId + '_principal">');
      var newEl = '<center><b>Gestion des occurences</b><div id="' + parametres.parentId + '_fermeture_occ" style="float:right;background-image:url(/js/dependencies/composant/cancel.png);background-repeat:no-repeat;width:24px;height:24px;"></div></center><br>';
      		newEl += '<table id="' + parametres.parentId + '_occ"></table>';
      newEl += '<center><div id="' + parametres.parentId + '_valider_occ" style="background-image:url(/js/dependencies/composant/valider.png);background-repeat:no-repeat;width:32px;height:32px;"></div></center>';
				  nouvelElement.html(newEl);
 	  
 		//alert(nouvelElement.html());
	  $(this).prepend(nouvelElement).find("#" + parametres.parentId + "_occ").prepend(parametres.une_contrainte()); 
	  
       
      $("#" + parametres.parentId + "_fermeture_occ").click(function(){
     
     	$(this).parent().parent().parent().remove();
 	  });

 	  $("#" + parametres.parentId + "_moins").click(function(){
      	
      	$("#" + parametres.parentId + "_moins").parent().parent().remove();

      }); 
       $("#" + parametres.parentId + "_plus").click(function(){
      	
      	$("#" + parametres.parentId + "_plus").parent().parent().parent().prepend(parametres.une_contrainte());

      });   
	  $("#" + parametres.parentId + "_valider_occ").click(function(){
     		var retour = {"occurences": new Array()};
        $(this).parent().parent().find(".occ_ligne").each(function(){
                var occ = {};
                occ["nb"] = $(this).find(".occ_nb").val();
                occ["directive"] = $(this).find(".occ_directive").val();
                occ["fois"] = $(this).find(".occ_fois").val();
                occ["date1"] = $(this).find(".occ_date1").val();
                occ["date2"] = $(this).find(".occ_date2").val();
                retour["occurences"].push(occ);                
              });

              parametres.callback(retour);
	  });




      
    };

})(jQuery);