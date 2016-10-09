(function($)
{ 

    $.fn.container=function(opts)

    {
       var defauts=

            {
            'collection':null,
            'groups' : 0,
            'preselection' : 0,
	        'currentIdx': 0,       
	        'parentId' : $(this).attr('id'),
	        'callback': null,
          'fermeture': null,
	        'unselect': function (nb) {
						      var sel = $("<select class='selGrp' id='" + parametres.parentId + "_sel_" + parametres.currentIdx + "'>");
						      for(var a=nb;a>=0;a--) {
						      	var op = $("<option value='" + a + "'>" + a + "</option>");
						      	sel.prepend(op);
						      }
						      parametres.currentIdx += 1;
						      return sel;
						  }        //Fonction appelée à chaque nouvelle image
			
            };  

           

            //On fusionne nos deux objets ! =D

      var parametres=$.extend(defauts, opts);
      
      $(this).attr("style","float:left; margin-right: 5px; padding: 10px 10px 10px; line-height: 1; color:#fff; -moz-border-radius: 30px; -webkit-border-radius: 30px; border-radius: 30px; background:linear-gradient(to top,#F7BF8F,#F08423)");
      


	  var contraintes = '<table>';
	  contraintes += '<tr><td>Pas sortie sur les <input type="text" id="txt_ps" class="no_sortie" style="width:26px;padding-left:5px;padding-right:5px">derniers tirages</td><td><input type="checkbox" id="chk_ps" class="chk_ns"></td></tr>';
	  contraintes += '<tr><td>Ec. moyen global <select class="ecart_global" id="ecart_gbl"><option value="<"><</option><option value=">">></option><option value="=">=</option></select></td><td><input type="checkbox" id="chk_ecart_gbl" class="chk_eg" ></td></tr>';
	  contraintes += '<tr><td>Ec. moyen  <select class="ecart_moyen" id="ecart_moyen"><option value="<"><</option><option value=">">></option><option value="=">=</option></select>sur <input type="text" id="txt_ecart" class="ecart_moyen_tirage" style="width:26px;padding-left:5px;padding-right:5px">derniers tirages</td><td><input type="checkbox" class="chk_em" id="chk_ecart_moyen"></td></tr>';


	  contraintes += '</table>';
      var nouvelElement = $('<div id="' + parametres.parentId + '_principal">');
      var newEl = '<center><b>Groupe de Sélection (' + parametres.groups + ')</b><div id="' + parametres.parentId + '_fermeture" style="float:right;background-image:url(/js/dependencies/composant/cancel.png);background-repeat:no-repeat;width:24px;height:24px;"></div></center><br><table><tr><td id="' + parametres.parentId + '_agregat"></td><td><img id="' + parametres.parentId + '_plus" src="/js/dependencies/composant/plus.png"><img id="' + parametres.parentId + '_moins" src="/js/dependencies/composant/moins.png"></td><td>nombre de numéros&nbsp;<input type="text" id="' + parametres.parentId + '_nb_num" class="numeros" value="" style="width:26px"></td></tr><tr><td colspan="3">Contraintes</td></tr><tr><td colspan="3">' + contraintes + '</td></tr></table>';
      newEl += '<center><div id="' + parametres.parentId + '_valider" style="background-image:url(/js/dependencies/composant/valider.png);background-repeat:no-repeat;width:32px;height:32px;"></div></center>';
				  nouvelElement.html(newEl);
 	  
 		//alert(nouvelElement.html());
	  $(this).prepend(nouvelElement).find("#" + parametres.parentId + "_agregat").prepend(parametres.unselect(parametres.groups)); 
	  
       $(this).find("#" + parametres.parentId + "_plus").click(function(){
      	//alert($(this).attr('id'));
      	var et = $("<f>et</f>");
      	
	    $("#" + parametres.parentId + "_agregat").prepend(et);  
      	$("#" + parametres.parentId + "_agregat").prepend(parametres.unselect(opts.groups));

      });
      $(this).find(".selGrp").val(parametres.preselection);
	  $("#" + parametres.parentId + "_moins").click(function(){
      	
      	$("#" + parametres.parentId + "_sel_" + (parametres.currentIdx-1)).remove();

      });  

      $("#" + parametres.parentId + "_fermeture").click(function(){
        parametres.fermeture();
     	  //$(this).parent().parent().parent().remove();
 	  });

	  $("#" + parametres.parentId + "_valider").click(function(){
     		var retour = {};
     	  	if(parametres.callback)
            {
               self = $(this).parent().parent().parent();
               tbGrp = new Array();
               self.find(".selGrp").each(function(){
               		if($(this).val()!= null && $(this).val() != undefined)tbGrp.push($(this).val());
               });	
               retour["groups"] = tbGrp;
               retour["numeros"] = self.find(".numeros").val();
               
               //contraintes
               if ( self.find(".chk_ns").is(':checked') )
               	retour["no_sortie"] = self.find(".no_sortie").val();
               else
               	retour["no_sortie"] = null;
               
               if (self.find(".chk_eg").is(':checked'))
               	retour["ecart_global"] = self.find(".ecart_global").val();
               else
               	retour["ecart_global"] = null;

               if (self.find(".chk_em").is(':checked'))
               	retour["ecart_moyen"] = {"directive": self.find(".ecart_moyen").val(), "tirages" : self.find(".ecart_moyen_tirage").val()};
               else
                retour["ecart_moyen"] = null;
              
               retour["parentId"] = parametres.parentId;	

               
               parametres.callback(retour);
            }
	  });





      
    };

})(jQuery);