"use strict";
//TODO

// predelat ty dlouhe podminky na kratke filter a for each?
// ocisteni
//refactoring, zkusit worker?
// production veze a parcel2

//roztrhnout na objekt kreslit barvit a ostatni, mozna hledat

//console.clear()
const log = {
  pocetTag: document.querySelector(".pocet"),
  inputTag: document.querySelector(".input"),
  hledatButtonTag: document.querySelector(".button"),
  monitorPryc: ["zabbix", "mondocucist"],
  divLog: document.querySelector("#log"),
  posledni: [],
  aktualizace: false,
  refreshTag: document.querySelector(".refresh"),
  idTime:
    "zde bude idtimeoutu pro zastaveni, aby se nemnozilo po zmene refreshe",
  async nactiSoubor(typ) {
    let res, text;
    try {
      if (typ === "access") {
        res = await fetch("access.log");
      } else {
        res = await fetch("error.log");
      }
      text = res.text();
      return text;
    } catch (e) {
      console.log(e);
      return e;
    }
  },
  async zpracuj(text) {
    let split;
    let monitor;
    // pridej konec radky a udelej pole , odstrani prazdny prvni prvek na 0
    split = await text.split(/\n/);
    console.log("co mam ve splitu na zacatku", split);
    split.pop();
    console.log("co mam na zacatku v poli", split);
    //ulozit posledni pridany radek do souboru pro nacitani aktualizaci dle asu
    //opet empty string na konci , musim dat -2
    if (this.aktualizace) {
      //najdu index radku v nove varce, kde je posledni zaznam z minule varky
      //odfiltruju pryc podle indexu ty starsi zaznamy, vratim do pole pouze nove zazanmy
      console.log("jak bezi filtr na aktualizaci");
      console.log("log.posledni je", log.posledni);
      console.log(
        "hledam podle split.indexOf(log.posledni",
        split.indexOf(log.posledni)
      );
      split = split.filter((e, i) => {
        console.log("split filter podle indexu", e, i);
        // vratim true pokud je index vetsi (novejsi) nez ulozena hodnota z poslendiho nacteni
        if (i > split.indexOf(log.posledni)) {
          console.log("podminka hledam vetsi index, pak vratim true");
          return true;
        }
      });
      console.log(
        "pokud mam aktu a nic noveho, taky split musi vracet nic",
        split
      );
    }
    // // nactu posledni z minule varky , abych mohl pouzit v dalsim volani zpracuj. Pokud mam prazdny pole, tedy nula prirustku, tak necham z minule, nelze porovnavat proti null
    if (split.length > 0) {
      log.posledni = split[split.length - 1];
    }
    console.log("v posledni z minule varky mam", log.posledni);
    // // odstranit zaznamy monitoru
    monitor = await split.filter((radek) => {
      let lowerr = radek.toLowerCase();
      let lpart = false;
      //hladem pro kazdou hodnotu pole v monitoru, pokud najdu tam odfiltruju
      this.monitorPryc.forEach((lco) => {
        if (lowerr.includes(lco)) {
          lpart = true;
        }
      });
      if (lpart) {
        return false;
      } else return true;
    });

    //vrat reverse order, prvni je posledni v cas
    console.log("co vracim po monitoru", monitor);
    return monitor.reverse();
  },
  zobraz(filtered) {
    ///nastaveni defautl velikost strankovani 43,pokud nemam vybrano
    let lpocet = log.pocetTag.value == 0 ? 43 : this.pocetTag.value;

    console.log("aktualizace pred checkem zobraz", log.aktualizace);
    //nechi promazavat textarea pokud aktualizuju
    console.log(log.aktualizace);
    if (!log.aktualizace) {
      this.divLog.innerHTML = "";
    }
    //mrknu jestli mam vykresil pocet radek, nebo pocet z hledani,
    // pokud mam vic radek nez najdu tak kresli undefined
    //check jestli pole po hledani neni prazdne
    let vyssi = () => {
      if (lpocet > filtered.length) {
        return filtered.length;
      } else {
        return lpocet;
      }
    };
    if (filtered.length > 0) {
      let strong;
      //TODO - proc mam prvni zaznam pole empty string, davam od 1 teda?
      for (let i = 0; i < vyssi(); i++) {
        strong = document.createElement("strong");
        // pridavam do textarea kazdy radek z pole. Pokud je aktualizace, tak chci pridavat na zacatekm ne na konec
        if (log.aktualizace) {
          this.divLog.innerHTML = this.obarvit(filtered[i]) + `\n` + this.divLog.innerHTML;
        } else {
          this.divLog.innerHTML += this.obarvit(filtered[i]) + "\n";
        }
      }
    }
  },
  // zmenitPocetRadek() {
  //   this.log = document.querySelector('.pocet')
  //   console.log(this.log)
  // },
  hledat(split, co) {
    console.log("split na zacatku hledani", split);
    let hledamVic;
    let filtered;
    if (this.inputTag.value.length >= 3) {
      if (!co.includes(" ")) {
        filtered = split.filter((radek) =>
          radek.toLowerCase().includes(co.toLowerCase(co))
        );
      } else {
        hledamVic = co.toLowerCase().split(" ");
        filtered = split.filter((radek) => {
          let partok = 0;
          // hledam pro kazde slovo v inputu hledani
          hledamVic.forEach((lco) => {
            if (radek.toLowerCase().includes(lco)) {
              partok++;
            }
          });
          //pokud sedi na vsechny slova tak vratim do filter funkce z callback true
          if (partok == hledamVic.length) {
            return true;
          } else {
            return false;
          }
        });
      }
      console.log("vyfiltrovano", filtered);
      return filtered;
      //vratim kdyz nic nehledam tak beze zmeny
    } else {
      console.log("co mam ve splitu pokud nehledam", split);
      return split;
    }
  },
  async runx() {
    //console.clear()
    //odstinim proces zpracovani, pokud z aktualizace je nula novych radku

    const text = await log.nactiSoubor("access");
    console.log("po nacteni soub akt", this.aktualizace);

    const zpracovano = await log.zpracuj(text);
    if ((this.aktulaizace = true) && zpracovano.length > 0) {
      console.log("aktializace po zaprac", log.aktualizace);
      console.log("pole zprac", zpracovano);
      const filtered = await log.hledat(zpracovano, this.inputTag.value);
      //console.log(filtered)
      await log.zobraz(filtered);
    }
    //console.log(log.refreshTag.value)
    //log.refresh = document.querySelector('refresh')
    //pokud mam delat refresh tak zacnu, casto chci az po prvnim prochodu
    if (log.refreshTag.value !== "off") {
      log.aktualizace = true;
    }
    //znovu spoustum runx pokud mam atkualaci nastavenou a button
    if (log.aktualizace && log.refreshTag.value !== "off") {
      log.idTime = setTimeout(
        () => {
          console.log("bezi timeout", log.refreshTag.value);

          //pokud je v selectu defatul value=0 jako label nastavim 5s defautlni hosdntotu
          log.runx();
        },
        log.refreshTag.value == 0 ? 5000 : `${log.refreshTag.value}000`
      );
    }
  },
  obarvit(radek) {
    let radekPole = radek.split(" ");
    let radekPoleProHledani = radekPole;
    //console.log(radekPole)
    radekPole[3] = `<span class="cas">${radekPole[3]}</span>`;
    if (/40+/.test(radekPole[8])) {
      radekPole[8] = `<span class="red">${radekPole[8]}</span>`;
    } else if (/20+/.test(radekPole[8])) {
      radekPole[8] = `<span class="green">${radekPole[8]}</span>`;
    } else if (/50+/.test(radekPole[8])) {
      radekPole[8] = `<span class="ultrared">${radekPole[8]}</span>`;
    }
    //pokud hledam, tak chci obarvit hledani
    let co = this.inputTag.value;
    if (co) {
      let coPole = co.split(" ");
      //console.log(coPole)
      //console.log(radekPole)
      let idx;
      coPole.forEach((co) => {
        idx = radekPoleProHledani.findIndex((e) => e == co);
        //console.log('idx',idx)
        radekPoleProHledani[
          idx
        ] = `<span class="hledat">${radekPoleProHledani[idx]}</span>`;
      });
      //console.log('hledam obarveno')
      radekPole = radekPoleProHledani;
    }

    return radekPole.join(" ");
  },
};
//na zacatku pri nacteni staranky nacti soubor
window.onload = () => log.runx();

// Pokud zmeni u tlacitka refresh nebo pocet radek hodnotu, tak musim na jeden cyklus zastavit refresh, abych mohl vykreslit vse znovu
// refresh checkuje nove veci a pokud nejsou tak nic neudela, tzn. ani nezmeni pocet niceho radek
//nutno take zastavit timeout, refresh si ho pusti sam v dalsim cyklu
log.hledatButtonTag.addEventListener("click", () => {
  //musim nechat hledat pri zapnute akyualizaci, tzn. necham jeden prubem bez aktualizace a pak ji zapnu

  log.aktualizace = false;
  console.log(log.aktualizace);
  clearTimeout(log.idTime);
  log.runx();
  console.log("aktualizace po run", log.aktualizace);
  if (log.refreshTag.value !== "off") {
    log.aktualizace = true;
  }
});
log.inputTag.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    //musim nechat hledat pri zapnute akyualizaci, tzn. necham jeden prubem bez aktualizace a pak ji zapnu
    log.aktualizace = false;
    clearTimeout(log.idTime);
    console.log("vypnuty time a aktualizace false", log.aktualizace);
    log.runx();
  }
});

log.pocetTag.addEventListener("change", () => {
  clearTimeout(log.idTime);
  log.aktualizace = false;
  log.runx();
  if (log.refreshTag == "off") {
    log.aktualizace = true;
  }
});

log.refreshTag.addEventListener("change", () => {
  clearTimeout(log.idTime);
  if (log.refreshTag.value == "off") {
    log.aktualizace = false;
  } else {
    log.aktualizace = true;
    log.runx();
  }
});

// form nechci submitovat
const form = document.querySelector("#controls");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // actual logic, e.g. validate the form
  console.log("Form submission cancelled.");
});
// po F5 nastavit deault valu, at to neporusuje aktualizacni  flow
window.addEventListener("keyup", (e) => {
  if (e.key == "F5") {
    console.log("reset");
    form.reset();
  }
});
