'use strict'
console.clear()
const log = {
  pocetTag: document.querySelector('.pocet'),
  inputTag: document.querySelector('.input'),
  hledatButtonTag: document.querySelector('.button'),
  monitorPryc: ['zabbix', 'mondocucist'],
  async nactiSoubor(typ) {
    let res, text
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
  async zpracuj(text) {
    let split
    let monitor
    // pridej konec radky a udelej pole
    split = await text.split(/\n/)
    // odstranit zaznamy monitoru
    monitor = await split.filter((radek) => {
      {
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
    })
    console.log(monitor)
    //udelej reverse order, prvni je posledni v cas
    return monitor.reverse()
  },
  zobraz(filtered) {
    ///nastaveni defautl velikost strankovani 43,pokud nemam vybrano
    let lpocet =
      log.pocetTag.value == 0 ? 10 : document.querySelector('.pocet').value
    let divLog = document.querySelector('#log')
    console.log('vloz')
    console.log(lpocet)
    divLog.textContent = ''
    for (let i = 0; i < lpocet; i++) {
      divLog.textContent += filtered[i] + '\n'
    }
  },
  zmenitPoceRadek() {
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
        console.log('multi filtr')
        hledamVic = co.toLowerCase().split(' ')
        console.log(hledamVic)
        filtered = split.filter((radek) => {
          let partok = 0
          // hledam pro kazde slovo v inputu hledani
          hledamVic.forEach((lco) => {
            if (radek.toLowerCase().includes(lco)) {
              console.log('je to ok')
              partok++
              console.log(partok)
              console.log(hledamVic.length)
            }
          })
          //pokud sedi na vsechny slova tak vratim do filter funkce z callback true
          if (partok == hledamVic.length) {
            console.log('sedi vsechny')
            return true
          } else {
            return false
          }
        })
      }
      console.log('filter')
      console.log(filtered)
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
    console.clear()
    // console.log(log.pocet)
    // const xx = await console.log('hoho')
    const text = await log.nactiSoubor('access')
    const zpracovano = await log.zpracuj(text)
    const filtered = await log.hledat(zpracovano, this.inputTag.value)
    await log.zobraz(filtered)
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
