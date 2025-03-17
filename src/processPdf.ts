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

  while (somePassed === true) {
    somePassed = false;

    for (const arrange_page of arrangement_pattern.pages) {
      debug && console.log("New Page")
      let newPage = null;

      for (const arrange_tile of arrange_page.tiles) {
        const pgNumber = arrange_tile.start + arrange_tile.iteration + (arrange_tile.skip*arrange_tile.iteration) 

        arrange_tile.iteration += 1;

        //latestPageSeen = Math.max(pgNumber, latestPageSeen);

        if (pgNumber >= source.getPageCount()) continue;

        debug && console.log("Drawing Source Page", pgNumber)

        if (!newPage) newPage = result.addPage([arrange_page.width, arrange_page.height])

        const sourcePage = source.getPage(pgNumber);

        if (!sourcePage) continue;

        const sourceEmbedded = await result.embedPage(sourcePage);
        newPage!.drawPage(sourceEmbedded, {
          x: arrange_tile.position.x,
          y: -arrange_tile.position.y
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
