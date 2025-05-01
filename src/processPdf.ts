import { download } from './download2';
import type { ArrangementPattern } from './types'
import { PDFDocument, type PageSizes } from 'pdf-lib'

const debug = false;

export const rearrange_pdf = async (
  source: PDFDocument,
  arrangement_pattern: ArrangementPattern,
) => {

  const result = await PDFDocument.create()

  let somePassed = true;
  let latestPageSeen = -1;

  // Create the page
  // Iterate through the placements
  // If there is no source page, mark the placement as complete
  // If all placements are complete, do not add the page (optional in future)
  
  while (somePassed === true) {
    somePassed = false;

    for (const arrange_page of arrangement_pattern.pages) {
      debug && console.log("New Page")
      let newPage = null;

      for (const placement of arrange_page.tiles) {
        const source_page = placement.start + placement.iteration + (placement.skip*placement.iteration) 

        placement.iteration += 1;

        //latestPageSeen = Math.max(pgNumber, latestPageSeen);

        if (source_page >= source.getPageCount()) continue;

        debug && console.log("Drawing Source Page", source_page)

        if (!newPage) newPage = result.addPage([arrange_page.width, arrange_page.height])

        const sourcePage = source.getPage(source_page);

        if (!sourcePage) continue;

        const sourceEmbedded = await result.embedPage(sourcePage);
        newPage!.drawPage(sourceEmbedded, {
          x: placement.position.x,
          y: arrange_page.height - sourcePage.getHeight() - placement.position.y // PDF 0, 0 is BOTTOM left, pdf tile assumes 0, 0 at TOP left
        })

        somePassed = true;

      }
    }

    debug && console.log("Some passed?", somePassed);


    //await result.save()
  }



  //await result.embedPage();
  //
  console.log("Saving Final PDF")

  const final_result = await result.save()

  download(final_result, "pdfRes.pdf", "application/pdf")
}
