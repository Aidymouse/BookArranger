export class PatternPage extends HTMLElement {
    static observedAttributes = ['width', 'height']

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
        const template = document.querySelector('#preview-page').content
        //shadow.appendChild(template.cloneNode(true));

        //const addPageButton = document.createElement("button")
        //addPageButton.textContent = "Add Page";
        //addPageButton.addEventListener(() => this.addPage();)
        //shadow.appendChild(addPageButton);

        // Defaults
        this.pageWidth = 100
        this.pageHeight = 100

        //this.pages = [];

        //console.log(this.shadowRoot.querySelector("#prev"));
        // this.render();
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        console.log(`${attr} changed from ${oldValue} to ${newValue}`)

        switch (attr) {
            case 'width':
                this.pageWidth = newValue
                // this.shadowRoot.querySelector(".preview-page").style.width = `${newValue}px`;
                break
            case 'height':
                this.pageHeight = newValue
                //this.shadowRoot.querySelector(".preview-page").style.height = `${newValue}px`;
                break
        }
    }

    /// I can put my own methods on here..... curious....
    addPlacement() {
        //this.pages.push({});
        const e = document.createElement('arranger-placement')
        //e.textContent = "P";

        //this.shadowRoot.createElement("arranger-placement");

        //document.createElement("arranasdger-placement");

        const elem = this.shadowRoot.querySelector('.preview-page')
        //console.log(elem);
        elem.appendChild(e)
    }

    removeThisPage() {
        this.remove()
    }

    render() {
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="main.css">
			<div class="preview-page" style="width: ${this.pageWidth}px; height: ${this.pageHeight}px">
			</div>
			<button onClick="this.getRootNode().host.addPlacement()">Add Placement</button>
			<button onClick="this.getRootNode().host.removeThisPage()">Remove!</button>
		`
    }

    connectedCallback() {
        this.render()
    }
}
