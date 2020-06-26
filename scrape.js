$(document).ready(function(){
    var audio = new Audio('click.wav');
doRest();
   $(".vendor").on('click',function(){
        console.log("clicked")
        doRest()
    })

async function doRest(){
    var info = await axios.get("https://spreadsheets.google.com/feeds/cells/1xSbe_GEtTUH0sJevvg7IjKdYttdcVW0Fx2yUcjlqMyo/1/public/full?alt=json")
    $('.emails').empty()
    var headers=[];
    var products=[];
    var data = info.data.feed.entry
    console.log(data)
    var currentRow='';
    data.forEach(item => {
        var row= item.gs$cell.row
        var value = item.content.$t || ""
        if(row==='1'){
            headers.push(value)
        }else if(row!=="1"){
            console.log("Row: "+row+ "Column: "+item.gs$cell.col)
        var column = headers[Number(item.gs$cell.col)-1]
        var object = {
            category:column,
            value:value || ""
        }
        products.push(object)
        }
    });
    var groupedRows = [];
    for(var i=0; i<products.length ; i=i+headers.length){
        var listItem={}
        for(var j=0; j<headers.length; j++){
            listItem[headers[j]]=products[j+i].value.trim();
        }
        groupedRows.push(listItem)
    }
   var finalObject={};
   console.log(groupedRows)
    groupedRows.forEach(thing=>{
        var vendor= thing.Vendor.trim()
        if(finalObject[vendor]){
            finalObject[vendor].push(thing)
        }else if(!finalObject[vendor]){
            finalObject[vendor]=[thing]
        }
    })
    console.log(finalObject)
    var count=0;
    for (var key in finalObject){
        count++
        var intro = `Hi ${finalObject[key][0].Vendor},\n
This is Kara from Reunion/Asada just emailing you to setup an order for the following items: \n \n`
        var outtro = `\nRegards, \nKara Trieglaff`
        var list =''
        finalObject[key].forEach(element=>{
            if(element.par>0){
                var lineItem= `==============================================
${element.Alcohol} | Type: ${element.Type} | Quantity: ${element.par} ${element.type} \n`
            list+= lineItem
            }
        })

        var email = intro + list + outtro
        var textArea=`<h2 class="text-center">${finalObject[key][0].Vendor}</h2>
        <textarea name="input" id="appendText${count}" class="text-left d-block mx-auto textArea"  cols="100" rows="10">${email}</textarea>
        <button data-id="${count}" class="btn btn-primary d-block mx-auto mb-5 grabText">Copy to Clipboard</button>
        `
        
        if(finalObject[key][0].Vendor!="not ordered"){
            $('.emails').append(`<div class="col-sm-4">${textArea}</div>`)
        }
    }
}
$(document).on('click',`.grabText`,function(){
    var num = $(this).attr("data-id")
    console.log(num)
    audio.play();
       const value = $(`#appendText${num}`).val();
       navigator.clipboard.writeText(value)
    
     })
})