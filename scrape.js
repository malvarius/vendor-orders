var audio = new Audio('click.wav');
   $(".vendor").on('click',function(){
        console.log("clicked")
        doRest()
    })

async function doRest(){
    var info = await axios.get("https://spreadsheets.google.com/feeds/cells/1xSbe_GEtTUH0sJevvg7IjKdYttdcVW0Fx2yUcjlqMyo/1/public/full?alt=json")
    var headers=[];
    var products=[];
    var data = info.data.feed.entry
    // console.log(data)
    var currentRow='';
    data.forEach(item => {
        var row= item.gs$cell.row
        var value = item.content.$t
        if(row==='1'){
            headers.push(value)
        }else if(row!=="1"){
        var column = headers[Number(item.gs$cell.col)-1]
        var object = {
            category:column,
            value:value
        }
        products.push(object)
        }
    });
    console.log(products)
    var groupedRows = [];
    for(var i=0; i<products.length ; i=i+headers.length){
        var listItem={}
        for(var j=0; j<headers.length; j++){
            listItem[headers[j]]=products[j+i].value
        }
        groupedRows.push(listItem)
    }
   var finalObject={};
    groupedRows.forEach(thing=>{
        if(finalObject[thing.Vendor]){
            finalObject[thing.Vendor].push(thing)
        }else if(!finalObject[thing.Vendor]){
            finalObject[thing.Vendor]=[thing]
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
            var lineItem= `${element.Alcohol} | Quantity: ${element.par} \n`
            list+= lineItem
        })

        var email = intro + list + outtro
        var textArea=`<textarea name="input" id="appendText${count}" class="text-left d-block mx-auto"  cols="100" rows="10">${email}</textarea>
        <button data-id="${count}" class="btn btn-primary d-block mx-auto mb-5 grabText">Copy to Clipboard</button>
        `
        
        $('.emails').append(`<div class="col-sm-6">${textArea}</div>`)
    }
}
$(document).on('click',`.grabText`,function(){
    var num = $(this).attr("data-id")
    console.log(num)
    audio.play();
       const value = $(`#appendText${num}`).val();
       navigator.clipboard.writeText(value)
    
     })