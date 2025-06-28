/** A placement is one output of a source page from the source pdf
 * I don't think this *needs* to have a shadow root but i couldn't be bothered updating the code that updates placement widths
 * */
export class Placement extends HTMLElement {
    static observedAttributes = ['width', 'height', 'data-x', 'data-y']

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        //console.log('Placement Attr Changed', attr, oldValue, newValue)

        switch (attr) {
            case 'width':
            case 'height': {
                const p = this.shadowRoot.querySelector('.placement')

                if (p != null) {
                    p.style[attr] = `${newValue}px`
                }

                break
            }

            case 'data-x': {
                this.style.left = `${newValue}px`
                this.shadowRoot.querySelector('#x').value = newValue
                break
            }
            case 'data-y': {
                this.style.top = `${newValue}px`
                this.shadowRoot.querySelector('#y').value = newValue
                break
            }
        }
    }

    render() {
        const w = this.getAttribute('width')
        const h = this.getAttribute('height')

        const x = this.getAttribute('data-x') ?? 0
        const y = this.getAttribute('data-y') ?? 0
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="css/placement.css">

			<div class="placement" style="width: ${w}px; height: ${h}px;">

				<section>
					<label for="x">X</label>
					<input type="number" value="${x}" id="x" onChange="this.getRootNode().host.setAttribute('data-x', event.target.value)">
					<label for="y">Y</label>
					<input type="number" value="${y}" id="y" onChange="this.getRootNode().host.setAttribute('data-y', event.target.value)">
				</section>

				<section>
					<input id="placement-source-start" type="number" value="1">
					<input id="placement-source-skip" type="number" value="1">
				</section>

				<section>
					<p>Grab Handle</p>
				</section>

				<section>
					<button onClick="this.getRootNode().host.remove()">Remove Placement</button>
				</section>
			</div>
		`
    }

    connectedCallback() {
        this.render()
    }
}
