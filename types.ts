
    // if (!pdfFiles) return;
    // if (pdfFiles.length < 1) return;
    //
    // const reader = new FileReader();
    // reader.onloadend = (load_res) => {
    //
    //   if (!reader.result) return;
    //
    //   processing_pdf = true;
    //
    //   PDFDocument.load(reader.result).then(pdf_res => {
    //     rearrange_pdf(pdf_res, working_pages_to_pattern(pages)).then( () => {
    //       processing_pdf = false;
    //     })
    //   });
    //
    // }
    //
    // reader.readAsDataURL(pdfFiles[0])
      // PDFDocument.load(reader.result).then(pdf_res => {
      //   rearrange_pdf(pdf_res, working_pages_to_pattern(pages)).then( () => {
      //     processing_pdf = false;
      //   })
      // });


  type Position = {
    x: number
    y: number
  }

  export type Page = {
    tiles: PDFTile[]
    width: number
    height: number
    //position: Position
  }

  // E.g. start 1 skip 1 = pages 1, 3, 5, 7, etc.
  // E.g. start 2 skip 1 = pages 2, 4, 6, 8, etc.
  export type PDFTile = {
    start: number // Start at page...
    skip: number // Skip page...
    position: Position,
  }


  export type PresetPattern = {
    name: string,
    source_width: number,
    source_height: number
    pages: Page[]
  }

  export type ArrangementPage = {
    tiles: ArrangementTile[]
    width: number
    height: number
  }
  
  export type ArrangementTile = PDFTile & {
    iteration: number,
  }

  export type ArrangementPattern = {
    pages: ArrangementPage[]
  }
