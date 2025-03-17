<script lang="ts">
  import { PageSizes, PDFDocument } from 'pdf-lib'

  import type { Page, PDFTile, ArrangementPattern, ArrangementPage, PresetPattern } from './types';
    import { rearrange_pdf } from './processPdf';
    import { download } from './download2';

    import A5Book20PgSignatures  from './presets/A5Booklet20PgSections.json';

  const presets: PresetPattern[] = [
    A5Book20PgSignatures
  ]

  let pages: Page[] = $state([]);

  let source_width: number = $state(PageSizes.A5[0]);
  let source_height: number = $state(PageSizes.A5[1]);

  let result_width: number = $state(PageSizes.A4[1]);
  let result_height: number = $state(PageSizes.A4[0]);


  const add_page = () => {
    pages = [...pages, {
    width: result_width,
    height: result_height,
      tiles: [],
    }]

  }

  const delete_page = (idx: number) => {
    pages = pages.filter( (p, i) => i !== idx)
  }

  const duplicate_page = (idx: number) => {
    pages = [...pages, JSON.parse(JSON.stringify(pages[idx]))]
  }

  /** Tiles */
  const add_tile = (page_idx: number) => {
    const cur_tiles = pages[page_idx].tiles
    pages[page_idx].tiles = [...cur_tiles, {start: 1, skip: 0, position: {x: 0, y: 0}}]
  }

  const delete_tile = (page_idx: number, tile_idx: number) => {
    const cur_tiles = pages[page_idx].tiles
    pages[page_idx].tiles = cur_tiles.filter((t, idx) => idx !== tile_idx)
  }

  let grabbed_tile: null | PDFTile = $state(null);
  const grab_tile = (page_idx: number, tile_idx: number) => {
    grabbed_tile = pages[page_idx].tiles[tile_idx]
  }

  const release_tile = (e: MouseEvent, page_idx: number) => {
    if (!grabbed_tile) return;

    // Snapping
    const pageNode: HTMLElement | null = (e.target as Node).parentElement
    if (!pageNode) {
      grabbed_tile = null;
      console.error("No parent node to PDF Tile!?")
      return;
    }

    // Snap to corners
    const parentDims = pageNode.getBoundingClientRect()
    const tileDims = (e.target as HTMLElement).getBoundingClientRect()

    const parentCorners = [
      {x: 0, y: 0},
      {x: parentDims.width, y: 0},
      {x: 0, y: parentDims.height},
      {x: parentDims.width, y: parentDims.height},
    ]

    const tileCorners = [
      {x: grabbed_tile.position.x, y: grabbed_tile.position.y},
      {x: grabbed_tile.position.x+tileDims.width, y: grabbed_tile.position.y},
      {x: grabbed_tile.position.x, y: grabbed_tile.position.y+tileDims.height},
      {x: grabbed_tile.position.x+tileDims.width, y: grabbed_tile.position.y+tileDims.height},
    ]

    const SNAP_DISTANCE = 30;
    let snap_candidates: {parentIdx: number, tileIdx: number, dist: number}[] = []
    parentCorners.forEach( (pc, pi) => {
      tileCorners.forEach( (tc, ti) => {
        const dist = Math.sqrt( (pc.x-tc.x)*(pc.x-tc.x) + (pc.y-tc.y)*(pc.y-tc.y) )
        console.log(dist, pc, tc);

        if (dist < SNAP_DISTANCE) {
          snap_candidates.push({parentIdx: pi, tileIdx: ti, dist})
        }
      })
    })
    
    if (snap_candidates.length < 1)  {

      grabbed_tile = null;
      return;
    }

    let closest = snap_candidates.reduce( (prev, cur) => {return (cur.dist < prev.dist) ? cur : prev}, snap_candidates[0])

    console.log("Closest", closest);
    
    grabbed_tile.position.x = parentCorners[closest.parentIdx].x
    grabbed_tile.position.y = parentCorners[closest.parentIdx].y
    
    // Find delta from cur pos to corner
    const tileCorners2 = [
      {x: grabbed_tile.position.x, y: grabbed_tile.position.y},
      {x: grabbed_tile.position.x+tileDims.width, y: grabbed_tile.position.y},
      {x: grabbed_tile.position.x, y: grabbed_tile.position.y+tileDims.height},
      {x: grabbed_tile.position.x+tileDims.width, y: grabbed_tile.position.y+tileDims.height},
    ]
    
    const cornerDeltaX = tileCorners2[closest.tileIdx].x - grabbed_tile.position.x
    const cornerDeltaY = tileCorners2[closest.tileIdx].y - grabbed_tile.position.y

    grabbed_tile.position.x -= cornerDeltaX
    grabbed_tile.position.y -= cornerDeltaY

    

    //pages = pages;
    
    grabbed_tile = null;

  }



  const mousemoved_on_page = (e: MouseEvent) => {
    if (grabbed_tile) {
    //console.log(e);
      grabbed_tile.position.x += e.movementX
      grabbed_tile.position.y += e.movementY
    }
  }

  let pdfFiles: FileList | undefined = $state()


  let processing_pdf: boolean = $state(false);

  $effect(() => {
    if (!pdfFiles) return;
    if (pdfFiles.length < 1) return;

    const reader = new FileReader();
    reader.onloadend = (load_res) => {

      if (!reader.result) return;

      processing_pdf = true;

      PDFDocument.load(reader.result).then(pdf_res => {
        rearrange_pdf(pdf_res, working_pages_to_pattern(pages)).then( () => {
          processing_pdf = false;
        })
      });

    }

    reader.readAsDataURL(pdfFiles[0])
  })

  const working_pages_to_pattern = (pages: Page[]): ArrangementPattern => {
    let pattern: ArrangementPattern = {
      pages: []
    }

    pages.forEach(p => {
      const arrangePage: ArrangementPage = {...p, tiles: p.tiles.map(t => ({...t, iteration: 0, start: t.start-1}))} // -1 because they're 1-indexed for UI purposes
      pattern.pages.push(arrangePage)
    })

    return pattern;
  }

  const export_pattern = () => {
    const pattern: PresetPattern = {
      name: "my pattern",
      source_width,
      source_height,
      pages
    }

    download(JSON.stringify(pattern), "my pattern.json", "text/json")
  }


</script>

<main>


  <header>


    <div>
      Source
      <input type="number" bind:value={source_width} />
      <input type="number" bind:value={source_height} />
      <button onclick={() => {source_width = PageSizes.A5[0], source_height =PageSizes.A5[1]}}>A5 PT</button>
    </div>


    <div>
      Presets

      {#each presets as preset}
        <button onclick={() => {
                pages = [...A5Book20PgSignatures.pages]; 
                source_height=preset.source_height ?? source_height;
                source_width=preset.source_width ?? source_width;
                }}>{preset.name}</button>
      {/each}
    </div>

    <div>
      New Page
      <input type="number" bind:value={result_width} />
      <input type="number" bind:value={result_height} />
      <button onclick={() => {result_width = PageSizes.A4[1], result_height =PageSizes.A4[0]}}>A4 LS</button>
    <button onclick={add_page}>Add Page</button>
    </div>


    <input type="file" bind:files={pdfFiles} accept="application/pdf">

    <button onclick={export_pattern}>Export Pattern</button>

    {#if processing_pdf}
    <div class="hexdots-loader" style="margin-left: 100px; margin-top: 100px"></div>
    {/if}
  </header>

  <div id="result-preview">
    {#each pages as page, idx}

      <div class="result-page" style={`width: ${page.width}px; height: ${page.height}px`}
           onmousemove={mousemoved_on_page}
      >

        <div class="result-page-controls">
          <button onclick={() => add_tile(idx)}>Add PDF Tile</button>
          <button onclick={() => delete_page(idx)}>Delete Page</button>
          <button onclick={() => duplicate_page(idx)}>Duplicate Page</button>
        </div>

        {#each page.tiles as tile, tile_idx}
          <div 
            class="pdf-tile"
            style={`width: ${source_width}px; height: ${source_height}px; left: ${tile.position.x}px; top: ${tile.position.y}px`}
            onmousedown={() => grab_tile(idx, tile_idx)}
            onmouseup={(e) => release_tile(e, idx)}
            onmouseleave={(e) => release_tile(e, idx)}
            onblur={(e) => release_tile(e, idx)}
          >
          <div>Start: <input min={0} type="number" bind:value={tile.start} /></div>
          <div>Skip: <input min={0} type="number" bind:value={tile.skip} /></div>
            <button onclick={() => delete_tile(idx, tile_idx)}>Delete</button>
            E.g. page {tile.start}, {tile.start + 1 + tile.skip}, {tile.start + 2 + tile.skip*2}...
            <span>X: {tile.position.x}, Y: {tile.position.y}</span>
          </div>
        {/each}


      </div>
    {/each}

  </div>


</main>

<style>
  main {
    background-color: var(--bg);
  }

  header {
    padding: var(--spacing-med);
    box-sizing: border-box;
  }

  #result-preview {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: var(--spacing-med);
  }

  .result-page-controls {
    position: absolute;
    width: 5em;
    height: 50%;
    display: flex;
    flex-direction: column;
    margin-left: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    padding: var(--spacing-med);
    box-sizing: border-box;
    border-bottom-right-radius: var(--spacing-med);
    border-top-right-radius: var(--spacing-med);
    gap: var(--spacing-med);
  }

  /** RESULT PAGE */
  .result-page {
    position: relative;
    border: solid 1px black;
    box-sizing: border-box;
  }

  #result-preview .result-page-controls {
    display: none;
  }
  #result-preview .result-page:hover .result-page-controls  {
    display: block;
  }


  /** PDF TILE */
  .pdf-tile {
    background-color: var(--bg-secondary);
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pdf-tile input {
    max-width: 100%;
  }

</style>
