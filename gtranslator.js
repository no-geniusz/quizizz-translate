const {Builder, By, until} = require(`selenium-webdriver`)
const chrome = require(`selenium-webdriver/chrome`)

let operationCenter = new Builder().forBrowser(`chrome`).setChromeOptions(new chrome.Options().headless()).build()
operationCenter.get(`https://translate.google.pl/#view=home&op=translate&sl=auto&tl=pl`)

module.exports = async function gt (content = {answers: ['0'], q: '0'}) {
    try {
        let result = {...content}
        console.log(result)
        result.answers = result.answers.map(x => {
            return {original: x, translated: ``}
        })
        result.q = {original: result.q, translated: ``}
        let comps = [...result.answers, result.q]
        
        let ac = 1
        for (let x = 0; x < comps.length; x++) {
            if (comps[x].original !== `*image*`) {
                if (x > 0 && comps[x].original == comps[x-ac].original) {
                    comps[x].translated = comps[x-ac].translated
                    ac = 1
                } else {
                    const inElem = await operationCenter.findElement(By.css('.QFw9Te textarea'))
                    inElem.clear()
                    inElem.sendKeys(comps[x].original)
                    const translationBy = By.css(`.VIiyi span span`)
                    const translationElem = await operationCenter.wait(until.elementLocated(translationBy), 15000);
                    comps[x].translated = await translationElem.getText()
                    await operationCenter.findElement(By.css('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.q7sDqe.GA2I6e')).click()
                }
            } else {
                comps[x].translated = `*image*`
                ac++
            }
        }
        return result
    }
    catch (err) {
        console.log(err)
    }
}