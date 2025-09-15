import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (slides, companyName = 'Pitch') => {
  if (!slides || slides.length === 0) {
    throw new Error('No slides provided for PDF generation')
  }

  try {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '-9999px'
    container.style.left = '-9999px'
    container.style.width = '1920px'
    container.style.height = '1080px'
    document.body.appendChild(container)

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    console.log('🎨 Starting PDF generation...')

    for (let i = 0; i < slides.length; i++) {
      console.log(`📄 Processing slide ${i + 1}/${slides.length}`)

      const slideElement = document.createElement('div')
      slideElement.innerHTML = slides[i]
      slideElement.style.width = '1920px'
      slideElement.style.height = '1080px'
      slideElement.style.transform = 'scale(0.5)'
      slideElement.style.transformOrigin = 'top left'
      
      container.appendChild(slideElement)

      await new Promise(resolve => setTimeout(resolve, 500))

      const canvas = await html2canvas(slideElement, {
        width: 1920,
        height: 1080,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)

      if (i > 0) {
        pdf.addPage()
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)

      container.removeChild(slideElement)
    }

    document.body.removeChild(container)

    const filename = `${companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pitch_deck.pdf`

    pdf.save(filename)

    console.log('✅ PDF generated successfully:', filename)
    
    return filename

  } catch (error) {
    console.error('❌ PDF generation failed:', error)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }
}

export const downloadSlidesAsImages = async (slides, companyName = 'Pitch') => {
  if (!slides || slides.length === 0) {
    throw new Error('No slides provided for image generation')
  }

  try {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '-9999px'
    container.style.left = '-9999px'
    container.style.width = '1920px'
    container.style.height = '1080px'
    document.body.appendChild(container)

    for (let i = 0; i < slides.length; i++) {
      console.log(`🖼️ Processing slide image ${i + 1}/${slides.length}`)

      const slideElement = document.createElement('div')
      slideElement.innerHTML = slides[i]
      slideElement.style.width = '1920px'
      slideElement.style.height = '1080px'
      
      container.appendChild(slideElement)

      await new Promise(resolve => setTimeout(resolve, 500))

      const canvas = await html2canvas(slideElement, {
        width: 1920,
        height: 1080,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      })

      const link = document.createElement('a')
      link.download = `${companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_slide_${i + 1}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      container.removeChild(slideElement)
    }

    document.body.removeChild(container)
    console.log('✅ All slide images downloaded successfully')

  } catch (error) {
    console.error('❌ Image generation failed:', error)
    throw new Error(`Failed to generate images: ${error.message}`)
  }
}
