'use strict'
//  automaticke nacitani - ted mi to nehleda, protoze jsem prestal mazat seznam zrejme
// ocisteni
//refactoring, zkusit worker?
// production veze
//roztrhnout na objekt kreslit barvit a ostatni, mozna hledat

//console.clear()
const log = {
  pocetTag: document.querySelector('.pocet'),
  inputTag: document.querySelector('.input'),
  hledatButtonTag: document.querySelector('.button'),
  monitorPryc: ['zabbix', 'mondocucist'],
  divLog: document.querySelector('#log'),
  posledni : 'zde bude posledni radek pro nacitani novych aktualizaci',
  aktualizace : true,
  refreshTag: document.querySelector('.refresh'),
  idTime : 'zde bude idtimeoutu pro zastaveni, aby se nemnozilo po zmene refreshe',
  async nactiSoubor(typ) {
    let res, text
    try {
      if (typ === 'access') {
        res = await fetch('access.log')
      } else {
        res = await fetch('error.log')
      }
      text = await res.text()
      return text
    } catch (e) {
      console.log(e)
      return e
    }
  },
  async zpracuj(text) {
    let split
    let monitor
    
    
    // pridej konec radky a udelej pole
    
    split = await text.split(/\n/)
     //ulozit posledni pridany radek do souboru pro nacitani aktualizaci dle asu
    //opet empty string na konci , musim dat -2
    
    if (this.aktualizace){
   
    //najdu index radku v nove varce, kde je posledni zaznam z minule varky
    //odfiltruju pryc podle indexu ty starsi zaznamy, vratim do pole pouze nove zazanmy
    split = split.filter ((e,i)=> {
      // vratim true pokud je index vetsi (novejsi) nez ulozena hodnota z poslendiho nacteni
          if (i > split.indexOf(log.posledni)){
            return true
          } 
    })
  }
     // // nactu posledni z minule varky, abych mohl pouzit v dalsim volani zpracuj 
    log.posledni = split[split.length-2].split(' ')
    //nastavim aktualizace na true , aby po prvni nacteni jen aktualizoval
    

    // // odstranit zaznamy monitoru    
    monitor = await split.filter((radek) => {
     
  
      
        let lowerr = radek.toLowerCase()
        let lpart = false
        //hladem pro kazdou hodnotu pole v monitoru, pokud najdu tam odfiltruju
        this.monitorPryc.forEach((lco) => {
          if (lowerr.includes(lco)) {
            lpart = true
          }
        })
        if (lpart) {
          return false
        } else return true
      }
    )
      
    //vrat reverse order, prvni je posledni v cas
    return monitor.reverse()
  },
  zobraz(filtered) {
    ///nastaveni defautl velikost strankovani 43,pokud nemam vybrano
    let lpocet =
      log.pocetTag.value == 0 ? 43 : document.querySelector('.pocet').value

    //console.log(lpocet)
    //nechi promazavat textarea pokud aktualizuju
    if (!log.aktualizace){
    this.divLog.innerHTML = ''
    }
    //mrknu jestli mam vykresil pocet radek, nebo pocet z hledani,
    // pokud mam vic radek nez najdu tak kresli undefined
    //check jestli pole po hledani neni prazdne
    let vyssi = () => {
      if (lpocet > filtered.length) {
        return filtered.length
      } else {
        return lpocet
      }
    }
    if (filtered.length > 0) {
      let strong
      //TODO - proc mam prvni zaznam pole empty string, davam od 1 teda?
      for (let i = 1; i < vyssi(); i++) {
        strong = document.createElement('strong')
        //this.divLog.textContent += this.obarvit(filtered[i]) + '\n'
        this.divLog.innerHTML += this.obarvit(filtered[i]) + '\n'
      }
    }
  },
  obarvit(radek) {
    let radekPole = radek.split(' ')
    let radekPoleProHledani = radekPole
    //console.log(radekPole)
    radekPole[3] = `<span class="cas">${radekPole[3]}</span>`
    if (/40+/.test(radekPole[8])) {
      radekPole[8] = `<span class="red">${radekPole[8]}</span>`
    } else if (/20+/.test(radekPole[8])) {
      radekPole[8] = `<span class="green">${radekPole[8]}</span>`
    } else if (/50+/.test(radekPole[8])) {
      radekPole[8] = `<span class="ultrared">${radekPole[8]}</span>`
    }
    //pokud hledam, tak chci obarvit hledani
    let co = this.inputTag.value
    if (co) {
      let coPole = co.split(' ')
      //console.log(coPole)
      //console.log(radekPole)
       let idx
      // let eHl = {}
      // eHl = radekPole.filter( e => e.includes(coPole));
      // console.log('hlele', eHl.length,eHl)
      // eHl.forEach( e => {
      //   radekPole.value 
      //   = `<span class="hledat">${radekPole[idxHlEl]}</span>`} )
      
       coPole.forEach( co => {
       idx = radekPoleProHledani.findIndex(e=> e == co)
       //console.log('idx',idx)
       radekPoleProHledani[idx] = `<span class="hledat">${radekPoleProHledani[idx]}</span>`
             }
       )
       //console.log('hledam obarveno')
         radekPole = radekPoleProHledani    
      }
   
      
      return radekPole.join(' ')
    }

   
  ,
  zmenitPocetRadek() {
    this.log = document.querySelector('.pocet')
    console.log(this.log)
  },
  hledat(split, co) {
    let hledamVic
    let filtered
    if (this.inputTag.value.length >= 3) {
      if (!co.includes(' ')) {
        filtered = split.filter((radek) =>
          radek.toLowerCase().includes(co.toLowerCase(co))
        )
      } else {
        hledamVic = co.toLowerCase().split(' ')
        filtered = split.filter((radek) => {
          let partok = 0
          // hledam pro kazde slovo v inputu hledani
          hledamVic.forEach((lco) => {
            if (radek.toLowerCase().includes(lco)) {
              partok++
            }
          })
          //pokud sedi na vsechny slova tak vratim do filter funkce z callback true
          if (partok == hledamVic.length) {
            return true
          } else {
            return false
          }
        })
      }
      //console.log(filtered)
      return filtered
      //vratim kdyz nic nehledam tak beze zmeny
    } else {
      return split
    }
  },
  hledatRun() {
    if (log.inputTag.value.length >= 3) {
      log.runx()
      console.log('klik')
    } else if (log.inputTag.value.length == 0) {
      log.runx()
    } else {
      alert('Prosim vyplněte alespoň tři znaky')
    }
  },
   
  async runx() {
    //console.clear()
    const text = await log.nactiSoubor('access')
    //console.log(text)
    const zpracovano = await log.zpracuj(text)
    //console.log(zpracovano)
    const filtered = await log.hledat(zpracovano, this.inputTag.value)
    //console.log(filtered)
    await log.zobraz(filtered)

    
    //console.log(log.refreshTag.value)
    //log.refresh = document.querySelector('refresh')
    
    if ((log.aktualizace) && (log.refreshTag.value!=="off")){
      log.idTime =  setTimeout(()=>{
        console.log('bezi timeout',log.refreshTag.value)
        
        //pokud je v selectu defatul value=0 jako label, nastavim 5s
        log.runx()}, (log.refreshTag.value==0)? 5000:`${log.refreshTag.value}000`)
}
  },
 
}
//na zacatku pri nacteni staranky nacti soubor
window.onload = () => log.runx()
// nacti soubor pri zmene poctu radku na strance
// log.pocetTag.addEventListener('change',()=>{
//    log.runx()
// })

log.hledatButtonTag.addEventListener('click', () => {
  log.hledatRun()
})
log.inputTag.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    log.hledatRun()
  }
})
log.pocetTag.addEventListener('change', () => {
  log.runx()
})

log.refreshTag.addEventListener('change', () => {
  clearTimeout(log.idTime)
  if (log.refreshTag.value=="off"){
    log.aktualizace = false
  } else{
    log.aktualizace = true
    log.runx()
  }

})

// let part = log.nactiSoubor('access').then((text)=>{log.zpracovani(text)})
// log.vloz(part);
// // .then((split) => {log.vloz(split)})
// console.log('part'||part )

// window.onload = () => {
//   let x = [1, 2, 3, 9, 15, 36, 5, 9, 1, 2, 3, 4, 5]
//   let y = [1, 3]
//   let z = []
//   console.log('lod')
//   z = _.differenceWith(x, y, _.isEqual)
//   console.log(z)
// }
