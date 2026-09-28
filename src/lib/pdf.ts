export async function downloadElementPdf(element: HTMLElement, filename: string) {
  const html2canvas = (await import("html2canvas")).default
  const { jsPDF } = await import("jspdf")
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#fffef8",
    useCORS: true,
  })
  const img = canvas.toDataURL("image/png")
  const pdf = new jsPDF({ unit: "mm", format: "a4" })
  const pageWidth = 210
  const pageHeight = 297
  const imgHeight = (canvas.height * pageWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 0
  pdf.addImage(img, "PNG", 0, position, pageWidth, imgHeight)
  heightLeft -= pageHeight
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(img, "PNG", 0, position, pageWidth, imgHeight)
    heightLeft -= pageHeight
  }
  pdf.save(filename)
}
