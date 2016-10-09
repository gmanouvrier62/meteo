(function($)

{ 

    $.fn.caisse=function(opts)

    {
      Array.prototype.inArray = function (value)
      {
        var i;
        for (i=0; i < this.length; i++)
        {
          if (this[i] == value)
          {
           return true;
          }
        }
        return false;
      };
       //atteignable par parametres.curenIdx, etc...
       var defauts=

            {
            'lastAction': '',
            'memory': '',
            'tempon' : '',
            'groups' : 0,
	          'currentIdx': 0,       //Intervalle entre chaque image, en millisecondes
	          'parentId' : $(this).attr('id'),
            'caisse_init': $(this).attr('caisse_init'),
	          'callback': null,
            'une_contrainte': function () {
                var ct ="";
                var elCpt = 0;
                //alert(caisse_init.rows);
                var p_action = '';
	        			for(var rows = 1; rows <= caisse_init.rows;rows ++) {
                  ct += "<tr>";
                  for(var cols = 1; cols <= caisse_init.cols;cols ++) {
                    if(elCpt<caisse_init.items.length-1) {
                        var additionnel = "";
                        if(caisse_init.items[elCpt].bgcolor != '') additionnel += "background-color:" + caisse_init.items[elCpt].bgcolor + ";";
                        if(caisse_init.items[elCpt].color != '') additionnel += "color:" + caisse_init.items[elCpt].color + ";";
                        
                        p_action = caisse_init.items[elCpt].content;
                        ct += "<td class='push_button' action='" + p_action + " ' datas='" + JSON.stringify(caisse_init.items[elCpt]) + "' style='" + additionnel + "'>" + caisse_init.items[elCpt].content  +  "</td>";
                    } else
                    {
                       ct += "<td class='vide'></td>";
                    }
                    elCpt ++;
                  }
                  ct += "</tr>";
                }
                var head="<thead><tr><th></th><th></th><th></th><th></th></tr></thead>";
                return "<table cellspacing='6' style='width:400px'>" + head + "<tr><td colspan='" + caisse_init.cols + "'><input type='txt' style='width:100%;height:30px' id='stdout'></td></tr>" + ct + "</table>";
             }
            };

        var parametres=$.extend(defauts, opts);     

      //click de chaque bouton
      $(this).on("click", '.push_button', function() {
        var ltb = [0,1,2,3,4,5,6,7,8,9];
        //alert($(this).attr("datas"));
        var obj = JSON.parse($(this).attr("datas"));
        if(ltb.inArray(obj.content)) {
          $("#stdout").val($("#stdout").val() + obj.content);
          if(parametres.lastAction.trim() != '') {
            $("#stdout").val('');
            $("#stdout").val(obj.content);
            parametres.lastAction = '';
          }
          parametres.memory = $("#stdout").val();
          

        } else {
          
          
          if($(this).attr("action").trim() == 'RAZ') {
           
            parametres.memory = '';
            parametres.lastAction = '';
            $("#stdout").val('');
          }
          if($(this).attr("action").trim() == '+') {
            alert('c bien un plus');
            parametres.tempon += parametres.memory + '+';
           

          }
          if($(this).attr("action").trim() == '-') {
            parametres.tempon += parametres.memory + '-';
          }
          if($(this).attr("action").trim() == '*') {
            parametres.tempon += parametres.memory + '*';
          }
          if($(this).attr("action").trim() == '/') {
            parametres.tempon += parametres.memory + '/';
          }
          if($(this).attr("action").trim() == 'C') {
            parametres.memory = '';
            $("#stdout").val('');
          }
          if($(this).attr("action").trim() == 'TOTAL') {
            parametres.tempon += parametres.memory
            alert(parametres.tempon);
            var ttl = eval(parametres.tempon);
            $("#stdout").val(ttl);
            parametres.memory = 0;
            parametres.tempon = '';

          }
           parametres.lastAction = $(this).attr("action").trim();
          //alert(parametres.lastAction);
        }

      });
    
      
      $(this).attr("style","float:left; margin-top: 50px; padding: 10px 20px 20px; line-height: 1; color:#fff; -moz-border-radius: 30px; -webkit-border-radius: 30px; border-radius: 30px; background:linear-gradient(to top,#ED283F,#ED7171)");
      


	 /*
      var nouvelElement = $('<div id="' + parametres.parentId + '_principal">');
      var newEl = '<center><b>Gestion des occurences</b><div id="' + parametres.parentId + '_fermeture_occ" style="float:right;background-image:url(/js/dependencies/composant/cancel.png);background-repeat:no-repeat;width:24px;height:24px;"></div></center><br>';
      		newEl += '<table id="' + parametres.parentId + '_occ"></table>';
      newEl += '<center><div id="' + parametres.parentId + '_valider_occ" style="background-image:url(/js/dependencies/composant/valider.png);background-repeat:no-repeat;width:32px;height:32px;"></div></center>';
				  nouvelElement.html(newEl);
 	  */
 		//alert(nouvelElement.html());
    var lec = parametres.une_contrainte();
	  //alert(lec);
    $(this).prepend(lec); 
	  
       
      
    };

})(jQuery);