/** A placement is one output of a source page from the source pdf */
export class Placement extends HTMLElement {
    observedAttributes = ['width', 'height']

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
    }

    // remove() {
    //     this..remove()
    // }

    render() {
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="main.css">

			<div class="placement">
			<button onClick="this.getRootNode().host.remove()">R</button>
			</div>
		`
    }

    connectedCallback() {
        this.render()
    }
}
