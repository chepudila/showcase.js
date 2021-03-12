class ShowCase {
    constructor(showcase, options) {
        this.showcase = showcase;
        this.options = options;
        this.InitShowcase();
        this.DrawShowcase();
        this.InitShowcaseEvents();
    }

    get showcase() { 
        return this._showcase;
    }

    set showcase(value) {
        this._showcase = value;
    }

    get showcaseDivs() {
        return this._showcaseDivs;
    }

    set showcaseDivs(value) {
        this._showcaseDivs = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    InitShowcase() {
        let arrDivs = this.showcase.querySelectorAll('div');
        let arrTemp = new Array();

        for (const key in arrDivs) {
            if (Object.hasOwnProperty.call(arrDivs, key)) {
                const element = arrDivs[key];
                if (element.parentNode === this.showcase) {
                    arrTemp.push(element);
                }
            }
        }

        this.showcaseDivs = arrTemp;
    }

    InitShowcaseEvents() {
        window.addEventListener('resize', () => {
            this.DrawShowcase();
        });

        if (this.options.left) {
            this.options.left.addEventListener('click', (event) => {
                this.SetActiveDiv(false, 'left');
                this.DrawShowcase();
            })
        }

        if (this.options.right) {
            this.options.right.addEventListener('click', (event) => {
                this.SetActiveDiv(false, 'right');
                this.DrawShowcase();
            })
        }

        this.showcaseDivs.forEach(element => {
            element.addEventListener('mouseenter', (event) => {
                this.SetActiveDiv(event.currentTarget);
                this.DrawShowcase();
            })
        });
    }

    SetActiveDiv(div, direction) {
        if (direction) {
            if (direction === 'left') {
                for (let i = 0; i < this.showcaseDivs.length; i++) {
                    const preElement = this.showcaseDivs[ i > 0 ? i - 1 : 0 ];
                    const element = this.showcaseDivs[i];
                    if (element.dataset.activeDiv === 'true') {
                        element.dataset.activeDiv ='false';
                        preElement.dataset.activeDiv = 'true';
                    }
                }
            } else {
                for (let i = this.showcaseDivs.length - 1; i >= 0; i--) {
                    const preElement = this.showcaseDivs[ i < this.showcaseDivs.length - 1 ? i + 1 : i ];
                    const element = this.showcaseDivs[i];
                    if (element.dataset.activeDiv === 'true') {
                        element.dataset.activeDiv ='false';
                        preElement.dataset.activeDiv = 'true';
                    }
                }
            }
        } else {
            this.showcaseDivs.forEach(element => {
                element.dataset.activeDiv = false;
            });
            if (div) {
                div.dataset.activeDiv = true;
            }
        }
    }

    DrawShowcase() {
        if (this.options.display === 'row') {
            this.DrawRow(this.options.scale ? this.options.scale : 0);
        }
    }

    DrawRow(resizeRatio) {
        let arrTempBefore = new Array();
        let arrTempAfter = new Array();
        let isActiveFound = false;

        for (const key in this.showcaseDivs) {
            if (Object.hasOwnProperty.call(this.showcaseDivs, key)) {
                const element = this.showcaseDivs[key];
                if (!isActiveFound) {
                    arrTempBefore.push(element);
                } 

                if (element.dataset.activeDiv === 'true') {
                    isActiveFound = true;
                }
                
                if (isActiveFound) {
                    arrTempAfter.push(element);
                }
            }
        }

        arrTempBefore.reverse();
        let allDrawnDivsWidth = 0;

        for (const key in arrTempBefore) {
            if (Object.hasOwnProperty.call(arrTempBefore, key)) {
                const element = arrTempBefore[key];
                this.DivTransform(element, resizeRatio, key);
                allDrawnDivsWidth += Number(element.dataset.resizeWidth);
            }
        }

        for (const key in arrTempAfter) {
            if (Object.hasOwnProperty.call(arrTempAfter, key)) {
                const element = arrTempAfter[key];
                if (key !== '0') {
                    this.DivTransform(element, resizeRatio, key);
                    allDrawnDivsWidth += Number(element.dataset.resizeWidth);
                }
            }
        }

        let allDrawnOfsetDivsWidth = 0;

        for (const key in this.showcaseDivs) {
            if (Object.hasOwnProperty.call(this.showcaseDivs, key)) {
                const element = this.showcaseDivs[key];
                element.style.left = (allDrawnOfsetDivsWidth - ((element.offsetWidth - element.dataset.resizeWidth) / 2)) + 'px';
                let ratio = (this.showcase.offsetWidth - this.showcaseDivs[this.showcaseDivs.length - 1].dataset.resizeWidth) / (allDrawnDivsWidth - this.showcaseDivs[this.showcaseDivs.length - 1].dataset.resizeWidth);
                allDrawnOfsetDivsWidth += element.dataset.resizeWidth * ratio;
            }
        }
    }

    DivTransform(element, resizeRatio, key) {
        element.dataset.resizeRatio = (1 - resizeRatio * key).toFixed(2) > 0.1 ? (1 - resizeRatio * key).toFixed(2) : 0.01;
        element.dataset.resizeWidth = Math.ceil(element.offsetWidth * element.dataset.resizeRatio);
        element.style.transform = 'scale('+ element.dataset.resizeRatio +')';
        element.style.zIndex = this.showcaseDivs.length - key;
    }
}

class ShowcasesCollection {
    constructor(arrShowcases, options) {
        this.InitOptions(options);
        this.InitShowcases(arrShowcases);
    }

    get arrShowcases() {
        return this._arrShowcases;
    }

    set arrShowcases(value) {
        this._arrShowcases = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    InitOptions(options) {
        if (options !== undefined) {
            this.options = options;

            if (this.options.right) {
                this.options.right = document.querySelector(this.options.right);
            }
            
            if (this.options.left) {
                this.options.left = document.querySelector(this.options.left);
            }
        } else {
            console.log('default options are used');
            this.options = {display: 'row', scale: 0}
        }
    }

    InitShowcases(arrShowcases) {
        let arrTemp = new Array();
        for (const key in arrShowcases) {
            if (Object.hasOwnProperty.call(arrShowcases, key)) {
                const element = arrShowcases[key];
                arrTemp.push( new ShowCase(element, this.options) );
            }
        }
        this.arrShowcases = arrTemp;
    }
}

class ShowcaseInitiator {
    static Init(selector, options) {
        if (selector.startsWith('.')) {
            return this.InitByClass(selector, options);
        }
    }

    static InitByClass(selector, options) {
        selector = selector.slice(1);
        return new ShowcasesCollection( document.getElementsByClassName(selector), options );
    }
}