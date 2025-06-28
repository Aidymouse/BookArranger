export class PatternPage extends HTMLElement {
    static observedAttributes = ['width', 'height']

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
        const template = document.querySelector('#preview-page').content

        // Defaults
        this.pageWidth = 100
        this.pageHeight = 100
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
        //this.shadowRoot.
        const e = document.createElement('arranger-placement')
        e.setAttribute(
            'width',
            document.querySelector('#source-page-width').value
        )
        e.setAttribute(
            'height',
            document.querySelector('#source-page-height').value
        )
        this.shadowRoot.querySelector('.preview-page').appendChild(e)
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
