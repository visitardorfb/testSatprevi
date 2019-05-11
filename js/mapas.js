$(document).ready(function(){

 arrayCasos = [];

obtenerConsolidadoCasos = function(){

  var Api = 'http://localhost:58813/api/Situacion/ObtenerConsolidadoCasosPorDepartamento';
  
  $.ajax({
      url: Api,
      dataType: "json",
      type: 'GET',
      data: {},
      asyn:true,
      contentType: "text/xml; charset=utf-8",
      cache: false,
      success: function (d) {  

        arrayCasos = d.Data[0].Table;
        setearCasos();
      },

      error: function (xhr, ajaxOptions, thrownError) {
          alert(JSON.stringify(xhr));
      },
      complete: function (d) { }
  });

}

obtenerConsolidadoCasos();

setearCasos = function(){
  var path = $('svg#nic-map path');

  $.each(path,function(idx, ele){
    if($(ele).data().id){
      
      var dep = $(ele).data().id;
      var criticos = 0;
      var medios = 0;
      var leves = 0;
      
      var casos = arrayCasos.filter(el => el.Departamento===dep);
      criticos = casos.reduce((a,b)=> a + (b.NivelSituacion === 1 ? b.CantidadCasos: 0),0 ); 
      medios = casos.reduce((a,b)=> a + (b.NivelSituacion === 2 ? b.CantidadCasos: 0),0 );    
      leves = casos.reduce((a,b)=> a + (b.NivelSituacion === 3 ? b.CantidadCasos: 0),0 );
      
      var estados = [
        {tipo:'criticos', valor:criticos}
        ,{tipo:'medios', valor:medios}
        ,{tipo:'leves', valor:leves}
      ];
      
      var estado = estados.reduce((a,b)=>a.valor > b.valor ? a : b,{});
      switch (estado.tipo) {
        case 'criticos':
        $(ele).addClass('casos-criticos');          
          break;
        
        case 'medios':
        $(ele).addClass('casos-medios');          
          break;

        case 'leves':
          $(ele).addClass('casos-leves');          
            break;

        default:
          break;
      }

      //[tablabase].[SP_ObtenerConsolidadoCasosPorDepartamento]

      $(ele).data().info = '<div><b>'+dep.toUpperCase()+'</b></div><div><b>Casos:</b></br>'+
      '<span>Criticos:'+criticos+' <span> </br>'+  
      '<span>Medios:'+medios+' <span> </br>'+ 
      '<span>Leves:'+leves+' <span> </div>';
    }

  });
}

setearCasosMunicipio = function(element){

  if(element.data().id){
      
    var municipio = element.data().id;
    var criticos = 0;
    var medios = 0;
    var leves = 0;
    
    var casos = arrayCasos.filter(el => el.Municipio===municipio);
    criticos = casos.reduce((a,b)=> a + (b.NivelSituacion === 1 ? b.CantidadCasos: 0),0 ); 
    medios = casos.reduce((a,b)=> a + (b.NivelSituacion === 2 ? b.CantidadCasos: 0),0 );    
    leves = casos.reduce((a,b)=> a + (b.NivelSituacion === 3 ? b.CantidadCasos: 0),0 );

    if (casos.length > 0) {
      var estados = [
        {tipo:'criticos', valor:criticos}
        ,{tipo:'medios', valor:medios}
        ,{tipo:'leves', valor:leves}
      ];
      
      var estado = estados.reduce((a,b)=>a.valor > b.valor ? a : b,{});
      switch (estado.tipo) {
        case 'criticos':
        element.addClass('casos-criticos');          
          break;
        
        case 'medios':
        element.addClass('casos-medios');          
          break;
  
        case 'leves':
        element.addClass('casos-leves');          
            break;
  
        default:
          break;
      }      
      element.data().info = '<div><b>'+element.data().name+'</b></div><div><b>Casos:</b></br>'+
        '<span>Criticos:'+criticos+' <span> </br>'+ 
        '<span>Medios:'+medios+' <span> </br>'+ 
        '<span>Leves:'+leves+' <span> </div>';
    }
    else{
      element.data().info ='<div><b>'+element.data().name+'</b></div><div><b>Casos:</b> Data</div>';
    }
    
   
}
}



    $("path, circle, polygon").hover(function(e) {
        $("#info-box").css("display", "block");
        $("#info-box").html($(this).data("info"));
      });
      
      $("path, circle, polygon").mouseleave(function(e) {
        $("#info-box").css("display", "none");
      });


      
      $(document)
        .mousemove(function(e) {
          $("#info-box").css("top", e.pageY - $("#info-box").height() - 35);
          $("#info-box").css("left", e.pageX - $("#info-box").width() / 2);
        })
        .mouseover();
      
      var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (ios) {
        $("a").on("click touchend", function() {
          var link = $(this).attr("href");
          window.open(link, "_blank");
          return false;
        });
      }

      $('.info-municipios').click(function(){
          debugger;
        var dep = $(this).data().departamento;
        var $departamento = $('svg#'+dep); 

        $.each($departamento.children(),function(idx, el){
          if($(el).find('title').text()){
            var municipio = $(el).find('title').text();
            $(el).find('title').remove();
            //data-id="sanmiguelito" data-info="<div><b>San Miguelito</b></div><div><b>Casos:</b> Data</div>"
            $(el).data().name = municipio;
            $(el).data().id = municipio.toLowerCase().split(' ').join('');

            setearCasosMunicipio($(el));

            
          }
         else {
           if ($(el).data().name) {
             var municipio = $(el).data().name;
             $(el).data().id = municipio.toLowerCase().split(' ').join('');
             setearCasosMunicipio($(el));
           }
         }
          
        });

        $('svg#nic-map').fadeOut();
        
        $('svg#'+dep).addClass('visible');
        $('svg#'+dep).fadeIn();
    });

    $('button#btn-verMapa').click(function(){
        $('svg#nic-map').fadeIn();
        $('.visible').fadeOut();
    });
      
});





