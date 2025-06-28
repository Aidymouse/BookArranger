/** A placement is one output of a source page from the source pdf
 * I don't think this *needs* to have a shadow root but i couldn't be bothered updating the code that updates placement widths
 * */
export class Placement extends HTMLElement {
    static observedAttributes = ['width', 'height', 'data-x', 'data-y']

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
    }

    // setAttribute(attrName, attrValue) {
    //     console.log('Setting attr')
    //     super.setAttribute(attrName, attrValue)
    //     this.attributeChangedCallback(attrName, null, attrValue)
    // }

    attributeChangedCallback(attr, oldValue, newValue) {
        console.log('Placement Attr Changed', attr, oldValue, newValue)

        switch (attr) {
            case 'width':
            case 'height': {
                const p = this.shadowRoot.querySelector('.placement')

                if (p != null) {
                    p.style[attr] = `${newValue}px`
                }

                break
            }
        }
    }

    render() {
        const w = this.getAttribute('width')
        const h = this.getAttribute('height')

        const x = 0
        const y = 0
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="css/placement.css">

			<div class="placement" style="width: ${w}px; height: ${h}px;">

				<section>
					<input type="number" value="${x}" id="x" onChange="this.getRootNode().host.setAttribute('width', event.target.value)">
					<input type="number" id="${y}" onChange="this.getRootNode().host.setAttribute('height', event.target.value)">
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

        // const placement = this.shadowRoot.querySelector('.placement')
        // placement.style.width = `${document.querySelector('#source-page-width').value}px`
        // placement.style.height = `${document.querySelector('#source-page-height').value}px`
    }
}
