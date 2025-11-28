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

		return e
    }

    removeThisPage() {
		const page = this.shadowRoot.querySelector(".preview-page");
		page.removeEventListener("mousemove", this.handleMouseMove);

        this.remove()
    }

    render() {
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="main.css">
			<link rel="stylesheet" href="css/patternpage.css">
			<div class="preview-page-container">

				<section>
					<button style="aspect-ratio: 4/3;" onClick="this.getRootNode().host.addPlacement()">Add Placement</button>
					<button onClick="this.getRootNode().host.removeThisPage()">Remove Page</button>
				</section>

				<div class="preview-page"
					style="width: ${this.pageWidth}px; height: ${this.pageHeight}px"
					onMousemove="this.getRootNode().host.handleMouseMove(event)"
					onMouseup="this.getRootNode().host.handleMouseUp(event)"
				>
				</div>
			</div>
		`
    }

	/** Move the dragged placement + handle snapping */
	handleMouseMove(e) {

		if (this.grabbedElem === undefined) { return; }

		const cur_x = this.grabbedElem.getAttribute('data-x')
		const cur_y = this.grabbedElem.getAttribute('data-y')

		//console.log(e.movementX, e.movementY)
		//console.log(cur_x, e.movementX, cur_y, e.movementY)

		this.grabbedElem.setAttribute('data-x', parseFloat(cur_x) + e.movementX);
		this.grabbedElem.setAttribute('data-y', parseFloat(cur_y) + e.movementY);

	}

	handleMouseUp(e) {
		if (this.grabbedElem === undefined) { return; }
		
		if (!e.shiftKey) {
			// Handle snapping
			const placement = this.grabbedElem
			const placement_x = parseFloat(placement.getAttribute('data-x'))
			const placement_y = parseFloat(placement.getAttribute('data-y'))
			const placement_width = parseFloat(placement.getAttribute('width'))
			const placement_height = parseFloat(placement.getAttribute('height'))

			//const page_rect = this.shadowRoot.querySelector('.preview-page').getBoundingClientRect()
			const page_width = this.pageWidth;
			
			const dist_left = Math.abs(placement_x);
			const dist_top = Math.abs(placement_y);
			
			const dist_right = Math.abs(parseFloat(this.pageWidth) - (placement_x + placement_width))
			const dist_bottom = Math.abs(parseFloat(this.pageHeight) - (placement_y + placement_height))

			const SNAP_DISTANCE = 20;

			// Snap to closest in-range value
			const snap_hor = dist_left < SNAP_DISTANCE && dist_right < SNAP_DISTANCE 
				? dist_left < dist_right ? 'left' : 'right'
				: dist_left < SNAP_DISTANCE
					? 'left'
					: dist_right < SNAP_DISTANCE
						? 'right'
						: ''

			if (snap_hor === 'left') {
				placement.setAttribute('data-x', 0);
			} else if (snap_hor === 'right') {
				placement.setAttribute('data-x', parseFloat(this.pageWidth) - placement_width);
			}

			
			const snap_vert = dist_top < SNAP_DISTANCE && dist_bottom < SNAP_DISTANCE 
				? dist_top < dist_bottom ? 'top' : 'bottom'
				: dist_top < SNAP_DISTANCE
					? 'top'
					: dist_bottom < SNAP_DISTANCE
						? 'bottom'
						: ''

			if (snap_vert === 'top') {
				placement.setAttribute('data-y', 0);
			} else if (snap_vert === 'bottom') {
				placement.setAttribute('data-y', parseFloat(this.pageHeight) - placement_height);
			}
		}


		// Set grabbed to nothing
		this.grabbedElem = undefined
	}

    connectedCallback() {
        this.render()

		//const page = this.shadowRoot.querySelector(".preview-page");
		//page.addEventListener("mousemove", this.handleMouseMove);
    }
}
