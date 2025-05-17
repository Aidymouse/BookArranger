/** A placement is one output of a source page from the source pdf
 * I don't think this *needs* to have a shadow root but i couldn't be bothered updating the code that updates placement widths
 * */
export class Placement extends HTMLElement {
    observedAttributes = ['width', 'height']

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
    }

    render() {
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="css/placement.css">

			<div class="placement">

				<section>
					<input type="number" id="x">
					<input type="number" id="y">
				</section>

				<section>
					<p>Grab Handle</p>
				</section>

				<section>
					<button onClick="this.getRootNode().host.remove()">R</button>
				</section>
			</div>

		`
    }

    connectedCallback() {
        this.render()
    }
}
