'user strict'
const log = {
  async nactiSoubor(typ) {
    try {
      let res, text
      if (typ === 'access') {
        res = await fetch('access.log')
      } else {
        res = await fetch('error.log')
      }
      text = await res.text()
      console.log(text)
      return text
    } catch (e) {
      console.log(e)
      return e
    }
  },
  vloz(text) {
    let divLog = document.querySelector('#log')
    console.log(text)
    divLog.textContent = text
  },
}

log.nactiSoubor('access').then((text) => {
  log.vloz(text)
})
