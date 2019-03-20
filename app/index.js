'use strict'
const storage = require('electron-json-storage')

const BrowserWindow = require('electron').remote.getCurrentWindow()

const main = new class {

    constructor() {

        this.percentage = 0
        this.openList = false

        this.timer()

        this.input = document.getElementById("stopcode-input");
        new Awesomplete(this.input, {
            list: Object.keys(codes),
            maxItems: 4
        })

        document.addEventListener('awesomplete-open', function () {
            document.getElementById('stopcode-message').innerHTML = ''
        })
    }

    showList() {
        
        storage.get('faults', (error, entries) => {
            if (error) throw error;

            let elm = document.getElementById('all-codes')

            if (!entries) {
                elm.innerHTML = "No entries found"
                return
            }

            elm.innerHTML = '<div class="all-codes-title">Stop codes encountered so far</div><ul>'
            for (var key in entries) {

                if (!entries.hasOwnProperty(key))
                    continue

                var val = entries[key]
                elm.innerHTML += '<li><b>' + key + '</b>: ' + val + '</li>'
            }
            elm.innerHTML += '</ul>'
            main.openList = true
        })
    }

    hideList() {
        if (!main.openList)
            return
        
        document.getElementById('all-codes').innerHTML = ''
        main.openList = false
    }

    toggleList() {
        if (main.openList)
            main.hideList()
        else
            main.showList()
    }

    save() {
        let val = this.input.value
        if (!codes.hasOwnProperty(val)) {
            document.getElementById('stopcode-message').innerHTML = "Sorry, but this stop code is invalid"
            return
        }

        storage.get('faults', (error, entries) => {
            if (error) throw error;

            if (!entries)
                entries = {}

            if (!entries.hasOwnProperty(val))
                entries[val] = 0

            entries[val]++

            storage.set('faults', entries)
            this.input.value = ''
            document.getElementById('stopcode').style.display = 'none'
            document.getElementById('stopcode-message').innerHTML = "Your stop code has been saved. Thank you."
            if (main.openList) {
                main.openList = false
                setTimeout(main.showList, 200)
            }
        });
    }

    close() {
        BrowserWindow.close()
    }

    timer() {
        this.updatePercentageInterval = setInterval(this.updatePercentage, 1000 * 1)
    }

    updatePercentage() {
        let elm = document.getElementById('text-percentage')
        if (!elm)
            return

        if (Math.random() > 0.5 && main.percentage < 100)
            main.percentage += 10

        elm.innerHTML = main.percentage + '% complete'
        if (main.percentage >= 100)
            clearInterval(main.updatePercentageInterval)
    }

}
