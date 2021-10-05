'use strict'
const log = {
    pocetTag : document.querySelector('.pocet'),
    inputTag : document.querySelector('.input'),
    hledatButtonTag : document.querySelector('.button'),
    async nactiSoubor(typ) {
    let res,text
    try {
      
      if (typ === 'access') {
        res = await fetch('access.log')
      } else {
        res = await fetch('error.log')
      }
      text = await res.text()
     // console.log(text)
      return text
    } catch (e) {
      console.log(e)
      return e
    }
  },
   async zpracuj (text){
     let split
       split =  await text.split(/\n/)
     // console.log('zpracovani')
     // console.log(split)
      return split
     

  },
  zobraz (filtered) {
    let lpocet = log.pocetTag.value==0 ? 43 : document.querySelector('.pocet').value
    let divLog = document.querySelector('#log')
    console.log('vloz')
    console.log(lpocet)
     divLog.textContent=""
    for (let i=0 ; i< lpocet;i++){
      //console.log(split[i])
      divLog.textContent += split[i]
     }
    },
  zmenitPoceRadek (){
      this.log = document.querySelector('.pocet')
      console.log(this.log)
    }, 
  hledat (split,co){
        return filtered =  split.filter( radek => radek.includes(co) )
        
    }   
    ,
   async  runx  () {
  // console.log(log.pocet)
   // const xx = await console.log('hoho')
    const text = await log.nactiSoubor ('access')
    const zpracovano = await log.zpracuj(text)
    const filtered = await log.hledat(zpracovano,'404')
    await log.zobraz(filtered)
 }
 
  }
//na zacatku pri nacteni staranky nacti soubor
window.onload = (()=>log.runx())    
 // nacti soubor pri zmene poctu radku na strance
// log.pocetTag.addEventListener('change',()=>{
//    log.runx()
// })

// log.hledatButtonTag('click',e => {
//   if (inputTag.value.length >=3)
//       // log.hledat(inputTag.value)
//       console.log('klik'      
//       )
//       else{
//         alert('Prosim vyplněte alespoň tři znaky')
//       }
// })
 



// let part = log.nactiSoubor('access').then((text)=>{log.zpracovani(text)})
// log.vloz(part);
// // .then((split) => {log.vloz(split)})
// console.log('part'||part )

