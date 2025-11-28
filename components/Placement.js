/** A placement is one output of a source page from the source pdf
 * I don't think this *needs* to have a shadow root but i couldn't be bothered updating the code that updates placement widths
 * */
export class Placement extends HTMLElement {
    static observedAttributes = ['width', 'height', 'data-x', 'data-y', 'data-start', 'data-skip']

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
            case 'data-start': {
                this.shadowRoot.querySelector('#placement-source-start').value = newValue
				const skip = this.shadowRoot.querySelector('#placement-source-skip').valueAsNumber
				this.shadowRoot.querySelector('#placement-pages').innerHTML = this.generatePagesString(parseFloat(newValue), skip);
                break
            }
			case 'data-skip': {
                this.shadowRoot.querySelector('#placement-source-skip').value = newValue
				const start = this.shadowRoot.querySelector('#placement-source-start').valueAsNumber
				this.shadowRoot.querySelector('#placement-pages').innerHTML = this.generatePagesString(start, parseFloat(newValue));
                break
			}
        }
    }

	handleMouseDown(e) {
		this.parentNode.getRootNode().host.grabbedElem = this
	}

	handleMouseUp(e) {
		// Parent div handles this
		//this.parentNode.getRootNode().host.grabbedElem = this
	}

	generatePagesString(start, skip) {
		return `Page ${start}, ${start+1+skip}, ${start+2+skip*2}, ${start+3+skip*3}...`
	}

	updateStart(start) {
		this.setAttribute('data-start', start)
	}

	updateSkip(skip) {
		this.setAttribute('data-skip', skip)
	}

    render() {
        const w = this.getAttribute('width')
        const h = this.getAttribute('height')

        const x = this.getAttribute('data-x') ?? 0
        const y = this.getAttribute('data-y') ?? 0
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="css/placement.css">

			<div class="placement" style="width: ${w}px; height: ${h}px;">

				<label for="placement-source-start">Start</label>
				<input id="placement-source-start" type="number" value="1" onChange="this.getRootNode().host.updateStart(event.target.valueAsNumber)">
				<label for="placement-source-skip">Skip</label>
				<input id="placement-source-skip" type="number" value="0" onChange="this.getRootNode().host.updateSkip(event.target.valueAsNumber)">

				<p id="placement-pages">Page 1, 2, 3, 4...</p>

				<button id="remove-placement-btn" onClick="this.getRootNode().host.remove()">Remove Placement</button>

				<div id="pos-controls">
					<label for="x">X</label>
					<input type="number" value="${x}" id="x" onChange="this.getRootNode().host.setAttribute('data-x', event.target.value)">
					<label for="y">Y</label>
					<input type="number" value="${y}" id="y" onChange="this.getRootNode().host.setAttribute('data-y', event.target.value)">
				</div>

				<section
					class="grab-handle"
					onMousedown="this.getRootNode().host.handleMouseDown(event)"
				>
					<img src="./assets/placement_handle.png">
				</section>
			</div>
		`
    }

    connectedCallback() {
        this.render()

		const grab_handle = this.shadowRoot.querySelector('.grab-handle')
		//grab_handle.addEventListener('mousedown', this.handleMouseDown)
		//grab_handle.addEventListener('mouseup', this.handleMouseUp)
		// TODO: remove these 
    }
}
