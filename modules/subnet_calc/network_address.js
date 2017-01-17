$(document).ready(function(){
    
    $("input.net_ad_input").focusin(function(){
       	elementID = $(this).attr("id");
       $("td."+elementID+"_bin").remove();
        $("span#netad_stat").text("Calculating ... ");
        if($(this).val()!=""){
        	compute_address(this);
        }
    });
    /*$("input.net_ad_input").keyup(function(){
       	
        $("span#netad_stat").text("Calculating ... ");
    });
    $("input.net_ad_input").keydown(function(){
       
        $("span#netad_stat").text("");
    });*/
    $("input.net_ad_input").focusout(function(){
        $("span#netad_stat").text("");
        var ip_address_bin = '';
        var elementID = $(this).attr("id");
       $("td."+elementID+"_bin").css("background-color","#fff");
    });

    $("input.net_ad_input").keyup(function(){
		compute_address(this);    	
    });
    $("button#net_add_button").click(function(){
    	compute_net_address();

    });
});
function compute_net_address () {
	// body...
	$("tr#net_add_ans").remove();
	$("tr#hr_line").remove();
	$("tr#net_add_ans_dec").remove();
	var netadd ='';
	var octet_count=1;
	var ip_address = $("td.ip_address_bin").text();
	var net_mask = $("td.net_mask_bin").text();
	netadd = '<tr id="hr_line"><td colspan="33" style=""><hr style="width:100%"></td></tr><tr id="net_add_ans"><td>Net Address </td></tr><tr id="net_add_ans_dec"><td>&nbsp;</td></tr>';
	$('table#netadd_result').append(netadd);
	var netadd2 ='';
	time =700;
	var octet_net_add_bin="";
	for (var i = 0; i < net_mask.length; i++) {
		
   		animate_output(net_mask[i],ip_address[i],i,time);
   		octet_net_add_bin = octet_net_add_bin +parseInt(parseInt(net_mask[i])&&parseInt(ip_address[i]));
   		
		time+=700;
		decimal="";
		if(parseInt(i+1)%8==0){
			netadd2 = '<td class=""></td>';
			$('tr#net_add_ans').append(netadd2);
			//convert to decimal
			decimal = compute_address_decimal(octet_net_add_bin,octet_count);
			
			octet_html = "<td id='net_add_octet"+octet_count+"' style='text-align:center;display:none' colspan='8'><h4>"+decimal+"</h4></td>";
			$('tr#net_add_ans_dec').append(octet_html);
			if (octet_count<4) {
				$('tr#net_add_ans_dec').append("<td style='text-align:center'><h4>.</h4></td>");
			}
			$('td#net_add_octet'+octet_count).delay(parseInt(time)).fadeIn();
			octet_count++;
			//initiate octet to ""
			//console.log(octet_net_add_bin);
			octet_net_add_bin = "";
		}
	};
	netadd2 = netadd2+"</tr>";
	$('tr#net_add_ans').append(netadd2);
	//$('table#netadd_result').append(netadd);
	//console.log($('tr#net_add_ans').text());
	//compute_address_decimal();

}

function compute_address_decimal (octet,octet_count) {
	// body...
	/*var net_add_bin = $('tr#net_add_ans').text();
	for (var i = 0; i < net_add_bin.length; i++) {
		net_add_bin[i];
	};*/
	var time = 700*8;
	var decimal = 0;
	var j=0;
	for(var i=octet.length-1;i>-1;i--){
		decimal = parseInt(parseInt(Math.pow(2,j)*parseInt(octet[i]))+parseInt(decimal));
		console.log(decimal);
		j++;
	}
	
	return decimal;
}


function animate_output(n_bit,i_bit,count,time){
	netadd2 = '<td style="display:none" class="bit_'+count+'">'+parseInt(parseInt(n_bit)&&parseInt(i_bit))+'</td>';
		$('tr#net_add_ans').append(netadd2);
		
		$('td.bit_'+count).delay(parseInt(time)).fadeIn();
		$("tr#ip_address_bin td.bit_"+count).css('background-color',"#fff").delay(50)
         .queue(function() {
            $(this).css("background", "lightgreen").dequeue();
            
   		}).delay(200).queue(function() {
            $(this).css("background", "#fff").dequeue();
            
   		});
   		$("tr#net_mask_bin td.bit_"+count).css('background-color',"#fff").delay(100)
         .queue(function() {
            $(this).css("background", "lightgreen").dequeue();
            
   		}).delay(200).queue(function() {
            $(this).css("background", "#fff").dequeue();
            
   		});
   		$("tr#net_add_ans td.bit_"+count).css('background-color',"#fff").delay(0)
         .queue(function() {
            $(this).css("background", "lightgreen").dequeue();
            
   		}).delay(200).queue(function() {
            $(this).css("background", "#fff").dequeue();
            
   		});
       $("td.bit_"+count).css('text-align','center');
       $("td.bit_"+count).css('border-radius','50%');
		
	//compute_address_decimal();

}
function compute_address(obj_this){
	var elementID = $(obj_this).attr("id");
    	 $("td."+elementID+"_bin").remove();
       var ipadd = $(obj_this).val();
       var octets = ipadd.split(".");
       var ipadd_bin = new Array();
       console.log(octets);
       
       var temp=0;
       for (var i = 0; i < octets.length; i++) {
       		ipadd_bin[i] = "";
       		temp = octets[i];
       	for (var j = 0; j< 8; j++) {
       		if(temp!=0){
       			//modulo ipadd[i] by 2, append answer to ipadd_bin
       			ipadd_bin[i] = parseInt(parseInt(temp)%2) + ipadd_bin[i];
       			//console.log(ipadd_bin);
       			//divide ipadd[i] by 2 get ans to temp var
       			temp = parseInt(parseInt(temp)/2);
       			//console.log(temp);
       		}else if(j<8){
       			ipadd_bin[i] = "0"+ipadd_bin[i];
       		}
       		

       	};
       };
       var ip_address_bin = '';
       
       var td_class =elementID+"_bin";
       var bit_counter = 0;
       for (var i = 0; i < ipadd_bin.length; i++) {

       		for (var j = 0; j < ipadd_bin[i].length; j++) {
       			
       			ip_address_bin = ip_address_bin+"<td class='"+td_class+" octet_"+i+" bit_"+bit_counter+"' >"+ipadd_bin[i][j]+"</td>";
       			bit_counter++; //0-31
       		};
       		//ip_address_bin = ip_address_bin +ipadd_bin[i]
       		ip_address_bin = ip_address_bin+"<td class='"+td_class+" '></td>";	
       };
       
       

       $("tr#"+td_class).append(ip_address_bin);
       $("td."+td_class).css('width','10px');
       $("td."+td_class).css('height','10px');
       var octets_color = new Array("lightgreen","orange", "lightblue", "lightpink");
       
       $("tr#"+td_class+" td.octet_"+parseInt(octets.length-1)).css('background-color',octets_color[octets.length-1]);
       $("tr#"+td_class+" td.octet_"+parseInt(octets.length-1)).css('text-align','center');
       $("tr#"+td_class+" td.octet_"+parseInt(octets.length-1)).css('border-radius','50%');
       
       console.log(ipadd_bin);
}