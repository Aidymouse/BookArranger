export class PatternPage extends HTMLElement {
    static observedAttributes = ['width', 'height']

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
        const template = document.querySelector('#preview-page').content

        // Defaults
        this.pageWidth = 100
        this.pageHeight = 100

		this.grabbedElem = undefined
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        console.log(`${attr} changed from ${oldValue} to ${newValue}`)

        switch (attr) {
            case 'width':
                this.pageWidth = newValue
                break
            case 'height':
                this.pageHeight = newValue
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

        e.style.position = 'absolute'

        this.shadowRoot.querySelector('.preview-page').appendChild(e)

        e.setAttribute('data-x', 0)
        e.setAttribute('data-y', 0)
    }

    removeThisPage() {
		const page = this.shadowRoot.querySelector(".preview-page");
		page.removeEventListener("mousemove", this.handleMouseMove);

        this.remove()
    }

    render() {
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="main.css">
			<div class="preview-page"
				 style="width: ${this.pageWidth}px; height: ${this.pageHeight}px"
				onMousemove="this.getRootNode().host.handleMouseMove(event)"
				onMouseup="this.getRootNode().host.handleMouseUp(event)"
			>
			</div>
			<button onClick="this.getRootNode().host.addPlacement()">Add Placement</button>
			<button onClick="this.getRootNode().host.removeThisPage()">Remove!</button>
		`
    }

	handleMouseMove(e) {

		if (this.grabbedElem === undefined) { return; }

		const cur_x = this.grabbedElem.getAttribute('data-x')
		const cur_y = this.grabbedElem.getAttribute('data-y')

		console.log(e.movementX, e.movementY)
		console.log(cur_x, e.movementX, cur_y, e.movementY)
		

		this.grabbedElem.setAttribute('data-x', parseFloat(cur_x) + e.movementX);
		this.grabbedElem.setAttribute('data-y', parseFloat(cur_y) + e.movementY);


	}

	handleMouseUp(e) {
		this.grabbedElem = undefined
	}

    connectedCallback() {
        this.render()

		//const page = this.shadowRoot.querySelector(".preview-page");
		//page.addEventListener("mousemove", this.handleMouseMove);
    }
}
